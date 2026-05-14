import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET = new TextEncoder().encode(
    process.env.MEMBER_JWT_SECRET ?? "fallback-secret"
);
const COOKIE = "member_token";

export async function signMemberToken(payload: { id: string; name: string; email: string }) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("7d")
        .sign(SECRET);
}

export async function verifyMemberToken(token: string) {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as { id: string; name: string; email: string };
}

export async function getMemberFromCookie() {
    const jar = await cookies();
    const token = jar.get(COOKIE)?.value;
    if (!token) return null;
    try {
        return await verifyMemberToken(token);
    } catch {
        return null;
    }
}

export function memberCookieOptions(token: string) {
    return {
        name: COOKIE,
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
    };
}
