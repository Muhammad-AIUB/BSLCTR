"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import SubscribeModal from "../SubscribeModal";
import { ChevronDown, ChevronRight, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DOCTOR_CATEGORIES } from "@/lib/doctors";
import { bangladeshToday } from "@/lib/webinars";

type NavLink = {
    name: string;
    path: string;
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
        path: "/doctors",
        // Each opens the directory filtered to that kind of specialist.
        children: DOCTOR_CATEGORIES.map((c) => ({
            name: c.name.en,
            path: `/doctors?type=${c.slug}`,
        })),
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
    // Controlled so that following a link closes the mobile sheet: the layout
    // survives navigation, so an uncontrolled sheet would stay open over the new page.
    const [sheetOpen, setSheetOpen] = useState(false);
    const [hasUpcoming, setHasUpcoming] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        fetch("/api/webinars")
            .then((r) => r.json())
            .then((data: { date: string }[]) => {
                const today = bangladeshToday();
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
            {/* Not sticky: the Navbar above now owns the sticky top-0 slot, and
                two stuck elements at top-0 would overlap. */}
            <nav className="w-full bg-secondary shadow-sm">
                {/* Mobile: hamburger */}
                <div className="flex items-center justify-between px-4 py-3 lg:hidden">
                    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
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
                                                onClick={() => {
                                                    setSheetOpen(false);
                                                    setShowSubscribeModal(true);
                                                }}
                                            >
                                                {link.name}
                                            </Button>
                                        );
                                    }

                                    return (
                                        <div key={link.path}>
                                            <Link
                                                href={link.path}
                                                onClick={() => setSheetOpen(false)}
                                            >
                                                <Button
                                                    variant="ghost"
                                                    className={`h-auto min-h-11 w-full justify-start whitespace-normal text-left text-white ${
                                                        pathname === link.path
                                                            ? "bg-primary"
                                                            : ""
                                                    }`}
                                                >
                                                    {link.name}
                                                    {link.path ===
                                                        "/live-webinars" &&
                                                        upcomingBadge(false)}
                                                </Button>
                                            </Link>

                                            {link.children?.map((child) => (
                                                <Link
                                                    key={child.path}
                                                    href={child.path}
                                                    onClick={() => setSheetOpen(false)}
                                                >
                                                    <Button
                                                        variant="ghost"
                                                        className={`h-auto min-h-11 w-full justify-start whitespace-normal pl-8 text-left text-sm font-normal text-white/80 ${
                                                            pathname ===
                                                            child.path
                                                                ? "bg-primary"
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
                <div className="hidden items-stretch justify-center gap-1.5 bg-secondary px-4 py-2 lg:flex">
                    {links.map((link) => {
                        const current = isCurrent(link, pathname);
                        // Type and padding step down between lg and xl so all 11
                        // links fit a 1024px viewport without overflowing.
                        const base = `relative rounded-md px-3 py-2 text-xs font-medium transition-colors xl:px-4 xl:text-sm ${
                            current
                                ? "bg-primary text-white hover:bg-primary/90"
                                : "text-white/90 hover:bg-white/10 hover:text-white"
                        }`;
                        // The solid orange fill is now the "you are here" signal;
                        // the old underline on top of it was redundant.
                        const marker = null;

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
                                        <div className="absolute left-0 top-full z-50 min-w-[16rem] overflow-hidden rounded-b-lg border border-black/5 bg-white p-1.5 shadow-xl">
                                            {link.children.map((child) => (
                                                <Link
                                                    key={child.path}
                                                    href={child.path}
                                                    // A ?type= link keeps the pathname, so the
                                                    // route-change effect would not close the menu.
                                                    onClick={() => setOpenMenu(null)}
                                                    className={`group/item flex items-center justify-between gap-4 rounded-md px-3 py-2.5 text-sm outline-none transition-colors hover:bg-secondary/10 hover:text-secondary focus-visible:bg-secondary/10 ${
                                                        pathname === child.path
                                                            ? "bg-secondary/10 font-semibold text-secondary"
                                                            : "text-neutral-700"
                                                    }`}
                                                >
                                                    {child.name}
                                                    <ChevronRight className="h-4 w-4 text-neutral-400 transition-transform group-hover/item:translate-x-0.5 group-hover/item:text-secondary" />
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        }

                        return (
                            <div key={link.path} className="flex items-stretch">
                                <Link href={link.path} className="flex items-stretch">
                                    <Button variant="ghost" className={`${base} h-12`}>
                                        {link.name}
                                        {link.path === "/live-webinars" &&
                                            upcomingBadge(true)}
                                        {marker}
                                    </Button>
                                </Link>
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
