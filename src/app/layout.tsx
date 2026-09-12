import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import LiverCursor from "@/components/LiverCursor";

// Quicksand ships 300–700 only. 700 is the heaviest real weight and is what
// the oversized watermark type uses — do not request 900, it does not exist.
const quicksand = Quicksand({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-quicksand",
    display: "swap",
});

export const metadata: Metadata = {
    title: "BSLCTR",
    description: "Bangladesh Society for Liver Cancer Treatment & Research",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={quicksand.variable}>
            <body suppressHydrationWarning>
                <LiverCursor />
                {children}
            </body>
        </html>
    );
}
