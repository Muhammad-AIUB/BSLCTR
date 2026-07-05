"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";

const moments = [
    { src: "/bslctrcon/moments/moment-1.jpeg", alt: "Faculty members seated on stage at BSLCTR CON" },
    { src: "/bslctrcon/moments/moment-2.jpeg", alt: "Delegates discussing the conference program" },
    { src: "/bslctrcon/moments/moment-3.jpeg", alt: "Panel discussion at BSLCTR CON 2026" },
    { src: "/bslctrcon/moments/moment-4.jpeg", alt: "Presenting a bouquet at the annual conference" },
    { src: "/bslctrcon/moments/moment-5.jpeg", alt: "Surgical team in the operating theatre" },
    { src: "/bslctrcon/moments/moment-6.jpeg", alt: "Crest presentation at the international annual conference" },
    { src: "/bslctrcon/moments/moment-7.jpeg", alt: "Felicitation with flowers on stage" },
    { src: "/bslctrcon/moments/moment-8.jpeg", alt: "Raffle draw session at BSLCTR CON" },
];

export default function MomentsPage() {
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    const next = () => setLightboxIndex((i) => (i === null ? null : (i + 1) % moments.length));
    const prev = () => setLightboxIndex((i) => (i === null ? null : (i - 1 + moments.length) % moments.length));

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200 px-4 sm:px-6 lg:px-8 py-10">
            <div className="max-w-6xl mx-auto">
                <Link
                    href="/bslctrcon"
                    className="inline-flex items-center gap-1.5 text-slate-500 hover:text-blue-600 text-sm py-2 -my-2 transition-colors"
                >
                    <ChevronLeft className="h-4 w-4" /> Back to BSLCTR CON
                </Link>

                <div className="text-center mt-6 mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
                        Some Moments from BSLCTR CON
                    </h1>
                    <p className="text-slate-500 text-sm max-w-2xl mx-auto">
                        Glimpses of the BSLCTR International Annual Conference — sessions, felicitations, and memorable moments
                    </p>
                </div>

                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
                    initial="hidden"
                    animate="visible"
                    variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
                >
                    {moments.map((photo, index) => (
                        <motion.div
                            key={photo.src}
                            variants={{
                                hidden: { opacity: 0, scale: 0.9 },
                                visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
                            }}
                            className="group relative cursor-pointer"
                            onClick={() => setLightboxIndex(index)}
                        >
                            <div className="relative aspect-[3/2] overflow-hidden rounded-xl bg-white shadow-md hover:shadow-2xl transition-all duration-300 border border-slate-200">
                                <img
                                    src={photo.src}
                                    alt={photo.alt}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <ZoomIn className="w-10 h-10 text-white scale-75 group-hover:scale-100 transition-transform duration-300" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            <AnimatePresence>
                {lightboxIndex !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={() => setLightboxIndex(null)}
                    >
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-4 right-4 text-white hover:bg-white/10 max-sm:bg-black/40 z-10"
                            onClick={() => setLightboxIndex(null)}
                        >
                            <X className="w-6 h-6" />
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 max-sm:bg-black/40 z-10"
                            onClick={(e) => { e.stopPropagation(); prev(); }}
                        >
                            <ChevronLeft className="w-8 h-8" />
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 max-sm:bg-black/40 z-10"
                            onClick={(e) => { e.stopPropagation(); next(); }}
                        >
                            <ChevronRight className="w-8 h-8" />
                        </Button>

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="relative max-w-6xl w-full max-h-[90vh] flex flex-col items-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={moments[lightboxIndex].src}
                                alt={moments[lightboxIndex].alt}
                                className="max-w-full max-h-[82vh] object-contain rounded-lg shadow-2xl"
                            />
                            <p className="text-white/70 text-sm mt-3">
                                {lightboxIndex + 1} / {moments.length}
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
