"use client";
import type React from "react";

const HeroSection: React.FC = () => {
    return (
        <section className="w-full">
            {/* Capped at the app's content width (max-w-7xl) so the banner no
                longer spans the full viewport. Intrinsic width/height are set
                to reserve the box and avoid layout shift while it loads. */}
            <div className="mx-auto w-full max-w-7xl">
                <img
                    src="/02696689-b7f7-47f8-b269-2a9321d83ed7.webp"
                    alt="BSLCTR 2026 Banner"
                    width={2172}
                    height={329}
                    className="h-auto w-full object-contain"
                />
            </div>
        </section>
    );
};

export default HeroSection;
