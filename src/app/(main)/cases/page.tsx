"use client";

import { useEffect, useState } from "react";
import { CalendarIcon, FileText, Tag } from "lucide-react";

interface CasePresentation {
    id: string;
    title: string;
    files: string[];
    description: string;
    tags: string[];
    createdAt: string;
}

const isPptUrl = (url: string) => /\.pptx?([?#]|$)/i.test(url);

export default function CasePresentationsPage() {
    const [cases, setCases] = useState<CasePresentation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/case-presentations")
            .then((r) => r.json())
            .then(setCases)
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white">
            <div className="container mx-auto py-12 px-4 md:px-6 max-w-5xl">
                <div className="flex items-center gap-3 mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">Case Presentations</h2>
                    <div className="flex-1 h-px bg-slate-200" />
                </div>

                {loading ? (
                    <div className="text-center py-10 text-muted-foreground">Loading...</div>
                ) : cases.length === 0 ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center border border-dashed border-slate-300 rounded-xl px-6 py-10 sm:px-10 bg-white max-w-sm w-full">
                            <div className="text-4xl mb-3">📋</div>
                            <p className="text-slate-600 font-medium">No case presentations published yet.</p>
                            <p className="text-slate-500 text-sm mt-1">Check back soon for new cases.</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        {cases.map((c) => <CaseCard key={c.id} caseItem={c} />)}
                    </div>
                )}
            </div>
        </div>
    );
}

function CaseCard({ caseItem: c }: { caseItem: CasePresentation }) {
    const date = new Date(c.createdAt).toLocaleDateString("en-GB", {
        day: "numeric", month: "long", year: "numeric",
    });

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-6">
            <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
                <h3 className="text-lg font-semibold text-slate-800">{c.title}</h3>
                <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 shrink-0 mt-1">
                    <CalendarIcon className="h-3.5 w-3.5" /> {date}
                </span>
            </div>

            {c.description && c.description !== "<p></p>" && (
                <div className="rich-text text-sm text-slate-600 mb-4 break-words [&_img]:max-w-full [&_img]:h-auto"
                    dangerouslySetInnerHTML={{ __html: c.description }} />
            )}

            {c.files.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {c.files.filter(Boolean).map((f, i) => (
                        <a key={i} href={f} target="_blank" rel="noreferrer"
                            className={`inline-flex items-center gap-1.5 text-xs font-medium border px-3 py-2 sm:py-1.5 rounded-md outline-none transition-colors focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-primary/50 ${
                                isPptUrl(f)
                                    ? "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100"
                                    : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                            }`}>
                            <FileText className="h-3.5 w-3.5" />
                            {isPptUrl(f) ? `View PPT ${c.files.length > 1 ? i + 1 : ""}` : `View PDF ${c.files.length > 1 ? i + 1 : ""}`}
                        </a>
                    ))}
                </div>
            )}

            {c.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {c.tags.map((t) => (
                        <span key={t} className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                            <Tag className="h-3 w-3" />{t}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}
