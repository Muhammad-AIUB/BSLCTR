import Navbar from "@/components/shared/Navbar";
import Search from "@/components/Search";
import NavLinksBar from "@/components/shared/NavLinksBar";
import { Footer } from "@/components/shared/Footer";
import ScrollToTop from "@/components/ScrollToTop";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            <Search />
            <ScrollToTop />
            <NavLinksBar />
            <main>{children}</main>
            <Footer />
        </>
    );
}
