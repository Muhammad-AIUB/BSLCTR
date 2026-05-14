"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { useEffect, useRef, useState } from "react";
import AdminLoginModal from "../AdminLoginModal";
import MemberSignupModal from "../MemberSignupModal";
import { ChevronDown } from "lucide-react";

const Navbar = () => {
    const router = useRouter();
    const [adminEmail, setAdminEmail] = useState<string | null>(null);
    const [memberMenuOpen, setMemberMenuOpen] = useState(false);
    const [signupOpen, setSignupOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loadAuth = () => {
            try {
                const raw = localStorage.getItem("adminAuth");
                if (!raw) { setAdminEmail(null); return; }
                const parsed = JSON.parse(raw);
                setAdminEmail(parsed?.email ?? null);
            } catch {
                setAdminEmail(null);
            }
        };

        loadAuth();
        const onStorage = (e: StorageEvent) => { if (e.key === "adminAuth") loadAuth(); };
        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMemberMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("adminAuth");
        setAdminEmail(null);
        router.push("/");
    };

    return (
        <>
            <nav className="flex items-center justify-between px-4 py-2 bg-primary shadow-md">
                <Link href="/" className="flex items-center gap-1">
                    <img src="/Logo1.png" alt="Logo" className="h-20 lg:h-24" />
                    <div className="hidden lg:block text-6xl font-bold text-white">
                        BSLCTR
                    </div>
                </Link>

                <div className="flex items-center gap-2">
                    {adminEmail ? (
                        <Button
                            className="bg-red-600 hover:bg-red-700 rounded-full"
                            onClick={handleLogout}
                        >
                            Log out
                        </Button>
                    ) : (
                        <AdminLoginModal />
                    )}

                    {/* Member dropdown */}
                    <div className="relative" ref={menuRef}>
                        <Button
                            variant="outline"
                            className="rounded-full flex items-center gap-1"
                            onClick={() => setMemberMenuOpen((prev) => !prev)}
                        >
                            Member
                            <ChevronDown className={`h-4 w-4 transition-transform ${memberMenuOpen ? "rotate-180" : ""}`} />
                        </Button>

                        {memberMenuOpen && (
                            <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden z-50">
                                <button
                                    className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 font-medium transition-colors"
                                    onClick={() => {
                                        setMemberMenuOpen(false);
                                        setSignupOpen(true);
                                    }}
                                >
                                    Sign Up
                                </button>
                                <div className="h-px bg-slate-100" />
                                <button
                                    className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 font-medium transition-colors"
                                    onClick={() => {
                                        setMemberMenuOpen(false);
                                        // Member login — to be implemented
                                    }}
                                >
                                    Log In
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            <MemberSignupModal open={signupOpen} onClose={() => setSignupOpen(false)} />
        </>
    );
};

export default Navbar;
