import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const webinars = await prisma.webinar.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(webinars);
}

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { headline, date, time, link, keynoteSpeakers, moderators, chairpersons, coChairmen, sponsors } = body;

    if (!headline || !date || !time || !link) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const webinar = await prisma.webinar.create({
        data: {
            headline,
            date,
            time,
            link,
            keynoteSpeakers: keynoteSpeakers ?? [],
            moderators: moderators ?? [],
            chairpersons: chairpersons ?? [],
            coChairmen: coChairmen ?? [],
            sponsors: sponsors ?? [],
        },
    });

    return NextResponse.json(webinar, { status: 201 });
}
