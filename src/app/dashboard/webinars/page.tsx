"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ExternalLink, Trash2, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import TextStyleControls from "@/components/dashboard/TextStyleControls";
import {
    DEFAULT_DESCRIPTION_STYLE,
    DEFAULT_SPEAKERS_STYLE,
    textStyleToCss,
    type TextStyle,
} from "@/lib/text-style";

type Webinar = {
    id: string;
    headline: string;
    date: string;
    time: string;
    link: string;
    thumbnail: string;
};

export default function DashboardWebinarsPage() {
    const [items, setItems] = useState<Webinar[]>([]);
    const [speakers, setSpeakers] = useState("");
    const [description, setDescription] = useState("");
    const [speakersStyle, setSpeakersStyle] = useState<TextStyle>(DEFAULT_SPEAKERS_STYLE);
    const [descriptionStyle, setDescriptionStyle] = useState<TextStyle>(DEFAULT_DESCRIPTION_STYLE);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [notice, setNotice] = useState<string | null>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const load = useCallback(async () => {
        const res = await fetch("/api/admin/webinars", { cache: "no-store" });
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
        data.set("speakers", speakers);
        data.set("description", description);
        data.set("speakersStyle", JSON.stringify(speakersStyle));
        data.set("descriptionStyle", JSON.stringify(descriptionStyle));
        const thumb = data.get("thumbnail");
        if (thumb instanceof File && thumb.size === 0) data.delete("thumbnail");

        try {
            const res = await fetch("/api/admin/webinars", { method: "POST", body: data });
            const body = await res.json().catch(() => ({}));
            if (!res.ok) {
                setError(body.error ?? "Could not save the webinar.");
                return;
            }
            setNotice("Saved. It now appears on the Live Webinars page.");
            formRef.current?.reset();
            setSpeakers("");
            setDescription("");
            setSpeakersStyle(DEFAULT_SPEAKERS_STYLE);
            setDescriptionStyle(DEFAULT_DESCRIPTION_STYLE);
            await load();
        } catch {
            setError("Could not reach the server. Try again.");
        } finally {
            setSubmitting(false);
        }
    }

    async function onDelete(w: Webinar) {
        if (!window.confirm(`Delete "${w.headline}"? This cannot be undone.`)) return;
        const res = await fetch(`/api/admin/webinars/${w.id}`, { method: "DELETE" });
        if (res.ok) await load();
        else setError("Could not delete that webinar.");
    }

    return (
        <div className="mx-auto max-w-4xl">
            <h1 className="text-2xl font-semibold text-secondary">Webinars</h1>
            <p className="mt-1 text-sm text-body">
                Schedule a webinar. It is shown on the Live Webinars page and removed automatically
                once its date and time have passed.
            </p>

            <form
                ref={formRef}
                onSubmit={onSubmit}
                className="mt-6 grid gap-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
            >
                <div className="grid gap-2">
                    <Label htmlFor="w-title">Title</Label>
                    <Input id="w-title" name="title" required maxLength={200} />
                </div>

                <div className="grid gap-3">
                    <Label htmlFor="w-speakers">Speakers</Label>
                    <Textarea
                        id="w-speakers"
                        rows={3}
                        value={speakers}
                        onChange={(e) => setSpeakers(e.target.value)}
                        placeholder={"Prof. Dr. A. B. Khan (Keynote)\nDr. C. Rahman (Moderator)"}
                        style={textStyleToCss(speakersStyle)}
                        className="whitespace-pre-line"
                    />
                    <TextStyleControls
                        idPrefix="speakers"
                        label="Speakers"
                        value={speakersStyle}
                        onChange={setSpeakersStyle}
                    />
                </div>

                <div className="grid gap-3">
                    <Label htmlFor="w-description">Description</Label>
                    <Textarea
                        id="w-description"
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        style={textStyleToCss(descriptionStyle)}
                        className="whitespace-pre-line"
                    />
                    <TextStyleControls
                        idPrefix="description"
                        label="Description"
                        value={descriptionStyle}
                        onChange={setDescriptionStyle}
                    />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                    <div className="grid gap-2">
                        <Label htmlFor="w-date">Date</Label>
                        <Input id="w-date" name="date" type="date" required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="w-time">Time</Label>
                        <Input id="w-time" name="time" type="time" required />
                    </div>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="w-link">Link</Label>
                    <Input id="w-link" name="link" type="url" required placeholder="https://..." />
                    <p className="text-xs text-body">Where attendees join, e.g. a Zoom or YouTube link.</p>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="w-thumb">Thumbnail image</Label>
                    <Input
                        id="w-thumb"
                        name="thumbnail"
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp"
                    />
                    <p className="text-xs text-body">JPG, PNG or WebP, up to 5 MB.</p>
                </div>

                {error && (
                    <p role="alert" className="text-sm text-destructive">
                        {error}
                    </p>
                )}
                {notice && (
                    <p role="status" className="text-sm text-green-700">
                        {notice}{" "}
                        <a
                            href="/live-webinars"
                            target="_blank"
                            rel="noopener"
                            className="underline"
                        >
                            View page
                        </a>
                    </p>
                )}

                <Button type="submit" disabled={submitting} className="justify-self-start">
                    {submitting ? "Saving..." : "Publish webinar"}
                </Button>
            </form>

            <h2 className="mt-10 text-lg font-semibold">Scheduled</h2>
            {items.length === 0 ? (
                <p className="mt-2 text-sm text-body">No webinars scheduled.</p>
            ) : (
                <ul className="mt-3 grid gap-3">
                    {items.map((w) => (
                        <li
                            key={w.id}
                            className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-3"
                        >
                            {w.thumbnail ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={w.thumbnail}
                                    alt=""
                                    className="h-14 w-20 shrink-0 rounded-md object-cover"
                                />
                            ) : (
                                <span className="flex h-14 w-20 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-400">
                                    <Video className="h-6 w-6" aria-hidden="true" />
                                </span>
                            )}
                            <div className="min-w-0 flex-1">
                                <p className="truncate font-medium">{w.headline}</p>
                                <p className="text-xs text-body">
                                    {w.date} · {w.time}
                                </p>
                            </div>
                            <a
                                href={w.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`Open link for ${w.headline}`}
                                className="p-2 text-body hover:text-secondary"
                            >
                                <ExternalLink className="h-4 w-4" />
                            </a>
                            <button
                                type="button"
                                onClick={() => onDelete(w)}
                                aria-label={`Delete ${w.headline}`}
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
