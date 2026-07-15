"use client";

import { useState } from "react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import SubscribeModal from "../SubscribeModal";

const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Live Webinars", path: "/live-webinars" },
    { name: "Guidelines", path: "/guidelines" },
    { name: "Case Presentations", path: "/cases" },
    { name: "Gallery", path: "/gallery" },
    { name: "Q&A", path: "/qa" },
    { name: "About", path: "/about" },
];

export function Footer() {
    const [showSubscribe, setShowSubscribe] = useState(false);

    return (
        <footer className="w-full bg-teal-900 text-white">
            <div className="page-container py-12">
                <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
                    {/* Brand */}
                    <div className="flex max-w-sm flex-col items-center text-center md:items-start md:text-left">
                        <img
                            src="/Logo1.png"
                            alt="BSLCTR Logo"
                            className="h-12 mb-4"
                        />
                        <h3 className="text-lg font-semibold">BSLCTR</h3>
                        <p className="mt-2 text-sm text-white/70">
                            Dedicated to improving liver health through
                            education and care.
                        </p>
                    </div>

                    {/* Quick links + Subscribe */}
                    <div className="flex flex-col items-center gap-4 md:items-end">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-white/60">
                            Quick Links
                        </h4>
                        <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm font-medium md:justify-end">
                            {quickLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    href={link.path}
                                    className="text-white/80 outline-none transition-colors hover:text-white hover:underline focus-visible:text-white focus-visible:underline"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </nav>
                        <button
                            type="button"
                            onClick={() => setShowSubscribe(true)}
                            className="mt-1 rounded-full bg-white px-5 py-2 text-sm font-semibold text-teal-900 outline-none transition-all duration-200 hover:bg-white/90 focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent active:scale-95"
                        >
                            Subscribe
                        </button>
                    </div>
                </div>

                <Separator className="my-6 bg-white/20" />

                {/* Bottom */}
                <p className="text-center text-xs text-white/60">
                    © {new Date().getFullYear()} BSLCTR [Bangladesh Society for
                    Liver Cancer Treatment &amp; Research] – All Rights Reserved
                </p>
            </div>

            <SubscribeModal
                isOpen={showSubscribe}
                onClose={() => setShowSubscribe(false)}
            />
        </footer>
    );
}
