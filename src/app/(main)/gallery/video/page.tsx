"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, Minimize2, ChevronLeft } from "lucide-react";
import Link from "next/link";

const videos = [
    { id: "F4AE1PgmlOE", title: "BSLCTR Video Highlights", date: "March 2024" },
    { id: "y-f3A21nT3A", title: "Medical Education Session", date: "February 2024" },
    { id: "Qz1REw087GE", title: "Healthcare Event Coverage", date: "January 2024" },
    { id: "AaNj_bmsUDs", title: "Medical Insights", date: "December 2023" },
];

export default function VideoGalleryPage() {
    const [playingId, setPlayingId] = useState<string | null>(null);
    const [floating, setFloating] = useState(false);
    const playerRef = useRef<HTMLDivElement>(null);

    // IntersectionObserver — when playing card leaves viewport, switch to floating
    useEffect(() => {
        if (!playingId || !playerRef.current) return;
        setFloating(false);

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) setFloating(true);
                else setFloating(false);
            },
            { threshold: 0.3 }
        );
        observer.observe(playerRef.current);
        return () => observer.disconnect();
    }, [playingId]);

    const handlePlay = (id: string) => {
        setPlayingId(id);
        setFloating(false);
    };

    const handleStop = () => {
        setPlayingId(null);
        setFloating(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200 px-4 py-12">
            <div className="max-w-6xl mx-auto">
                {/* Back */}
                <Link href="/gallery" className="inline-flex items-center gap-1.5 text-slate-500 hover:text-blue-600 text-sm mb-8 transition-colors">
                    <ChevronLeft className="h-4 w-4" /> Back to Gallery
                </Link>

                <h1 className="text-3xl font-bold text-slate-800 mb-8">Video Gallery</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {videos.map((video, index) => {
                        const isPlaying = playingId === video.id;
                        return (
                            <motion.div
                                key={video.id}
                                ref={isPlaying ? playerRef : null}
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.08 }}
                                className="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300"
                            >
                                {isPlaying ? (
                                    /* Inline Player */
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
                                            className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 transition-colors z-10"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ) : (
                                    /* Thumbnail */
                                    <div
                                        className="relative aspect-video cursor-pointer group"
                                        onClick={() => handlePlay(video.id)}
                                    >
                                        <img
                                            src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                                            alt={video.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-16 h-16 bg-blue-600 hover:bg-blue-500 rounded-full flex items-center justify-center shadow-xl transition-all group-hover:scale-110">
                                                <Play className="w-7 h-7 text-white ml-1" fill="white" />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="p-4">
                                    <h3 className="font-semibold text-slate-800">{video.title}</h3>
                                    <p className="text-slate-400 text-xs mt-1">{video.date}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Floating Mini Player */}
            <AnimatePresence>
                {playingId && floating && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        transition={{ duration: 0.25 }}
                        className="fixed bottom-6 right-6 z-50 w-72 rounded-xl overflow-hidden shadow-2xl border border-slate-200 bg-black"
                        style={{ aspectRatio: "16/9" }}
                    >
                        <iframe
                            src={`https://www.youtube.com/embed/${playingId}?autoplay=1`}
                            title="Floating Player"
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                        {/* Controls */}
                        <div className="absolute top-2 right-2 flex gap-1">
                            <button
                                onClick={() => {
                                    setFloating(false);
                                    // scroll back to card
                                    playerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
                                }}
                                className="bg-black/60 hover:bg-black/80 text-white rounded-full p-1 transition-colors"
                                title="Go back to player"
                            >
                                <Minimize2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                                onClick={handleStop}
                                className="bg-black/60 hover:bg-black/80 text-white rounded-full p-1 transition-colors"
                                title="Stop"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
