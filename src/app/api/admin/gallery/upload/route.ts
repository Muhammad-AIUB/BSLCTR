import { NextRequest, NextResponse } from "next/server";
import { readdir, stat, unlink } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
import { adminFromRequest } from "@/lib/admin-auth";
import {
    MAX_VIDEO_BYTES,
    UPLOAD_DIR,
    UploadError,
    VIDEO_TYPES,
    saveUploadStream,
} from "@/lib/uploads";

export const dynamic = "force-dynamic";

const UPLOADED_VIDEO_NAME = /^[0-9a-f-]{36}\.(mp4|webm)$/;
/** An uploaded video nobody has added to the gallery after this long is treated as abandoned. */
const UNCLAIMED_VIDEO_TTL_MS = 24 * 60 * 60 * 1000;

/**
 * Removes videos that were uploaded here but never submitted with the gallery
 * form (the form request failed, or the tab was closed). Best effort: any
 * failure leaves the files alone.
 */
async function sweepUnclaimedVideos(): Promise<void> {
    try {
        // No uploads folder yet means nothing to sweep.
        const names = (await readdir(UPLOAD_DIR).catch(() => [] as string[])).filter((n) =>
            UPLOADED_VIDEO_NAME.test(n)
        );
        if (names.length === 0) return;

        const rows = await prisma.video.findMany({
            where: { link: { contains: "/api/files/" } },
            select: { link: true },
        });
        const claimed = new Set(rows.map((r) => r.link.split("/").pop()));
        const cutoff = Date.now() - UNCLAIMED_VIDEO_TTL_MS;

        for (const name of names) {
            if (claimed.has(name)) continue;
            const file = path.join(UPLOAD_DIR, name);
            if ((await stat(file)).mtimeMs < cutoff) await unlink(file);
        }
    } catch (error) {
        console.error("sweep of unclaimed gallery videos failed", error);
    }
}

/**
 * POST /api/admin/gallery/upload?name=clip.mp4 with the video as the raw request body.
 *
 * Videos are too large to buffer through formData(), so the body is streamed
 * straight to disk. Returns { url }, which the gallery form then submits.
 */
export async function POST(req: NextRequest) {
    if (!adminFromRequest(req)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const name = req.nextUrl.searchParams.get("name") ?? "";
    if (!req.body) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    await sweepUnclaimedVideos();

    try {
        const url = await saveUploadStream(req.body, name, VIDEO_TYPES, MAX_VIDEO_BYTES, {
            declaredBytes: Number(req.headers.get("content-length")) || undefined,
        });
        return NextResponse.json({ url }, { status: 201 });
    } catch (error) {
        console.error("gallery video upload failed", error);
        if (error instanceof UploadError) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        return NextResponse.json({ error: "Could not upload the video" }, { status: 500 });
    }
}
