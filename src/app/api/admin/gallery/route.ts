import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { adminFromRequest } from "@/lib/admin-auth";
import { IMAGE_TYPES, VIDEO_TYPES, UploadError, deleteUpload, saveUpload } from "@/lib/uploads";
import { youtubeId } from "@/lib/youtube";

export const dynamic = "force-dynamic";

const MB = 1024 * 1024;

function isHttpUrl(value: string): boolean {
    try {
        const u = new URL(value);
        return u.protocol === "http:" || u.protocol === "https:";
    } catch {
        return false;
    }
}

/** A video already streamed to disk by /api/admin/gallery/upload. */
const UPLOADED_VIDEO = /^\/api\/files\/[0-9a-f-]{36}\.(mp4|webm)$/;

/** True when the URL path ends in one of the given file extensions. */
function hasExtension(url: string, allowed: string[]): boolean {
    const ext = new URL(url).pathname.split(".").pop()?.toLowerCase() ?? "";
    return allowed.includes(ext);
}

export async function GET(req: NextRequest) {
    if (!adminFromRequest(req)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const [videos, photos] = await Promise.all([
        prisma.video.findMany({ orderBy: { createdAt: "desc" } }),
        prisma.photo.findMany({ orderBy: { createdAt: "desc" } }),
    ]);
    return NextResponse.json({ videos, photos });
}

export async function POST(req: NextRequest) {
    if (!adminFromRequest(req)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const form = await req.formData().catch(() => null);
    if (!form) return NextResponse.json({ error: "Invalid form data" }, { status: 400 });

    const kind = form.get("kind");
    const title = String(form.get("title") ?? "").trim();
    const link = String(form.get("link") ?? "").trim();
    const file = form.get("file");
    const rawUploaded = String(form.get("uploaded") ?? "");
    const uploaded = UPLOADED_VIDEO.test(rawUploaded) ? rawUploaded : "";

    // A file that already backs a gallery video is not this request's to claim,
    // and must not be deleted by the clean-up below.
    if (uploaded && (await prisma.video.findFirst({ where: { link: uploaded }, select: { id: true } }))) {
        return NextResponse.json({ error: "Invalid uploaded file" }, { status: 400 });
    }

    // A rejected submission must not leave its already-uploaded video behind.
    const reject = async (error: string) => {
        if (uploaded) await deleteUpload(uploaded);
        return NextResponse.json({ error }, { status: 400 });
    };

    if (kind !== "VIDEO" && kind !== "PHOTO") return reject("Choose Video or Photo");
    if (!title) return reject("Title is required");
    if (rawUploaded && (!uploaded || kind !== "VIDEO")) return reject("Invalid uploaded file");

    const hasFile = file instanceof File && file.size > 0;
    // Video files arrive via /api/admin/gallery/upload; buffering them here would exhaust memory.
    if (hasFile && kind === "VIDEO") return reject("Video files must be uploaded separately");
    if ((hasFile || uploaded) && link) return reject("Use either a link or a file, not both");
    if (!hasFile && !uploaded && !link) return reject("Paste a link or choose a file");
    if (link) {
        if (!isHttpUrl(link)) return reject("Link must be a valid http(s) link");
        // The gallery can only show what the browser can embed: a YouTube
        // player, or a file it can load directly.
        if (kind === "VIDEO" && !youtubeId(link) && !hasExtension(link, VIDEO_TYPES)) {
            return reject("Video link must be a YouTube link or a direct .mp4 / .webm link");
        }
    }

    let saved = uploaded;
    try {
        if (hasFile) saved = await saveUpload(file, IMAGE_TYPES, 10 * MB);
        // Admin uploads skip moderation and are published straight away.
        const data = { title, link: saved || link, status: "APPROVED" as const };
        const created =
            kind === "VIDEO"
                ? await prisma.video.create({ data })
                : await prisma.photo.create({ data });
        return NextResponse.json(created, { status: 201 });
    } catch (error) {
        if (saved) await deleteUpload(saved);
        console.error("create gallery item failed", error);
        if (error instanceof UploadError) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        return NextResponse.json({ error: "Could not save the gallery item" }, { status: 500 });
    }
}
