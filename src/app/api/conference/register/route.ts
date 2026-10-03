import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Mirrors the fields in src/components/forms/ConferenceRegistrationForm.tsx.
const registrationSchema = z.object({
    name: z.string().trim().min(2, "Name is required").max(200),
    degree: z.string().trim().min(1, "Degree is required").max(200),
    speciality: z.string().trim().min(1, "Speciality is required").max(200),
    designation: z.string().trim().min(1, "Designation is required").max(200),
    institution: z.string().trim().min(2, "Institution is required").max(300),
    contactNo: z.string().trim().regex(/^\+?[0-9]{10,14}$/, "Contact number is not valid"),
    email: z.string().trim().email("Invalid email address"),
    category: z.enum(["delegate", "student"], { message: "Invalid participant's category" }),
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
                    name: data.name,
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
