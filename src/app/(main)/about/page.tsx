import { BookOpen, Calendar, HeartPulse, Stethoscope, Target, Eye } from "lucide-react";
import { Section } from "@/components/ui/section";

export const metadata = {
    title: "About Us | BSLCTR",
    description:
        "About the Bangladesh Society for Liver Cancer Treatment & Research: our mission, vision and work.",
};

// Placeholder copy — to be replaced with the society's own content.
const pillars = [
    {
        icon: Stethoscope,
        title: "Clinical Excellence",
        text: "Sharing evidence-based practice in the diagnosis and treatment of liver cancer among clinicians across Bangladesh.",
    },
    {
        icon: BookOpen,
        title: "Research & Education",
        text: "Supporting research, case discussions, webinars and training that keep physicians current with the field.",
    },
    {
        icon: HeartPulse,
        title: "Patient Awareness",
        text: "Publishing guidance and awareness material so patients and families can understand liver disease and seek care early.",
    },
    {
        icon: Calendar,
        title: "Annual Conference",
        text: "Bringing specialists together every year to exchange findings, present cases and build collaborations.",
    },
];

const stats = [
    { value: "5th", label: "Annual Conference" },
    { value: "2026", label: "Current edition" },
    { value: "100+", label: "Member physicians" },
    { value: "64", label: "Districts reached" },
];

export default function AboutPage() {
    return (
        <>
            <Section watermark="About" eyebrow="Who we are" title="About BSLCTR">
                <div className="max-w-3xl">
                    <p className="text-body">
                        The Bangladesh Society for Liver Cancer Treatment &amp;
                        Research (BSLCTR) is a professional society of physicians
                        and researchers working to improve the prevention,
                        diagnosis and treatment of liver cancer in Bangladesh.
                    </p>
                    <p className="mt-4 text-body">
                        Through conferences, webinars, case presentations and
                        public awareness material, we connect clinicians with one
                        another and with the patients they serve.
                    </p>
                </div>

                <dl className="mt-12 grid grid-cols-2 gap-6 lg:grid-cols-4">
                    {stats.map((s) => (
                        <div
                            key={s.label}
                            className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm"
                        >
                            <dd className="text-3xl font-bold text-secondary">{s.value}</dd>
                            <dt className="mt-1 text-sm text-body">{s.label}</dt>
                        </div>
                    ))}
                </dl>
            </Section>

            <Section className="bg-wash" watermark="Purpose" eyebrow="Mission & vision" title="What Guides Us">
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
                        <Target className="mb-4 h-8 w-8 text-primary" aria-hidden="true" />
                        <h3 className="text-xl font-semibold">Our Mission</h3>
                        <p className="mt-3 text-body">
                            To advance the care of liver cancer patients by
                            promoting clinical education, research and
                            collaboration among Bangladeshi physicians.
                        </p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
                        <Eye className="mb-4 h-8 w-8 text-primary" aria-hidden="true" />
                        <h3 className="text-xl font-semibold">Our Vision</h3>
                        <p className="mt-3 text-body">
                            A Bangladesh where liver cancer is detected early,
                            treated to international standards and understood
                            by the communities affected by it.
                        </p>
                    </div>
                </div>
            </Section>

            <Section watermark="Work" eyebrow="What we do" title="Our Focus Areas">
                <div className="grid gap-6 sm:grid-cols-2">
                    {pillars.map(({ icon: Icon, title, text }) => (
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
