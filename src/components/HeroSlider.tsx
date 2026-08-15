"use client";

import { useEffect, useState } from "react";

const slides = [
    "/hero-slide-1.webp",
    "/hero-slide-2.webp",
    "/hero-slide-3.webp",
];

/** How long each slide stays on screen before advancing. */
const SLIDE_INTERVAL_MS = 10000;

export default function HeroSlider() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, SLIDE_INTERVAL_MS);
        return () => clearInterval(timer);
    }, []);

    return (
        // Capped at the app's content width (max-w-7xl) to match the banner
        // above, instead of spanning the full viewport.
        <div className="relative mx-auto w-full max-w-7xl select-none overflow-hidden">
            {/* Slides */}
            <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${current * 100}%)` }}
            >
                {slides.map((src, i) => (
                    <div key={i} className="w-full shrink-0">
                        <img
                            src={src}
                            alt={`Slide ${i + 1}`}
                            width={1920}
                            height={820}
                            className="block h-auto w-full"
                            draggable={false}
                        />
                    </div>
                ))}
            </div>

            {/* Pagination dots */}
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-0">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        aria-label={`Go to slide ${i + 1}`}
                        className="-m-1 flex items-center justify-center rounded-full p-2 outline-none transition-transform focus-visible:ring-2 focus-visible:ring-white/80 active:scale-90"
                    >
                        <span
                            className={`rounded-full transition-all duration-300 ${
                                i === current
                                    ? "h-3 w-6 bg-primary"
                                    : "h-3 w-3 bg-white/70 hover:bg-white"
                            }`}
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}
