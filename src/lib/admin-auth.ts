import { createHmac, timingSafeEqual } from "crypto";
import { mkdirSync, readFileSync, renameSync, writeFileSync } from "fs";
import path from "path";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { UPLOAD_DIR } from "@/lib/uploads";

export const ADMIN_COOKIE = "admin_session";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
// When each admin last signed out. A file, not memory: the host stops the app when it is idle,
// and a sign-out that a restart forgets is not one. It sits with the uploads because that is
// the one folder a redeploy leaves in place.
const SESSION_CUTOFFS_FILE = path.join(UPLOAD_DIR, ".session-cutoffs.json");

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

// Wrong passwords allowed from one caller on one account before that caller has to wait.
const MAX_FAILED_LOGINS = 10;
// And from every caller together. Without it, someone who can change the address they appear
// to come from would never run out of guesses.
const MAX_FAILED_LOGINS_PER_ACCOUNT = 50;
const LOGIN_LOCKOUT_MS = 15 * 60 * 1000;
const MAX_TRACKED_KEYS = 10_000;
// A full map is cut back to this, not by one, so a flood does not pay for a pass per request.
const TRACKED_KEYS_AFTER_EVICTION = 9_000;
// Kept in memory: enough for a single server process, and it resets on restart.
const failedLogins = new Map<string, { count: number; until: number; account: string }>();

/** One counter a sign-in attempt is held to. */
export type LoginThrottle = { key: string; limit: number; account: string };

const accountOf = (email: string) => email.toLowerCase().slice(0, 254);

/**
 * The counters for an attempt on `email` by `caller`: the caller's own tries at that account,
 * and everyone's. Nothing is counted per caller alone. One address can be a whole office or the
 * host's own proxy, and a lock on it kept every admin behind it out after ten wrong guesses by
 * anyone; it also added nothing, since a guess at an email that is not an admin's opens no door.
 */
export function loginThrottles(email: string, caller: string): LoginThrottle[] {
    const account = accountOf(email);
    return [
        { key: JSON.stringify(["account", account]), limit: MAX_FAILED_LOGINS_PER_ACCOUNT, account },
        { key: JSON.stringify(["caller", account, caller.slice(0, 64)]), limit: MAX_FAILED_LOGINS, account },
    ];
}

/** True when this counter has used up its failed attempts for now. */
export function loginBlocked({ key, limit }: LoginThrottle): boolean {
    const f = failedLogins.get(key);
    if (f && f.until <= Date.now()) failedLogins.delete(key);
    return (failedLogins.get(key)?.count ?? 0) >= limit;
}

/**
 * Bounds the map when someone sprays random emails or addresses. Expired counters go first,
 * then the oldest ones, but never a real admin's: dropping those would hand the sprayer a
 * fresh set of guesses against that account.
 */
function makeRoom(now: number): void {
    for (const [key, f] of failedLogins) {
        if (f.until <= now) failedLogins.delete(key);
    }
    if (failedLogins.size <= TRACKED_KEYS_AFTER_EVICTION) return;
    const admins = new Set(credentials().map((c) => accountOf(c.email)));
    for (const [key, f] of failedLogins) {
        if (failedLogins.size <= TRACKED_KEYS_AFTER_EVICTION) break;
        if (!admins.has(f.account)) failedLogins.delete(key);
    }
}

export function recordFailedLogin({ key, account }: LoginThrottle): void {
    const now = Date.now();
    if (failedLogins.size >= MAX_TRACKED_KEYS) makeRoom(now);
    const f = failedLogins.get(key);
    if (f && f.until > now) f.count++;
    else failedLogins.set(key, { count: 1, until: now + LOGIN_LOCKOUT_MS, account });
}

export function clearFailedLogins({ key }: LoginThrottle): void {
    failedLogins.delete(key);
}

/** Returns the matching admin email, or null. Checks every entry so timing does not reveal which one matched. */
export function checkCredentials(email: string, password: string): string | null {
    let match: string | null = null;
    for (const c of credentials()) {
        // An address is the same whatever case it is typed in; a password is not.
        const okEmail = safeEqual(c.email.toLowerCase(), email.toLowerCase());
        const okPass = safeEqual(c.password, password);
        if (okEmail && okPass) match = c.email;
    }
    return match;
}

/** When each admin last signed out, by email. Empty until someone has. */
function sessionCutoffs(): Record<string, unknown> {
    let text: string;
    try {
        text = readFileSync(SESSION_CUTOFFS_FILE, "utf8");
    } catch (error) {
        // No file yet is the normal case. Anything else leaves signed-out sessions working.
        if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
            console.error("could not read the sign-out record", error);
        }
        return {};
    }
    try {
        const parsed: unknown = JSON.parse(text);
        return parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : {};
    } catch (error) {
        console.error("the sign-out record is not valid JSON", error);
        return {};
    }
}

/** When `email` last signed out (ms since the epoch), or 0 if never. */
function lastSignOut(email: string): number {
    const at = sessionCutoffs()[email];
    return typeof at === "number" ? at : 0;
}

/**
 * Ends every session `email` has, on every device. Clearing the cookie only removes one
 * browser's copy; a copy taken earlier would otherwise keep working until it expired.
 * Returns false when the sign-out could not be recorded.
 */
export function endSessions(email: string): boolean {
    try {
        mkdirSync(UPLOAD_DIR, { recursive: true });
        // Written beside the file and renamed over it, so a process stopped part-way leaves
        // the old record and never half of a new one.
        const next = `${SESSION_CUTOFFS_FILE}.${process.pid}.tmp`;
        writeFileSync(next, JSON.stringify({ ...sessionCutoffs(), [email]: Date.now() }));
        renameSync(next, SESSION_CUTOFFS_FILE);
        return true;
    } catch (error) {
        console.error("could not record the sign-out", error);
        return false;
    }
}

/** `email` must be one checkCredentials just returned. */
export function createSessionToken(email: string): string {
    const now = Date.now();
    // Later than the last sign-out even when both fall in the same millisecond.
    const iat = Math.max(now, lastSignOut(email) + 1);
    const payload = Buffer.from(
        JSON.stringify({ email, iat, exp: now + SESSION_TTL_MS })
    ).toString("base64url");
    const password = credentials().find((c) => c.email === email)?.password ?? "";
    return `${payload}.${sign(payload, password)}`;
}

/**
 * Returns the admin email if the token is authentic, unexpired, issued since that admin last
 * signed out, and that admin still has the same password.
 */
export function verifySessionToken(token: string | undefined): string | null {
    if (!token) return null;
    const [payload, sig] = token.split(".");
    if (!payload || !sig) return null;
    // Read before the signature check only to pick whose password signed it.
    let claims: { email?: unknown; iat?: unknown; exp?: unknown } | null;
    try {
        claims = JSON.parse(Buffer.from(payload, "base64url").toString());
    } catch {
        return null;
    }
    // A payload can be valid JSON and still not an object, e.g. `null`.
    const { email, iat, exp } = claims ?? {};
    if (typeof email !== "string" || typeof exp !== "number" || exp <= Date.now()) return null;
    const admin = credentials().find((c) => c.email === email);
    if (!admin || !safeEqual(sig, sign(payload, admin.password))) return null;
    // Tokens from before `iat` was added are dated from their expiry.
    const issuedAt = typeof iat === "number" ? iat : exp - SESSION_TTL_MS;
    return issuedAt > lastSignOut(email) ? email : null;
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
