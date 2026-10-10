import type { Metadata } from "next";

// The page here is a client component, which cannot export metadata itself.
export const metadata: Metadata = {
    title: "BSLCTR CON | BSLCTR",
    description:
        "The annual conference of the Bangladesh Society for Liver Cancer Treatment & Research: photos and recorded lectures.",
};

export default function BslctrconLayout({ children }: { children: React.ReactNode }) {
    return children;
}
