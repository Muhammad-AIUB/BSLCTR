import type { ReactNode } from "react";
import Link from "next/link";
import { Building2 } from "lucide-react";

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-10 border-b bg-background">
                <div className="container flex h-16 items-center justify-between py-4">
                    <div className="flex items-center gap-2">
                        <Link href="/" className="flex items-center gap-2">
                            <Building2 className="h-6 w-6" />
                            <h1 className="text-xl font-bold">
                                Cement Shop IMS
                            </h1>
                        </Link>
                    </div>
                </div>
            </header>
            <main className="flex-1">{children}</main>
        </div>
    );
}
