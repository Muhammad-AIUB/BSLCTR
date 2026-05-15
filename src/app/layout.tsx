import type { Metadata } from "next";
import "./globals.css";
import LiverCursor from "@/components/LiverCursor";

export const metadata: Metadata = {
    title: "BSLCTR",
    description: "Bangladesh Society for Liver Cancer Treatment & Research",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body suppressHydrationWarning>
                <LiverCursor />
                {children}
            </body>
        </html>
    );
}
