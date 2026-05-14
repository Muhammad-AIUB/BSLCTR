import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
    const { email, password } = await req.json();

    if (!email || !password) {
        return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const member = await prisma.member.findUnique({ where: { email } });

    if (!member || !member.password) {
        return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    if (member.status === "PENDING") {
        return NextResponse.json({ error: "Your application is pending admin approval" }, { status: 403 });
    }

    if (member.status === "REJECTED") {
        return NextResponse.json({ error: "Your application has been rejected" }, { status: 403 });
    }

    const valid = await bcrypt.compare(password, member.password);
    if (!valid) {
        return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    return NextResponse.json({
        success: true,
        member: { id: member.id, name: member.name, email: member.email },
    });
}
