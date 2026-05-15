"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import AdminLoginModal from "../AdminLoginModal";
import MemberSignupModal from "../MemberSignupModal";
import MemberLoginModal from "../MemberLoginModal";
import { LayoutDashboard, LogOut } from "lucide-react";

const Navbar = () => {
    const router = useRouter();
    const [adminEmail, setAdminEmail] = useState<string | null>(null);
    const [memberName, setMemberName] = useState<string | null>(null);
    const [adminMenuOpen, setAdminMenuOpen] = useState(false);
    const [memberMenuOpen, setMemberMenuOpen] = useState(false);
    const [signupOpen, setSignupOpen] = useState(false);
    const [loginOpen, setLoginOpen] = useState(false);
    const adminMenuRef = useRef<HTMLDivElement>(null);
    const memberMenuRef = useRef<HTMLDivElement>(null);

    const loadAdmin = () => {
        try {
            const raw = localStorage.getItem("adminAuth");
            if (!raw) { setAdminEmail(null); return; }
            const parsed = JSON.parse(raw);
            setAdminEmail(parsed?.email ?? null);
        } catch {
            setAdminEmail(null);
        }
    };

    useEffect(() => {
        loadAdmin();
        const onStorage = (e: StorageEvent) => { if (e.key === "adminAuth") loadAdmin(); };
        const onCustom = () => loadAdmin();
        window.addEventListener("storage", onStorage);
        window.addEventListener("adminAuthChanged", onCustom);
        return () => {
            window.removeEventListener("storage", onStorage);
            window.removeEventListener("adminAuthChanged", onCustom);
        };
    }, []);

    useEffect(() => {
        fetch("/api/member/me")
            .then((r) => r.json())
            .then((d) => setMemberName(d.member?.name ?? null))
            .catch(() => setMemberName(null));
    }, []);

    // Close dropdowns on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (adminMenuRef.current && !adminMenuRef.current.contains(e.target as Node)) setAdminMenuOpen(false);
            if (memberMenuRef.current && !memberMenuRef.current.contains(e.target as Node)) setMemberMenuOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleAdminLogout = () => {
        localStorage.removeItem("adminAuth");
        setAdminEmail(null);
        setAdminMenuOpen(false);
        router.push("/");
    };

    const handleMemberLogout = async () => {
        await fetch("/api/member/logout", { method: "POST" });
        setMemberName(null);
        setMemberMenuOpen(false);
    };

    const adminInitial = adminEmail ? adminEmail[0].toUpperCase() : "A";
    const memberInitial = memberName ? memberName[0].toUpperCase() : "M";

    return (
        <>
            <nav className="flex items-center justify-between px-4 py-2 bg-primary shadow-md">
                <Link href="/" className="flex items-center gap-1">
                    <img src="/Logo1.png" alt="Logo" className="h-20 lg:h-24" />
                    <div className="hidden lg:block text-6xl font-bold text-white">
                        BSLCTR
                    </div>
                </Link>

                <div className="flex items-center gap-3">
                    {/* Admin logged in → round avatar, hide member button */}
                    {adminEmail ? (
                        <div className="relative" ref={adminMenuRef}>
                            <button
                                onClick={() => setAdminMenuOpen((p) => !p)}
                                className="w-11 h-11 rounded-full bg-blue-700 hover:bg-blue-600 text-white font-bold text-lg flex items-center justify-center shadow-md border-2 border-white/30 transition-colors"
                                title={adminEmail}
                            >
                                {adminInitial}
                            </button>

                            {adminMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">
                                    <div className="px-4 py-3 border-b border-slate-100">
                                        <p className="text-xs text-slate-400">Logged in as</p>
                                        <p className="text-sm font-semibold text-slate-700 truncate">{adminEmail}</p>
                                    </div>
                                    <Link
                                        href="/dashboard"
                                        className="flex items-center gap-2 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 font-medium transition-colors"
                                        onClick={() => setAdminMenuOpen(false)}
                                    >
                                        <LayoutDashboard className="h-4 w-4 text-primary" />
                                        Dashboard
                                    </Link>
                                    <div className="h-px bg-slate-100" />
                                    <button
                                        onClick={handleAdminLogout}
                                        className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 font-medium transition-colors"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Log Out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : memberName ? (
                        /* Member logged in → round avatar, hide admin button */
                        <div className="relative" ref={memberMenuRef}>
                            <button
                                onClick={() => setMemberMenuOpen((p) => !p)}
                                className="w-11 h-11 rounded-full bg-teal-600 hover:bg-teal-500 text-white font-bold text-lg flex items-center justify-center shadow-md border-2 border-white/30 transition-colors"
                                title={memberName}
                            >
                                {memberInitial}
                            </button>

                            {memberMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">
                                    <div className="px-4 py-3 border-b border-slate-100">
                                        <p className="text-xs text-slate-400">Logged in as</p>
                                        <p className="text-sm font-semibold text-slate-700 truncate">{memberName}</p>
                                    </div>
                                    <Link
                                        href="/member-dashboard"
                                        className="flex items-center gap-2 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 font-medium transition-colors"
                                        onClick={() => setMemberMenuOpen(false)}
                                    >
                                        <LayoutDashboard className="h-4 w-4 text-teal-600" />
                                        Dashboard
                                    </Link>
                                    <div className="h-px bg-slate-100" />
                                    <button
                                        onClick={handleMemberLogout}
                                        className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 font-medium transition-colors"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Log Out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Nobody logged in → show both Admin Login + Member button */
                        <>
                            <AdminLoginModal />

                            <div className="relative" ref={memberMenuRef}>
                                <button
                                    onClick={() => setMemberMenuOpen((p) => !p)}
                                    className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-medium border border-white/30 transition-colors"
                                >
                                    Member
                                </button>

                                {memberMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-40 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">
                                        <button
                                            className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 font-medium transition-colors"
                                            onClick={() => { setMemberMenuOpen(false); setSignupOpen(true); }}
                                        >
                                            Sign Up
                                        </button>
                                        <div className="h-px bg-slate-100" />
                                        <button
                                            className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 font-medium transition-colors"
                                            onClick={() => { setMemberMenuOpen(false); setLoginOpen(true); }}
                                        >
                                            Log In
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </nav>

            <MemberSignupModal open={signupOpen} onClose={() => setSignupOpen(false)} />
            <MemberLoginModal
                open={loginOpen}
                onClose={() => setLoginOpen(false)}
                onSuccess={(name) => setMemberName(name)}
            />
        </>
    );
};

export default Navbar;
