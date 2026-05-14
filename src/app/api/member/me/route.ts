import { NextResponse } from "next/server";
import { getMemberFromCookie } from "@/lib/memberAuth";

export async function GET() {
    const member = await getMemberFromCookie();
    if (!member) {
        return NextResponse.json({ member: null }, { status: 401 });
    }
    return NextResponse.json({ member });
}
