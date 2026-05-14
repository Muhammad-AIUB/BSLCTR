"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
    children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(
        null
    );

    useEffect(() => {
        try {
            const raw = localStorage.getItem("adminAuth");
            if (raw) {
                const parsed = JSON.parse(raw);
                setIsAuthenticated(Boolean(parsed?.email));
            } else {
                setIsAuthenticated(false);
            }
        } catch {
            setIsAuthenticated(false);
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated === false) {
            router.push("/");
        }
    }, [isAuthenticated, router]);

    if (isAuthenticated === null) return null;
    if (!isAuthenticated) return null;

    return <>{children}</>;
}
