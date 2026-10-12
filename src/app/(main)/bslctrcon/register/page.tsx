import type { Metadata } from "next";
import { Section } from "@/components/ui/section";
import { ConferenceRegistrationForm } from "@/components/forms/ConferenceRegistrationForm";

export const metadata: Metadata = {
    title: "Conference Registration | BSLCTR",
    description:
        "Register for BSLCTR CON 2026, the 5th International Annual Conference: 22 December 2026, Pan Pacific Sonargaon, Dhaka.",
};

// The society's conference banner, 1200 x 341, shown as the registration form's letterhead.
const CONFERENCE_BANNER = "/bslctrcon/registration-banner.webp";

export default function ConferenceRegistrationPage() {
    return (
        <Section watermark="Register" eyebrow="BSLCTR CON 2026" title="Conference Registration">
            <div className="w-full max-w-2xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={CONFERENCE_BANNER}
                    alt="BSLCTR CON 2026, 5th International Annual Conference. 22 December 2026, Pan Pacific Sonargaon, Dhaka, Bangladesh. Bangladesh Society for Liver Cancer Treatment & Research."
                    width={1200}
                    height={341}
                    className="block h-auto w-full"
                />
                <div className="p-6 sm:p-8">
                    <ConferenceRegistrationForm />
                </div>
            </div>
        </Section>
    );
}
