import { NextRequest, NextResponse } from "next/server";
import { adminFromRequest } from "@/lib/admin-auth";
import { MAX_VIDEO_BYTES, VIDEO_TYPES, saveUploadStream } from "@/lib/uploads";

export const dynamic = "force-dynamic";

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

    try {
        const url = await saveUploadStream(req.body, name, VIDEO_TYPES, MAX_VIDEO_BYTES, {
            declaredBytes: Number(req.headers.get("content-length")) || undefined,
        });
        return NextResponse.json({ url }, { status: 201 });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Upload failed";
        console.error("gallery video upload failed", error);
        return NextResponse.json({ error: message }, { status: 400 });
    }
}
