"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import AdminLoginModal from "../AdminLoginModal";
import MemberSignupModal from "../MemberSignupModal";
import MemberLoginModal from "../MemberLoginModal";
import { LayoutDashboard, LogOut, Bell } from "lucide-react";

const Navbar = () => {
    const router = useRouter();
    const [adminEmail, setAdminEmail] = useState<string | null>(null);
    const [memberName, setMemberName] = useState<string | null>(null);
    const [adminMenuOpen, setAdminMenuOpen] = useState(false);
    const [memberMenuOpen, setMemberMenuOpen] = useState(false);
    const [signupOpen, setSignupOpen] = useState(false);
    const [loginOpen, setLoginOpen] = useState(false);
    const [pendingCount, setPendingCount] = useState(0);
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

    const fetchPendingCount = async () => {
        try {
            const [vRes, pRes] = await Promise.all([
                fetch("/api/admin/videos"),
                fetch("/api/admin/photos"),
            ]);
            const videos = await vRes.json();
            const photos = await pRes.json();
            const count =
                (Array.isArray(videos) ? videos.filter((v: { status: string }) => v.status === "PENDING").length : 0) +
                (Array.isArray(photos) ? photos.filter((p: { status: string }) => p.status === "PENDING").length : 0);
            setPendingCount(count);
        } catch {
            setPendingCount(0);
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
        if (!adminEmail) { setPendingCount(0); return; }
        fetchPendingCount();
        const interval = setInterval(fetchPendingCount, 30000);
        return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [adminEmail]);

    useEffect(() => {
        fetch("/api/member/me")
            .then((r) => r.json())
            .then((d) => setMemberName(d.member?.name ?? null))
            .catch(() => setMemberName(null));
    }, []);

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
                    {adminEmail ? (
                        <div className="relative" ref={adminMenuRef}>
                            {/* Avatar button with notification badge */}
                            <button
                                onClick={() => setAdminMenuOpen((p) => !p)}
                                className="relative w-11 h-11 rounded-full bg-blue-700 hover:bg-blue-600 text-white font-bold text-lg flex items-center justify-center shadow-md border-2 border-white/30 transition-colors"
                                title={adminEmail}
                            >
                                {adminInitial}
                                {pendingCount > 0 && (
                                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center px-1 border border-white shadow">
                                        {pendingCount}
                                    </span>
                                )}
                            </button>

                            {adminMenuOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 z-[9999] overflow-hidden">
                                    {/* Header */}
                                    <div className="px-4 py-3 border-b border-slate-100">
                                        <p className="text-xs text-slate-400">Logged in as</p>
                                        <p className="text-sm font-semibold text-slate-700 truncate">{adminEmail}</p>
                                    </div>

                                    {/* Notifications link */}
                                    <Link
                                        href="/dashboard/notifications"
                                        className="flex items-center gap-2 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 font-medium transition-colors"
                                        onClick={() => setAdminMenuOpen(false)}
                                    >
                                        <Bell className="h-4 w-4 text-primary" />
                                        <span className="flex-1">Notifications</span>
                                        {pendingCount > 0 && (
                                            <span className="min-w-[20px] h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center px-1">
                                                {pendingCount}
                                            </span>
                                        )}
                                    </Link>

                                    {/* Dashboard link */}
                                    <Link
                                        href="/dashboard"
                                        className="flex items-center gap-2 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 font-medium transition-colors"
                                        onClick={() => setAdminMenuOpen(false)}
                                    >
                                        <LayoutDashboard className="h-4 w-4 text-primary" />
                                        Dashboard
                                    </Link>

                                    <div className="h-px bg-slate-100" />

                                    {/* Logout */}
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
                        <div className="relative" ref={memberMenuRef}>
                            <button
                                onClick={() => setMemberMenuOpen((p) => !p)}
                                className="w-11 h-11 rounded-full bg-teal-600 hover:bg-teal-500 text-white font-bold text-lg flex items-center justify-center shadow-md border-2 border-white/30 transition-colors"
                                title={memberName}
                            >
                                {memberInitial}
                            </button>

                            {memberMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-[9999]">
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
                                    <div className="absolute right-0 mt-2 w-40 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-[9999]">
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
