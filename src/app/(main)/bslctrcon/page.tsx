"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Camera, Presentation, Calendar, ChevronLeft } from "lucide-react";

const YEARS = ["2025", "2024", "2023"];

export default function BslctrConPage() {
    const [year, setYear] = useState<string | null>(null);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200 flex items-center justify-center px-4 py-20">
            <div className="w-full max-w-3xl">
                <h1 className="text-3xl md:text-4xl font-bold text-center text-slate-800 mb-2">BSLCTR CON</h1>
                <p className="text-center text-slate-500 mb-12 text-sm">
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
                            className="inline-flex items-center gap-1.5 text-slate-500 hover:text-blue-600 text-sm mb-6 transition-colors"
                        >
                            <ChevronLeft className="h-4 w-4" /> Back to years
                        </button>

                        <h2 className="text-center text-lg font-semibold text-slate-700 mb-8">
                            BSLCTRCON {year}
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <ConCard
                                href={`/bslctrcon/moments?year=${year}`}
                                icon={<Camera className="h-12 w-12 text-blue-600" />}
                                title="Some Moments from BSLCTR CON"
                                description="Photo highlights of speakers, sessions, and ceremonies from the conference"
                                gradient="from-blue-600 to-sky-400"
                                index={0}
                            />
                            <ConCard
                                href={`/bslctrcon/lectures?year=${year}`}
                                icon={<Presentation className="h-12 w-12 text-indigo-600" />}
                                title="Lectures from BSLCTR"
                                description="Scientific lectures and presentations delivered at BSLCTR CON"
                                gradient="from-indigo-600 to-blue-400"
                                index={1}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
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
            className="block w-full text-left group"
        >
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-blue-200/50 border border-slate-100 overflow-hidden transition-all duration-300">
                <div className="bg-gradient-to-br from-blue-600 to-sky-400 h-32 flex items-center justify-center">
                    <div className="bg-white/20 rounded-full p-4 group-hover:scale-110 transition-transform duration-300">
                        <Calendar className="h-9 w-9 text-white" />
                    </div>
                </div>
                <div className="p-5 text-center">
                    <h2 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
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
            <Link href={href} className="block group">
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-blue-200/50 border border-slate-100 overflow-hidden transition-all duration-300">
                    <div className={`bg-gradient-to-br ${gradient} h-44 flex items-center justify-center`}>
                        <div className="bg-white/20 rounded-full p-5 group-hover:scale-110 transition-transform duration-300">
                            {icon}
                        </div>
                    </div>
                    <div className="p-6 text-center">
                        <h2 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">{title}</h2>
                        <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
