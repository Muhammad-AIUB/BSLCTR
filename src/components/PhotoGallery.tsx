"use client";

import { useRef, useState, useMemo, memo } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Calendar,
    MapPin,
    Users,
    X,
    ZoomIn,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

interface Photo {
    id: number;
    src: string;
    alt: string;
    title: string;
    date: string;
    location: string;
    attendees: string;
    category: string;
}

const PhotoGallery = ({ photos: photosProp }: { photos?: Photo[] }) => {
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [selectedImage, setSelectedImage] = useState<Photo | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    // Enhanced photos data with categories
    const photos = useMemo<Photo[]>(
        () => photosProp ?? [
            {
                id: 1,
                src: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&h=800&fit=crop",
                alt: "Medical Conference 1",
                title: "BSLCTR Annual Conference 2024",
                date: "March 15, 2024",
                location: "Dhaka Medical College",
                attendees: "250+ Attendees",
                category: "Conference",
            },
            {
                id: 2,
                src: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=1200&h=800&fit=crop",
                alt: "Medical Conference 2",
                title: "Hepatobiliary Surgery Workshop",
                date: "February 20, 2024",
                location: "Bangabandhu Sheikh Mujib Medical University",
                attendees: "180+ Surgeons",
                category: "Workshop",
            },
            {
                id: 3,
                src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=800&fit=crop",
                alt: "Medical Conference 3",
                title: "Liver Disease Symposium",
                date: "January 10, 2024",
                location: "National Institute of Liver Disease",
                attendees: "320+ Participants",
                category: "Symposium",
            },
            {
                id: 4,
                src: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&h=800&fit=crop",
                alt: "Medical Conference 4",
                title: "Advanced Hepatology Training",
                date: "December 5, 2023",
                location: "Square Hospitals Ltd",
                attendees: "150+ Doctors",
                category: "Training",
            },
            {
                id: 5,
                src: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=1200&h=800&fit=crop",
                alt: "Medical Conference 5",
                title: "International Medical Summit",
                date: "November 18, 2023",
                location: "Pan Pacific Sonargaon",
                attendees: "500+ Delegates",
                category: "Conference",
            },
            {
                id: 6,
                src: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=1200&h=800&fit=crop",
                alt: "Medical Conference 6",
                title: "Clinical Research Seminar",
                date: "October 8, 2023",
                location: "United Hospital Ltd",
                attendees: "200+ Researchers",
                category: "Seminar",
            },
            {
                id: 7,
                src: "https://images.unsplash.com/photo-1512678080530-7760d81faba6?w=1200&h=800&fit=crop",
                alt: "Medical Conference 7",
                title: "Liver Transplant Workshop",
                date: "September 12, 2023",
                location: "Apollo Hospital Dhaka",
                attendees: "120+ Specialists",
                category: "Workshop",
            },
            {
                id: 8,
                src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=800&fit=crop",
                alt: "Medical Conference 8",
                title: "Cholangiocarcinoma Research Summit",
                date: "August 25, 2023",
                location: "Evercare Hospital Dhaka",
                attendees: "280+ Participants",
                category: "Symposium",
            },
        ],
        [photosProp]
    );

    // Get unique categories
    const categories = useMemo(() => {
        const uniqueCategories = Array.from(
            new Set(photos.map((photo) => photo.category))
        );
        return ["All", ...uniqueCategories];
    }, [photos]);

    // Filter photos by category
    const filteredPhotos = useMemo(() => {
        if (selectedCategory === "All") return photos;
        return photos.filter((photo) => photo.category === selectedCategory);
    }, [selectedCategory, photos]);

    // Lightbox navigation handlers
    const openLightbox = (photo: Photo, index: number) => {
        setSelectedImage(photo);
        setCurrentImageIndex(index);
    };

    const closeLightbox = () => {
        setSelectedImage(null);
    };

    const nextImage = () => {
        const nextIndex = (currentImageIndex + 1) % filteredPhotos.length;
        setCurrentImageIndex(nextIndex);
        setSelectedImage(filteredPhotos[nextIndex]);
    };

    const prevImage = () => {
        const prevIndex =
            (currentImageIndex - 1 + filteredPhotos.length) %
            filteredPhotos.length;
        setCurrentImageIndex(prevIndex);
        setSelectedImage(filteredPhotos[prevIndex]);
    };

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
                {photos.length > 1 && (
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
                            className={`px-4 sm:px-6 py-2 rounded-full text-sm font-medium outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 ${
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
                                className="group relative cursor-pointer"
                                onClick={() => openLightbox(photo, index)}
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
                                        <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground border-0 shadow-lg">
                                            {photo.category}
                                        </Badge>
                                    </div>

                                    {/* Content */}
                                    <div className="p-4">
                                        <h3 className="font-medium text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                            {photo.title}
                                        </h3>
                                        <div className="space-y-1.5 text-xs text-slate-600">
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
                            No events found in this category
                        </p>
                    </motion.div>
                )}
            </div>

            {/* Lightbox Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={closeLightbox}
                    >
                        {/* Close Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-4 right-4 text-white hover:bg-white/10 max-sm:bg-black/40 z-10"
                            onClick={closeLightbox}
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
                                prevImage();
                            }}
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
                                nextImage();
                            }}
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
                            <div className="relative flex-1 min-h-0 flex items-center justify-center mb-4">
                                <img
                                    src={selectedImage.src}
                                    alt={selectedImage.alt}
                                    className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-2xl"
                                />
                            </div>

                            {/* Image Info */}
                            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-white">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <Badge className="bg-primary text-primary-foreground border-0 mb-2">
                                            {selectedImage.category}
                                        </Badge>
                                        <h3 className="text-xl font-medium">
                                            {selectedImage.title}
                                        </h3>
                                    </div>
                                    <p className="text-sm text-white/70 shrink-0 whitespace-nowrap ml-3">
                                        {currentImageIndex + 1} /{" "}
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
