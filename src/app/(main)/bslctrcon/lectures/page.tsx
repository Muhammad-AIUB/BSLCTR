"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronLeft, Play, X, Presentation } from "lucide-react";

// Lecture videos are scoped per conference year. Add other years here as they become available.
const lecturesByYear: Record<string, { id: string; title: string; date: string }[]> = {
    "2026": [
        { id: "sIG_ZHYrEZk", title: "Multidisciplinary Approach to HCC — Prof. Dr. Salimur Rahman", date: "July 2026" },
    ],
};

/** Shown when the address names no year. */
const LATEST_YEAR = "2026";

function LecturesContent({ requested }: { requested: string | null }) {
    // The year goes into the heading and is used as a lookup key, so take only what looks like one.
    const year = requested && /^\d{4}$/.test(requested) ? requested : LATEST_YEAR;
    const lectures = lecturesByYear[year] ?? [];
    const [playingId, setPlayingId] = useState<string | null>(null);
    // The lecture just stopped. Play and Stop replace each other, which would drop keyboard
    // focus; each takes it over as it appears.
    const [stoppedId, setStoppedId] = useState<string | null>(null);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-primary/5 to-slate-200 px-4 sm:px-6 lg:px-8 py-10">
            <div className="max-w-6xl mx-auto">
                <Link
                    href="/bslctrcon"
                    className="inline-flex items-center gap-1.5 rounded-md text-slate-500 hover:text-primary text-sm py-2 -my-2 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                    <ChevronLeft className="h-4 w-4" /> Back to BSLCTR CON
                </Link>

                <div className="text-center mt-6 mb-10">
                    <h1 className="text-3xl md:text-4xl font-medium mb-2">
                        Lectures from BSLCTRCON {year}
                    </h1>
                    <p className="text-slate-500 text-sm max-w-2xl mx-auto">
                        Scientific lectures and presentations from the BSLCTR International Annual Conference
                    </p>
                </div>

                {lectures.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col items-center justify-center bg-white rounded-xl shadow-sm border border-slate-100 py-24 px-6 text-center"
                    >
                        <div className="bg-primary/10 rounded-full p-6 mb-6">
                            <Presentation className="h-12 w-12 text-primary" />
                        </div>
                        <h2 className="text-xl font-medium mb-2">Lectures coming soon</h2>
                        <p className="text-slate-500 text-sm max-w-md">
                            Recorded lectures from BSLCTRCON {year} will be published here shortly. Please check back soon.
                        </p>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {lectures.map((video, index) => {
                            const isPlaying = playingId === video.id;
                            return (
                                <motion.div
                                    key={video.id}
                                    initial={{ opacity: 0, y: 24 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.08 }}
                                    className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300"
                                >
                                    {isPlaying ? (
                                        <div className="relative aspect-video bg-black">
                                            <iframe
                                                src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
                                                title={video.title}
                                                className="w-full h-full"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            />
                                            <button
                                                onClick={() => {
                                                    setStoppedId(video.id);
                                                    setPlayingId(null);
                                                }}
                                                aria-label="Stop video"
                                                autoFocus
                                                className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white rounded-full p-2.5 sm:p-1.5 transition-colors z-10"
                                            >
                                                <X className="h-5 w-5 sm:h-4 sm:w-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            type="button"
                                            aria-label={`Play ${video.title}`}
                                            autoFocus={stoppedId === video.id}
                                            className="group relative block aspect-video w-full cursor-pointer outline-none"
                                            onClick={() => {
                                                setStoppedId(null);
                                                setPlayingId(video.id);
                                            }}
                                        >
                                            <img
                                                src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                                                alt=""
                                                className="w-full h-full object-cover"
                                            />
                                            <span className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
                                            <span className="absolute inset-0 flex items-center justify-center group-focus-visible:ring-4 group-focus-visible:ring-inset group-focus-visible:ring-white">
                                                <span className="w-16 h-16 bg-primary hover:bg-primary/90 rounded-full flex items-center justify-center shadow-xl transition-all group-hover:scale-110">
                                                    <Play className="w-7 h-7 text-white ml-1" fill="white" />
                                                </span>
                                            </span>
                                        </button>
                                    )}

                                    <div className="p-4">
                                        <h3 className="font-medium">{video.title}</h3>
                                        <p className="text-slate-500 text-xs mt-1">{video.date}</p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

function LecturesForRequestedYear() {
    return <LecturesContent requested={useSearchParams().get("year")} />;
}

// useSearchParams needs a Suspense boundary for the page to prerender, and only the fallback
// is in the prerendered HTML. The fallback is therefore the default year, not an empty box.
export default function LecturesPage() {
    return (
        <Suspense fallback={<LecturesContent requested={null} />}>
            <LecturesForRequestedYear />
        </Suspense>
    );
}
