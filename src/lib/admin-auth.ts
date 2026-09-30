import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

export const ADMIN_COOKIE = "admin_session";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

type Credential = { email: string; password: string };

function secret(): string {
    const s = process.env.ADMIN_SESSION_SECRET;
    if (!s) throw new Error("ADMIN_SESSION_SECRET is not set");
    return s;
}

function credentials(): Credential[] {
    try {
        const parsed = JSON.parse(process.env.ADMIN_CREDENTIALS ?? "[]");
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function safeEqual(a: string, b: string): boolean {
    const ab = Buffer.from(a);
    const bb = Buffer.from(b);
    return ab.length === bb.length && timingSafeEqual(ab, bb);
}

function sign(payload: string): string {
    return createHmac("sha256", secret()).update(payload).digest("base64url");
}

/** Returns the matching admin email, or null. Checks every entry so timing does not reveal which one matched. */
export function checkCredentials(email: string, password: string): string | null {
    let match: string | null = null;
    for (const c of credentials()) {
        const okEmail = safeEqual(c.email, email);
        const okPass = safeEqual(c.password, password);
        if (okEmail && okPass) match = c.email;
    }
    return match;
}

export function createSessionToken(email: string): string {
    const payload = Buffer.from(
        JSON.stringify({ email, exp: Date.now() + SESSION_TTL_MS })
    ).toString("base64url");
    return `${payload}.${sign(payload)}`;
}

/** Returns the admin email if the token is authentic and unexpired. */
export function verifySessionToken(token: string | undefined): string | null {
    if (!token) return null;
    const [payload, sig] = token.split(".");
    if (!payload || !sig || !safeEqual(sig, sign(payload))) return null;
    try {
        const { email, exp } = JSON.parse(Buffer.from(payload, "base64url").toString());
        return typeof email === "string" && typeof exp === "number" && exp > Date.now()
            ? email
            : null;
    } catch {
        return null;
    }
}

export function adminFromRequest(req: NextRequest): string | null {
    return verifySessionToken(req.cookies.get(ADMIN_COOKIE)?.value);
}

/** For server components and layouts. */
export async function adminFromCookies(): Promise<string | null> {
    return verifySessionToken((await cookies()).get(ADMIN_COOKIE)?.value);
}

export const sessionCookieOptions = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
};
