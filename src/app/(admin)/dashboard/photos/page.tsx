"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Plus, X, Trash2, Pencil, Link as LinkIcon, Check, Tag } from "lucide-react";
import ShareButtons from "@/components/ShareButtons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), { ssr: false });

interface Photo {
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

function PhotoForm({
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
    const [uploading, setUploading] = useState(false);
    const set = (key: string, val: unknown) => setForm((f) => ({ ...f, [key]: val }));

    const handleFileUpload = async (file: File | null) => {
        if (!file) return;
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append("file", file);
            const res = await fetch("/api/upload", { method: "POST", body: fd });
            const data = await res.json();
            set("link", data.url);
        } finally {
            setUploading(false);
        }
    };

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
                <Label>Photo Link or Upload</Label>
                <Input
                    type="url"
                    value={form.link}
                    onChange={(e) => set("link", e.target.value)}
                    placeholder="https://..."
                />
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-400">or upload:</span>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e.target.files?.[0] ?? null)}
                        className="block text-xs text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                    />
                    {uploading && <span className="text-xs text-slate-400">Uploading...</span>}
                </div>
                {form.link && (
                    <div className="mt-2">
                        <img src={form.link} alt="Preview" className="h-20 w-auto object-cover rounded border border-slate-200" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    </div>
                )}
            </div>
            <div className="space-y-1">
                <Label>Description</Label>
                <RichTextEditor
                    value={form.description}
                    onChange={(html) => set("description", html)}
                    placeholder="Enter photo description..."
                />
            </div>
            <div className="space-y-1">
                <Label>Tags</Label>
                <TagsInput tags={form.tags} onChange={(tags) => set("tags", tags)} />
            </div>
            {error && <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded px-3 py-2">{error}</p>}
            <div className="flex gap-2 pt-1">
                <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>Cancel</Button>
                <Button type="submit" className="flex-1" disabled={submitting || uploading}>
                    {submitting ? "Saving..." : "Save"}
                </Button>
            </div>
        </form>
    );
}

export default function PhotosPage() {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState(emptyForm());
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);

    const fetchPhotos = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/photos");
            setPhotos(await res.json());
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPhotos(); }, []);

    const handleAdd = async (f: ReturnType<typeof emptyForm>) => {
        setError("");
        setSubmitting(true);
        try {
            const res = await fetch("/api/admin/photos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(f),
            });
            if (!res.ok) { const d = await res.json(); setError(d.error || "Failed"); return; }
            setForm(emptyForm());
            await fetchPhotos();
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = async (id: string, f: ReturnType<typeof emptyForm>) => {
        setError("");
        setSubmitting(true);
        try {
            const res = await fetch(`/api/admin/photos/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(f),
            });
            if (!res.ok) { const d = await res.json(); setError(d.error || "Failed"); return; }
            setEditingId(null);
            await fetchPhotos();
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        await fetch(`/api/admin/photos/${id}`, { method: "DELETE" });
        await fetchPhotos();
    };

    const handleStatus = async (id: string, status: "APPROVED" | "REJECTED") => {
        await fetch(`/api/admin/photos/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
        });
        await fetchPhotos();
    };

    const pending = photos.filter((p) => p.status === "PENDING");
    const rest = photos.filter((p) => p.status !== "PENDING");

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="flex gap-6 px-6 py-8 h-full">

                {/* Left — Add Form */}
                <div className="w-96 shrink-0">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 sticky top-8">
                        <h3 className="text-base font-semibold text-slate-800 mb-4">Add Photo</h3>
                        <PhotoForm
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
                                        {pending.map((p) => (
                                            <PendingPhotoCard
                                                key={p.id}
                                                photo={p}
                                                onApprove={() => handleStatus(p.id, "APPROVED")}
                                                onReject={() => handleStatus(p.id, "REJECTED")}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* All Other Photos */}
                            {rest.length === 0 && pending.length === 0 ? (
                                <div className="text-center py-16 text-slate-400">No photos yet.</div>
                            ) : rest.length > 0 && (
                                <div className="space-y-4">
                                    {rest.map((p) =>
                                        editingId === p.id ? (
                                            <div key={p.id} className="bg-white rounded-xl border border-primary/40 shadow-sm p-5">
                                                <h4 className="text-sm font-semibold text-slate-700 mb-4">Edit Photo</h4>
                                                <PhotoForm
                                                    initial={{
                                                        title: p.title,
                                                        link: p.link,
                                                        description: p.description,
                                                        tags: p.tags,
                                                    }}
                                                    onSave={(f) => handleEdit(p.id, f)}
                                                    onCancel={() => setEditingId(null)}
                                                    submitting={submitting}
                                                    error={error}
                                                />
                                            </div>
                                        ) : (
                                            <PhotoCard
                                                key={p.id}
                                                photo={p}
                                                onEdit={() => setEditingId(p.id)}
                                                onDelete={() => handleDelete(p.id)}
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

function isImageUrl(url: string) {
    return /\.(jpg|jpeg|png|gif|webp|avif|svg)(\?.*)?$/i.test(url);
}

function PendingPhotoCard({ photo: p, onApprove, onReject }: { photo: Photo; onApprove: () => void; onReject: () => void }) {
    return (
        <div className="bg-white rounded-xl border border-amber-200 shadow-sm p-5">
            <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                    <h3 className="font-semibold text-slate-800">{p.title}</h3>
                    {p.uploadedByName && (
                        <p className="text-xs text-slate-400 mt-0.5">Submitted by {p.uploadedByName}</p>
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
            {p.link && isImageUrl(p.link) && (
                <div className="mb-2">
                    <img src={p.link} alt={p.title} className="h-32 w-auto object-cover rounded-lg border border-slate-200" />
                </div>
            )}
            {p.link && !isImageUrl(p.link) && (
                <a href={p.link} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm text-primary hover:underline mb-2">
                    <LinkIcon className="h-3.5 w-3.5" /> {p.link}
                </a>
            )}
            {p.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {p.tags.map((tag) => (
                        <span key={tag} className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                            <Tag className="h-3 w-3" />{tag}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}

function PhotoCard({ photo: p, onEdit, onDelete }: { photo: Photo; onEdit: () => void; onDelete: () => void }) {
    const [confirm, setConfirm] = useState(false);

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="font-semibold text-slate-800">{p.title}</h3>
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

            {p.link && isImageUrl(p.link) && (
                <div className="mb-3">
                    <img src={p.link} alt={p.title} className="h-32 w-auto object-cover rounded-lg border border-slate-200" />
                </div>
            )}

            {p.link && !isImageUrl(p.link) && (
                <div className="mb-3">
                    <a href={p.link} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm text-primary hover:underline">
                        <LinkIcon className="h-3.5 w-3.5" /> Link
                    </a>
                </div>
            )}

            {p.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                    {p.tags.map((tag) => (
                        <span key={tag} className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                            <Tag className="h-3 w-3" />
                            {tag}
                        </span>
                    ))}
                </div>
            )}

            {p.description && p.description !== "<p></p>" && (
                <div
                    className="prose prose-sm max-w-none text-slate-600 text-sm line-clamp-3 mb-3"
                    dangerouslySetInnerHTML={{ __html: p.description }}
                />
            )}

            <ShareButtons url={p.link} title={p.title} />
        </div>
    );
}
