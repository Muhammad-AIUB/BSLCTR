import Navbar from "@/components/shared/Navbar";
import NavLinksBar from "@/components/shared/NavLinksBar";
import { Footer } from "@/components/shared/Footer";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            <NavLinksBar />
            <main>{children}</main>
            <Footer />
        </>
    );
}
