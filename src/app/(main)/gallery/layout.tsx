import type { Metadata } from "next";

// The page here is a client component, which cannot export metadata itself.
export const metadata: Metadata = {
    title: "Gallery | BSLCTR",
    description:
        "Photos and videos from the Bangladesh Society for Liver Cancer Treatment & Research.",
};

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
    return children;
}
