import { NextResponse } from "next/server";
import { createReadStream } from "fs";
import { stat } from "fs/promises";
import path from "path";
import { Readable } from "stream";
import { CONTENT_TYPES, DOC_TYPES, UPLOAD_DIR } from "@/lib/uploads";

const SAFE_NAME = /^[0-9a-f-]{36}\.(pdf|docx?|jpe?g|png|webp|mp4|webm)$/;

type Context = { params: Promise<{ name: string }> };

/** The stored file behind a public name, with the headers every answer for it carries; null when there is none. */
async function findUpload(name: string) {
    if (!SAFE_NAME.test(name)) return null;

    const file = path.join(UPLOAD_DIR, name);
    const size = await stat(file).then((s) => s.size, () => -1);
    if (size < 0) return null;

    const ext = name.split(".").pop()!;
    const headers: Record<string, string> = {
        "Content-Type": CONTENT_TYPES[ext],
        // A name is never reused, so a cached copy never goes stale. But a guideline can be
        // withdrawn, and a copy cached for a year would outlive it, so documents get an hour.
        "Cache-Control": DOC_TYPES.includes(ext)
            ? "public, max-age=3600"
            : "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
        "Accept-Ranges": "bytes",
    };
    return { file, size, headers };
}

// Declared so that Next does not answer HEAD by running GET: it would open the file and
// then drop the stream unread, which leaves the file open for good.
export async function HEAD(_req: Request, { params }: Context) {
    const found = await findUpload((await params).name);
    if (!found) return new NextResponse(null, { status: 404 });
    return new NextResponse(null, {
        headers: { ...found.headers, "Content-Length": String(found.size) },
    });
}

export async function GET(req: Request, { params }: Context) {
    const found = await findUpload((await params).name);
    if (!found) return new NextResponse("Not found", { status: 404 });
    const { file, size, headers } = found;

    // Range requests let browsers seek in uploaded videos (Safari will not play without them).
    const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.get("range") ?? "");
    if (range && (range[1] || range[2])) {
        // "bytes=-N" means the last N bytes.
        const start = range[1] ? Number(range[1]) : Math.max(size - Number(range[2]), 0);
        const end = range[1] && range[2] ? Math.min(Number(range[2]), size - 1) : size - 1;
        if (start > end || start >= size) {
            return new NextResponse(null, {
                status: 416,
                headers: { "Content-Range": `bytes */${size}` },
            });
        }
        return new NextResponse(stream(file, start, end, req.signal), {
            status: 206,
            headers: {
                ...headers,
                "Content-Range": `bytes ${start}-${end}/${size}`,
                "Content-Length": String(end - start + 1),
            },
        });
    }

    if (size === 0) return new NextResponse(null, { headers });
    return new NextResponse(stream(file, 0, size - 1, req.signal), {
        headers: { ...headers, "Content-Length": String(size) },
    });
}

/** `signal` closes the file when the client goes away before the stream has been read to the end. */
function stream(file: string, start: number, end: number, signal: AbortSignal) {
    return Readable.toWeb(createReadStream(file, { start, end, signal })) as ReadableStream;
}
