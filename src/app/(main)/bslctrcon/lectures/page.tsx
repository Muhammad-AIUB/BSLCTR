"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, Presentation } from "lucide-react";

export default function LecturesPage() {
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
                        Lectures from BSLCTR
                    </h1>
                    <p className="text-slate-500 text-sm max-w-2xl mx-auto">
                        Scientific lectures and presentations from the BSLCTR International Annual Conference
                    </p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center justify-center bg-white rounded-2xl shadow-lg border border-slate-100 py-24 px-6 text-center"
                >
                    <div className="bg-blue-50 rounded-full p-6 mb-6">
                        <Presentation className="h-12 w-12 text-blue-600" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 mb-2">Lectures coming soon</h2>
                    <p className="text-slate-500 text-sm max-w-md">
                        Recorded lectures from BSLCTR CON will be published here shortly. Please check back soon.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
