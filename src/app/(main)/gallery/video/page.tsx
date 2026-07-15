"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, Minimize2, ChevronLeft } from "lucide-react";
import Link from "next/link";

const videos = [
    { id: "5ljrzDlq0Qg", title: "World Hepatitis Day 2025 উপলক্ষে আরটিভির বিশেষ স্বাস্থ্য বিষয়ক অনুষ্ঠান | Rtv", date: "July 2025" },
    { id: "OeXDYUIv0t4", title: "রোজায় সুস্থতা: লিভার সিরোসিস প্রতিরোধে ডাক্তারের পরামর্শ | Somoy TV", date: "April 2023" },
    { id: "F4AE1PgmlOE", title: "BSLCTR Video Highlights", date: "March 2024" },
    { id: "y-f3A21nT3A", title: "Medical Education Session", date: "February 2024" },
    { id: "Qz1REw087GE", title: "Healthcare Event Coverage", date: "January 2024" },
    { id: "AaNj_bmsUDs", title: "Medical Insights", date: "December 2023" },
];

export default function VideoGalleryPage() {
    const [playingId, setPlayingId] = useState<string | null>(null);
    const [floating, setFloating] = useState(false);
    // callback ref — fires as soon as the element mounts/unmounts
    const [playerEl, setPlayerEl] = useState<HTMLDivElement | null>(null);

    const playerRef = useCallback((node: HTMLDivElement | null) => {
        setPlayerEl(node);
    }, []);

    // IntersectionObserver — watch the playing card; go floating when off-screen
    useEffect(() => {
        if (!playerEl) return;
        setFloating(false);

        const observer = new IntersectionObserver(
            ([entry]) => {
                setFloating(!entry.isIntersecting);
            },
            { threshold: 0.25 }
        );
        observer.observe(playerEl);
        return () => observer.disconnect();
    }, [playerEl]);

    // When video stops, remove floating
    useEffect(() => {
        if (!playingId) setFloating(false);
    }, [playingId]);

    const handleStop = () => {
        setPlayingId(null);
        setFloating(false);
    };

    const scrollToPlayer = () => {
        setFloating(false);
        playerEl?.scrollIntoView({ behavior: "smooth", block: "center" });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-primary/5 to-slate-200 px-4 py-12">
            <div className="max-w-6xl mx-auto">
                <Link href="/gallery" className="inline-flex items-center gap-1.5 rounded-md text-slate-500 hover:text-primary text-sm py-2 -mt-2 mb-6 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2">
                    <ChevronLeft className="h-4 w-4" /> Back to Gallery
                </Link>

                <h1 className="text-3xl font-bold text-slate-800 mb-8">Video Gallery</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {videos.map((video, index) => {
                        const isPlaying = playingId === video.id;
                        return (
                            <motion.div
                                key={video.id}
                                /* callback ref only on the currently playing card */
                                ref={isPlaying ? playerRef : null}
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
                                            onClick={handleStop}
                                            className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white rounded-full p-2.5 sm:p-1.5 transition-colors z-10"
                                        >
                                            <X className="h-5 w-5 sm:h-4 sm:w-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div
                                        className="relative aspect-video cursor-pointer group"
                                        onClick={() => setPlayingId(video.id)}
                                    >
                                        <img
                                            src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                                            alt={video.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-16 h-16 bg-primary hover:bg-primary/90 rounded-full flex items-center justify-center shadow-xl transition-all group-hover:scale-110">
                                                <Play className="w-7 h-7 text-white ml-1" fill="white" />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="p-4">
                                    <h3 className="font-semibold text-slate-800">{video.title}</h3>
                                    <p className="text-slate-500 text-xs mt-1">{video.date}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Floating Mini Player — appears when playing card scrolls out of view */}
            <AnimatePresence>
                {playingId && floating && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.85, y: 24 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.85, y: 24 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-6 right-6 z-50 w-[300px] max-w-[calc(100vw-3rem)] bg-black rounded-xl overflow-hidden shadow-2xl border border-white/10"
                        style={{ aspectRatio: "16/9" }}
                    >
                        <iframe
                            src={`https://www.youtube.com/embed/${playingId}?autoplay=1`}
                            title="Floating Player"
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                        <div className="absolute top-2 right-2 flex gap-2 sm:gap-1.5">
                            <button
                                onClick={scrollToPlayer}
                                className="bg-black/70 hover:bg-black/90 text-white rounded-full p-2 sm:p-1.5 transition-colors backdrop-blur-sm"
                                title="Back to player"
                            >
                                <Minimize2 className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
                            </button>
                            <button
                                onClick={handleStop}
                                className="bg-black/70 hover:bg-black/90 text-white rounded-full p-2 sm:p-1.5 transition-colors backdrop-blur-sm"
                                title="Stop"
                            >
                                <X className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
