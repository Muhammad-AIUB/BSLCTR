"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import SubscribeModal from "@/components/SubscribeModal";

const TITLE_WORDS = ["BSLCTR", "Annual", "Conference", "2026"];

export default function ConferenceHero() {
    // When the user has asked for reduced motion we render the final state
    // immediately. The animation is an enhancement over a correct static
    // hero, never a gate on the content appearing.
    const reduceMotion = useReducedMotion();
    // Opens the registration modal rather than linking to /subscribe — that
    // route does not exist, and the nav's own "Subscribe" is a modal too.
    const [showSubscribe, setShowSubscribe] = useState(false);

    return (
        <section className="relative flex h-svh min-h-[36rem] w-full items-center overflow-hidden bg-secondary">
            {/* Background. aria-hidden + empty alt: purely decorative. */}
            <img
                src="/02696689-b7f7-47f8-b269-2a9321d83ed7.webp"
                alt=""
                aria-hidden="true"
                width={2172}
                height={329}
                className="absolute inset-0 h-full w-full object-cover opacity-25"
            />
            {/* Navy scrim so the type always clears contrast over the image. */}
            <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/85 to-secondary/40"
            />

            <div className="page-container relative">
                <motion.p
                    initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-6 text-sm font-semibold uppercase tracking-[0.25em] text-primary sm:text-base"
                >
                    12–14 March 2026 &nbsp;|&nbsp; Dhaka, Bangladesh
                </motion.p>

                <h1 className="max-w-4xl text-white">
                    {TITLE_WORDS.map((word, i) => (
                        <motion.span
                            key={word}
                            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.6,
                                delay: reduceMotion ? 0 : 0.15 + i * 0.12,
                            }}
                            className="mr-4 inline-block text-[2.75rem] leading-[1.05] sm:text-6xl lg:text-7xl"
                        >
                            {word}
                        </motion.span>
                    ))}
                </h1>

                <motion.div
                    initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.5,
                        delay: reduceMotion ? 0 : 0.15 + TITLE_WORDS.length * 0.12,
                    }}
                    className="mt-10"
                >
                    <Button
                        variant="pill"
                        size="lg"
                        onClick={() => setShowSubscribe(true)}
                    >
                        Register now
                    </Button>
                </motion.div>
            </div>

            <SubscribeModal
                isOpen={showSubscribe}
                onClose={() => setShowSubscribe(false)}
            />
        </section>
    );
}
