"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import SubscribeModal from "../SubscribeModal";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const links = [
    { name: "Home", path: "/" },
    { name: "Live Webinars", path: "/live-webinars" },
    { name: "BSLCTRcon", path: "/bslctrcon" },
    {
        name: "All Hepatologist, Hepatobiliary Surgeon, Interventiona list",
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

const NavLinksBar = () => {
    const [showSubscribeModal, setShowSubscribeModal] = useState(false);
    const pathname = usePathname();

    return (
        <>
            <nav className="w-full bg-secondary shadow-sm sticky top-0 z-50">
                <div className="flex items-center justify-between px-4 py-3 md:hidden">
                    {/* Mobile: Hamburger */}
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
                                                className={`w-full justify-start text-white ${
                                                    pathname === link.path
                                                        ? "bg-sky-400"
                                                        : ""
                                                }`}
                                            >
                                                {link.name}
                                            </Button>
                                        </Link>
                                    );
                                })}
                            </div>
                        </SheetContent>
                    </Sheet>

                    {/* Logo */}
                    <div className="text-white font-bold text-xl">BSLCTR</div>
                </div>

                {/* Desktop: Full Nav */}
                <div className="hidden md:flex items-stretch justify-between divide-x divide-primary bg-secondary py-1 px-2 lg:py-2 lg:px-4">
                    {links.map((link, index) => {
                        if (link.name === "Subscribe") {
                            return (
                                <div key={index} className="flex-grow min-w-0">
                                    <Button
                                        variant="ghost"
                                        className={`rounded-none px-1 py-2 md:px-2 lg:px-4 xl:px-6 text-white hover:bg-sky-400 hover:text-white w-full h-full text-[10px] md:text-xs lg:text-sm font-medium whitespace-normal leading-tight ${
                                            pathname === link.path
                                                ? "bg-sky-400"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            setShowSubscribeModal(true)
                                        }
                                    >
                                        <span className="break-words text-center">
                                            {link.name}
                                        </span>
                                    </Button>
                                </div>
                            );
                        }

                        return (
                            <Link
                                key={index}
                                href={link.path}
                                className="flex-grow min-w-0"
                            >
                                <Button
                                    variant="ghost"
                                    className={`rounded-none px-1 py-2 md:px-2 lg:px-4 xl:px-6 text-white hover:bg-sky-400 hover:text-white w-full h-full text-[10px] md:text-xs lg:text-sm font-medium whitespace-normal leading-tight ${
                                        pathname === link.path
                                            ? "bg-sky-400 "
                                            : ""
                                    }`}
                                >
                                    <span className="break-words text-center">
                                        {link.name}
                                    </span>
                                </Button>
                            </Link>
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
