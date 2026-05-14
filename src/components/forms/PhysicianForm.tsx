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

const formSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    mobileNumber: z
        .string()
        .min(10, { message: "Please enter a valid mobile number." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    specialty: z.string().min(1, { message: "Please select a specialty." }),
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
    "Other",
];

type PhysicianFormProps = {
    onBack: () => void;
};

export function PhysicianForm({ onBack }: PhysicianFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            mobileNumber: "",
            email: "",
            specialty: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);

        try {
            // TODO: Implement form submission logic
            console.log("Form data:", values);
            alert(
                "Physician registration form submitted! (No backend connected)"
            );
            form.reset();
            onBack();
        } catch (error) {
            console.error("Error:", error);
            alert("Something went wrong. Please try again.");
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
                    className="mb-2 p-0 h-auto bg-destructive/10 text-destructive hover:bg-destructive/20 hover:text-destructive rounded-md"
                    aria-label="Back"
                >
                    <ChevronLeft className="h-4 w-4 mr-1" /> Back
                </Button>

                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter your name"
                                    {...field}
                                />
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
                            <FormLabel>Mobile Number</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter your mobile number"
                                    {...field}
                                />
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
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter your email address"
                                    type="email"
                                    {...field}
                                />
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
                            <FormLabel>Specialty</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select your specialty" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {specialties.map((specialty) => (
                                        <SelectItem
                                            key={specialty}
                                            value={specialty}
                                        >
                                            {specialty}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end pt-4">
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="rounded-full bg-blue-800 hover:bg-blue-900"
                    >
                        {isSubmitting ? "Submitting..." : "Subscribe"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
