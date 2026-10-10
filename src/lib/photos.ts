import { prisma } from "@/lib/prisma";

/**
 * Approved gallery photos, newest first, in the shape <PhotoGallery> takes.
 * Photos are managed from the dashboard (Gallery tab).
 */
export async function getGalleryPhotos(limit?: number) {
    try {
        const rows = await prisma.photo.findMany({
            where: { status: "APPROVED" },
            orderBy: { createdAt: "desc" },
            take: limit,
        });
        return rows.map((p) => ({
            id: p.id,
            src: p.link,
            alt: p.title,
            title: p.title,
            date: "",
            location: "",
            attendees: "",
        }));
    } catch (error) {
        console.error("load gallery photos failed", error);
        return [];
    }
}
