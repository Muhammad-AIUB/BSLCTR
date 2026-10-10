import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const memberSignupSchema = z.object({
    fullName: z.string().trim().min(2, "Full name must be at least 2 characters").max(200),
    designation: z.string().trim().min(1, "Designation is required").max(200),
    specialty: z.string().trim().min(1, "Specialty is required").max(200),
    affiliatedInstitution: z.string().trim().min(2, "Institution name is required").max(300),
    bmdcRegNo: z
        .string()
        .trim()
        .min(5, "BMDC registration number must be at least 5 characters")
        .max(20, "BMDC registration number is too long"),
    mobileNumber: z
        .string()
        .trim()
        .regex(/^[0-9]{10,15}$/, "Mobile number must be 10 to 15 digits"),
    // Lower-cased so the unique check does not take A@x.com and a@x.com for two people.
    email: z.string().trim().toLowerCase().email("Invalid email address").max(254),
});

type MemberSignupData = z.infer<typeof memberSignupSchema>;

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Server-side validation
        const validation = memberSignupSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    message: "Validation failed",
                    errors: validation.error.flatten().fieldErrors,
                },
                { status: 400 }
            );
        }

        const data: MemberSignupData = validation.data;

        // Check if email already exists
        const existingMember = await prisma.member.findUnique({
            where: { email: data.email },
        });

        if (existingMember) {
            return NextResponse.json(
                { message: "Email already registered" },
                { status: 409 }
            );
        }

        // Check if BMDC reg no already exists
        const existingBmdcReg = await prisma.member.findFirst({
            where: { bmdcNo: data.bmdcRegNo },
        });

        if (existingBmdcReg) {
            return NextResponse.json(
                { message: "BMDC registration number already registered" },
                { status: 409 }
            );
        }

        // Create new member
        const newMember = await prisma.member.create({
            data: {
                name: data.fullName,
                designation: data.designation,
                specialtySubject: data.specialty,
                // The signup form has no qualifications field and the column is
                // required; an admin fills it in when reviewing the application.
                academicQualifications: "",
                currentPosting: data.affiliatedInstitution,
                bmdcNo: data.bmdcRegNo,
                mobileNo: data.mobileNumber,
                email: data.email,
                status: "PENDING", // Default status is PENDING until admin approves
            },
        });

        console.log("New member signup:", {
            id: newMember.id,
            email: newMember.email,
            timestamp: new Date().toISOString(),
            ipAddress: request.headers.get("x-forwarded-for") || "unknown",
        });

        return NextResponse.json(
            {
                success: true,
                message: "Signup successful",
                data: {
                    id: newMember.id,
                    email: newMember.email,
                    name: newMember.name,
                    status: newMember.status,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        // Two signups with the same email can both pass the check above; the
        // unique constraint then rejects the second.
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            return NextResponse.json(
                { message: "Email already registered" },
                { status: 409 }
            );
        }

        console.error("Member signup error:", error);

        if (error instanceof SyntaxError) {
            return NextResponse.json(
                { message: "Invalid request format" },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { message: "Server error. Please try again later." },
            { status: 500 }
        );
    }
}
