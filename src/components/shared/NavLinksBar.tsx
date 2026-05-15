"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import SubscribeModal from "../SubscribeModal";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { motion, AnimatePresence } from "framer-motion";

const links = [
    { name: "Home", path: "/" },
    { name: "Live Webinars", path: "/live-webinars" },
    { name: "BSLCTRcon", path: "/bslctrcon" },
    {
        name: "All Hepatologists, Hepatobiliary Surgeons, Interventional Lists",
        path: "/hepatologist-surgeon-interventiona",
    },
    { name: "Guidelines", path: "/guidelines" },
    { name: "Case Presentations", path: "/cases" },
    { name: "Video/Photo Gallery", path: "/gallery" },
    { name: "Q&A", path: "/qa" },
    { name: "Donation", path: "/donate" },
    { name: "Subscribe", path: "/subscribe" },
    { name: "About US", path: "/about" },
];

const homeLink = links[0];
const restLinks = links.slice(1);

const NavLinksBar = () => {
    const [showSubscribeModal, setShowSubscribeModal] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [hasUpcoming, setHasUpcoming] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        fetch("/api/webinars")
            .then((r) => r.json())
            .then((data: { date: string }[]) => {
                const today = new Date().toISOString().split("T")[0];
                setHasUpcoming(data.some((w) => w.date > today));
            })
            .catch(() => {});
    }, []);

    return (
        <>
            <nav className="w-full bg-secondary shadow-sm sticky top-0 z-50">
                {/* Mobile: Hamburger */}
                <div className="flex items-center justify-between px-4 py-3 md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-white"
                            >
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent
                            side="left"
                            className="bg-sky-500 text-white border-none"
                        >
                            <div className="flex flex-col gap-4 mt-8">
                                {links.map((link, index) => {
                                    if (link.name === "Subscribe") {
                                        return (
                                            <Button
                                                key={index}
                                                variant="ghost"
                                                className="w-full justify-start text-white"
                                                onClick={() =>
                                                    setShowSubscribeModal(true)
                                                }
                                            >
                                                {link.name}
                                            </Button>
                                        );
                                    }
                                    return (
                                        <Link key={index} href={link.path}>
                                            <Button
                                                variant="ghost"
                                                className={`relative w-full justify-start text-white ${
                                                    pathname === link.path
                                                        ? "bg-sky-400"
                                                        : ""
                                                }`}
                                            >
                                                {link.name}
                                                {link.path === "/live-webinars" && (
                                                    <span className={`ml-2 inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full border transition-all duration-300 ${
                                                        hasUpcoming
                                                            ? "bg-amber-400 border-amber-300 text-amber-900"
                                                            : "bg-white/10 border-white/20 text-white/40"
                                                    }`}>
                                                        <span className={`inline-flex rounded-full h-1.5 w-1.5 ${
                                                            hasUpcoming ? "bg-amber-700 animate-pulse" : "bg-white/30"
                                                        }`} />
                                                        Upcoming
                                                    </span>
                                                )}
                                            </Button>
                                        </Link>
                                    );
                                })}
                            </div>
                        </SheetContent>
                    </Sheet>
                    <div className="text-white font-bold text-xl">BSLCTR</div>
                </div>

                {/* Desktop: Expand on hover */}
                <div
                    className="hidden md:flex items-stretch overflow-hidden bg-secondary py-1 px-2 lg:py-2 lg:px-4"
                    onMouseEnter={() => setExpanded(true)}
                    onMouseLeave={() => setExpanded(false)}
                >
                    {/* Home — always visible */}
                    <Link href={homeLink.path} className="shrink-0">
                        <Button
                            variant="ghost"
                            className={`rounded-none px-4 lg:px-6 text-white hover:bg-sky-400 hover:text-white h-full text-sm font-medium ${
                                pathname === homeLink.path ? "bg-sky-400" : ""
                            }`}
                        >
                            {homeLink.name}
                        </Button>
                    </Link>

                    {/* Divider after Home */}
                    <div className="w-px bg-primary self-stretch shrink-0" />

                    {/* Rest of links — slide in on hover */}
                    <AnimatePresence>
                        {expanded &&
                            restLinks.map((link, index) => (
                                <motion.div
                                    key={link.path}
                                    className="flex items-stretch shrink-0"
                                    initial={{ width: 0, opacity: 0 }}
                                    animate={{ width: "auto", opacity: 1 }}
                                    exit={{ width: 0, opacity: 0 }}
                                    transition={{
                                        duration: 0.2,
                                        delay: index * 0.04,
                                        ease: "easeOut",
                                    }}
                                    style={{ overflow: "hidden" }}
                                >
                                    {link.name === "Subscribe" ? (
                                        <Button
                                            variant="ghost"
                                            className={`rounded-none px-3 lg:px-4 text-white hover:bg-sky-400 hover:text-white h-full text-[10px] md:text-xs lg:text-sm font-medium whitespace-nowrap ${
                                                pathname === link.path
                                                    ? "bg-sky-400"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                setShowSubscribeModal(true)
                                            }
                                        >
                                            {link.name}
                                        </Button>
                                    ) : (
                                        <Link
                                            href={link.path}
                                            className="flex items-stretch"
                                        >
                                            <Button
                                                variant="ghost"
                                                className={`relative rounded-none px-3 lg:px-4 text-white hover:bg-sky-400 hover:text-white h-full text-[10px] md:text-xs lg:text-sm font-medium whitespace-nowrap ${
                                                    pathname === link.path
                                                        ? "bg-sky-400"
                                                        : ""
                                                }`}
                                            >
                                                {link.name}
                                                {link.path === "/live-webinars" && (
                                                    <span className={`ml-1.5 inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full border transition-all duration-300 ${
                                                        hasUpcoming
                                                            ? "bg-amber-400 border-amber-300 text-amber-900"
                                                            : "bg-white/10 border-white/20 text-white/40"
                                                    }`}>
                                                        <span className={`inline-flex rounded-full h-1.5 w-1.5 ${
                                                            hasUpcoming ? "bg-amber-700 animate-pulse" : "bg-white/30"
                                                        }`} />
                                                        Upcoming
                                                    </span>
                                                )}
                                            </Button>
                                        </Link>
                                    )}
                                    <div className="w-px bg-primary self-stretch" />
                                </motion.div>
                            ))}
                    </AnimatePresence>
                </div>
            </nav>

            <SubscribeModal
                isOpen={showSubscribeModal}
                onClose={() => setShowSubscribeModal(false)}
            />
        </>
    );
};

export default NavLinksBar;
