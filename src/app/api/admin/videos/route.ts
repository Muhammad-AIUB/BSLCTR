import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const videos = await prisma.video.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(videos);
}

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { title, link, description, tags } = body;

    if (!title || !link) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const video = await prisma.video.create({
        data: {
            title,
            link,
            description: description ?? "",
            tags: tags ?? [],
        },
    });

    return NextResponse.json(video, { status: 201 });
}
