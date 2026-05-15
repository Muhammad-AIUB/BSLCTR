"use client";

import { useEffect, useState } from "react";

const slides = [
    "/hero-slide-1.png",
    "/hero-slide-2.png",
    "/hero-slide-3.png",
];

export default function HeroSlider() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 2000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="w-full relative overflow-hidden select-none">
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
                            className="w-full h-auto block"
                            draggable={false}
                        />
                    </div>
                ))}
            </div>

            {/* Pagination dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        className={`rounded-full transition-all duration-300 ${
                            i === current
                                ? "bg-primary w-6 h-3"
                                : "bg-white/70 w-3 h-3 hover:bg-white"
                        }`}
                    />
                ))}
            </div>
        </div>
    );
}
