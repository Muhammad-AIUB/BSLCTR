import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const all = await prisma.webinar.findMany({ orderBy: { createdAt: "desc" } });

        const now = new Date();
        const expiredIds: string[] = [];

        for (const w of all) {
            // date: "YYYY-MM-DD", time: "HH:MM"
            const dt = new Date(`${w.date}T${w.time}:00`);
            if (!isNaN(dt.getTime()) && dt < now) {
                expiredIds.push(w.id);
            }
        }

        if (expiredIds.length > 0) {
            await prisma.webinar.deleteMany({ where: { id: { in: expiredIds } } });
        }

        const active = all.filter((w) => !expiredIds.includes(w.id));
        return NextResponse.json(active);
    } catch (error) {
        console.error(error);
        return NextResponse.json([], { status: 500 });
    }
}
