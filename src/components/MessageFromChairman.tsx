"use client";

import { useRef, useMemo, memo } from "react";
import { motion, useInView } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Quote, Award } from "lucide-react";


const MessageFromChairman = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    // Memoized sections data
    const sections = useMemo(
        () => [
            {
                id: 1,
                title: "President",
                author: "Prof. Dr. Salimur Rahman",
                position: "President, BSLCTR",
                qualification: "MBBS, FCPS, FRCS",
                icon: Award,
                image: "/1.jpeg",
                content: `Dear friends,

Liver cancer is one of the fastest-rising health threats in Bangladesh, yet it is preventable with awareness, vaccination, and healthy lifestyle choices. Our mission is threefold: to educate communities on prevention, to bring world-class treatment within reach of every patient, and to train our young doctors to match international standards. Together, we can reduce suffering, save lives, and build a future where liver cancer is no longer a silent killer in our nation. Let us unite for prevention, care, and hope.

Thank you.`,
                imagePosition: "right",
            },
            {
                id: 2,
                title: "Vice President",
                author: "Faroque Ahmed",
                position: "Vice President, BSLCTR",
                qualification: "MBBS, MD",
                icon: Award,
                image: "/faruq.jpeg",
                content: `Dear colleague I want to emphasize that liver cancer is not only a medical challenge but also a social responsibility. Prevention through awareness, early screening, and vaccination is our strongest shield. At the same time, we are committed to ensuring access to international-level treatment and nurturing the next generation of skilled doctors in Bangladesh. With collective effort—from doctors, policymakers, and the community—we can turn the tide against liver cancer and bring hope to countless families. Together, we can make a difference.`,
                imagePosition: "left",
            },
            {
                id: 3,
                title: "Secretary General",
                author: "Dr. Md. Fazal Karim",
                position: "Secretary General, BSLCTR",
                qualification: "MBBS, FCPS, MD",
                icon: Award,
                image: "/3.jpeg",
                content: `As Secretary General, I assure you that every resource we gather is dedicated to saving lives and building a healthier future. Our focus is to invest in prevention programs, world-class treatment facilities, and the training of young doctors who will lead the fight against liver cancer in Bangladesh. Transparency, accountability, and efficiency will guide us in managing funds so that every contribution truly makes an impact. With your support, we can ensure that hope and healing reach those who need it most.`,
                imagePosition: "right",
            },
        ],
        []
    );

    // Animation variants
    const fadeInUp = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0 },
    };

    const fadeInScale = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1 },
    };

    const staggerContainer = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.15,
            },
        },
    };

    return (
        <section
            ref={ref}
            className="relative overflow-hidden py-16 lg:py-24 bg-gradient-to-b from-slate-100 via-slate-50 to-slate-100"
        >
            {/* Enhanced Background */}
            <div className="absolute inset-0 z-0">
                {/* Primary gradient wash */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.08] via-slate-100/60 to-accent/[0.1]" />

                {/* Sophisticated dot grid pattern */}
                <div
                    className="absolute inset-0 opacity-50"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0,162,183) 0.6px, transparent 0)`,
                        backgroundSize: "36px 36px",
                    }}
                />

                {/* Diagonal lines pattern for medical/technical feel */}
                <div className="absolute inset-0 opacity-[0.05] bg-[repeating-linear-gradient(45deg,rgb(0,162,183)_0px,rgb(0,162,183)_1px,transparent_1px,transparent_12px)]" />

                {/* Cross-hatch pattern for additional texture */}
                <div className="absolute inset-0 opacity-[0.03] bg-[repeating-linear-gradient(-45deg,rgb(157,196,205)_0px,rgb(157,196,205)_1px,transparent_1px,transparent_12px)]" />

                {/* Soft gradient orbs for depth */}
                <div
                    className="absolute top-20 -right-40 w-[550px] h-[550px] bg-gradient-to-bl from-primary/20 via-primary/10 to-transparent rounded-full blur-3xl animate-pulse"
                    style={{ animationDuration: "9s" }}
                />
                <div
                    className="absolute bottom-20 -left-40 w-[550px] h-[550px] bg-gradient-to-tr from-accent/25 via-accent/12 to-transparent rounded-full blur-3xl animate-pulse"
                    style={{ animationDuration: "11s" }}
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-secondary/10 to-transparent rounded-full blur-2xl" />

                {/* Subtle overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-100/50 via-transparent to-slate-100/40" />
            </div>

            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    className="text-center mb-16 lg:mb-20"
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    variants={fadeInUp}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
                        Leadership Messages
                    </h2>
                    <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
                        Words of commitment and vision from our distinguished
                        leadership team
                    </p>
                </motion.div>

                {/* Sections */}
                <motion.div
                    className="space-y-16 lg:space-y-20"
                    variants={staggerContainer}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                >
                    {sections.map((section, index) => {
                        const IconComponent = section.icon;
                        const isEven = index % 2 === 0;

                        return (
                            <motion.div
                                key={section.id}
                                variants={fadeInScale}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                className="group"
                            >
                                <div
                                    className={`flex flex-col ${
                                        isEven
                                            ? "lg:flex-row"
                                            : "lg:flex-row-reverse"
                                    } gap-8 lg:gap-12 items-start`}
                                >
                                    {/* Image Section */}
                                    <div className="w-full lg:w-4/12 flex-shrink-0">
                                        <div className="relative">
                                            {/* Main image container */}
                                            <div className="relative overflow-hidden rounded-xl shadow-lg">
                                                <img
                                                    src={section.image}
                                                    alt={`${section.author} - ${section.position}`}
                                                    className="w-full aspect-[4/5] object-cover transition-transform duration-700 group-hover:scale-105"
                                                    loading="lazy"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent" />

                                                {/* Badge overlay */}
                                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                                    <Badge className="bg-primary text-primary-foreground border-0 text-xs px-3 py-1 shadow-lg">
                                                        <IconComponent className="w-3.5 h-3.5 mr-1 inline-block" />
                                                        {section.title}
                                                    </Badge>
                                                </div>
                                            </div>

                                            {/* Decorative element */}
                                            <div
                                                className={`absolute -bottom-3 ${
                                                    isEven
                                                        ? "-right-3"
                                                        : "-left-3"
                                                } w-20 h-20 bg-primary/10 rounded-xl -z-10`}
                                            />
                                        </div>
                                    </div>

                                    {/* Content Section */}
                                    <div className="flex-1">
                                        <div className="relative bg-white rounded-2xl shadow-lg border border-slate-200 p-8 lg:p-10 hover:shadow-xl transition-shadow duration-300">
                                            {/* Quote icon */}
                                            <Quote className="absolute -top-3 left-8 w-12 h-12 text-primary/20" />

                                            <div className="relative space-y-6">
                                                {/* Header */}
                                                <div className="space-y-2">
                                                    <h3 className="text-2xl lg:text-3xl font-bold text-slate-900">
                                                        {section.author}
                                                    </h3>
                                                    <p className="text-base font-semibold text-primary">
                                                        {section.position}
                                                    </p>
                                                    <p className="text-sm text-slate-500">
                                                        {section.qualification}
                                                    </p>
                                                </div>

                                                {/* Divider */}
                                                <div className="w-16 h-1 bg-gradient-to-r from-primary to-secondary rounded-full" />

                                                {/* Content */}
                                                <div className="prose prose-slate max-w-none">
                                                    <p className="text-slate-700 leading-relaxed text-base whitespace-pre-line">
                                                        {section.content}
                                                    </p>
                                                </div>

                                                {/* Footer signature */}
                                                <div className="pt-6 border-t border-slate-200">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="font-bold text-slate-900 text-lg">
                                                                {section.author}
                                                            </p>
                                                            <p className="text-sm text-slate-600">
                                                                {section.title},
                                                                BSLCTR
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                                                <IconComponent className="w-6 h-6 text-primary" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
};

export default memo(MessageFromChairman);
