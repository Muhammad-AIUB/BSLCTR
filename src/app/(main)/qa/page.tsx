import { ChevronDown } from "lucide-react";
import { Section } from "@/components/ui/section";

export const metadata = {
    title: "Q&A | BSLCTR",
    description:
        "Common questions about liver cancer, prevention and screening, and about the Bangladesh Society for Liver Cancer Treatment & Research.",
};

type QA = { q: string; a: string };

// Placeholder copy — to be reviewed and replaced by the society's physicians.
const liverQuestions: QA[] = [
    {
        q: "What is liver cancer?",
        a: "Liver cancer is cancer that starts in the cells of the liver. The most common type in adults is hepatocellular carcinoma (HCC). Cancer that begins elsewhere and spreads to the liver is a different condition and is treated differently.",
    },
    {
        q: "Who is at higher risk?",
        a: "People with long-term hepatitis B or hepatitis C infection, cirrhosis from any cause, fatty liver disease, heavy alcohol use, or a family history of liver cancer are at higher risk. Having a risk factor does not mean you will develop cancer, but it is a reason to talk to a doctor about screening.",
    },
    {
        q: "Can liver cancer be prevented?",
        a: "Many cases can. Hepatitis B vaccination, testing and treatment for hepatitis B and C, limiting alcohol, and maintaining a healthy weight all lower the risk.",
    },
    {
        q: "What are the warning signs?",
        a: "Early liver cancer often causes no symptoms. Later signs can include unexplained weight loss, loss of appetite, pain or swelling in the upper right abdomen, yellowing of the skin or eyes, and persistent tiredness. These symptoms have many other causes, so see a doctor for a proper evaluation.",
    },
    {
        q: "Should I be screened?",
        a: "Regular screening is generally advised for people at higher risk, such as those with cirrhosis or chronic hepatitis B. Your doctor can tell you whether screening is right for you and how often it should be done.",
    },
];

const societyQuestions: QA[] = [
    {
        q: "What is BSLCTR?",
        a: "The Bangladesh Society for Liver Cancer Treatment & Research is a professional society of physicians and researchers working to improve the prevention, diagnosis and treatment of liver cancer in Bangladesh.",
    },
    {
        q: "How can I find a liver specialist?",
        a: "Our doctor directory lists member hepatologists, hepatobiliary surgeons and intervention hepatologists.",
    },
    {
        q: "Who can attend the annual conference?",
        a: "The conference is open to physicians, trainees and researchers with an interest in liver disease. Registration details are published on the conference page.",
    },
    {
        q: "Where can I find guidance written for patients?",
        a: "The Patients Guidelines page collects awareness and guidance material written for patients and their families.",
    },
];

function QAList({ items }: { items: QA[] }) {
    return (
        <div className="max-w-3xl space-y-3">
            {items.map(({ q, a }) => (
                <details
                    key={q}
                    className="group rounded-xl border border-slate-200 bg-white shadow-sm"
                >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-lg font-semibold [&::-webkit-details-marker]:hidden">
                        {q}
                        <ChevronDown
                            className="h-5 w-5 shrink-0 text-primary transition-transform group-open:rotate-180"
                            aria-hidden="true"
                        />
                    </summary>
                    <p className="px-5 pb-5 text-body">{a}</p>
                </details>
            ))}
        </div>
    );
}

export default function QAPage() {
    return (
        <>
            <Section watermark="Q&A" eyebrow="Questions & answers" title="Liver Cancer: Common Questions">
                <QAList items={liverQuestions} />
                <p className="mt-8 max-w-3xl text-sm text-body">
                    This information is for general awareness only and is not a
                    substitute for medical advice. Please consult a qualified
                    doctor about your own health.
                </p>
            </Section>

            <Section className="bg-wash" watermark="BSLCTR" eyebrow="About the society" title="About BSLCTR">
                <QAList items={societyQuestions} />
            </Section>
        </>
    );
}
