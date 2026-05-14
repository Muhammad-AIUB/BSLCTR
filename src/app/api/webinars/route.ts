import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const webinars = await prisma.webinar.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(webinars);
}
