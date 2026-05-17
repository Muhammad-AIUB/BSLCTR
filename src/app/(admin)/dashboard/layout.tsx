"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Users, LogOut, Radio, Video, Image as ImageIcon, ArrowLeft, Bell, BookOpen } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [adminEmail, setAdminEmail] = useState<string | null>(null);
    const [ready, setReady] = useState(false);
    const [pendingCount, setPendingCount] = useState(0);

    useEffect(() => {
        try {
            const raw = localStorage.getItem("adminAuth");
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed?.email) {
                    setAdminEmail(parsed.email);
                    setReady(true);
                    return;
                }
            }
        } catch { /* ignore */ }
        router.replace("/");
    }, [router]);

    useEffect(() => {
        if (!ready) return;
        const fetchCount = async () => {
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
            } catch { /* ignore */ }
        };
        fetchCount();
        const id = setInterval(fetchCount, 30000);
        return () => clearInterval(id);
    }, [ready]);

    const handleLogout = () => {
        localStorage.removeItem("adminAuth");
        router.push("/");
    };

    if (!ready) return null;

    const navItems = [
        { href: "/dashboard", label: "Members", icon: Users },
        { href: "/dashboard/notifications", label: "Notifications", icon: Bell, badge: pendingCount },
        { href: "/dashboard/webinars", label: "Webinars", icon: Radio },
        { href: "/dashboard/videos", label: "Videos", icon: Video },
        { href: "/dashboard/photos", label: "Images", icon: ImageIcon },
        { href: "/dashboard/guidelines", label: "Guidelines", icon: BookOpen },
    ];

    return (
        <div className="flex min-h-screen bg-slate-100">
            <aside className="w-64 bg-primary text-white flex flex-col shrink-0">
                <div className="px-6 py-5 border-b border-white/20">
                    <div className="text-2xl font-bold tracking-wide">BSLCTR</div>
                    <div className="text-xs text-white/60 mt-0.5">Admin Panel</div>
                </div>

                <div className="px-6 py-4 border-b border-white/20">
                    <div className="text-xs text-white/50 uppercase tracking-widest mb-1">Logged in as</div>
                    <div className="text-sm font-medium truncate">{adminEmail}</div>
                </div>

                <nav className="flex-1 px-3 py-4 space-y-1">
                    {navItems.map(({ href, label, icon: Icon, badge }) => {
                        const active = pathname === href;
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                    active
                                        ? "bg-white/15 text-white"
                                        : "text-white/70 hover:bg-white/10 hover:text-white"
                                }`}
                            >
                                <Icon className="h-4 w-4 shrink-0" />
                                <span className="flex-1">{label}</span>
                                {badge != null && badge > 0 && (
                                    <span className="min-w-[20px] h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center px-1">
                                        {badge}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="px-3 py-4 border-t border-white/20 space-y-1">
                    <Link
                        href="/"
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors text-sm"
                    >
                        <ArrowLeft className="h-4 w-4 shrink-0" />
                        Back to Site
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors text-sm"
                    >
                        <LogOut className="h-4 w-4 shrink-0" />
                        Log Out
                    </button>
                </div>
            </aside>

            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
