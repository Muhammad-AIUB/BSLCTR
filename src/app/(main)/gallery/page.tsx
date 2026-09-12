"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Film, Images } from "lucide-react";
import { Section } from "@/components/ui/section";

export default function GalleryPage() {
    return (
        <Section watermark="Gallery" eyebrow="Media" title="Gallery">
            <div className="w-full max-w-3xl">
                <p className="mb-12 text-body">
                    Browse our video and photo collections
                </p>

                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                    <GalleryCard
                        href="/gallery/video"
                        icon={<Film className="h-12 w-12 text-white" />}
                        title="Video Gallery"
                        description="Watch recorded webinars, events, and educational sessions"
                        gradient="from-primary to-secondary"
                        index={0}
                    />
                    <GalleryCard
                        href="/gallery/photo"
                        icon={<Images className="h-12 w-12 text-white" />}
                        title="Photo Gallery"
                        description="View photos from our conferences, seminars, and events"
                        gradient="from-primary to-secondary"
                        index={1}
                    />
                </div>
            </div>
        </Section>
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
