import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

// The gallery items that used to be hardcoded in the gallery pages. createdAt
// carries the date shown on the card and sets the order (newest first).
const videos = [
    { id: "5ljrzDlq0Qg", title: "World Hepatitis Day 2025 উপলক্ষে আরটিভির বিশেষ স্বাস্থ্য বিষয়ক অনুষ্ঠান | Rtv", date: "2025-07-01" },
    { id: "OeXDYUIv0t4", title: "রোজায় সুস্থতা: লিভার সিরোসিস প্রতিরোধে ডাক্তারের পরামর্শ | Somoy TV", date: "2023-04-01" },
    { id: "F4AE1PgmlOE", title: "BSLCTR Video Highlights", date: "2024-03-01" },
    { id: "y-f3A21nT3A", title: "Medical Education Session", date: "2024-02-01" },
    { id: "Qz1REw087GE", title: "Healthcare Event Coverage", date: "2024-01-01" },
    { id: "AaNj_bmsUDs", title: "Medical Insights", date: "2023-12-01" },
];

const photos = [
    { link: "/80.jpeg", title: "Surgical Team in the Operating Theatre", tags: ["Surgery"] },
];

async function main() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) throw new Error("DATABASE_URL is not set");

    const pool = new Pool({ connectionString });
    const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

    // Safe to re-run: an item whose link is already in the table is skipped.
    for (const v of videos) {
        const link = `https://www.youtube.com/watch?v=${v.id}`;
        if (await prisma.video.findFirst({ where: { link } })) {
            console.log("skip video ", v.id);
            continue;
        }
        await prisma.video.create({
            data: { title: v.title, link, status: "APPROVED", createdAt: new Date(`${v.date}T12:00:00Z`) },
        });
        console.log("added video", v.id);
    }

    for (const p of photos) {
        if (await prisma.photo.findFirst({ where: { link: p.link } })) {
            console.log("skip photo ", p.link);
            continue;
        }
        await prisma.photo.create({ data: { ...p, status: "APPROVED" } });
        console.log("added photo", p.link);
    }

    console.log(`videos: ${await prisma.video.count()}, photos: ${await prisma.photo.count()}`);

    await prisma.$disconnect();
    await pool.end();
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
