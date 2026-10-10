"use client";

import { useState } from "react";
import Link from "next/link";
import SubscribeModal from "../SubscribeModal";

// Mirrors the main nav, grouped so the footer reads as a site map.
const linkGroups = [
    {
        title: "Society",
        links: [
            { name: "Home", path: "/" },
            { name: "About Us", path: "/about" },
            { name: "Doctors", path: "/doctors" },
            { name: "BSLCTRcon", path: "/bslctrcon" },
            { name: "Gallery", path: "/gallery" },
        ],
    },
    {
        title: "Resources",
        links: [
            { name: "Live Webinars", path: "/live-webinars" },
            { name: "Clinical Guidelines", path: "/guidelines" },
            { name: "Patients Guidelines", path: "/patients-guidelines" },
            { name: "Case Presentations", path: "/cases" },
            { name: "Q&A", path: "/qa" },
        ],
    },
];

const linkClass =
    "text-sm text-white/75 outline-none transition-colors hover:text-white focus-visible:text-white focus-visible:underline";

export function Footer() {
    const [showSubscribe, setShowSubscribe] = useState(false);

    return (
        // The orange rule separates the footer from page content and from the same-blue nav bar.
        <footer className="w-full border-t-4 border-primary bg-secondary text-white">
            <div className="page-container py-12 lg:py-16">
                <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:gap-12">
                    {/* Brand */}
                    <div className="col-span-2 lg:col-span-1">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-3 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/logo.png" alt="" width={387} height={288} className="h-12 w-auto" />
                            <span className="text-xl font-semibold tracking-wide">BSLCTR</span>
                        </Link>
                        <p className="mt-4 max-w-xs text-sm font-medium leading-relaxed text-white/90">
                            Bangladesh Society for Liver Cancer Treatment &amp; Research
                        </p>
                        <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/65">
                            Dedicated to improving liver health through education and care.
                        </p>
                    </div>

                    {linkGroups.map((group) => (
                        <nav key={group.title} aria-label={group.title}>
                            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-white/55">
                                {group.title}
                            </h3>
                            <ul className="mt-2">
                                {group.links.map((link) => (
                                    <li key={link.path}>
                                        <Link href={link.path} className={`block py-2.5 lg:py-2 ${linkClass}`}>
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    ))}

                    {/* Get involved */}
                    <div className="col-span-2 lg:col-span-1">
                        <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-white/55">
                            Get Involved
                        </h3>
                        <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/75">
                            Subscribe for updates, or register for the annual conference.
                        </p>
                        <div className="mt-4 flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={() => setShowSubscribe(true)}
                                className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground outline-none transition-all duration-200 hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-white/70 active:scale-95"
                            >
                                Subscribe
                            </button>
                            <Link
                                href="/donate"
                                className="rounded-full border border-white/40 px-5 py-2.5 text-sm font-semibold text-white outline-none transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/70"
                            >
                                Donate
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <p className="mt-10 border-t border-white/15 pt-6 text-xs text-white/55 lg:mt-12">
                    © {new Date().getFullYear()} Bangladesh Society for Liver
                    Cancer Treatment &amp; Research. All rights reserved.
                </p>
            </div>

            <SubscribeModal
                isOpen={showSubscribe}
                onClose={() => setShowSubscribe(false)}
            />
        </footer>
    );
}
