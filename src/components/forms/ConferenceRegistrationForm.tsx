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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";

const formSchema = z.object({
    fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
    designation: z.string().min(1, { message: "Please enter your designation." }),
    specialty: z.string().min(1, { message: "Please select a specialty." }),
    affiliatedInstitution: z.string().min(2, { message: "Please enter your affiliated institution." }),
    bmdcRegNo: z.string().min(5, { message: "Please enter a valid BMDC registration number." }),
    mobileNumber: z
        .string()
        .regex(/^[0-9]{10,}$/, { message: "Please enter a valid 10+ digit mobile number." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    paymentOption: z.enum(["pay_now", "pay_later"], { message: "Please select a payment option." }),
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

type ConferenceRegistrationFormProps = {
    onBack: () => void;
};

export function ConferenceRegistrationForm({ onBack }: ConferenceRegistrationFormProps) {
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
            paymentOption: "pay_later",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            const response = await fetch("/api/conference/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Registration failed");
            }

            const data = await response.json();
            alert(`Registration successful! Your confirmation has been sent to ${values.email}`);
            form.reset();
            onBack();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Something went wrong";
            console.error("Error:", error);
            setSubmitError(errorMessage);
            alert(`Error: ${errorMessage}`);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={onBack}
                    className="mb-2 h-auto rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                    aria-label="Back"
                >
                    <ChevronLeft className="h-4 w-4 mr-1" /> Back
                </Button>

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

                <FormField
                    control={form.control}
                    name="paymentOption"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Payment Option *</FormLabel>
                            <FormControl>
                                <RadioGroup onValueChange={field.onChange} defaultValue={field.value}>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="pay_now" id="pay_now" />
                                        <FormLabel htmlFor="pay_now" className="font-normal cursor-pointer">
                                            Pay Now
                                        </FormLabel>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="pay_later" id="pay_later" />
                                        <FormLabel htmlFor="pay_later" className="font-normal cursor-pointer">
                                            Pay Later
                                        </FormLabel>
                                    </div>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {submitError && (
                    <div className="text-sm text-destructive font-medium">{submitError}</div>
                )}

                <div className="flex justify-end pt-4">
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="rounded-full bg-primary text-white hover:bg-primary/90"
                    >
                        {isSubmitting ? "Registering..." : "Register"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
