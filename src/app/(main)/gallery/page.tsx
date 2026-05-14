"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Film, Images } from "lucide-react";

export default function GalleryPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200 flex items-center justify-center px-4 py-20">
            <div className="w-full max-w-3xl">
                <h1 className="text-3xl md:text-4xl font-bold text-center text-slate-800 mb-2">Gallery</h1>
                <p className="text-center text-slate-500 mb-12 text-sm">Browse our video and photo collections</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <GalleryCard
                        href="/gallery/video"
                        icon={<Film className="h-12 w-12 text-blue-600" />}
                        title="Video Gallery"
                        description="Watch recorded webinars, events, and educational sessions"
                        gradient="from-blue-600 to-sky-400"
                        index={0}
                    />
                    <GalleryCard
                        href="/gallery/photo"
                        icon={<Images className="h-12 w-12 text-indigo-600" />}
                        title="Photo Gallery"
                        description="View photos from our conferences, seminars, and events"
                        gradient="from-indigo-600 to-blue-400"
                        index={1}
                    />
                </div>
            </div>
        </div>
    );
}

function GalleryCard({
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
