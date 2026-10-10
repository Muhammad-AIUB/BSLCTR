"use client";

import { useCallback, useEffect, useRef, useState, useMemo, memo } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Calendar,
    MapPin,
    Users,
    X,
    ZoomIn,
    ZoomOut,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { useModal } from "@/lib/use-modal";

interface Photo {
    id: number | string;
    src: string;
    alt: string;
    title: string;
    date: string;
    location: string;
    attendees: string;
    /** Optional: photos without one get no badge, and the filter only appears when some have one. */
    category?: string;
}

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.5;

type Pan = { x: number; y: number };

/**
 * Keeps part of a zoomed photo in view: it may sit off-centre by at most half of what the
 * zoom added to its size, which at 100% is nothing.
 */
function clampPan(pan: Pan, zoom: number, img: HTMLElement): Pan {
    const maxX = (img.offsetWidth * (zoom - 1)) / 2;
    const maxY = (img.offsetHeight * (zoom - 1)) / 2;
    const x = Math.min(maxX, Math.max(-maxX, pan.x));
    const y = Math.min(maxY, Math.max(-maxY, pan.y));
    return x === pan.x && y === pan.y ? pan : { x, y };
}

const PhotoGallery = ({ photos }: { photos: Photo[] }) => {
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    // Position in filteredPhotos of the photo open in the lightbox; null while it is closed.
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    // Lightbox zoom: scale plus the pan offset (px) applied while zoomed in.
    const [zoom, setZoom] = useState(MIN_ZOOM);
    const [pan, setPan] = useState<Pan>({ x: 0, y: 0 });
    const drag = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);
    const lightboxRef = useRef<HTMLDivElement>(null);
    const lightboxImg = useRef<HTMLImageElement>(null);
    const [zoomFrame, setZoomFrame] = useState<HTMLDivElement | null>(null);
    const ref = useRef(null);

    const changeZoom = useCallback((delta: number) => {
        setZoom((z) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z + delta)));
    }, []);

    const resetZoom = useCallback(() => {
        setZoom(MIN_ZOOM);
        setPan({ x: 0, y: 0 });
    }, []);

    // Every photo opens at 100%.
    useEffect(() => {
        resetZoom();
    }, [openIndex, resetZoom]);

    // Zooming out shrinks how far off-centre the photo may sit, so pull it back inside the
    // new limit; otherwise a photo dragged aside at 400% is out of the frame at 200%.
    useEffect(() => {
        const img = lightboxImg.current;
        if (img) setPan((p) => clampPan(p, zoom, img));
    }, [zoom]);

    // Mouse wheel zooms. Attached natively because React's onWheel is passive
    // and could not stop the lightbox from scrolling underneath; on the frame
    // rather than the photo, so it works wherever the photo has been dragged to.
    useEffect(() => {
        if (!zoomFrame) return;
        const onWheel = (e: WheelEvent) => {
            e.preventDefault();
            changeZoom(e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP);
        };
        zoomFrame.addEventListener("wheel", onWheel, { passive: false });
        return () => zoomFrame.removeEventListener("wheel", onWheel);
    }, [zoomFrame, changeZoom]);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    // Get unique categories
    const categories = useMemo(() => {
        const uniqueCategories = Array.from(
            new Set(photos.flatMap((photo) => photo.category ?? []))
        );
        return ["All", ...uniqueCategories];
    }, [photos]);

    // Filter photos by category
    const filteredPhotos = useMemo(() => {
        if (selectedCategory === "All") return photos;
        return photos.filter((photo) => photo.category === selectedCategory);
    }, [selectedCategory, photos]);

    // Lightbox navigation handlers
    const selectedImage = openIndex === null ? null : (filteredPhotos[openIndex] ?? null);

    const closeLightbox = () => setOpenIndex(null);

    /** Moves to the next (+1) or previous (-1) photo, wrapping round at either end. */
    const stepImage = (delta: number) =>
        setOpenIndex((i) =>
            i === null ? i : (i + delta + filteredPhotos.length) % filteredPhotos.length
        );

    // Keyboard: arrows change photo, + / - zoom, 0 resets, Escape closes.
    useModal(selectedImage !== null, lightboxRef, (e) => {
        if (e.key === "ArrowLeft") stepImage(-1);
        else if (e.key === "ArrowRight") stepImage(1);
        else if (e.key === "+" || e.key === "=") changeZoom(ZOOM_STEP);
        else if (e.key === "-") changeZoom(-ZOOM_STEP);
        else if (e.key === "0") resetZoom();
        else if (e.key === "Escape") closeLightbox();
    });

    // Animation variants
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
                staggerChildren: 0.08,
            },
        },
    };

    const scaleIn = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.5,
            },
        },
    };

    return (
        // Decorative dot-grid / orb background removed with the ILCA restyle —
        // it was built on the retired teal (rgb(0,162,183)). The old h1 here
        // also competed with the hero's, so the heading and page container now
        // come from the wrapping <Section>.
        <div ref={ref}>
            <div className="relative z-10 w-full">
                {/* Intro */}
                <motion.div
                    className="mb-12"
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    variants={fadeInUp}
                    transition={{ duration: 0.6 }}
                >
                    <p className="max-w-2xl text-base text-body sm:text-lg">
                        Documenting our commitment to advancing liver disease
                        research and medical education
                    </p>
                </motion.div>

                {/* Category Filter */}
                {categories.length > 1 && (
                <motion.div
                    className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-12"
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    variants={staggerContainer}
                >
                    {categories.map((category) => (
                        <motion.button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 sm:px-6 py-2 rounded-full text-sm font-medium outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                                selectedCategory === category
                                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/30"
                                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                            }`}
                            variants={scaleIn}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {category}
                        </motion.button>
                    ))}
                </motion.div>
                )}

                {/* Gallery Grid */}
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6"
                    variants={staggerContainer}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                >
                    <AnimatePresence mode="popLayout">
                        {filteredPhotos.map((photo, index) => (
                            <motion.div
                                key={photo.id}
                                layout
                                variants={scaleIn}
                                initial="hidden"
                                animate="visible"
                                exit={{ opacity: 0, scale: 0.8 }}
                                role="button"
                                tabIndex={0}
                                aria-label={`Open photo: ${photo.title}`}
                                className="group relative cursor-pointer rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                                onClick={() => setOpenIndex(index)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        setOpenIndex(index);
                                    }
                                }}
                            >
                                <div className="relative overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-200">
                                    {/* Image */}
                                    <div className="relative aspect-[4/3] overflow-hidden">
                                        <img
                                            src={photo.src}
                                            alt={photo.alt}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            loading="lazy"
                                        />
                                        {/* Overlay on hover */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <ZoomIn className="w-10 h-10 text-white transform scale-75 group-hover:scale-100 transition-transform duration-300" />
                                            </div>
                                        </div>
                                        {/* Category Badge */}
                                        {photo.category && (
                                            <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground border-0 shadow-lg">
                                                {photo.category}
                                            </Badge>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-4">
                                        <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                                            {photo.title}
                                        </h3>
                                        <div className="mt-2 space-y-1.5 text-xs text-slate-600 empty:hidden">
                                            {photo.date && (
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                                                    <span>{photo.date}</span>
                                                </div>
                                            )}
                                            {photo.location && (
                                                <div className="flex items-center gap-1.5">
                                                    <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                                                    <span className="line-clamp-1">
                                                        {photo.location}
                                                    </span>
                                                </div>
                                            )}
                                            {photo.attendees && (
                                                <div className="flex items-center gap-1.5">
                                                    <Users className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                                                    <span>{photo.attendees}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* Empty State */}
                {filteredPhotos.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <p className="text-slate-500 text-lg">
                            {photos.length === 0 ? "No photos yet" : "No events found in this category"}
                        </p>
                    </motion.div>
                )}
            </div>

            {/* Lightbox Modal */}
            <AnimatePresence>
                {selectedImage && openIndex !== null && (
                    <motion.div
                        ref={lightboxRef}
                        role="dialog"
                        aria-modal="true"
                        aria-label={selectedImage.title}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={closeLightbox}
                    >
                        {/* Zoom controls */}
                        <div
                            className="absolute top-4 left-4 z-10 flex items-center gap-1 rounded-full bg-black/50 p-1 text-white backdrop-blur-sm"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full text-white hover:bg-white/10 hover:text-white disabled:opacity-40"
                                onClick={() => changeZoom(-ZOOM_STEP)}
                                disabled={zoom <= MIN_ZOOM}
                                aria-label="Zoom out"
                            >
                                <ZoomOut className="w-5 h-5" />
                            </Button>
                            <button
                                type="button"
                                onClick={resetZoom}
                                className="min-w-12 rounded-full px-1 text-center text-sm tabular-nums hover:bg-white/10"
                                // The name has to contain what the button shows, the percentage.
                                aria-label={`${Math.round(zoom * 100)}%, reset zoom`}
                                title="Reset zoom"
                            >
                                {Math.round(zoom * 100)}%
                            </button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full text-white hover:bg-white/10 hover:text-white disabled:opacity-40"
                                onClick={() => changeZoom(ZOOM_STEP)}
                                disabled={zoom >= MAX_ZOOM}
                                aria-label="Zoom in"
                            >
                                <ZoomIn className="w-5 h-5" />
                            </Button>
                        </div>

                        {/* Close Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-4 right-4 text-white hover:bg-white/10 max-sm:bg-black/40 z-10"
                            onClick={closeLightbox}
                            aria-label="Close"
                            data-autofocus
                        >
                            <X className="w-6 h-6" />
                        </Button>

                        {/* Previous Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 max-sm:bg-black/40 z-10"
                            onClick={(e) => {
                                e.stopPropagation();
                                stepImage(-1);
                            }}
                            aria-label="Previous photo"
                        >
                            <ChevronLeft className="w-8 h-8" />
                        </Button>

                        {/* Next Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 max-sm:bg-black/40 z-10"
                            onClick={(e) => {
                                e.stopPropagation();
                                stepImage(1);
                            }}
                            aria-label="Next photo"
                        >
                            <ChevronRight className="w-8 h-8" />
                        </Button>

                        {/* Image Container */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="relative max-w-6xl w-full max-h-[90vh] flex flex-col overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* overflow-hidden keeps a zoomed photo from covering the caption and buttons */}
                            <div
                                ref={setZoomFrame}
                                className="relative flex-1 min-h-0 flex items-center justify-center mb-4 overflow-hidden rounded-xl"
                            >
                                <img
                                    ref={lightboxImg}
                                    src={selectedImage.src}
                                    alt={selectedImage.alt}
                                    draggable={false}
                                    className={`max-w-full max-h-[70vh] object-contain rounded-xl shadow-2xl select-none touch-none ${
                                        zoom > MIN_ZOOM ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in"
                                    }`}
                                    style={{
                                        transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                                        // No easing while dragging, so the photo tracks the pointer.
                                        transition: drag.current ? "none" : "transform 0.15s ease-out",
                                    }}
                                    onDoubleClick={() => (zoom > MIN_ZOOM ? resetZoom() : changeZoom(1))}
                                    onPointerDown={(e) => {
                                        if (zoom <= MIN_ZOOM) return;
                                        e.currentTarget.setPointerCapture(e.pointerId);
                                        drag.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
                                    }}
                                    onPointerMove={(e) => {
                                        const d = drag.current;
                                        if (!d) return;
                                        setPan(
                                            clampPan(
                                                { x: d.panX + e.clientX - d.x, y: d.panY + e.clientY - d.y },
                                                zoom,
                                                e.currentTarget
                                            )
                                        );
                                    }}
                                    onPointerUp={() => (drag.current = null)}
                                    onPointerCancel={() => (drag.current = null)}
                                />
                            </div>

                            {/* Image Info */}
                            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-white">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        {selectedImage.category && (
                                            <Badge className="bg-primary text-primary-foreground border-0 mb-2">
                                                {selectedImage.category}
                                            </Badge>
                                        )}
                                        <h3 className="text-xl font-medium text-white">
                                            {selectedImage.title}
                                        </h3>
                                    </div>
                                    <p className="text-sm text-white/70 shrink-0 whitespace-nowrap ml-3">
                                        {openIndex + 1} /{" "}
                                        {filteredPhotos.length}
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                                    {selectedImage.date && (
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-secondary" />
                                            <span>{selectedImage.date}</span>
                                        </div>
                                    )}
                                    {selectedImage.location && (
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-secondary" />
                                            <span>{selectedImage.location}</span>
                                        </div>
                                    )}
                                    {selectedImage.attendees && (
                                        <div className="flex items-center gap-2">
                                            <Users className="w-4 h-4 text-secondary" />
                                            <span>{selectedImage.attendees}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default memo(PhotoGallery);
