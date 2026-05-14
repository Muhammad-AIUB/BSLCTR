import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const body = await req.json();
    const { action, rejectionReason } = body;

    if (!["approve", "reject"].includes(action)) {
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const member = await prisma.member.findUnique({ where: { id } });
    if (!member) {
        return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    const updated = await prisma.member.update({
        where: { id },
        data: {
            status: action === "approve" ? "APPROVED" : "REJECTED",
            rejectionReason: action === "reject" ? (rejectionReason || "Application not approved") : null,
        },
    });

    return NextResponse.json({ success: true, status: updated.status });
}
