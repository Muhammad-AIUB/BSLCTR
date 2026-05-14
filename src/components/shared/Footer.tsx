import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export function Footer() {
    return (
        <footer className="w-full bg-blue-900 text-white">
            <div className="container mx-auto px-4 py-10">
                {/* Top separator line */}
                <Separator className="bg-white/20 mb-6" />

                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    {/* Left Side */}
                    <div className="flex flex-col items-center md:items-start">
                        <img
                            src="/Logo1.png"
                            alt="BSLCTR Logo"
                            className="h-12 mb-4"
                        />
                        <h3 className="text-lg font-semibold">BSLCTR</h3>
                        <p className="text-sm text-white/70 mt-2 text-center md:text-left">
                            Dedicated to improving liver health through
                            education and care.
                        </p>
                    </div>

                    {/* Right Side - Links */}
                    <div className="flex flex-wrap justify-center md:justify-end gap-4 text-sm font-medium">
                        <Link href="/" className="hover:underline">
                            Home
                        </Link>
                        <Link
                            href="/live-webinars"
                            className="hover:underline"
                        >
                            Live Webinars
                        </Link>
                        <Link href="/donation" className="hover:underline">
                            Donate
                        </Link>
                        <Link href="/subscribe" className="hover:underline">
                            Subscribe
                        </Link>
                    </div>
                </div>

                {/* Bottom section */}
                <div className="mt-8 text-center text-xs text-white/50">
                    <p>
                        © {new Date().getFullYear()} BSLCTR [Bangladesh Society
                        for Liver Cancer Treatment & Research] – All Rights
                        Reserved
                    </p>
                </div>
            </div>
        </footer>
    );
}
