"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import AdminLoginModal from "../AdminLoginModal";
import MemberLoginModal from "../MemberLoginModal";
import { LayoutDashboard, LogOut, Bell } from "lucide-react";

const Navbar = () => {
    const router = useRouter();
    const [adminEmail, setAdminEmail] = useState<string | null>(null);
    const [memberName, setMemberName] = useState<string | null>(null);
    const [adminMenuOpen, setAdminMenuOpen] = useState(false);
    const [memberMenuOpen, setMemberMenuOpen] = useState(false);
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
                    <img src="/Logo1.png" alt="Logo" className="h-14 sm:h-20 lg:h-24" />
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
                                className="focus-ring relative flex size-11 items-center justify-center rounded-full border-2 border-white/30 bg-secondary text-lg font-bold text-white shadow-md transition-colors hover:bg-secondary/90 active:scale-95"
                                title={adminEmail}
                            >
                                {adminInitial}
                                {pendingCount > 0 && (
                                    <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full border border-white bg-destructive px-1 text-2xs font-bold text-white shadow">
                                        {pendingCount}
                                    </span>
                                )}
                            </button>

                            {adminMenuOpen && (
                                <div className="menu-panel absolute right-0 mt-2 w-56">
                                    {/* Header */}
                                    <div className="border-b border-border px-4 py-3">
                                        <p className="text-xs text-muted-foreground">Logged in as</p>
                                        <p className="truncate text-sm font-semibold text-foreground">{adminEmail}</p>
                                    </div>

                                    {/* Notifications link */}
                                    <Link
                                        href="/dashboard/notifications"
                                        className="menu-item"
                                        onClick={() => setAdminMenuOpen(false)}
                                    >
                                        <Bell className="h-4 w-4 text-primary" />
                                        <span className="flex-1">Notifications</span>
                                        {pendingCount > 0 && (
                                            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-2xs font-bold text-white">
                                                {pendingCount}
                                            </span>
                                        )}
                                    </Link>

                                    {/* Dashboard link */}
                                    <Link
                                        href="/dashboard"
                                        className="menu-item"
                                        onClick={() => setAdminMenuOpen(false)}
                                    >
                                        <LayoutDashboard className="h-4 w-4 text-primary" />
                                        Dashboard
                                    </Link>

                                    <div className="h-px bg-border" />

                                    {/* Logout */}
                                    <button
                                        onClick={handleAdminLogout}
                                        className="menu-item text-destructive hover:bg-destructive/10 hover:text-destructive"
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
                                className="focus-ring flex size-11 items-center justify-center rounded-full border-2 border-white/30 bg-teal-600 text-lg font-bold text-white shadow-md transition-colors hover:bg-teal-500 active:scale-95"
                                title={memberName}
                            >
                                {memberInitial}
                            </button>

                            {memberMenuOpen && (
                                <div className="menu-panel absolute right-0 mt-2 w-48">
                                    <div className="border-b border-border px-4 py-3">
                                        <p className="text-xs text-muted-foreground">Logged in as</p>
                                        <p className="truncate text-sm font-semibold text-foreground">{memberName}</p>
                                    </div>
                                    <Link
                                        href="/member-dashboard"
                                        className="menu-item"
                                        onClick={() => setMemberMenuOpen(false)}
                                    >
                                        <LayoutDashboard className="h-4 w-4 text-teal-600" />
                                        Dashboard
                                    </Link>
                                    <div className="h-px bg-border" />
                                    <button
                                        onClick={handleMemberLogout}
                                        className="menu-item text-destructive hover:bg-destructive/10 hover:text-destructive"
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
                                    className="focus-ring rounded-full border border-white/30 bg-white/10 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20 active:scale-95 sm:px-4"
                                >
                                    Member
                                </button>
                                {memberMenuOpen && (
                                    <div className="menu-panel absolute right-0 mt-2 w-40">
                                        <Link
                                            href="/member-signup"
                                            className="menu-item"
                                            onClick={() => setMemberMenuOpen(false)}
                                        >
                                            Sign Up
                                        </Link>
                                        <div className="h-px bg-border" />
                                        <button
                                            className="menu-item"
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

            <MemberLoginModal
                open={loginOpen}
                onClose={() => setLoginOpen(false)}
                onSuccess={(name) => setMemberName(name)}
            />
        </>
    );
};

export default Navbar;
