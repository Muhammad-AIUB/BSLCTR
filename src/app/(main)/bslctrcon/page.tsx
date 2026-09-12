"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Camera, Presentation, Calendar, ChevronLeft } from "lucide-react";
import { Section } from "@/components/ui/section";

const YEARS = ["2025", "2024", "2023"];

export default function BslctrConPage() {
    const [year, setYear] = useState<string | null>(null);

    return (
        <Section watermark="Con" eyebrow="Conference" title="BSLCTR CON">
            <div className="w-full max-w-3xl">
                <p className="mb-12 text-body">
                    Highlights from the BSLCTR International Annual Conference
                </p>

                {year === null ? (
                    /* Year selection */
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {YEARS.map((y, i) => (
                            <YearCard key={y} year={y} index={i} onClick={() => setYear(y)} />
                        ))}
                    </div>
                ) : (
                    /* Selected year → Moments + Lectures */
                    <div>
                        <button
                            onClick={() => setYear(null)}
                            className="inline-flex items-center gap-1.5 rounded-md text-slate-500 hover:text-primary text-sm mb-6 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
                        >
                            <ChevronLeft className="h-4 w-4" /> Back to years
                        </button>

                        <h2 className="mb-8 text-center text-lg">
                            BSLCTRCON {year}
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <ConCard
                                href={`/bslctrcon/moments?year=${year}`}
                                icon={<Camera className="h-12 w-12 text-white" />}
                                title="Some Moments from BSLCTR CON"
                                description="Photo highlights of speakers, sessions, and ceremonies from the conference"
                                gradient="from-primary to-secondary"
                                index={0}
                            />
                            <ConCard
                                href={`/bslctrcon/lectures?year=${year}`}
                                icon={<Presentation className="h-12 w-12 text-white" />}
                                title="Lectures from BSLCTR"
                                description="Scientific lectures and presentations delivered at BSLCTR CON"
                                gradient="from-primary to-secondary"
                                index={1}
                            />
                        </div>
                    </div>
                )}
            </div>
        </Section>
    );
}

function YearCard({
    year, index, onClick,
}: {
    year: string;
    index: number;
    onClick: () => void;
}) {
    return (
        <motion.button
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.12 }}
            whileHover={{ y: -6 }}
            onClick={onClick}
            className="block w-full text-left group rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
        >
            <div className="bg-white rounded-xl shadow-sm hover:shadow-lg hover:shadow-primary/10 border border-slate-100 overflow-hidden transition-all duration-300">
                <div className="bg-gradient-to-br from-primary to-secondary h-32 flex items-center justify-center">
                    <div className="bg-white/20 rounded-full p-4 group-hover:scale-110 transition-transform duration-300">
                        <Calendar className="h-9 w-9 text-white" />
                    </div>
                </div>
                <div className="p-5 text-center">
                    <h2 className="text-lg font-medium group-hover:text-primary transition-colors">
                        BSLCTRCON {year}
                    </h2>
                </div>
            </div>
        </motion.button>
    );
}

function ConCard({
    href, icon, title, description, gradient, index,
}: {
    href: string;
    icon: React.ReactNode;
    title: string;
    description: string;
    gradient: string;
    index: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            whileHover={{ y: -6 }}
        >
            <Link href={href} className="block group rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2">
                <div className="bg-white rounded-xl shadow-sm hover:shadow-lg hover:shadow-primary/10 border border-slate-100 overflow-hidden transition-all duration-300">
                    <div className={`bg-gradient-to-br ${gradient} h-44 flex items-center justify-center`}>
                        <div className="bg-white/20 rounded-full p-5 group-hover:scale-110 transition-transform duration-300">
                            {icon}
                        </div>
                    </div>
                    <div className="p-6 text-center">
                        <h2 className="text-xl font-medium mb-2 group-hover:text-primary transition-colors">{title}</h2>
                        <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
