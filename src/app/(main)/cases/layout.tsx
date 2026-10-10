import type { Metadata } from "next";

// The page here is a client component, which cannot export metadata itself.
export const metadata: Metadata = {
    title: "Case Presentations | BSLCTR",
    description:
        "Clinical case presentations published by the Bangladesh Society for Liver Cancer Treatment & Research.",
};

export default function CasesLayout({ children }: { children: React.ReactNode }) {
    return children;
}
