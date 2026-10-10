import GuidelineCard from "@/components/GuidelineCard";
import { Section } from "@/components/ui/section";
import { getGuidelines, type GuidelineItem } from "@/lib/guidelines";

export const metadata = {
    title: "Patients Guidelines | BSLCTR",
    description:
        "Downloadable dietary and nutrition guidance for liver patients, published by the Bangladesh Society for Liver Cancer Treatment & Research.",
};

export const dynamic = "force-dynamic";

// Shipped with the site. Guidelines published from the dashboard are listed first.
const bundled: GuidelineItem[] = [
    {
        id: "dietary-guidelines-chronic-liver-disease",
        title: "Dietary Guidelines in Chronic Liver Disease",
        description:
            "Nutrition guidance for patients with cirrhosis, covering daily calorie and protein targets, preferred carbohydrates, vegetarian and non-vegetarian protein sources, meal timing, and additional recommendations for patients who are also diabetic.",
        file: "/guidelines/dietary-guidelines-chronic-liver-disease.pdf",
        thumbnail: "",
        source: "",
        tags: [],
        meta: "PDF · 5 pages · 267 KB",
    },
    {
        id: "wilson-disease-food-chart",
        title: "Wilson Disease Food Chart",
        description:
            "A reference food chart for patients living with Wilson's disease.",
        file: "/guidelines/wilson-disease-food-chart.pdf",
        thumbnail: "",
        source: "",
        tags: [],
        meta: "PDF · 2 pages · 71 KB",
    },
];

export default async function PatientsGuidelinesPage() {
    // The bundled PDFs are still shown when the database cannot be read.
    const published = await getGuidelines("PATIENT");
    const guidelines = [...(published ?? []), ...bundled];

    return (
        <Section
            watermark="Patients"
            eyebrow="Guidance"
            title="Patients Guidelines"
        >
            <div className="max-w-5xl">
                <p className="mb-8 max-w-2xl text-body">
                    Download or share these guides with patients and carers.
                    They are general guidance and do not replace advice from
                    your treating physician.
                </p>

                {!published && (
                    <p role="alert" className="mb-6 text-sm text-slate-600">
                        More guides could not be loaded just now. Please try again in a moment.
                    </p>
                )}

                <div className="flex flex-col gap-6">
                    {guidelines.map((g) => (
                        <GuidelineCard key={g.id} guideline={g} />
                    ))}
                </div>
            </div>
        </Section>
    );
}
