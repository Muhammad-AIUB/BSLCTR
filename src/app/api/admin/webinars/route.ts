import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { adminFromRequest } from "@/lib/admin-auth";
import { IMAGE_TYPES, UploadError, deleteUpload, saveUpload } from "@/lib/uploads";
import {
    DEFAULT_DESCRIPTION_STYLE,
    DEFAULT_SPEAKERS_STYLE,
    parseTextStyle,
} from "@/lib/text-style";
import { webinarStart } from "@/lib/webinars";

export const dynamic = "force-dynamic";

function isHttpUrl(value: string): boolean {
    try {
        const u = new URL(value);
        return u.protocol === "http:" || u.protocol === "https:";
    } catch {
        return false;
    }
}

function parseJson(value: FormDataEntryValue | null): unknown {
    try {
        return JSON.parse(String(value ?? "{}"));
    } catch {
        return {};
    }
}

export async function GET(req: NextRequest) {
    if (!adminFromRequest(req)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // Unlike the public /api/webinars, this also lists webinars that are over.
    const rows = await prisma.webinar.findMany({ orderBy: [{ date: "desc" }, { time: "desc" }] });
    return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
    if (!adminFromRequest(req)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const form = await req.formData().catch(() => null);
    if (!form) return NextResponse.json({ error: "Invalid form data" }, { status: 400 });

    const title = String(form.get("title") ?? "").trim();
    const speakers = String(form.get("speakers") ?? "").trim();
    const description = String(form.get("description") ?? "").trim();
    const date = String(form.get("date") ?? "").trim();
    const time = String(form.get("time") ?? "").trim();
    const link = String(form.get("link") ?? "").trim();
    const thumbnail = form.get("thumbnail");

    if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 });
    // The public list is ordered by these as text, which needs "YYYY-MM-DD" / "HH:MM".
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return NextResponse.json({ error: "Choose a valid date" }, { status: 400 });
    }
    if (!/^\d{2}:\d{2}$/.test(time)) {
        return NextResponse.json({ error: "Choose a valid time" }, { status: 400 });
    }
    const start = webinarStart(date, time).getTime();
    if (isNaN(start)) {
        return NextResponse.json({ error: "Choose a valid date and time" }, { status: 400 });
    }
    // The public page hides a webinar once it is over, so a past one would never show.
    if (start <= Date.now()) {
        return NextResponse.json(
            { error: "Date and time must be in the future (Bangladesh time)" },
            { status: 400 }
        );
    }
    if (!isHttpUrl(link)) {
        return NextResponse.json({ error: "Link must be a valid http(s) URL" }, { status: 400 });
    }

    let thumbUrl = "";
    try {
        if (thumbnail instanceof File && thumbnail.size > 0) {
            thumbUrl = await saveUpload(thumbnail, IMAGE_TYPES, 5 * 1024 * 1024);
        }
        const created = await prisma.webinar.create({
            data: {
                headline: title,
                date,
                time,
                link,
                speakers,
                speakersStyle: parseTextStyle(parseJson(form.get("speakersStyle")), DEFAULT_SPEAKERS_STYLE),
                description,
                descriptionStyle: parseTextStyle(
                    parseJson(form.get("descriptionStyle")),
                    DEFAULT_DESCRIPTION_STYLE
                ),
                thumbnail: thumbUrl,
            },
        });
        return NextResponse.json(created, { status: 201 });
    } catch (error) {
        if (thumbUrl) await deleteUpload(thumbUrl);
        console.error("create webinar failed", error);
        if (error instanceof UploadError) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        return NextResponse.json({ error: "Could not save the webinar" }, { status: 500 });
    }
}
