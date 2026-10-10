import type { GuidelineType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type GuidelineItem = {
    id: string;
    title: string;
    file: string;
    thumbnail: string;
    source: string;
    tags: string[];
    description?: string;
    meta?: string;
};

/** Guidelines of one type, newest first, or null when the database could not be read. */
export async function getGuidelines(type: GuidelineType): Promise<GuidelineItem[] | null> {
    try {
        const rows = await prisma.guideline.findMany({
            where: { type },
            orderBy: { createdAt: "desc" },
        });
        return rows.map((r) => ({
            id: r.id,
            title: r.title,
            file: r.pdfs[0] ?? "",
            thumbnail: r.thumbnail,
            source: r.link,
            tags: r.tags,
        }));
    } catch (error) {
        console.error("getGuidelines failed", error);
        return null;
    }
}
