import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const where = status ? { status: status as "PENDING" | "APPROVED" | "REJECTED" } : {};

    const members = await prisma.member.findMany({
        where,
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            name: true,
            email: true,
            mobileNo: true,
            bmdcNo: true,
            designation: true,
            specialtySubject: true,
            otherSpecialty: true,
            academicQualifications: true,
            profilePicture: true,
            status: true,
            rejectionReason: true,
            createdAt: true,
        },
    });

    return NextResponse.json(members);
}
