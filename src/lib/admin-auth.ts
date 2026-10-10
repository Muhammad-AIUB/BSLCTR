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

/** The signature covers the admin's current password, so changing it (or removing the admin) ends their sessions. */
function sign(payload: string, password: string): string {
    return createHmac("sha256", secret()).update(`${payload}.${password}`).digest("base64url");
}

const MAX_FAILED_LOGINS = 10;
const LOGIN_LOCKOUT_MS = 15 * 60 * 1000;
// Kept in memory: enough for a single server process, and it resets on restart.
const failedLogins = new Map<string, { count: number; until: number }>();

/** True when `key` (a caller or a targeted email) has used up its failed attempts for now. */
export function loginBlocked(key: string): boolean {
    const f = failedLogins.get(key);
    if (f && f.until <= Date.now()) failedLogins.delete(key);
    return (failedLogins.get(key)?.count ?? 0) >= MAX_FAILED_LOGINS;
}

export function recordFailedLogin(key: string): void {
    // Bounds the map when someone sprays random emails.
    if (failedLogins.size > 10_000) failedLogins.clear();
    const now = Date.now();
    const f = failedLogins.get(key);
    if (f && f.until > now) f.count++;
    else failedLogins.set(key, { count: 1, until: now + LOGIN_LOCKOUT_MS });
}

export function clearFailedLogins(key: string): void {
    failedLogins.delete(key);
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

/** `email` must be one checkCredentials just returned. */
export function createSessionToken(email: string): string {
    const payload = Buffer.from(
        JSON.stringify({ email, exp: Date.now() + SESSION_TTL_MS })
    ).toString("base64url");
    const password = credentials().find((c) => c.email === email)?.password ?? "";
    return `${payload}.${sign(payload, password)}`;
}

/** Returns the admin email if the token is authentic, unexpired and that admin still has the same password. */
export function verifySessionToken(token: string | undefined): string | null {
    if (!token) return null;
    const [payload, sig] = token.split(".");
    if (!payload || !sig) return null;
    // Read before the signature check only to pick whose password signed it.
    let claims: { email?: unknown; exp?: unknown };
    try {
        claims = JSON.parse(Buffer.from(payload, "base64url").toString());
    } catch {
        return null;
    }
    const { email, exp } = claims;
    if (typeof email !== "string" || typeof exp !== "number" || exp <= Date.now()) return null;
    const admin = credentials().find((c) => c.email === email);
    return admin && safeEqual(sig, sign(payload, admin.password)) ? email : null;
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
