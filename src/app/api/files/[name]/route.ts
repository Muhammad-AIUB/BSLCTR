import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { CONTENT_TYPES, UPLOAD_DIR } from "@/lib/uploads";

const SAFE_NAME = /^[0-9a-f-]{36}\.(pdf|docx?|jpe?g|png|webp)$/;

export async function GET(_req: Request, { params }: { params: Promise<{ name: string }> }) {
    const { name } = await params;
    if (!SAFE_NAME.test(name)) return new NextResponse("Not found", { status: 404 });

    try {
        const data = await readFile(path.join(UPLOAD_DIR, name));
        const ext = name.split(".").pop()!;
        return new NextResponse(new Uint8Array(data), {
            headers: {
                "Content-Type": CONTENT_TYPES[ext],
                "Cache-Control": "public, max-age=31536000, immutable",
                "X-Content-Type-Options": "nosniff",
            },
        });
    } catch {
        return new NextResponse("Not found", { status: 404 });
    }
}
