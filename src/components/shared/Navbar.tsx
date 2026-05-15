"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useCallback } from "react";
import AdminLoginModal from "../AdminLoginModal";
import MemberSignupModal from "../MemberSignupModal";
import MemberLoginModal from "../MemberLoginModal";
import { LayoutDashboard, LogOut, Check, X, Video, Image as ImageIcon } from "lucide-react";

interface PendingItem {
    id: string;
    title: string;
    uploadedByName?: string;
    type: "video" | "photo";
}

const Navbar = () => {
    const router = useRouter();
    const [adminEmail, setAdminEmail] = useState<string | null>(null);
    const [memberName, setMemberName] = useState<string | null>(null);
    const [adminMenuOpen, setAdminMenuOpen] = useState(false);
    const [memberMenuOpen, setMemberMenuOpen] = useState(false);
    const [signupOpen, setSignupOpen] = useState(false);
    const [loginOpen, setLoginOpen] = useState(false);
    const [pendingItems, setPendingItems] = useState<PendingItem[]>([]);
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

    const fetchPending = useCallback(async () => {
        try {
            const [vRes, pRes] = await Promise.all([
                fetch("/api/admin/videos"),
                fetch("/api/admin/photos"),
            ]);
            const videos = await vRes.json();
            const photos = await pRes.json();
            const items: PendingItem[] = [
                ...videos.filter((v: { status: string }) => v.status === "PENDING").map((v: { id: string; title: string; uploadedByName?: string }) => ({ ...v, type: "video" as const })),
                ...photos.filter((p: { status: string }) => p.status === "PENDING").map((p: { id: string; title: string; uploadedByName?: string }) => ({ ...p, type: "photo" as const })),
            ];
            setPendingItems(items);
        } catch {
            setPendingItems([]);
        }
    }, []);

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
        if (adminEmail) fetchPending();
        else setPendingItems([]);
    }, [adminEmail, fetchPending]);

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

    const handleItemStatus = async (item: PendingItem, status: "APPROVED" | "REJECTED") => {
        const url = item.type === "video"
            ? `/api/admin/videos/${item.id}`
            : `/api/admin/photos/${item.id}`;
        await fetch(url, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
        });
        await fetchPending();
    };

    const adminInitial = adminEmail ? adminEmail[0].toUpperCase() : "A";
    const memberInitial = memberName ? memberName[0].toUpperCase() : "M";
    const pendingCount = pendingItems.length;

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
                                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 z-[9999] overflow-hidden">
                                    {/* Header */}
                                    <div className="px-4 py-3 border-b border-slate-100">
                                        <p className="text-xs text-slate-400">Logged in as</p>
                                        <p className="text-sm font-semibold text-slate-700 truncate">{adminEmail}</p>
                                    </div>

                                    {/* Pending notifications */}
                                    {pendingItems.length > 0 && (
                                        <div className="border-b border-slate-100">
                                            <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                                                {pendingItems.map((item) => (
                                                    <div key={`${item.type}-${item.id}`} className="px-4 py-3 bg-amber-50/60 hover:bg-amber-50 transition-colors">
                                                        <div className="flex items-start justify-between gap-2 mb-2">
                                                            <div className="flex items-center gap-1.5 min-w-0">
                                                                {item.type === "video"
                                                                    ? <Video className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                                                                    : <ImageIcon className="h-3.5 w-3.5 text-purple-500 shrink-0" />
                                                                }
                                                                <span className="text-sm font-medium text-slate-800 truncate">{item.title}</span>
                                                            </div>
                                                        </div>
                                                        {item.uploadedByName && (
                                                            <p className="text-xs text-slate-400 mb-2">by {item.uploadedByName}</p>
                                                        )}
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => handleItemStatus(item, "APPROVED")}
                                                                className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 px-3 py-1 rounded-full transition-colors"
                                                            >
                                                                <Check className="h-3 w-3" /> Approve
                                                            </button>
                                                            <button
                                                                onClick={() => handleItemStatus(item, "REJECTED")}
                                                                className="flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-100 hover:bg-red-200 px-3 py-1 rounded-full transition-colors"
                                                            >
                                                                <X className="h-3 w-3" /> Reject
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

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
