import GuidelineCard from "@/components/GuidelineCard";
import { Section } from "@/components/ui/section";
import { getGuidelines } from "@/lib/guidelines";

export const metadata = {
    title: "Clinical Guidelines | BSLCTR",
    description:
        "Clinical guidelines for physicians, published by the Bangladesh Society for Liver Cancer Treatment & Research.",
};

// Guidelines are published from the dashboard at any time, so never prerender.
export const dynamic = "force-dynamic";

export default async function ClinicalGuidelinesPage() {
    const guidelines = await getGuidelines("CLINICAL");

    return (
        <Section watermark="Clinical" eyebrow="Guidance" title="Clinical Guidelines">
            <div className="max-w-5xl">
                {!guidelines || guidelines.length === 0 ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="w-full max-w-sm rounded-xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center sm:px-10">
                            <p className="font-medium text-slate-600">
                                {guidelines
                                    ? "No clinical guidelines published yet."
                                    : "The clinical guidelines could not be loaded."}
                            </p>
                            <p className="mt-1 text-sm text-slate-500">
                                {guidelines ? "Check back soon." : "Please try again in a moment."}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        {guidelines.map((g) => (
                            <GuidelineCard key={g.id} guideline={g} />
                        ))}
                    </div>
                )}
            </div>
        </Section>
    );
}
