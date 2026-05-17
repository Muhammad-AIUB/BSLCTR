import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const guidelines = await prisma.guideline.findMany({
        orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(guidelines);
}

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { title, link, pdfs, tags } = body;
    if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 });

    const guideline = await prisma.guideline.create({
        data: {
            title,
            link: link ?? "",
            pdfs: pdfs ?? [],
            tags: tags ?? [],
        },
    });
    return NextResponse.json(guideline, { status: 201 });
}
