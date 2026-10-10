import { createWriteStream } from "fs";
import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { Readable, Transform } from "stream";
import { pipeline } from "stream/promises";

/** Uploads live outside public/ so files added at runtime are served immediately, via /api/files/. */
export const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads");

export const DOC_TYPES = ["pdf", "doc", "docx"];
export const IMAGE_TYPES = ["jpg", "jpeg", "png", "webp"];
export const VIDEO_TYPES = ["mp4", "webm"];
/** Gallery video size cap. Videos are streamed to disk, so this is a disk-space guard, not a memory one. */
export const MAX_VIDEO_BYTES = 2 * 1024 * 1024 * 1024;

export const CONTENT_TYPES: Record<string, string> = {
    pdf: "application/pdf",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    mp4: "video/mp4",
    webm: "video/webm",
};

const FILE_URL_PREFIX = "/api/files/";

/** A rejected upload. Its message is written for the admin and is safe to send back; no other error's is. */
export class UploadError extends Error {}

/** Validates and saves an uploaded file; returns its public URL. Throws an UploadError when the file is refused. */
export async function saveUpload(
    file: File,
    allowed: string[],
    maxBytes: number
): Promise<string> {
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    if (!allowed.includes(ext)) {
        throw new UploadError(`"${file.name}" must be one of: ${allowed.join(", ")}`);
    }
    if (file.size > maxBytes) {
        throw new UploadError(`"${file.name}" is larger than ${Math.round(maxBytes / 1024 / 1024)} MB`);
    }
    await mkdir(UPLOAD_DIR, { recursive: true });
    const name = `${randomUUID()}.${ext}`;
    await writeFile(path.join(UPLOAD_DIR, name), Buffer.from(await file.arrayBuffer()));
    return FILE_URL_PREFIX + name;
}

function sizeLabel(bytes: number): string {
    const mb = bytes / 1024 / 1024;
    return mb >= 1024 ? `${Math.round((mb / 1024) * 10) / 10} GB` : `${Math.round(mb)} MB`;
}

/**
 * Like saveUpload, but streams the body to disk instead of buffering it, for
 * files too large to hold in memory. A partial file is removed on any failure.
 */
export async function saveUploadStream(
    body: ReadableStream<Uint8Array>,
    filename: string,
    allowed: string[],
    maxBytes: number,
    { declaredBytes }: { declaredBytes?: number } = {}
): Promise<string> {
    const ext = filename.split(".").pop()?.toLowerCase() ?? "";
    if (!allowed.includes(ext)) {
        throw new UploadError(`"${filename}" must be one of: ${allowed.join(", ")}`);
    }
    const tooLarge = () => new UploadError(`"${filename}" is larger than ${sizeLabel(maxBytes)}`);
    // Content-Length lets an oversized upload be refused before any of it is written.
    if (declaredBytes && declaredBytes > maxBytes) throw tooLarge();

    await mkdir(UPLOAD_DIR, { recursive: true });
    const name = `${randomUUID()}.${ext}`;
    const target = path.join(UPLOAD_DIR, name);

    let written = 0;
    const limit = new Transform({
        transform(chunk: Buffer, _enc, done) {
            written += chunk.length;
            done(written > maxBytes ? tooLarge() : null, chunk);
        },
    });
    try {
        await pipeline(
            Readable.fromWeb(body as import("stream/web").ReadableStream),
            limit,
            createWriteStream(target)
        );
    } catch (error) {
        await unlink(target).catch(() => {});
        throw error;
    }
    if (written === 0) {
        await unlink(target).catch(() => {});
        throw new UploadError(`"${filename}" is empty`);
    }
    return FILE_URL_PREFIX + name;
}

/** Best-effort removal of a file previously saved by saveUpload. */
export async function deleteUpload(url: string): Promise<void> {
    if (!url.startsWith(FILE_URL_PREFIX)) return;
    const name = path.basename(url.slice(FILE_URL_PREFIX.length));
    await unlink(path.join(UPLOAD_DIR, name)).catch((error) => {
        // Already gone is fine. Anything else leaves a file that is still served at its URL.
        if (error?.code !== "ENOENT") console.error("could not delete upload", name, error);
    });
}
