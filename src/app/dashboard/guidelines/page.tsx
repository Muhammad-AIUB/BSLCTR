"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ExternalLink, FileText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type GuidelineType = "PATIENT" | "CLINICAL";

type Guideline = {
    id: string;
    type: GuidelineType;
    title: string;
    link: string;
    pdfs: string[];
    thumbnail: string;
    tags: string[];
    createdAt: string;
};

const TYPES: { value: GuidelineType; label: string; page: string }[] = [
    { value: "PATIENT", label: "Patient", page: "/patients-guidelines" },
    { value: "CLINICAL", label: "Clinical", page: "/guidelines" },
];

export default function DashboardGuidelinesPage() {
    const [type, setType] = useState<GuidelineType>("PATIENT");
    const [items, setItems] = useState<Guideline[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [notice, setNotice] = useState<{ text: string; page: string } | null>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const load = useCallback(async () => {
        const res = await fetch("/api/admin/guidelines", { cache: "no-store" });
        if (res.status === 401) {
            window.location.href = "/";
            return;
        }
        if (res.ok) setItems(await res.json());
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
        data.set("type", type);
        // Empty file inputs still send a zero-byte File; drop them.
        for (const key of ["file", "thumbnail"]) {
            const f = data.get(key);
            if (f instanceof File && f.size === 0) data.delete(key);
        }

        try {
            const res = await fetch("/api/admin/guidelines", { method: "POST", body: data });
            const body = await res.json().catch(() => ({}));
            if (!res.ok) {
                setError(body.error ?? "Could not save the guideline.");
                return;
            }
            const target = TYPES.find((t) => t.value === type)!;
            setNotice({ text: `Saved. It now appears on the ${target.label} page.`, page: target.page });
            formRef.current?.reset();
            await load();
        } catch {
            setError("Could not reach the server. Try again.");
        } finally {
            setSubmitting(false);
        }
    }

    async function onDelete(g: Guideline) {
        if (!window.confirm(`Delete "${g.title}"? This cannot be undone.`)) return;
        const res = await fetch(`/api/admin/guidelines/${g.id}`, { method: "DELETE" });
        if (res.ok) await load();
        else setError("Could not delete that guideline.");
    }

    return (
        <div className="mx-auto max-w-4xl">
            <h1 className="text-2xl font-semibold text-secondary">Guidelines</h1>
            <p className="mt-1 text-sm text-body">
                Publish a guideline to the Patient or Clinical page.
            </p>

            <form
                ref={formRef}
                onSubmit={onSubmit}
                className="mt-6 grid gap-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
            >
                <fieldset className="grid gap-2">
                    <legend className="mb-1 text-sm font-medium">Guideline type</legend>
                    <div className="grid grid-cols-2 gap-3">
                        {TYPES.map((t) => (
                            <label
                                key={t.value}
                                className={`flex cursor-pointer items-center justify-center rounded-md border px-4 py-3 text-sm font-medium transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary/50 ${
                                    type === t.value
                                        ? "border-primary bg-accent text-primary-deep"
                                        : "border-slate-200 hover:bg-slate-50"
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="type-choice"
                                    value={t.value}
                                    checked={type === t.value}
                                    onChange={() => setType(t.value)}
                                    className="sr-only"
                                />
                                {t.label}
                            </label>
                        ))}
                    </div>
                    <p className="text-xs text-body">
                        Shows on {TYPES.find((t) => t.value === type)!.page}
                    </p>
                </fieldset>

                <div className="grid gap-2">
                    <Label htmlFor="g-title">Title</Label>
                    <Input id="g-title" name="title" required maxLength={200} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="g-file">Upload PDF / DOC</Label>
                    <Input id="g-file" name="file" type="file" accept=".pdf,.doc,.docx" />
                    <p className="text-xs text-body">PDF, DOC or DOCX, up to 25 MB.</p>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="g-thumb">Thumbnail</Label>
                    <Input
                        id="g-thumb"
                        name="thumbnail"
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp"
                    />
                    <p className="text-xs text-body">JPG, PNG or WebP, up to 5 MB.</p>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="g-tags">Tags</Label>
                    <Input id="g-tags" name="tags" placeholder="diet, cirrhosis, nutrition" />
                    <p className="text-xs text-body">Separate tags with commas.</p>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="g-source">Source</Label>
                    <Input
                        id="g-source"
                        name="source"
                        type="url"
                        placeholder="https://..."
                    />
                    <p className="text-xs text-body">
                        Paste any link. Needed if you don&apos;t upload a file.
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
                    {submitting ? "Saving..." : "Publish guideline"}
                </Button>
            </form>

            <h2 className="mt-10 text-lg font-semibold">Published</h2>
            {items.length === 0 ? (
                <p className="mt-2 text-sm text-body">Nothing published yet.</p>
            ) : (
                <ul className="mt-3 grid gap-3">
                    {items.map((g) => (
                        <li
                            key={g.id}
                            className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-3"
                        >
                            {g.thumbnail ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={g.thumbnail}
                                    alt=""
                                    className="h-14 w-14 shrink-0 rounded-md object-cover"
                                />
                            ) : (
                                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-400">
                                    <FileText className="h-6 w-6" aria-hidden="true" />
                                </span>
                            )}
                            <div className="min-w-0 flex-1">
                                <p className="truncate font-medium">{g.title}</p>
                                <p className="text-xs text-body">
                                    {g.type === "PATIENT" ? "Patient" : "Clinical"}
                                    {g.tags.length > 0 && ` · ${g.tags.join(", ")}`}
                                </p>
                            </div>
                            {g.link && (
                                <a
                                    href={g.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={`Open source for ${g.title}`}
                                    className="p-2 text-body hover:text-secondary"
                                >
                                    <ExternalLink className="h-4 w-4" />
                                </a>
                            )}
                            <button
                                type="button"
                                onClick={() => onDelete(g)}
                                aria-label={`Delete ${g.title}`}
                                className="p-2 text-body hover:text-destructive"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
