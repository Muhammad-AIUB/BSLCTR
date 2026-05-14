import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "BSLCTR",
    description: "Bangladesh Society for Liver Cancer Treatment & Research",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body suppressHydrationWarning>
                {children}
            </body>
        </html>
    );
}
