"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Play, X, Calendar, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Gallery = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

    const videos = [
        {
            id: "F4AE1PgmlOE",
            title: "BSLCTR Video Highlights",
            description: "Watch our latest medical event highlights",
            date: "March 2024",
            duration: "25:30",
        },
        {
            id: "y-f3A21nT3A",
            title: "Medical Education Session",
            description: "Expert insights and educational content",
            date: "February 2024",
            duration: "18:45",
        },
        {
            id: "Qz1REw087GE",
            title: "Healthcare Event Coverage",
            description: "Key moments from our medical events",
            date: "January 2024",
            duration: "32:15",
        },
        {
            id: "AaNj_bmsUDs",
            title: "Medical Insights",
            description: "Important discussions on patient care",
            date: "December 2023",
            duration: "28:50",
        },
    ];

    const fadeInUp = {
        hidden: { opacity: 0, y: 60 },
        visible: {
            opacity: 1,
            y: 0,
        },
    };

    const staggerContainer = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.1,
            },
        },
    };

    const scaleIn = {
        hidden: { scale: 0.8, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
        },
    };

    return (
        <section
            ref={ref}
            className="relative min-h-screen flex items-center justify-center overflow-hidden"
        >
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(100,116,139,0.1)_1px,transparent_0)] bg-[size:30px_30px] opacity-40" />
                <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
                {/* Header */}
                <motion.div
                    className="text-center mb-12 lg:mb-16"
                    variants={staggerContainer}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                >
                    <motion.h1
                        className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-6"
                        variants={fadeInUp}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <span className="bg-gradient-to-r from-slate-800 via-blue-700 to-slate-700 bg-clip-text text-transparent">
                            Video Gallery
                        </span>
                    </motion.h1>
                </motion.div>

                {/* Video Grid */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
                    variants={staggerContainer}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                >
                    {videos.map((video, index) => (
                        <motion.div
                            key={video.id}
                            className="relative group cursor-pointer"
                            variants={fadeInUp}
                            transition={{
                                duration: 0.6,
                                ease: "easeOut",
                                delay: index * 0.1,
                            }}
                            whileHover={{ y: -8 }}
                            onClick={() => setSelectedVideo(video.id)}
                        >
                            <div className="relative overflow-hidden rounded-2xl shadow-xl bg-white border-2 border-transparent hover:border-blue-400 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-blue-500/20">
                                {/* Thumbnail */}
                                <div className="relative aspect-video bg-gradient-to-br from-slate-900 to-blue-900">
                                    <img
                                        src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                                        alt={video.title}
                                        className="w-full h-full object-cover"
                                    />
                                    
                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
                                    
                                    {/* Play Button */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <motion.div
                                            className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center shadow-2xl group-hover:bg-blue-500 transition-all duration-300"
                                            whileHover={{ scale: 1.15 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <Play className="w-10 h-10 text-white ml-1" fill="white" />
                                        </motion.div>
                                    </div>

                                    {/* Duration Badge */}
                                    <div className="absolute top-4 right-4">
                                        <Badge className="bg-black/70 backdrop-blur-sm text-white border-0 px-3 py-1 text-sm font-medium">
                                            <Clock className="w-3 h-3 mr-1" />
                                            {video.duration}
                                        </Badge>
                                    </div>
                                </div>
                                
                                {/* Video Info */}
                                <div className="p-6 bg-gradient-to-br from-white to-blue-50/30">
                                    <h3 className="text-slate-900 font-bold text-xl mb-2 group-hover:text-blue-600 transition-colors duration-300">
                                        {video.title}
                                    </h3>
                                    <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                                        {video.description}
                                    </p>
                                    
                                    {/* Metadata */}
                                    <div className="flex items-center gap-4 text-sm text-slate-500">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-4 h-4" />
                                            <span>{video.date}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Shine Effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Video Modal */}
                <AnimatePresence>
                    {selectedVideo && (
                        <motion.div
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedVideo(null)}
                        >
                            <motion.div
                                className="relative w-full max-w-6xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl"
                                variants={scaleIn}
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Close Button */}
                                <button
                                    className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 group"
                                    onClick={() => setSelectedVideo(null)}
                                >
                                    <X className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-300" />
                                </button>

                                {/* Video Player */}
                                <iframe
                                    src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
                                    title="Video Player"
                                    className="w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
};

export default Gallery;
