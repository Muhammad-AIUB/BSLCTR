"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Users, LogOut } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [adminEmail, setAdminEmail] = useState<string | null>(null);
    const [ready, setReady] = useState(false);

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
        } catch {
            // ignore
        }
        router.replace("/");
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("adminAuth");
        router.push("/");
    };

    if (!ready) return null;

    return (
        <div className="flex min-h-screen bg-slate-100">
            {/* Sidebar */}
            <aside className="w-64 bg-primary text-white flex flex-col shrink-0">
                {/* Logo */}
                <div className="px-6 py-5 border-b border-white/20">
                    <div className="text-2xl font-bold tracking-wide">BSLCTR</div>
                    <div className="text-xs text-white/60 mt-0.5">Admin Panel</div>
                </div>

                {/* Admin info */}
                <div className="px-6 py-4 border-b border-white/20">
                    <div className="text-xs text-white/50 uppercase tracking-widest mb-1">Logged in as</div>
                    <div className="text-sm font-medium truncate">{adminEmail}</div>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-4 space-y-1">
                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/15 text-white font-medium cursor-default">
                        <Users className="h-4 w-4 shrink-0" />
                        <span>Members</span>
                    </div>
                </nav>

                {/* Logout */}
                <div className="px-3 py-4 border-t border-white/20">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors text-sm"
                    >
                        <LogOut className="h-4 w-4 shrink-0" />
                        <span>Log Out</span>
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
