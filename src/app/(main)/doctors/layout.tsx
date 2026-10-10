import type { Metadata } from "next";
import type { ReactNode } from "react";
import { LanguageProvider } from "@/components/LanguageToggle";

// The listing is a client component, which cannot export metadata itself; a profile page
// sets its own.
export const metadata: Metadata = {
    title: "Doctors | BSLCTR",
    description: "Doctor directory of the Bangladesh Society for Liver Cancer Treatment & Research.",
};

/** Shares the language choice between the listing and the profile pages. */
export default function DoctorsLayout({ children }: { children: ReactNode }) {
    return <LanguageProvider>{children}</LanguageProvider>;
}
