import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { adminFromRequest } from "@/lib/admin-auth";
import { deleteUpload } from "@/lib/uploads";

/** PATCH /api/admin/gallery/:id?kind=VIDEO|PHOTO with { title } renames an item. */
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    if (!adminFromRequest(req)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    const kind = req.nextUrl.searchParams.get("kind");
    if (kind !== "VIDEO" && kind !== "PHOTO") {
        return NextResponse.json({ error: "Unknown kind" }, { status: 400 });
    }

    const body = await req.json().catch(() => null);
    const title = typeof body?.title === "string" ? body.title.trim() : "";
    if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 });
    if (title.length > 200) {
        return NextResponse.json({ error: "Title is too long" }, { status: 400 });
    }

    // updateMany so a missing id is a 404 rather than a thrown error.
    const { count } =
        kind === "VIDEO"
            ? await prisma.video.updateMany({ where: { id }, data: { title } })
            : await prisma.photo.updateMany({ where: { id }, data: { title } });
    if (count === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
}

/** DELETE /api/admin/gallery/:id?kind=VIDEO|PHOTO */
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    if (!adminFromRequest(req)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    const kind = req.nextUrl.searchParams.get("kind");
    if (kind !== "VIDEO" && kind !== "PHOTO") {
        return NextResponse.json({ error: "Unknown kind" }, { status: 400 });
    }

    const existing =
        kind === "VIDEO"
            ? await prisma.video.findUnique({ where: { id } })
            : await prisma.photo.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (kind === "VIDEO") await prisma.video.delete({ where: { id } });
    else await prisma.photo.delete({ where: { id } });
    await deleteUpload(existing.link);
    return NextResponse.json({ ok: true });
}
