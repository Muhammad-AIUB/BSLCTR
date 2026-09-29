import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const registrationSchema = z.object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    designation: z.string().min(1, "Designation is required"),
    specialty: z.string().min(1, "Specialty is required"),
    affiliatedInstitution: z.string().min(2, "Institution name is required"),
    bmdcRegNo: z
        .string()
        .min(5, "BMDC registration number must be at least 5 characters")
        .max(20, "BMDC registration number is too long"),
    mobileNumber: z
        .string()
        .regex(/^[0-9]{10,}$/, "Mobile number must be at least 10 digits"),
    email: z.string().email("Invalid email address"),
    paymentOption: z.enum(["pay_now", "pay_later"], "Invalid payment option"),
});

type RegistrationData = z.infer<typeof registrationSchema>;

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Server-side validation
        const validation = registrationSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    message: "Validation failed",
                    errors: validation.error.flatten().fieldErrors,
                },
                { status: 400 }
            );
        }

        const data: RegistrationData = validation.data;

        // Additional business logic validations
        if (data.bmdcRegNo.length < 5) {
            return NextResponse.json(
                { message: "Invalid BMDC registration number format" },
                { status: 400 }
            );
        }

        // TODO: Save to database or send confirmation email
        // For now, just log and return success
        console.log("Conference registration received:", {
            ...data,
            timestamp: new Date().toISOString(),
            ipAddress: request.headers.get("x-forwarded-for") || "unknown",
        });

        // Simulate async operation (e.g., sending email, saving to DB)
        await new Promise((resolve) => setTimeout(resolve, 500));

        return NextResponse.json(
            {
                success: true,
                message: "Registration successful",
                data: {
                    email: data.email,
                    fullName: data.fullName,
                    registeredAt: new Date().toISOString(),
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Conference registration error:", error);

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
