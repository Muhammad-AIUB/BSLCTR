import PhotoGallery from "@/components/PhotoGallery";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Section } from "@/components/ui/section";

// Photos come from the database at runtime, so render per request.
export const dynamic = "force-dynamic";

export default async function PhotoGalleryPage() {
    // Photos are managed from the dashboard (Gallery tab).
    const rows = await prisma.photo
        .findMany({ where: { status: "APPROVED" }, orderBy: { createdAt: "desc" } })
        .catch((error) => {
            console.error("load gallery photos failed", error);
            return [];
        });

    const photos = rows.map((p) => ({
        id: p.id,
        src: p.link,
        alt: p.title,
        title: p.title,
        date: "",
        location: "",
        attendees: "",
    }));

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
