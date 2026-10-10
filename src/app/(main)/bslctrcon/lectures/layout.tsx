import type { Metadata } from "next";

// The page here is a client component, which cannot export metadata itself.
export const metadata: Metadata = {
    title: "Conference Lectures | BSLCTR",
    description:
        "Recorded lectures from the BSLCTR annual conference.",
};

export default function LecturesLayout({ children }: { children: React.ReactNode }) {
    return children;
}
