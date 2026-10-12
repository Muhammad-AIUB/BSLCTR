import { NextRequest, NextResponse } from "next/server";
import {
    ADMIN_COOKIE,
    checkCredentials,
    clearFailedLogins,
    createSessionToken,
    loginBlocked,
    loginThrottles,
    recordFailedLogin,
    sessionCookieOptions,
} from "@/lib/admin-auth";

/**
 * The caller's address as the nearest proxy reports it: the last entry of X-Forwarded-For.
 * Each proxy adds the address it saw to the end, so anything before that is what the client
 * sent and can say whatever the client likes. With no proxy in front, Next fills the header in
 * from the socket.
 */
function callerAddress(req: NextRequest): string {
    return req.headers.get("x-forwarded-for")?.split(",").pop()?.trim() || "unknown";
}

export async function POST(req: NextRequest) {
    const body = await req.json().catch(() => null);
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    const password = typeof body?.password === "string" ? body.password : "";

    // Throttled per caller on the targeted account, and per account across all callers.
    const throttles = loginThrottles(email, callerAddress(req));
    if (throttles.some(loginBlocked)) {
        return NextResponse.json(
            { error: "Too many attempts. Try again in 15 minutes." },
            { status: 429 }
        );
    }

    const admin = checkCredentials(email, password);
    if (!admin) {
        throttles.forEach(recordFailedLogin);
        return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }
    throttles.forEach(clearFailedLogins);

    const res = NextResponse.json({ email: admin });
    res.cookies.set(ADMIN_COOKIE, createSessionToken(admin), sessionCookieOptions);
    return res;
}
