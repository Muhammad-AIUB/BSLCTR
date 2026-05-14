import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const photos = await prisma.photo.findMany({ orderBy: { createdAt: "desc" } });
        return NextResponse.json(photos);
    } catch (error) {
        console.error(error);
        return NextResponse.json([], { status: 500 });
    }
}
