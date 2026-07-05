import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const cases = await prisma.casePresentation.findMany({
        orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(cases);
}

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { title, files, description, tags } = body;
    if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 });

    const casePresentation = await prisma.casePresentation.create({
        data: {
            title,
            files: files ?? [],
            description: description ?? "",
            tags: tags ?? [],
        },
    });
    return NextResponse.json(casePresentation, { status: 201 });
}
