import { FlaskConical, GraduationCap, Megaphone, Users } from "lucide-react";
import { Section } from "@/components/ui/section";

export const metadata = {
    title: "Donate | BSLCTR",
    description:
        "Support the Bangladesh Society for Liver Cancer Treatment & Research: fund awareness, physician training and research.",
};

// Placeholder copy — to be replaced with the society's own content.
const causes = [
    {
        icon: Megaphone,
        title: "Public Awareness",
        text: "Awareness campaigns and patient material on hepatitis vaccination, screening and early warning signs of liver disease.",
    },
    {
        icon: GraduationCap,
        title: "Physician Training",
        text: "Webinars, workshops and case discussions that keep clinicians across Bangladesh current with liver cancer care.",
    },
    {
        icon: FlaskConical,
        title: "Research",
        text: "Supporting local studies and data collection so treatment decisions reflect the patients we actually see.",
    },
    {
        icon: Users,
        title: "Annual Conference",
        text: "Bringing specialists together each year and helping young doctors attend and present their work.",
    },
];

export default function DonatePage() {
    return (
        <>
            <Section watermark="Donate" eyebrow="Support our work" title="Make a Donation">
                <div className="max-w-3xl">
                    <p className="text-body">
                        Liver cancer is largely preventable, yet many patients in
                        Bangladesh are diagnosed late. Your contribution helps
                        BSLCTR reach more people with awareness, train more
                        physicians and support research into better care.
                    </p>
                    <p className="mt-4 text-body">
                        Every donation, large or small, goes towards the
                        society&apos;s educational and awareness activities.
                    </p>
                </div>
            </Section>

            <Section className="bg-wash" watermark="Impact" eyebrow="Where it goes" title="What Your Donation Supports">
                <div className="grid gap-6 sm:grid-cols-2">
                    {causes.map(({ icon: Icon, title, text }) => (
                        <div
                            key={title}
                            className="flex gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                        >
                            <Icon className="mt-1 h-7 w-7 shrink-0 text-primary" aria-hidden="true" />
                            <div>
                                <h3 className="text-lg font-semibold">{title}</h3>
                                <p className="mt-2 text-sm text-body">{text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Section>
        </>
    );
}
