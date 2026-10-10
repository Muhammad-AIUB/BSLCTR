import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { adminFromRequest } from "@/lib/admin-auth";
import { DOC_TYPES, IMAGE_TYPES, UploadError, deleteUpload, saveUpload } from "@/lib/uploads";

export const dynamic = "force-dynamic";

const MB = 1024 * 1024;

function isHttpUrl(value: string): boolean {
    try {
        const u = new URL(value);
        return u.protocol === "http:" || u.protocol === "https:";
    } catch {
        return false;
    }
}

export async function GET(req: NextRequest) {
    if (!adminFromRequest(req)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const rows = await prisma.guideline.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
    if (!adminFromRequest(req)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const form = await req.formData().catch(() => null);
    if (!form) return NextResponse.json({ error: "Invalid form data" }, { status: 400 });

    const type = form.get("type");
    const title = String(form.get("title") ?? "").trim();
    const source = String(form.get("source") ?? "").trim();
    const tags = String(form.get("tags") ?? "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    const file = form.get("file");
    const thumbnail = form.get("thumbnail");

    if (type !== "PATIENT" && type !== "CLINICAL") {
        return NextResponse.json({ error: "Choose Patient or Clinical" }, { status: 400 });
    }
    if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 });
    if (source && !isHttpUrl(source)) {
        return NextResponse.json({ error: "Source must be a valid http(s) link" }, { status: 400 });
    }

    const hasFile = file instanceof File && file.size > 0;
    if (!hasFile && !source) {
        return NextResponse.json(
            { error: "Upload a PDF/DOC or paste a source link" },
            { status: 400 }
        );
    }

    const saved: string[] = [];
    try {
        let fileUrl = "";
        let thumbUrl = "";
        if (hasFile) {
            fileUrl = await saveUpload(file, DOC_TYPES, 25 * MB);
            saved.push(fileUrl);
        }
        if (thumbnail instanceof File && thumbnail.size > 0) {
            thumbUrl = await saveUpload(thumbnail, IMAGE_TYPES, 5 * MB);
            saved.push(thumbUrl);
        }

        const created = await prisma.guideline.create({
            data: {
                type,
                title,
                link: source,
                pdfs: fileUrl ? [fileUrl] : [],
                thumbnail: thumbUrl,
                tags,
            },
        });
        return NextResponse.json(created, { status: 201 });
    } catch (error) {
        await Promise.all(saved.map(deleteUpload));
        console.error("create guideline failed", error);
        if (error instanceof UploadError) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        return NextResponse.json({ error: "Could not save the guideline" }, { status: 500 });
    }
}
