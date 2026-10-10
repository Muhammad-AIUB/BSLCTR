import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { WEBINAR_VISIBLE_AFTER_START_MS, webinarStart } from "@/lib/webinars";

export async function GET() {
    try {
        const all = await prisma.webinar.findMany({ orderBy: { createdAt: "desc" } });

        // Past webinars are hidden here, never deleted: a public GET must not
        // change data. Admins remove old ones from the dashboard.
        const cutoff = Date.now() - WEBINAR_VISIBLE_AFTER_START_MS;
        const active = all.filter((w) => {
            const start = webinarStart(w.date, w.time).getTime();
            return isNaN(start) || start > cutoff;
        });
        return NextResponse.json(active);
    } catch (error) {
        console.error(error);
        return NextResponse.json([], { status: 500 });
    }
}
