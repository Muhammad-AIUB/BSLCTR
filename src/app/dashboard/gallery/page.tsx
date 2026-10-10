"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, ExternalLink, Film, Pencil, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { youtubeId } from "@/lib/youtube";

type Kind = "VIDEO" | "PHOTO";

type Item = { id: string; title: string; link: string; createdAt: string };

/** Sends a video as the raw request body so the server can stream it to disk; reports 0-100. */
function uploadVideo(file: File, onProgress: (percent: number) => void): Promise<string> {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `/api/admin/gallery/upload?name=${encodeURIComponent(file.name)}`);
        xhr.responseType = "json";
        xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
        };
        xhr.onload = () => {
            if (xhr.status === 201 && xhr.response?.url) resolve(xhr.response.url);
            else reject(new Error(xhr.response?.error ?? "Could not upload the video."));
        };
        xhr.onerror = () => reject(new Error("Could not reach the server. Try again."));
        xhr.send(file);
    });
}

const KINDS: {
    value: Kind;
    label: string;
    page: string;
    accept: string;
    fileHint: string;
    linkHint: string;
}[] = [
    {
        value: "VIDEO",
        label: "Video",
        page: "/gallery/video",
        accept: ".mp4,.webm",
        fileHint: "MP4 or WebM, up to 2 GB.",
        linkHint: "A YouTube link, or a direct link to an .mp4 / .webm file.",
    },
    {
        value: "PHOTO",
        label: "Photo",
        page: "/gallery/photo",
        accept: ".jpg,.jpeg,.png,.webp",
        fileHint: "JPG, PNG or WebP, up to 10 MB.",
        linkHint: "A direct link to an image.",
    },
];

export default function DashboardGalleryPage() {
    const [kind, setKind] = useState<Kind>("VIDEO");
    const [items, setItems] = useState<Record<Kind, Item[]>>({ VIDEO: [], PHOTO: [] });
    // Kept apart from `error`, which belongs to the form: a list that fails to refresh after a
    // save must not read as a failed save, and a failed load must not read as an empty list.
    const [listState, setListState] = useState<"loading" | "ready" | "error">("loading");
    const [submitting, setSubmitting] = useState(false);
    // Upload progress of a video file, 0-100, while it is being sent.
    const [progress, setProgress] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [notice, setNotice] = useState<{ text: string; page: string } | null>(null);
    // The list row whose title is being edited, with the draft text.
    const [editing, setEditing] = useState<{ id: string; title: string } | null>(null);
    const [savingEdit, setSavingEdit] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    const current = KINDS.find((k) => k.value === kind)!;

    const load = useCallback(async () => {
        try {
            const res = await fetch("/api/admin/gallery", { cache: "no-store" });
            if (res.status === 401) {
                window.location.href = "/";
                return;
            }
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const body = await res.json();
            setItems({ VIDEO: body.videos, PHOTO: body.photos });
            setListState("ready");
        } catch {
            setListState("error");
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        setNotice(null);
        setSubmitting(true);

        const data = new FormData(e.currentTarget);
        data.set("kind", kind);
        // Empty file inputs still send a zero-byte File; drop it.
        const f = data.get("file");
        if (f instanceof File && f.size === 0) data.delete("file");

        try {
            // Videos go up on their own first: they are too large to send with the form.
            if (kind === "VIDEO" && f instanceof File && f.size > 0) {
                // Checked here as well as on the server, so that a form the server would
                // refuse does not first upload a video of up to 2 GB.
                if (!String(data.get("title") ?? "").trim()) {
                    setError("Title is required");
                    return;
                }
                if (String(data.get("link") ?? "").trim()) {
                    setError("Use either a link or a file, not both");
                    return;
                }
                setProgress(0);
                data.set("uploaded", await uploadVideo(f, setProgress));
                data.delete("file");
            }
            const res = await fetch("/api/admin/gallery", { method: "POST", body: data });
            if (res.status === 401) {
                window.location.href = "/";
                return;
            }
            const body = await res.json().catch(() => ({}));
            if (!res.ok) {
                setError(body.error ?? `Could not save the ${current.label.toLowerCase()}.`);
                return;
            }
            setNotice({
                text: `Saved. It now appears in the ${current.label} Gallery.`,
                page: current.page,
            });
            formRef.current?.reset();
            await load();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Could not reach the server. Try again.");
        } finally {
            setSubmitting(false);
            setProgress(null);
        }
    }

    async function onDelete(item: Item) {
        if (!window.confirm(`Delete "${item.title}"? This cannot be undone.`)) return;
        setError(null);
        try {
            const res = await fetch(`/api/admin/gallery/${item.id}?kind=${kind}`, { method: "DELETE" });
            if (res.status === 401) {
                window.location.href = "/";
                return;
            }
            if (!res.ok) {
                setError(`Could not delete that ${current.label.toLowerCase()}.`);
                return;
            }
        } catch {
            setError("Could not reach the server. Try again.");
            return;
        }
        await load();
    }

    async function onSaveTitle(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!editing) return;
        const title = editing.title.trim();
        if (!title) return;
        setError(null);
        setSavingEdit(true);
        try {
            const res = await fetch(`/api/admin/gallery/${editing.id}?kind=${kind}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title }),
            });
            if (res.status === 401) {
                window.location.href = "/";
                return;
            }
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                setError(body.error ?? "Could not save the title.");
                return;
            }
            setEditing(null);
            await load();
        } catch {
            setError("Could not reach the server. Try again.");
        } finally {
            setSavingEdit(false);
        }
    }

    const list = items[kind];

    return (
        <div className="mx-auto max-w-4xl">
            <h1 className="text-2xl font-semibold text-secondary">Gallery</h1>
            <p className="mt-1 text-sm text-body">
                Add a video or photo to the public gallery.
            </p>

            <form
                ref={formRef}
                onSubmit={onSubmit}
                className="mt-6 grid gap-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
            >
                <fieldset className="grid gap-2">
                    <legend className="mb-1 text-sm font-medium">What are you adding?</legend>
                    <div className="grid grid-cols-2 gap-3">
                        {KINDS.map((k) => (
                            <label
                                key={k.value}
                                className={`flex cursor-pointer items-center justify-center rounded-md border px-4 py-3 text-sm font-medium transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary ${
                                    kind === k.value
                                        ? "border-primary bg-accent text-primary-deep"
                                        : "border-slate-200 hover:bg-slate-50"
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="kind-choice"
                                    value={k.value}
                                    checked={kind === k.value}
                                    onChange={() => {
                                        setKind(k.value);
                                        setError(null);
                                        setNotice(null);
                                        setEditing(null);
                                        // The file input's accept list changes with the kind.
                                        formRef.current?.reset();
                                    }}
                                    className="sr-only"
                                />
                                {k.label}
                            </label>
                        ))}
                    </div>
                    <p className="text-xs text-body">Shows on {current.page}</p>
                </fieldset>

                <div className="grid gap-2">
                    <Label htmlFor="gal-title">Title</Label>
                    <Input id="gal-title" name="title" required maxLength={200} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="gal-link">{current.label} link</Label>
                    <Input id="gal-link" name="link" type="url" placeholder="https://..." />
                    <p className="text-xs text-body">{current.linkHint}</p>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="gal-file">Or upload a {current.label.toLowerCase()} file</Label>
                    <Input id="gal-file" name="file" type="file" accept={current.accept} />
                    <p className="text-xs text-body">
                        {current.fileHint} Use either the link or a file, not both.
                    </p>
                </div>

                {error && (
                    <p role="alert" className="text-sm text-destructive">
                        {error}
                    </p>
                )}
                {notice && (
                    <p role="status" className="text-sm text-green-700">
                        {notice.text}{" "}
                        <a href={notice.page} target="_blank" rel="noopener" className="underline">
                            View page
                        </a>
                    </p>
                )}

                <Button type="submit" disabled={submitting} className="justify-self-start">
                    {progress !== null && progress < 100
                        ? `Uploading ${progress}%`
                        : submitting
                          ? "Submitting..."
                          : "Submit"}
                </Button>
            </form>

            <h2 className="mt-10 text-lg font-semibold">{current.label}s in the gallery</h2>
            {listState === "error" ? (
                <p role="alert" className="mt-2 text-sm text-destructive">
                    Could not load the gallery. Reload the page to try again.
                </p>
            ) : listState === "loading" ? (
                <p className="mt-2 text-sm text-body">Loading...</p>
            ) : list.length === 0 ? (
                <p className="mt-2 text-sm text-body">Nothing added yet.</p>
            ) : (
                <ul className="mt-3 grid gap-3">
                    {list.map((item) => {
                        const yt = kind === "VIDEO" ? youtubeId(item.link) : null;
                        const thumb =
                            kind === "PHOTO"
                                ? item.link
                                : yt && `https://img.youtube.com/vi/${yt}/default.jpg`;
                        return (
                            <li
                                key={item.id}
                                className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-3"
                            >
                                {thumb ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={thumb}
                                        alt=""
                                        className="h-14 w-14 shrink-0 rounded-md object-cover"
                                    />
                                ) : (
                                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-400">
                                        <Film className="h-6 w-6" aria-hidden="true" />
                                    </span>
                                )}
                                <div className="min-w-0 flex-1">
                                    {editing?.id === item.id ? (
                                        <form onSubmit={onSaveTitle} className="flex items-center gap-1">
                                            <Input
                                                value={editing.title}
                                                onChange={(e) =>
                                                    setEditing({ id: item.id, title: e.target.value })
                                                }
                                                onKeyDown={(e) => e.key === "Escape" && setEditing(null)}
                                                aria-label="Title"
                                                required
                                                maxLength={200}
                                                autoFocus
                                                className="h-8"
                                            />
                                            <button
                                                type="submit"
                                                disabled={savingEdit}
                                                aria-label="Save title"
                                                className="p-2 text-green-700 hover:text-green-800 disabled:opacity-50"
                                            >
                                                <Check className="h-4 w-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setEditing(null)}
                                                aria-label="Cancel editing"
                                                className="p-2 text-body hover:text-secondary"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </form>
                                    ) : (
                                        <div className="flex items-center gap-1">
                                            <p className="truncate font-medium">{item.title}</p>
                                            <button
                                                type="button"
                                                onClick={() => setEditing({ id: item.id, title: item.title })}
                                                aria-label={`Edit title of ${item.title}`}
                                                className="shrink-0 p-1.5 text-body hover:text-secondary"
                                            >
                                                <Pencil className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    )}
                                    <p className="text-xs text-body">
                                        {item.link.startsWith("/api/files/") ? "Uploaded file" : "Link"}
                                        {" · "}
                                        {new Date(item.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <a
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={`Open ${item.title}`}
                                    className="p-2 text-body hover:text-secondary"
                                >
                                    <ExternalLink className="h-4 w-4" />
                                </a>
                                <button
                                    type="button"
                                    onClick={() => onDelete(item)}
                                    aria-label={`Delete ${item.title}`}
                                    className="p-2 text-body hover:text-destructive"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
