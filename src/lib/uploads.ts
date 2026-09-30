import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

/** Uploads live outside public/ so files added at runtime are served immediately, via /api/files/. */
export const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads");

export const DOC_TYPES = ["pdf", "doc", "docx"];
export const IMAGE_TYPES = ["jpg", "jpeg", "png", "webp"];

export const CONTENT_TYPES: Record<string, string> = {
    pdf: "application/pdf",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
};

const FILE_URL_PREFIX = "/api/files/";

/** Validates and saves an uploaded file; returns its public URL. Throws an Error with a user-facing message. */
export async function saveUpload(
    file: File,
    allowed: string[],
    maxBytes: number
): Promise<string> {
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    if (!allowed.includes(ext)) {
        throw new Error(`"${file.name}" must be one of: ${allowed.join(", ")}`);
    }
    if (file.size > maxBytes) {
        throw new Error(`"${file.name}" is larger than ${Math.round(maxBytes / 1024 / 1024)} MB`);
    }
    await mkdir(UPLOAD_DIR, { recursive: true });
    const name = `${randomUUID()}.${ext}`;
    await writeFile(path.join(UPLOAD_DIR, name), Buffer.from(await file.arrayBuffer()));
    return FILE_URL_PREFIX + name;
}

/** Best-effort removal of a file previously saved by saveUpload. */
export async function deleteUpload(url: string): Promise<void> {
    if (!url.startsWith(FILE_URL_PREFIX)) return;
    const name = path.basename(url.slice(FILE_URL_PREFIX.length));
    await unlink(path.join(UPLOAD_DIR, name)).catch(() => {});
}
