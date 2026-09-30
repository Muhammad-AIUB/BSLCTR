import { NextRequest, NextResponse } from "next/server";
import {
    ADMIN_COOKIE,
    checkCredentials,
    createSessionToken,
    sessionCookieOptions,
} from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
    const body = await req.json().catch(() => null);
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    const password = typeof body?.password === "string" ? body.password : "";

    const admin = checkCredentials(email, password);
    if (!admin) {
        return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    const res = NextResponse.json({ email: admin });
    res.cookies.set(ADMIN_COOKIE, createSessionToken(admin), sessionCookieOptions);
    return res;
}
