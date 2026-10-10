"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Play, X, Minimize2, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { youtubeId } from "@/lib/youtube";

/** A gallery video from the database: either a YouTube id or a file to play directly. */
type GalleryVideo = { key: string; title: string; date: string; id?: string; src?: string };

export default function VideoGalleryPage() {
    const [videos, setVideos] = useState<GalleryVideo[]>([]);
    const [playingId, setPlayingId] = useState<string | null>(null);
    const [floating, setFloating] = useState(false);
    // callback ref — fires as soon as the element mounts/unmounts
    const [playerEl, setPlayerEl] = useState<HTMLDivElement | null>(null);

    const playerRef = useCallback((node: HTMLDivElement | null) => {
        setPlayerEl(node);
    }, []);

    // Videos are managed from the dashboard (Gallery tab); newest first.
    useEffect(() => {
        fetch("/api/videos")
            .then((res) => (res.ok ? res.json() : []))
            .then((rows: { id: string; title: string; link: string; createdAt: string }[]) =>
                setVideos(
                    rows.map((r) => {
                        const id = youtubeId(r.link) ?? undefined;
                        return {
                            key: r.id,
                            title: r.title,
                            date: new Date(r.createdAt).toLocaleDateString("en-GB", {
                                month: "long",
                                year: "numeric",
                            }),
                            id,
                            src: id ? undefined : r.link,
                        };
                    })
                )
            )
            .catch(() => {});
    }, []);

    const fileVideos = videos.filter((v) => v.src);
    // The YouTube id is the card key and the player id, so drop repeats of the same video.
    const youtubeVideos = videos.filter(
        (v, i) => v.id && videos.findIndex((o) => o.id === v.id) === i
    ) as (GalleryVideo & { id: string })[];

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

                <h1 className="text-3xl font-medium mb-8">Video Gallery</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {fileVideos.map((video) => (
                        <div
                            key={video.key}
                            className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300"
                        >
                            <video
                                src={video.src}
                                controls
                                preload="metadata"
                                className="aspect-video w-full bg-black"
                            />
                            <div className="p-4">
                                <h3 className="font-medium">{video.title}</h3>
                                <p className="text-slate-500 text-xs mt-1">{video.date}</p>
                            </div>
                        </div>
                    ))}
                    {youtubeVideos.map((video, index) => {
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
                                    // The outer box keeps the card's shape. The player inside is the
                                    // only iframe: it goes fixed to the corner when the card scrolls
                                    // out of view, so the same video keeps playing where it was.
                                    // This needs the card to rest with no transform (a hover lift
                                    // on it would trap the fixed player inside the card).
                                    <div className="relative aspect-video bg-black">
                                        <div
                                            className={
                                                floating
                                                    ? "fixed bottom-6 right-6 z-50 aspect-video w-[300px] max-w-[calc(100vw-3rem)] overflow-hidden rounded-xl border border-white/10 bg-black shadow-2xl"
                                                    : "absolute inset-0"
                                            }
                                        >
                                            <iframe
                                                src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
                                                title={video.title}
                                                className="w-full h-full"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            />
                                            <div className="absolute top-3 right-3 z-10 flex gap-2">
                                                {floating && (
                                                    <button
                                                        onClick={scrollToPlayer}
                                                        className="bg-black/60 hover:bg-black/80 text-white rounded-full p-2.5 sm:p-1.5 transition-colors"
                                                        title="Back to player"
                                                    >
                                                        <Minimize2 className="h-5 w-5 sm:h-4 sm:w-4" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={handleStop}
                                                    className="bg-black/60 hover:bg-black/80 text-white rounded-full p-2.5 sm:p-1.5 transition-colors"
                                                    title="Stop"
                                                >
                                                    <X className="h-5 w-5 sm:h-4 sm:w-4" />
                                                </button>
                                            </div>
                                        </div>
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
                                    <h3 className="font-medium">{video.title}</h3>
                                    <p className="text-slate-500 text-xs mt-1">{video.date}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
