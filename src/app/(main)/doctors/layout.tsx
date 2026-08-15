import type { ReactNode } from "react";
import { LanguageProvider } from "@/components/LanguageToggle";

/** Shares the language choice between the listing and the profile pages. */
export default function DoctorsLayout({ children }: { children: ReactNode }) {
    return <LanguageProvider>{children}</LanguageProvider>;
}
