"use client";

import { startTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";

/** Shown in place of a public page that threw while rendering; the nav and footer stay. */
export default function PageError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const router = useRouter();

    useEffect(() => {
        console.error(error);
    }, [error]);

    // reset() alone re-renders what the server already sent, so a page that failed on the
    // server would fail again; refresh() asks the server for it anew.
    const retry = () =>
        startTransition(() => {
            router.refresh();
            reset();
        });

    return (
        <Section watermark="Error" eyebrow="Something went wrong" title="This page could not be shown">
            <p role="alert" className="max-w-2xl text-body">
                Please try again in a moment.
            </p>
            <Button onClick={retry} className="mt-6">
                Try again
            </Button>
        </Section>
    );
}
