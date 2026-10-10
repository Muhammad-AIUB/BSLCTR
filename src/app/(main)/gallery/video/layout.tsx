import type { Metadata } from "next";

// The page here is a client component, which cannot export metadata itself.
export const metadata: Metadata = {
    title: "Video Gallery | BSLCTR",
    description:
        "Videos from the Bangladesh Society for Liver Cancer Treatment & Research.",
};

export default function VideoGalleryLayout({ children }: { children: React.ReactNode }) {
    return children;
}
