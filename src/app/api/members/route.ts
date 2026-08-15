import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Public directory of approved members.
 *
 * Deliberately narrower than /api/admin/members: it returns APPROVED members
 * only, and omits email and mobileNo. Those are personal contact details
 * collected at signup, not directory data — chamber addresses are the intended
 * public contact route. Never select `password`.
 */
export async function GET() {
    const members = await prisma.member.findMany({
        where: { status: "APPROVED" },
        orderBy: { name: "asc" },
        select: {
            id: true,
            name: true,
            bmdcNo: true,
            designation: true,
            specialtySubject: true,
            otherSpecialty: true,
            academicQualifications: true,
            specializedTraining: true,
            currentPosting: true,
            pastPostings: true,
            chamberAddresses: true,
            shortIntroduction: true,
            shortBiography: true,
            journals: true,
            profilePicture: true,
            interventions: true,
        },
    });

    return NextResponse.json(members);
}
