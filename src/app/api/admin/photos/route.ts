import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const photos = await prisma.photo.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(photos);
}

// Admin direct upload → auto APPROVED
export async function POST(req: NextRequest) {
    const body = await req.json();
    const { title, link, description, tags } = body;
    if (!title || !link) return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

    const photo = await prisma.photo.create({
        data: { title, link, description: description ?? "", tags: tags ?? [], status: "APPROVED" },
    });
    return NextResponse.json(photo, { status: 201 });
}
