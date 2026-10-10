import { NextRequest, NextResponse } from "next/server";
import {
    ADMIN_COOKIE,
    checkCredentials,
    clearFailedLogins,
    createSessionToken,
    emailLoginKey,
    loginBlocked,
    recordFailedLogin,
    sessionCookieOptions,
} from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
    const body = await req.json().catch(() => null);
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    const password = typeof body?.password === "string" ? body.password : "";

    // Throttled per targeted account and, when a proxy reports one, per caller.
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim();
    const keys = [emailLoginKey(email)];
    // Capped: the header is the caller's to choose, and each key is held for 15 minutes.
    if (ip) keys.push(`ip:${ip.slice(0, 64)}`);
    if (keys.some(loginBlocked)) {
        return NextResponse.json(
            { error: "Too many attempts. Try again in 15 minutes." },
            { status: 429 }
        );
    }

    const admin = checkCredentials(email, password);
    if (!admin) {
        keys.forEach(recordFailedLogin);
        return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }
    keys.forEach(clearFailedLogins);

    const res = NextResponse.json({ email: admin });
    res.cookies.set(ADMIN_COOKIE, createSessionToken(admin), sessionCookieOptions);
    return res;
}
