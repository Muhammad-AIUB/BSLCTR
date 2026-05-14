"use client";

import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ChevronLeft } from "lucide-react";

const formSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    mobileNumber: z
        .string()
        .min(10, { message: "Please enter a valid mobile number." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    hasLiverDisease: z.enum(["yes", "no"]),
    liverDiseaseDescription: z.string().optional(),
    hasRelativeWithLiverDisease: z.enum(["yes", "no"]),
    relativeDiseasesDescription: z.string().optional(),
});

type PatientFormProps = {
    onBack: () => void;
};

export function PatientForm({ onBack }: PatientFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            mobileNumber: "",
            email: "",
            hasLiverDisease: "no",
            liverDiseaseDescription: "",
            hasRelativeWithLiverDisease: "no",
            relativeDiseasesDescription: "",
        },
    });

    const hasLiverDisease = form.watch("hasLiverDisease");
    const hasRelativeWithLiverDisease = form.watch(
        "hasRelativeWithLiverDisease"
    );

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);

        try {
            // TODO: Implement form submission logic
            console.log("Form data:", values);
            alert(
                "Patient registration form submitted! (No backend connected)"
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
                    name="hasLiverDisease"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                            <FormLabel>
                                Do you have any liver disease?
                            </FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex flex-row space-x-4"
                                >
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value="yes" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                            Yes
                                        </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value="no" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                            No
                                        </FormLabel>
                                    </FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {hasLiverDisease === "yes" && (
                    <FormField
                        control={form.control}
                        name="liverDiseaseDescription"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Please describe your liver disease
                                </FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="e.g. name of liver disease"
                                        className="resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                <FormField
                    control={form.control}
                    name="hasRelativeWithLiverDisease"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                            <FormLabel>
                                Do you have any 1st degree relative with liver
                                disease?
                            </FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex flex-row space-x-4"
                                >
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value="yes" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                            Yes
                                        </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value="no" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                            No
                                        </FormLabel>
                                    </FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {hasRelativeWithLiverDisease === "yes" && (
                    <FormField
                        control={form.control}
                        name="relativeDiseasesDescription"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Please describe your relative's liver
                                    disease
                                </FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="e.g. relation, name of liver disease"
                                        className="resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                <div className="mt-6 text-sm text-muted-foreground bg-slate-50 p-3 rounded-md">
                    This will allow us to send you notifications (awareness
                    video or email or SMS) according to your disease. Your
                    information will never be shared with third party.
                </div>

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
