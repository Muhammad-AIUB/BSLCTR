"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import AdminLoginModal from "../AdminLoginModal";

const Navbar = () => {
    const router = useRouter();
    const [adminEmail, setAdminEmail] = useState<string | null>(null);

    useEffect(() => {
        const loadAuth = () => {
            try {
                const raw = localStorage.getItem("adminAuth");

                if (!raw) {
                    setAdminEmail(null);
                    return;
                }

                const parsed = JSON.parse(raw);
                setAdminEmail(parsed?.email ?? null);
            } catch {
                setAdminEmail(null);
            }
        };

        loadAuth();

        const onStorage = (e: StorageEvent) => {
            if (e.key === "adminAuth") loadAuth();
        };

        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("adminAuth");
        setAdminEmail(null);
        router.push("/");
    };

    return (
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
                <Button variant="outline" className="rounded-full">
                    Member Login
                </Button>
            </div>
        </nav>
    );
};

export default Navbar;
