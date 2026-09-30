import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { adminFromRequest } from "@/lib/admin-auth";
import { deleteUpload } from "@/lib/uploads";

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    if (!adminFromRequest(req)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;

    const existing = await prisma.guideline.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await prisma.guideline.delete({ where: { id } });
    await Promise.all([...existing.pdfs, existing.thumbnail].filter(Boolean).map(deleteUpload));
    return NextResponse.json({ ok: true });
}
