import { NextResponse } from "next/server";
import { createReadStream } from "fs";
import { stat } from "fs/promises";
import path from "path";
import { Readable } from "stream";
import { CONTENT_TYPES, UPLOAD_DIR } from "@/lib/uploads";

const SAFE_NAME = /^[0-9a-f-]{36}\.(pdf|docx?|jpe?g|png|webp|mp4|webm)$/;

export async function GET(req: Request, { params }: { params: Promise<{ name: string }> }) {
    const { name } = await params;
    if (!SAFE_NAME.test(name)) return new NextResponse("Not found", { status: 404 });

    const file = path.join(UPLOAD_DIR, name);
    const size = await stat(file).then((s) => s.size, () => -1);
    if (size < 0) return new NextResponse("Not found", { status: 404 });

    const ext = name.split(".").pop()!;
    const headers: Record<string, string> = {
        "Content-Type": CONTENT_TYPES[ext],
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
        "Accept-Ranges": "bytes",
    };

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
        return new NextResponse(stream(file, start, end), {
            status: 206,
            headers: {
                ...headers,
                "Content-Range": `bytes ${start}-${end}/${size}`,
                "Content-Length": String(end - start + 1),
            },
        });
    }

    if (size === 0) return new NextResponse(null, { headers });
    return new NextResponse(stream(file, 0, size - 1), {
        headers: { ...headers, "Content-Length": String(size) },
    });
}

function stream(file: string, start: number, end: number) {
    return Readable.toWeb(createReadStream(file, { start, end })) as ReadableStream;
}
