"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import SubscribeModal from "@/components/SubscribeModal";

const TITLE_WORDS = ["BSLCTR", "5th", "Annual", "Conference", "2026"];

// The hero picture: a glowing wireframe liver on deep blue, 719 x 1600, with a world map
// above it. It is tall, so a phone gets all of it as a backdrop, and a wide screen gets the
// liver and its rings cropped out of it, beside the words.
const HERO_PICTURE = "/hero-liver.webp";

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
            {/* The ground: brand navy behind the words, deepening on the right into the
                picture's own blue, so the liver sits in the hero and not on top of it. */}
            <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary to-[#06166e]"
            />

            {/* Phones: the whole picture as a backdrop, dimmed under a navy wash so the
                words stay readable. Decorative, hence the empty alt. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={HERO_PICTURE}
                alt=""
                aria-hidden="true"
                width={719}
                height={1600}
                className="absolute inset-0 h-full w-full object-cover opacity-60 mix-blend-lighten lg:hidden"
            />
            <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-b from-secondary/40 via-secondary/55 to-secondary/85 lg:hidden"
            />

            <div className="page-container relative lg:grid lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:items-center lg:gap-10">
                <div>
                    <motion.p
                        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-6 text-sm font-semibold uppercase tracking-[0.25em] text-white sm:text-base"
                    >
                        22 December 2026 &nbsp;|&nbsp; Pan Pacific Sonargaon, Dhaka, Bangladesh
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
                                className="mr-4 inline-block text-[2.75rem] leading-[1.05] sm:text-6xl xl:text-7xl"
                            >
                                {/* The trailing space keeps the heading's text as separate words;
                                    at the end of an inline-block it takes up no room. */}
                                {`${word} `}
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
                            Register for conference
                        </Button>
                    </motion.div>
                </div>

                {/* lg and up: the liver and its rings, cropped square out of the tall picture
                    and let grow past its column. `lighten` keeps only what is brighter than
                    the hero behind it, and the round mask fades the rest, so no edge of the
                    picture shows. Both sit on this wrapper: a mask isolates what is inside
                    it, and a blend mode set on the image would have nothing to blend with. */}
                <div
                    aria-hidden="true"
                    className="relative hidden aspect-square w-full scale-110 mix-blend-lighten [mask-image:radial-gradient(closest-side,black_55%,transparent)] lg:block"
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={HERO_PICTURE}
                        alt=""
                        width={719}
                        height={1600}
                        className="animate-hero-float h-full w-full object-cover object-[50%_55%]"
                    />
                </div>
            </div>

            <SubscribeModal
                isOpen={showSubscribe}
                onClose={() => setShowSubscribe(false)}
                conferenceOnly
            />
        </section>
    );
}
