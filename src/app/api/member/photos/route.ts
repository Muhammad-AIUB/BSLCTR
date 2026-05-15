import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

async function getMember() {
    const cookieStore = await cookies();
    const token = cookieStore.get("member_token")?.value;
    if (!token) return null;
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? "secret");
        const { payload } = await jwtVerify(token, secret);
        return payload as { id: string; name: string; email: string };
    } catch {
        return null;
    }
}

export async function GET() {
    const member = await getMember();
    if (!member) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const photos = await prisma.photo.findMany({
        where: { uploadedById: member.id },
        orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(photos);
}

export async function POST(req: NextRequest) {
    const member = await getMember();
    if (!member) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { title, link, description, tags } = body;
    if (!title || !link) return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

    const photo = await prisma.photo.create({
        data: {
            title,
            link,
            description: description ?? "",
            tags: tags ?? [],
            status: "PENDING",
            uploadedById: member.id,
            uploadedByName: member.name,
        },
    });
    return NextResponse.json(photo, { status: 201 });
}
