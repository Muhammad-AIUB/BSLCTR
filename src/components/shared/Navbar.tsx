"use client";

import Link from "next/link";
import { useState } from "react";
import AdminNavControls from "../AdminNavControls";
import MemberSignupModal from "../MemberSignupModal";

const Navbar = () => {
    const [signupOpen, setSignupOpen] = useState(false);

    return (
        <>
            {/* Translucent bar, per the ILCA header treatment. It is the sticky bar from lg
                up; on phones NavLinksBar is, so that the menu button is the part that stays. */}
            <nav
                aria-label="Account"
                className="flex items-center justify-between border-b border-white/10 bg-secondary/90 px-4 py-3 backdrop-blur-md lg:sticky lg:top-0 lg:z-50"
            >
                <Link href="/" className="flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src="/logo.png"
                        alt="BSLCTR"
                        width={387}
                        height={288}
                        className="h-12 w-auto sm:h-14"
                    />
                    <span className="hidden text-2xl font-medium tracking-wide text-white lg:block">
                        BSLCTR
                    </span>
                </Link>

                {/* AdminNavControls swaps Admin Login for Dashboard + Log out once the
                    server confirms an admin session, and hides the membership button. */}
                <div className="flex items-center gap-3">
                    <AdminNavControls>
                        <button
                            type="button"
                            onClick={() => setSignupOpen(true)}
                            className="focus-ring rounded-full border border-white/30 bg-white/10 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20 active:scale-95 sm:px-4"
                        >
                            Membership
                        </button>
                    </AdminNavControls>
                </div>
            </nav>

            <MemberSignupModal open={signupOpen} onClose={() => setSignupOpen(false)} />
        </>
    );
};

export default Navbar;
