import { NextRequest, NextResponse } from "next/server";
import { adminFromRequest } from "@/lib/admin-auth";
import { listMemberSignups } from "@/lib/submissions";

export const dynamic = "force-dynamic";

/** Every membership application, newest first, for the dashboard. */
export async function GET(req: NextRequest) {
    if (!adminFromRequest(req)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        // Not cached anywhere: the rows are people's contact details.
        return NextResponse.json(await listMemberSignups(), {
            headers: { "Cache-Control": "no-store" },
        });
    } catch (error) {
        console.error("list member signups failed", error);
        return NextResponse.json({ error: "Could not load the member signups" }, { status: 500 });
    }
}
