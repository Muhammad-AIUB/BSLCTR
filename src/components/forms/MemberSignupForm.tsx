"use client";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";

// Mirrors the limits in src/app/api/member/signup/route.ts.
const formSchema = z.object({
    fullName: z.string().trim().min(2, { message: "Full name must be at least 2 characters." }).max(200),
    designation: z.string().trim().min(1, { message: "Please enter your designation." }).max(200),
    specialty: z.string().min(1, { message: "Please select a specialty." }),
    affiliatedInstitution: z
        .string()
        .trim()
        .min(2, { message: "Please enter your affiliated institution." })
        .max(300),
    bmdcRegNo: z
        .string()
        .trim()
        .min(5, { message: "Please enter a valid BMDC registration number." })
        .max(20, { message: "BMDC registration number is too long." }),
    mobileNumber: z
        .string()
        .trim()
        .regex(/^[0-9]{10,15}$/, { message: "Please enter a valid mobile number (10 to 15 digits)." }),
    email: z.string().trim().email({ message: "Please enter a valid email address." }).max(254),
});

const specialties = [
    "Hepatology",
    "Gastroenterology",
    "Internal Medicine",
    "Family Medicine",
    "Surgery",
    "Transplant Surgery",
    "Oncology",
    "Pediatrics",
    "Radiology",
    "Pathology",
    "Nursing",
    "Other",
];

type MemberSignupFormProps = {
    /** Returns to whatever offered the form. Omit when the form is opened directly. */
    onBack?: () => void;
    onSuccess?: () => void;
};

export function MemberSignupForm({ onBack, onSuccess }: MemberSignupFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: "",
            designation: "",
            specialty: "",
            affiliatedInstitution: "",
            bmdcRegNo: "",
            mobileNumber: "",
            email: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            const response = await fetch("/api/member/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                // A crashed route answers with an HTML page, not JSON.
                const error = await response.json().catch(() => ({}));
                throw new Error(error.message || "Signup failed. Please try again later.");
            }

            // No email is sent and there is no member login yet; say only what happened.
            alert("Signup received. Your membership application is pending approval.");
            form.reset();
            onSuccess?.();
            onBack?.();
        } catch (error) {
            // fetch itself rejects with a TypeError when the network is down.
            setSubmitError(
                error instanceof TypeError
                    ? "Could not reach the server. Check your connection and try again."
                    : error instanceof Error
                      ? error.message
                      : "Something went wrong"
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {onBack && (
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onBack}
                        className="mb-2 h-auto rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                        aria-label="Back"
                    >
                        <ChevronLeft className="h-4 w-4 mr-1" /> Back
                    </Button>
                )}

                <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Full Name *</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter your full name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="designation"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Designation *</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., Dr., Prof., Mr., Ms." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="specialty"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Specialty *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select your specialty" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {specialties.map((specialty) => (
                                        <SelectItem key={specialty} value={specialty}>
                                            {specialty}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="affiliatedInstitution"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Affiliated Institution *</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter your institution name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="bmdcRegNo"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>BMDC Registration Number *</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., A-12345" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="mobileNumber"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mobile Number *</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., 01XXXXXXXXX" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email Address *</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="Enter your email" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {submitError && (
                    <div role="alert" className="text-sm text-destructive font-medium">
                        {submitError}
                    </div>
                )}

                <div className="flex justify-end pt-4">
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="rounded-full bg-secondary text-white hover:bg-secondary/90"
                    >
                        {isSubmitting ? "Signing up..." : "Sign Up"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
