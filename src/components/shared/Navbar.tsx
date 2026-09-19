"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import AdminLoginModal from "../AdminLoginModal";
import MemberLoginModal from "../MemberLoginModal";

const Navbar = () => {
    const [memberMenuOpen, setMemberMenuOpen] = useState(false);
    const [loginOpen, setLoginOpen] = useState(false);
    const memberMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (memberMenuRef.current && !memberMenuRef.current.contains(e.target as Node)) {
                setMemberMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <>
            {/* Sticky translucent bar, per the ILCA header treatment. NavLinksBar
                gives up its own sticky slot so the two cannot overlap. */}
            <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-white/10 bg-secondary/90 px-4 py-3 backdrop-blur-md">
                <Link href="/" className="flex items-center gap-2">
                    <img src="/Logo1.png" alt="BSLCTR" className="h-12 sm:h-14" />
                    <span className="hidden text-2xl font-medium tracking-wide text-white lg:block">
                        BSLCTR
                    </span>
                </Link>

                {/* These two entry points are all that is left. The admin and member
                    dashboards they led to have been removed, so there is no logged-in
                    avatar state, no notification badge and no pending-count polling. */}
                <div className="flex items-center gap-3">
                    <AdminLoginModal />

                    <div className="relative" ref={memberMenuRef}>
                        <button
                            onClick={() => setMemberMenuOpen((p) => !p)}
                            className="focus-ring rounded-full border border-white/30 bg-white/10 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20 active:scale-95 sm:px-4"
                        >
                            Member
                        </button>

                        {memberMenuOpen && (
                            <div className="menu-panel absolute right-0 mt-2 w-40">
                                <button
                                    className="menu-item"
                                    onClick={() => {
                                        setMemberMenuOpen(false);
                                        setLoginOpen(true);
                                    }}
                                >
                                    Log In
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* onSuccess can never fire: /api/member/login went with the member
                dashboard, so the modal only ever reaches its error branch. */}
            <MemberLoginModal
                open={loginOpen}
                onClose={() => setLoginOpen(false)}
                onSuccess={() => {}}
            />
        </>
    );
};

export default Navbar;
