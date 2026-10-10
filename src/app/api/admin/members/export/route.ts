import { NextRequest, NextResponse } from "next/server";
import { adminFromRequest } from "@/lib/admin-auth";
import { csvResponse, toCsv } from "@/lib/csv";
import { MEMBER_SIGNUP_CSV, bangladeshDateStamp, listMemberSignups } from "@/lib/submissions";

export const dynamic = "force-dynamic";

/** Every membership application as a CSV file, for the dashboard's Export button. */
export async function GET(req: NextRequest) {
    if (!adminFromRequest(req)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const csv = toCsv(MEMBER_SIGNUP_CSV, await listMemberSignups());
        return csvResponse(csv, `member-signups-${bangladeshDateStamp()}.csv`);
    } catch (error) {
        console.error("list member signups export failed", error);
        return NextResponse.json({ error: "Could not export the member signups" }, { status: 500 });
    }
}
