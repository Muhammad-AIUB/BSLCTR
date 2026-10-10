import { NextRequest, NextResponse } from "next/server";
import { adminFromRequest } from "@/lib/admin-auth";
import { csvResponse, toCsv } from "@/lib/csv";
import { REGISTRATION_CSV, bangladeshDateStamp, listRegistrations } from "@/lib/submissions";

export const dynamic = "force-dynamic";

/** Every conference registration as a CSV file, for the dashboard's Export button. */
export async function GET(req: NextRequest) {
    if (!adminFromRequest(req)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const csv = toCsv(REGISTRATION_CSV, await listRegistrations());
        return csvResponse(csv, `conference-registrations-${bangladeshDateStamp()}.csv`);
    } catch (error) {
        console.error("list registrations export failed", error);
        return NextResponse.json({ error: "Could not export the registrations" }, { status: 500 });
    }
}
