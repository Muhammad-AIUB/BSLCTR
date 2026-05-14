import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    await prisma.webinar.delete({ where: { id } });
    return NextResponse.json({ ok: true });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const body = await req.json();
    const webinar = await prisma.webinar.update({
        where: { id },
        data: {
            headline: body.headline,
            date: body.date,
            time: body.time,
            link: body.link,
            keynoteSpeakers: body.keynoteSpeakers ?? [],
            moderators: body.moderators ?? [],
            chairpersons: body.chairpersons ?? [],
            coChairmen: body.coChairmen ?? [],
            sponsors: body.sponsors ?? [],
        },
    });
    return NextResponse.json(webinar);
}
