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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";

// The fields mirror the society's printed registration form, and the limits mirror
// src/app/api/conference/register/route.ts.
const formSchema = z.object({
    name: z.string().trim().min(2, { message: "Please enter your name." }).max(200),
    degree: z.string().trim().min(1, { message: "Please enter your degree." }).max(200),
    speciality: z.string().trim().min(1, { message: "Please enter your speciality." }).max(200),
    designation: z.string().trim().min(1, { message: "Please enter your designation." }).max(200),
    institution: z.string().trim().min(2, { message: "Please enter your institution." }).max(300),
    contactNo: z
        .string()
        .trim()
        .regex(/^\+?[0-9]{10,14}$/, { message: "Please enter a valid contact number." }),
    email: z.string().trim().email({ message: "Please enter a valid email address." }).max(254),
    category: z.enum(["delegate", "student"], {
        message: "Please choose a participant's category.",
    }),
});

type FormValues = z.infer<typeof formSchema>;

const CATEGORIES: { value: FormValues["category"]; label: string; fee: string }[] = [
    { value: "delegate", label: "Delegate (Post Graduate)", fee: "BDT 2000" },
    { value: "student", label: "Student (Post Graduate)", fee: "BDT 1000" },
];

const TEXT_FIELDS: {
    name: Exclude<keyof FormValues, "category">;
    label: string;
    type?: string;
    autoComplete?: string;
}[] = [
    { name: "name", label: "Name", autoComplete: "name" },
    { name: "degree", label: "Degree" },
    { name: "speciality", label: "Speciality" },
    { name: "designation", label: "Designation", autoComplete: "organization-title" },
    { name: "institution", label: "Institution", autoComplete: "organization" },
    { name: "contactNo", label: "Contact No", type: "tel", autoComplete: "tel" },
    { name: "email", label: "E-mail", type: "email", autoComplete: "email" },
];

type ConferenceRegistrationFormProps = {
    /** Returns to the subscribe chooser. Omit when the form is opened directly. */
    onBack?: () => void;
    /** Called after a successful registration. */
    onDone: () => void;
};

export function ConferenceRegistrationForm({ onBack, onDone }: ConferenceRegistrationFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            degree: "",
            speciality: "",
            designation: "",
            institution: "",
            contactNo: "",
            email: "",
        },
    });

    async function onSubmit(values: FormValues) {
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            const response = await fetch("/api/conference/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.message || "Registration failed");
            }

            alert("Registration received. Thank you!");
            form.reset();
            onDone();
        } catch (error) {
            console.error("Error:", error);
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

                {TEXT_FIELDS.map(({ name, label, type, autoComplete }) => (
                    <FormField
                        key={name}
                        control={form.control}
                        name={name}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{label}</FormLabel>
                                <FormControl>
                                    <Input type={type} autoComplete={autoComplete} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                ))}

                <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Participant&apos;s Category</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    value={field.value ?? ""}
                                    className="grid gap-2"
                                >
                                    {CATEGORIES.map((c) => (
                                        <label
                                            key={c.value}
                                            htmlFor={`category-${c.value}`}
                                            className={`flex cursor-pointer items-start gap-3 rounded-md border p-3 text-sm transition-colors ${
                                                field.value === c.value
                                                    ? "border-primary bg-accent"
                                                    : "border-slate-200 hover:bg-slate-50"
                                            }`}
                                        >
                                            <RadioGroupItem
                                                value={c.value}
                                                id={`category-${c.value}`}
                                                className="mt-0.5"
                                            />
                                            <span className="flex flex-1 flex-wrap justify-between gap-x-3">
                                                <span className="font-medium">{c.label}</span>
                                                <span className="text-body">{c.fee}</span>
                                            </span>
                                        </label>
                                    ))}
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {submitError && (
                    <p role="alert" className="text-sm font-medium text-destructive">
                        {submitError}
                    </p>
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
