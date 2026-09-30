import { NextRequest, NextResponse } from "next/server";
import { adminFromRequest } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    const email = adminFromRequest(req);
    return NextResponse.json({ email });
}
