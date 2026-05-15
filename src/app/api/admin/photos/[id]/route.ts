import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const body = await req.json();

    const photo = await prisma.photo.update({
        where: { id },
        data: {
            ...(body.title !== undefined && { title: body.title }),
            ...(body.link !== undefined && { link: body.link }),
            ...(body.description !== undefined && { description: body.description ?? "" }),
            ...(body.tags !== undefined && { tags: body.tags ?? [] }),
            ...(body.status !== undefined && { status: body.status }),
        },
    });
    return NextResponse.json(photo);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    await prisma.photo.delete({ where: { id } });
    return NextResponse.json({ ok: true });
}
