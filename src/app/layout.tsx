import type { Metadata } from "next";
import "./globals.css";
import TopBar from "@/components/shared/TopBar";
import Navbar from "@/components/shared/Navbar";
import Search from "@/components/Search";
import NavLinksBar from "@/components/shared/NavLinksBar";
import { Footer } from "@/components/shared/Footer";
import ScrollToTop from "@/components/ScrollToTop";

export const metadata: Metadata = {
    title: "BSLCTR",
    description:
        "Bangladesh Society for Liver Cancer Treatment & Research",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <TopBar />
                <Navbar />
                <Search />
                <ScrollToTop />
                <NavLinksBar />
                <main>{children}</main>
                <Footer />
            </body>
        </html>
    );
}
