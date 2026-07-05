import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { title, files, description, tags } = await req.json();
    const casePresentation = await prisma.casePresentation.update({
        where: { id },
        data: {
            ...(title !== undefined && { title }),
            ...(files !== undefined && { files }),
            ...(description !== undefined && { description }),
            ...(tags !== undefined && { tags }),
        },
    });
    return NextResponse.json(casePresentation);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    await prisma.casePresentation.delete({ where: { id } });
    return NextResponse.json({ ok: true });
}
