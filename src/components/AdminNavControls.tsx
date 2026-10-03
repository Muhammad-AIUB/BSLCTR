"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import AdminLoginModal from "./AdminLoginModal";

const pill =
    "rounded-full border border-white/30 bg-white/10 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20 active:scale-95 sm:px-4";

/**
 * Shows Admin Login, or Dashboard + Log out once the server confirms an admin session.
 * `children` are the signed-out-only controls (the Member menu): hidden for an admin.
 */
export default function AdminNavControls({ children }: { children?: ReactNode }) {
    const [isAdmin, setIsAdmin] = useState(false);

    const refresh = useCallback(async () => {
        try {
            const res = await fetch("/api/admin/me", { cache: "no-store" });
            setIsAdmin(Boolean((await res.json()).email));
        } catch {
            setIsAdmin(false);
        }
    }, []);

    useEffect(() => {
        refresh();
        window.addEventListener("adminAuthChanged", refresh);
        return () => window.removeEventListener("adminAuthChanged", refresh);
    }, [refresh]);

    if (!isAdmin) {
        return (
            <>
                <AdminLoginModal />
                {children}
            </>
        );
    }

    return (
        <>
            <a href="/dashboard" target="_blank" rel="noopener" className={pill}>
                Dashboard
            </a>
            <button
                type="button"
                className={pill}
                onClick={async () => {
                    await fetch("/api/admin/logout", { method: "POST" });
                    setIsAdmin(false);
                }}
            >
                Log out
            </button>
        </>
    );
}
