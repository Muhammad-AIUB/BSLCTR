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
        // Decorative pattern/orb background removed with the ILCA restyle — the
        // dot grid was hardcoded to the retired teal rgba(0,162,183,0.08).
        // Heading and page container now come from the wrapping <Section>.
        <div ref={ref}>
            <div className="relative z-10 w-full">
                {/* Main Content */}
                <motion.div
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    transition={{ delay: 0.3 }}
                >
                    <Card className="overflow-hidden border border-slate-200 bg-white shadow-lg">
                        <div className="p-6 sm:p-8 lg:p-12 text-center">
                            <motion.div
                                variants={fadeInUp}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                            >
                                <h3 className="mb-6 text-2xl lg:text-3xl">
                                    We are building this
                                </h3>
                                <p className="text-lg leading-relaxed text-body">
                                    This section is currently under development. 
                                    We are working to bring you the best content and experience.
                                </p>
                            </motion.div>
                        </div>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default memo(MessageFromTreasurer);
