import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const photos = await prisma.photo.findMany({
            where: { status: "APPROVED" },
            orderBy: { createdAt: "desc" },
            // Only what the gallery shows; who uploaded a row stays private.
            select: { id: true, title: true, link: true, createdAt: true },
        });
        return NextResponse.json(photos);
    } catch (error) {
        console.error(error);
        return NextResponse.json([], { status: 500 });
    }
}
