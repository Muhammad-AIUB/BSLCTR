import PhotoGallery from "@/components/PhotoGallery";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getGalleryPhotos } from "@/lib/photos";
import { Section } from "@/components/ui/section";

// Photos come from the database at runtime, so render per request.
export const dynamic = "force-dynamic";

export default async function PhotoGalleryPage() {
    const photos = await getGalleryPhotos();

    return (
        <>
            <div className="page-container pt-8">
                <Link href="/gallery" className="inline-flex items-center gap-1.5 rounded-md text-slate-500 hover:text-primary text-sm py-2 -my-2 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2">
                    <ChevronLeft className="h-4 w-4" /> Back to Gallery
                </Link>
            </div>
            <Section watermark="Photos" eyebrow="Gallery" title="Photo Gallery" className="pt-6 lg:pt-8">
                <PhotoGallery photos={photos} />
            </Section>
        </>
    );
}
