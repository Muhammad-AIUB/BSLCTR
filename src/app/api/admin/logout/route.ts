import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, adminFromRequest, endSessions } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
    // Only a request that carries a valid session ends that admin's sessions: a caller with
    // no cookie, or a forged one, signs nobody out.
    const email = adminFromRequest(req);
    const recorded = !email || endSessions(email);

    // The cookie is cleared either way. Without the record this browser is signed out but a
    // copy of the cookie is not, and the reply must not say otherwise.
    const res = recorded
        ? NextResponse.json({ ok: true })
        : NextResponse.json({ error: "Signed out here, but not on other devices" }, { status: 500 });
    res.cookies.set(ADMIN_COOKIE, "", { path: "/", maxAge: 0 });
    return res;
}
