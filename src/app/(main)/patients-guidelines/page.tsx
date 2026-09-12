import { Download, FileText } from "lucide-react";
import ShareMenu from "@/components/ShareMenu";
import { Section } from "@/components/ui/section";

export const metadata = {
    title: "Patients Guidelines | BSLCTR",
    description:
        "Downloadable dietary and nutrition guidance for liver patients, published by the Bangladesh Society for Liver Cancer Treatment & Research.",
};

type Guideline = {
    title: string;
    description: string;
    file: string;
    pages: number;
    size: string;
};

const guidelines: Guideline[] = [
    {
        title: "Dietary Guidelines in Chronic Liver Disease",
        description:
            "Nutrition guidance for patients with cirrhosis, covering daily calorie and protein targets, preferred carbohydrates, vegetarian and non-vegetarian protein sources, meal timing, and additional recommendations for patients who are also diabetic.",
        file: "/guidelines/dietary-guidelines-chronic-liver-disease.pdf",
        pages: 5,
        size: "267 KB",
    },
    {
        title: "Wilson Disease Food Chart",
        description:
            "A reference food chart for patients living with Wilson's disease.",
        file: "/guidelines/wilson-disease-food-chart.pdf",
        pages: 2,
        size: "71 KB",
    },
];

export default function PatientsGuidelinesPage() {
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

                <div className="flex flex-col gap-6">
                    {guidelines.map((g) => (
                        <GuidelineCard key={g.file} guideline={g} />
                    ))}
                </div>
            </div>
        </Section>
    );
}

function GuidelineCard({ guideline: g }: { guideline: Guideline }) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex gap-4">
                <span
                    className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 sm:inline-flex"
                    aria-hidden="true"
                >
                    <FileText className="h-6 w-6" />
                </span>

                <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-medium">
                        {g.title}
                    </h3>
                    <p className="mt-0.5 text-xs text-slate-500">
                        PDF · {g.pages} page{g.pages === 1 ? "" : "s"} · {g.size}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">
                        {g.description}
                    </p>

                    <div className="mt-5 flex flex-wrap items-center gap-3">
                        <a
                            href={g.file}
                            download
                            className="inline-flex min-h-11 items-center gap-2 rounded-md bg-secondary px-4 py-2 text-sm font-medium text-white outline-none transition-colors hover:bg-secondary/90 focus-visible:ring-2 focus-visible:ring-primary/50"
                        >
                            <Download className="h-4 w-4" />
                            Download
                        </a>

                        <ShareMenu path={g.file} title={g.title} />
                    </div>
                </div>
            </div>
        </div>
    );
}
