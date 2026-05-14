"use client";

import { useRef, memo } from "react";
import { motion, useInView } from "framer-motion";
import { Card } from "@/components/ui/card";

const MessageFromTreasurer = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });


    // Simplified animation variants for better performance
    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 },
    };


    const staggerContainer = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1,
            },
        },
    };

    return (
        <section ref={ref} className="relative overflow-hidden py-16 lg:py-24">
            {/* Simple Light Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-purple-50/30 to-white">
                {/* Subtle pattern overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(139,69,190,0.1)_1px,transparent_0)] bg-[size:30px_30px] opacity-40" />

                {/* Single subtle accent */}
                <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    className="text-center mb-12 lg:mb-16"
                    variants={staggerContainer}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                >

                    <motion.h2
                        className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6"
                        variants={fadeInUp}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        <span className="bg-gradient-to-r from-purple-600 via-slate-700 to-purple-600 bg-clip-text text-transparent">
                            Message from Treasurer
                        </span>
                    </motion.h2>

                </motion.div>

                {/* Main Content */}
                <motion.div
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    transition={{ delay: 0.3 }}
                >
                    <Card className="overflow-hidden shadow-lg border border-gray-200 bg-white">
                        <div className="p-12 text-center">
                            <motion.div
                                variants={fadeInUp}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                            >
                                <h3 className="text-2xl lg:text-3xl font-bold text-slate-800 mb-6">
                                    We are building this
                                </h3>
                                <p className="text-lg text-slate-600 leading-relaxed">
                                    This section is currently under development. 
                                    We are working to bring you the best content and experience.
                                </p>
                            </motion.div>
                        </div>
                    </Card>
                </motion.div>
            </div>
        </section>
    );
};

export default memo(MessageFromTreasurer);
