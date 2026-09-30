"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Home, Video } from "lucide-react";
import { cn } from "@/lib/utils";

// Add new dashboard sections here; Guidelines is the first.
const ITEMS = [
    { name: "Guidelines", href: "/dashboard/guidelines", icon: BookOpen },
    { name: "Webinars", href: "/dashboard/webinars", icon: Video },
];

export default function DashboardSidebar({ email }: { email: string }) {
    const pathname = usePathname();

    return (
        <aside className="shrink-0 bg-secondary text-white md:sticky md:top-0 md:h-svh md:w-60">
            <div className="flex items-center justify-between gap-3 px-5 py-4 md:block md:py-6">
                <div>
                    <p className="text-lg font-semibold tracking-wide">BSLCTR</p>
                    <p className="max-w-44 truncate text-xs text-white/70" title={email}>
                        {email}
                    </p>
                </div>
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-xs text-white/80 hover:text-white md:mt-4"
                >
                    <Home className="h-4 w-4" aria-hidden="true" />
                    View site
                </Link>
            </div>

            <nav aria-label="Dashboard" className="flex gap-1 px-3 pb-3 md:flex-col md:pb-0">
                {ITEMS.map(({ name, href, icon: Icon }) => {
                    const active = pathname.startsWith(href);
                    return (
                        <Link
                            key={href}
                            href={href}
                            aria-current={active ? "page" : undefined}
                            className={cn(
                                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                                active ? "bg-primary text-white" : "text-white/80 hover:bg-white/10"
                            )}
                        >
                            <Icon className="h-4 w-4" aria-hidden="true" />
                            {name}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
