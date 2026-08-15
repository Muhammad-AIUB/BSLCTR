"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import SubscribeModal from "../SubscribeModal";
import { ChevronDown, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

type NavLink = {
    name: string;
    path: string;
    /** Shown on hover (desktop) or as sub-text (mobile) when the short label needs unpacking. */
    detail?: string[];
    /** Sub-pages surfaced in a dropdown (desktop) or as indented items (mobile). */
    children?: { name: string; path: string }[];
    /** Opens the subscribe modal instead of navigating. */
    isModal?: boolean;
};

const links: NavLink[] = [
    { name: "Home", path: "/" },
    { name: "Live Webinars", path: "/live-webinars" },
    { name: "BSLCTRcon", path: "/bslctrcon" },
    {
        name: "Doctors",
        path: "/hepatologist-surgeon-interventiona",
        detail: [
            "All Hepatologists",
            "Hepatobiliary Surgeons",
            "Interventional Lists",
        ],
    },
    {
        name: "Guidelines",
        path: "/guidelines",
        children: [
            { name: "Clinical Guidelines", path: "/guidelines" },
            { name: "Patients Guidelines", path: "/patients-guidelines" },
        ],
    },
    { name: "Cases", path: "/cases" },
    { name: "Gallery", path: "/gallery" },
    { name: "Q&A", path: "/qa" },
    { name: "Donation", path: "/donate" },
    { name: "Subscribe", path: "/subscribe", isModal: true },
    { name: "About Us", path: "/about" },
];

/** A link is "current" when its own path matches, or when one of its children does. */
const isCurrent = (link: NavLink, pathname: string) =>
    pathname === link.path ||
    (link.children?.some((c) => c.path === pathname) ?? false);

const NavLinksBar = () => {
    const [showSubscribeModal, setShowSubscribeModal] = useState(false);
    const [openMenu, setOpenMenu] = useState<string | null>(null);
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

    // Close any open dropdown when the route changes.
    useEffect(() => setOpenMenu(null), [pathname]);

    const upcomingBadge = (compact: boolean) => (
        <span
            className={`${
                compact ? "ml-1.5" : "ml-2"
            } inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-2xs font-bold transition-colors duration-300 ${
                hasUpcoming
                    ? "border-amber-300 bg-amber-400 text-amber-900"
                    : "border-white/20 bg-white/10 text-white/40"
            }`}
        >
            <span
                className={`inline-flex h-1.5 w-1.5 rounded-full ${
                    hasUpcoming ? "animate-pulse bg-amber-700" : "bg-white/30"
                }`}
            />
            Upcoming
        </span>
    );

    return (
        <>
            <nav className="sticky top-0 z-50 w-full bg-secondary shadow-sm">
                {/* Mobile: hamburger */}
                <div className="flex items-center justify-between px-4 py-3 lg:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-11 w-11 text-white"
                                aria-label="Open navigation menu"
                            >
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent
                            side="left"
                            className="overflow-y-auto border-none bg-secondary text-white"
                        >
                            <div className="mt-8 flex flex-col gap-1">
                                {links.map((link) => {
                                    if (link.isModal) {
                                        return (
                                            <Button
                                                key={link.path}
                                                variant="ghost"
                                                className="h-auto min-h-11 w-full justify-start whitespace-normal text-left text-white"
                                                onClick={() =>
                                                    setShowSubscribeModal(true)
                                                }
                                            >
                                                {link.name}
                                            </Button>
                                        );
                                    }

                                    return (
                                        <div key={link.path}>
                                            <Link href={link.path}>
                                                <Button
                                                    variant="ghost"
                                                    className={`h-auto min-h-11 w-full justify-start whitespace-normal text-left text-white ${
                                                        pathname === link.path
                                                            ? "bg-white/20"
                                                            : ""
                                                    }`}
                                                >
                                                    <span className="flex flex-col items-start gap-0.5">
                                                        <span>{link.name}</span>
                                                        {link.detail && (
                                                            <span className="text-2xs font-normal text-white/60">
                                                                {link.detail.join(
                                                                    " · ",
                                                                )}
                                                            </span>
                                                        )}
                                                    </span>
                                                    {link.path ===
                                                        "/live-webinars" &&
                                                        upcomingBadge(false)}
                                                </Button>
                                            </Link>

                                            {link.children?.map((child) => (
                                                <Link
                                                    key={child.path}
                                                    href={child.path}
                                                >
                                                    <Button
                                                        variant="ghost"
                                                        className={`h-auto min-h-11 w-full justify-start whitespace-normal pl-8 text-left text-sm font-normal text-white/80 ${
                                                            pathname ===
                                                            child.path
                                                                ? "bg-white/20"
                                                                : ""
                                                        }`}
                                                    >
                                                        {child.name}
                                                    </Button>
                                                </Link>
                                            ))}
                                        </div>
                                    );
                                })}
                            </div>
                        </SheetContent>
                    </Sheet>
                    <div className="text-xl font-bold text-white">BSLCTR</div>
                </div>

                {/* Desktop: all links always visible, no scroll */}
                <div className="hidden items-stretch justify-center bg-secondary px-4 lg:flex">
                    {links.map((link) => {
                        const current = isCurrent(link, pathname);
                        // Type and padding step down between lg and xl so all 11
                        // links fit a 1024px viewport without overflowing.
                        const base = `relative rounded-none px-2 text-xs font-medium text-white hover:bg-white/10 hover:text-white xl:px-4 xl:text-sm ${
                            current ? "bg-white/10" : ""
                        }`;
                        // Underline marks the current section — stronger "you are
                        // here" signal than a background tint alone.
                        const marker = (
                            <span
                                className={`absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-white transition-opacity ${
                                    current ? "opacity-100" : "opacity-0"
                                }`}
                            />
                        );

                        if (link.isModal) {
                            return (
                                <Button
                                    key={link.path}
                                    variant="ghost"
                                    className={`${base} h-12`}
                                    onClick={() => setShowSubscribeModal(true)}
                                >
                                    {link.name}
                                </Button>
                            );
                        }

                        if (link.children) {
                            const open = openMenu === link.path;
                            return (
                                <div
                                    key={link.path}
                                    className="relative flex items-stretch"
                                    onMouseEnter={() => setOpenMenu(link.path)}
                                    onMouseLeave={() => setOpenMenu(null)}
                                    onFocus={() => setOpenMenu(link.path)}
                                    onBlur={(e) => {
                                        if (
                                            !e.currentTarget.contains(
                                                e.relatedTarget as Node,
                                            )
                                        ) {
                                            setOpenMenu(null);
                                        }
                                    }}
                                >
                                    <Link href={link.path}>
                                        <Button
                                            variant="ghost"
                                            className={`${base} h-12 gap-1`}
                                            aria-expanded={open}
                                            aria-haspopup="true"
                                        >
                                            {link.name}
                                            <ChevronDown
                                                className={`h-3.5 w-3.5 transition-transform duration-200 ${
                                                    open ? "rotate-180" : ""
                                                }`}
                                            />
                                            {marker}
                                        </Button>
                                    </Link>

                                    {open && (
                                        <div className="absolute left-0 top-full z-50 min-w-[15rem] overflow-hidden rounded-b-md border border-black/5 bg-white py-1 shadow-lg">
                                            {link.children.map((child) => (
                                                <Link
                                                    key={child.path}
                                                    href={child.path}
                                                    className={`block px-4 py-2.5 text-sm transition-colors hover:bg-secondary/10 ${
                                                        pathname === child.path
                                                            ? "bg-secondary/10 font-semibold text-secondary"
                                                            : "text-neutral-700"
                                                    }`}
                                                >
                                                    {child.name}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        }

                        const button = (
                            <Link href={link.path} className="flex items-stretch">
                                <Button
                                    variant="ghost"
                                    className={`${base} h-12`}
                                >
                                    {link.name}
                                    {link.path === "/live-webinars" &&
                                        upcomingBadge(true)}
                                    {marker}
                                </Button>
                            </Link>
                        );

                        if (!link.detail) {
                            return (
                                <div
                                    key={link.path}
                                    className="flex items-stretch"
                                >
                                    {button}
                                </div>
                            );
                        }

                        return (
                            <div key={link.path} className="flex items-stretch">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        {button}
                                    </TooltipTrigger>
                                    <TooltipContent
                                        side="bottom"
                                        sideOffset={4}
                                        className="pointer-events-none px-3 py-2 shadow-lg"
                                    >
                                        <ul className="flex flex-col gap-1 text-left">
                                            {link.detail.map((item) => (
                                                <li
                                                    key={item}
                                                    className="flex items-center gap-2 whitespace-nowrap text-xs"
                                                >
                                                    <span className="h-1 w-1 shrink-0 rounded-full bg-current opacity-60" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                        );
                    })}
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
