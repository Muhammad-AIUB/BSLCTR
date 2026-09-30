import { Download, ExternalLink, FileText } from "lucide-react";
import ShareMenu from "@/components/ShareMenu";
import type { GuidelineItem } from "@/lib/guidelines";

const action =
    "inline-flex min-h-11 items-center gap-2 rounded-md px-4 py-2 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary/50";

export default function GuidelineCard({ guideline: g }: { guideline: GuidelineItem }) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex gap-4">
                {g.thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={g.thumbnail}
                        alt=""
                        className="hidden h-20 w-20 shrink-0 rounded-lg border border-slate-200 object-cover sm:block"
                    />
                ) : (
                    <span
                        className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 sm:inline-flex"
                        aria-hidden="true"
                    >
                        <FileText className="h-6 w-6" />
                    </span>
                )}

                <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-medium">{g.title}</h3>
                    {g.meta && <p className="mt-0.5 text-xs text-slate-500">{g.meta}</p>}

                    {g.tags.length > 0 && (
                        <ul className="mt-2 flex flex-wrap gap-1.5">
                            {g.tags.map((t) => (
                                <li
                                    key={t}
                                    className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-primary-deep"
                                >
                                    {t}
                                </li>
                            ))}
                        </ul>
                    )}

                    {g.description && (
                        <p className="mt-3 text-sm leading-relaxed text-slate-600">
                            {g.description}
                        </p>
                    )}

                    <div className="mt-5 flex flex-wrap items-center gap-3">
                        {g.file && (
                            <a
                                href={g.file}
                                download
                                className={`${action} bg-secondary text-white hover:bg-secondary/90`}
                            >
                                <Download className="h-4 w-4" />
                                Download
                            </a>
                        )}
                        {g.source && (
                            <a
                                href={g.source}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`${action} border border-secondary text-secondary hover:bg-secondary hover:text-white`}
                            >
                                <ExternalLink className="h-4 w-4" />
                                Source
                            </a>
                        )}
                        {g.file && <ShareMenu path={g.file} title={g.title} />}
                    </div>
                </div>
            </div>
        </div>
    );
}
