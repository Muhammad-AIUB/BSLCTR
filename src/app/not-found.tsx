import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import MainLayout from "./(main)/layout";

export const metadata = {
    title: "Page not found | BSLCTR",
};

// At the root so it also answers addresses that match no route at all. It brings the public
// layout with it, because a not-found page here replaces everything below the root layout.
export default function NotFound() {
    return (
        <MainLayout>
            <Section watermark="404" eyebrow="Not found" title="This page does not exist">
                <p className="max-w-2xl text-body">
                    The link may be out of date, or the page may have been moved.
                </p>
                <Button asChild className="mt-6">
                    <Link href="/">Back to the home page</Link>
                </Button>
            </Section>
        </MainLayout>
    );
}
