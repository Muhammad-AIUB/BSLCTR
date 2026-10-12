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

    try {
        const existing = await prisma.webinar.findUnique({ where: { id } });
        if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

        await prisma.webinar.delete({ where: { id } });
        if (existing.thumbnail) await deleteUpload(existing.thumbnail);
        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error("delete webinar failed", error);
        return NextResponse.json({ error: "Could not delete the webinar" }, { status: 500 });
    }
}
