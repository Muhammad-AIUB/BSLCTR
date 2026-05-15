"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Plus, X, Trash2, Pencil, Link as LinkIcon, Check, Tag } from "lucide-react";
import ShareButtons from "@/components/ShareButtons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), { ssr: false });

interface Video {
    id: string;
    title: string;
    link: string;
    description: string;
    tags: string[];
    createdAt: string;
    status: string;
    uploadedByName?: string;
}

const emptyForm = () => ({
    title: "",
    link: "",
    description: "",
    tags: [] as string[],
});

function TagsInput({ tags, onChange }: { tags: string[]; onChange: (tags: string[]) => void }) {
    const [input, setInput] = useState("");

    const addTag = () => {
        const trimmed = input.trim();
        if (trimmed && !tags.includes(trimmed)) {
            onChange([...tags, trimmed]);
        }
        setInput("");
    };

    const removeTag = (tag: string) => onChange(tags.filter((t) => t !== tag));

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addTag();
        }
    };

    return (
        <div className="space-y-2">
            <div className="flex gap-2">
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Add a tag..."
                />
                <Button type="button" variant="outline" size="icon" onClick={addTag}>
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
            {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {tags.map((tag) => (
                        <span key={tag} className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                            <Tag className="h-3 w-3" />
                            {tag}
                            <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500 transition-colors">
                                <X className="h-3 w-3" />
                            </button>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}

function VideoForm({
    initial,
    onSave,
    onCancel,
    submitting,
    error,
}: {
    initial: ReturnType<typeof emptyForm>;
    onSave: (form: ReturnType<typeof emptyForm>) => Promise<void>;
    onCancel: () => void;
    submitting: boolean;
    error: string;
}) {
    const [form, setForm] = useState(initial);
    const set = (key: string, val: unknown) => setForm((f) => ({ ...f, [key]: val }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSave(form);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={form.title} onChange={(e) => set("title", e.target.value)} required />
            </div>
            <div className="space-y-1">
                <Label htmlFor="link">Link</Label>
                <Input id="link" type="url" value={form.link} onChange={(e) => set("link", e.target.value)}
                    placeholder="https://youtube.com/..." required />
            </div>
            <div className="space-y-1">
                <Label>Description</Label>
                <RichTextEditor
                    value={form.description}
                    onChange={(html) => set("description", html)}
                    placeholder="Enter video description..."
                />
            </div>
            <div className="space-y-1">
                <Label>Tags</Label>
                <TagsInput tags={form.tags} onChange={(tags) => set("tags", tags)} />
            </div>
            {error && <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded px-3 py-2">{error}</p>}
            <div className="flex gap-2 pt-1">
                <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>Cancel</Button>
                <Button type="submit" className="flex-1" disabled={submitting}>
                    {submitting ? "Saving..." : "Save"}
                </Button>
            </div>
        </form>
    );
}

export default function VideosPage() {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState(emptyForm());
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);

    const fetchVideos = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/videos");
            setVideos(await res.json());
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchVideos(); }, []);

    const handleAdd = async (f: ReturnType<typeof emptyForm>) => {
        setError("");
        setSubmitting(true);
        try {
            const res = await fetch("/api/admin/videos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(f),
            });
            if (!res.ok) { const d = await res.json(); setError(d.error || "Failed"); return; }
            setForm(emptyForm());
            await fetchVideos();
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = async (id: string, f: ReturnType<typeof emptyForm>) => {
        setError("");
        setSubmitting(true);
        try {
            const res = await fetch(`/api/admin/videos/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(f),
            });
            if (!res.ok) { const d = await res.json(); setError(d.error || "Failed"); return; }
            setEditingId(null);
            await fetchVideos();
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        await fetch(`/api/admin/videos/${id}`, { method: "DELETE" });
        await fetchVideos();
    };

    const handleStatus = async (id: string, status: "APPROVED" | "REJECTED") => {
        await fetch(`/api/admin/videos/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
        });
        await fetchVideos();
    };

    const pending = videos.filter((v) => v.status === "PENDING");
    const rest = videos.filter((v) => v.status !== "PENDING");

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="flex gap-6 px-6 py-8 h-full">

                {/* Left — Add Form */}
                <div className="w-96 shrink-0">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 sticky top-8">
                        <h3 className="text-base font-semibold text-slate-800 mb-4">Add Video</h3>
                        <VideoForm
                            initial={form}
                            onSave={handleAdd}
                            onCancel={() => setForm(emptyForm())}
                            submitting={submitting}
                            error={error}
                        />
                    </div>
                </div>

                {/* Right — List */}
                <div className="flex-1 min-w-0">
                    {loading ? (
                        <div className="text-center py-16 text-slate-400">Loading...</div>
                    ) : (
                        <>
                            {/* Pending Reviews */}
                            {pending.length > 0 && (
                                <div className="mb-8">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">{pending.length} Pending</span>
                                    </div>
                                    <div className="space-y-4">
                                        {pending.map((v) => (
                                            <PendingVideoCard
                                                key={v.id}
                                                video={v}
                                                onApprove={() => handleStatus(v.id, "APPROVED")}
                                                onReject={() => handleStatus(v.id, "REJECTED")}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* All Other Videos */}
                            {rest.length === 0 && pending.length === 0 ? (
                                <div className="text-center py-16 text-slate-400">No videos yet.</div>
                            ) : rest.length > 0 && (
                                <div className="space-y-4">
                                    {rest.map((v) =>
                                        editingId === v.id ? (
                                            <div key={v.id} className="bg-white rounded-xl border border-primary/40 shadow-sm p-5">
                                                <h4 className="text-sm font-semibold text-slate-700 mb-4">Edit Video</h4>
                                                <VideoForm
                                                    initial={{
                                                        title: v.title,
                                                        link: v.link,
                                                        description: v.description,
                                                        tags: v.tags,
                                                    }}
                                                    onSave={(f) => handleEdit(v.id, f)}
                                                    onCancel={() => setEditingId(null)}
                                                    submitting={submitting}
                                                    error={error}
                                                />
                                            </div>
                                        ) : (
                                            <VideoCard
                                                key={v.id}
                                                video={v}
                                                onEdit={() => setEditingId(v.id)}
                                                onDelete={() => handleDelete(v.id)}
                                            />
                                        )
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

function PendingVideoCard({ video: v, onApprove, onReject }: { video: Video; onApprove: () => void; onReject: () => void }) {
    return (
        <div className="bg-white rounded-xl border border-amber-200 shadow-sm p-5">
            <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                    <h3 className="font-semibold text-slate-800">{v.title}</h3>
                    {v.uploadedByName && (
                        <p className="text-xs text-slate-400 mt-0.5">Submitted by {v.uploadedByName}</p>
                    )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={onApprove}>
                        <Check className="h-3.5 w-3.5 mr-1" /> Approve
                    </Button>
                    <Button size="sm" variant="destructive" onClick={onReject}>
                        <X className="h-3.5 w-3.5 mr-1" /> Reject
                    </Button>
                </div>
            </div>
            <a href={v.link} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm text-primary hover:underline mb-2">
                <LinkIcon className="h-3.5 w-3.5" /> {v.link}
            </a>
            {v.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {v.tags.map((tag) => (
                        <span key={tag} className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                            <Tag className="h-3 w-3" />{tag}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}

function VideoCard({ video: v, onEdit, onDelete }: { video: Video; onEdit: () => void; onDelete: () => void }) {
    const [confirm, setConfirm] = useState(false);

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="font-semibold text-slate-800">{v.title}</h3>
                <div className="flex items-center gap-1 shrink-0">
                    {confirm ? (
                        <>
                            <Button size="sm" variant="destructive" onClick={onDelete}>
                                <Check className="h-3.5 w-3.5 mr-1" /> Confirm
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setConfirm(false)}>Cancel</Button>
                        </>
                    ) : (
                        <>
                            <Button size="sm" variant="outline" className="text-slate-600 hover:text-primary" onClick={onEdit}>
                                <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
                            </Button>
                            <Button size="sm" variant="outline" className="text-slate-400 hover:text-red-500 hover:border-red-300" onClick={() => setConfirm(true)}>
                                <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                            </Button>
                        </>
                    )}
                </div>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-slate-600 mb-3">
                <a href={v.link} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-primary hover:underline">
                    <LinkIcon className="h-3.5 w-3.5" /> Link
                </a>
            </div>

            {v.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                    {v.tags.map((tag) => (
                        <span key={tag} className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                            <Tag className="h-3 w-3" />
                            {tag}
                        </span>
                    ))}
                </div>
            )}

            {v.description && v.description !== "<p></p>" && (
                <div
                    className="prose prose-sm max-w-none text-slate-600 text-sm line-clamp-3 mb-3"
                    dangerouslySetInnerHTML={{ __html: v.description }}
                />
            )}

            <ShareButtons url={v.link} title={v.title} />
        </div>
    );
}
