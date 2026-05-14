import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const {
            name, mobileNo, email, password, bmdcNo, designation,
            specialtySubject, academicQualifications, specializedTraining,
            currentPosting, chamberAddresses, shortBiography, journals,
            profilePicture, backgroundPicture, interventions,
        } = body;

        if (!name || !mobileNo || !email || !password || !bmdcNo || !designation || !specialtySubject || !academicQualifications) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const existing = await prisma.member.findUnique({ where: { email } });
        if (existing) {
            return NextResponse.json({ error: "Email already registered" }, { status: 409 });
        }

        const isOther = specialtySubject === "other";
        const hashedPassword = await bcrypt.hash(password, 10);

        const member = await prisma.member.create({
            data: {
                name,
                mobileNo,
                email,
                password: hashedPassword,
                bmdcNo,
                designation,
                specialtySubject,
                academicQualifications,
                specializedTraining: specializedTraining || null,
                currentPosting: isOther ? null : (currentPosting || null),
                chamberAddresses: isOther ? [] : (chamberAddresses || []),
                shortBiography: isOther ? null : (shortBiography || null),
                journals: isOther ? null : (journals || null),
                profilePicture: profilePicture || null,
                backgroundPicture: isOther ? null : (backgroundPicture || null),
                interventions: isOther ? [] : (interventions || []),
            },
        });

        return NextResponse.json({ success: true, id: member.id }, { status: 201 });
    } catch (error) {
        console.error("Member signup error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
