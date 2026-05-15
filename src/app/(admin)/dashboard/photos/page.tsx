"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Plus, X, Trash2, Pencil, Link as LinkIcon, Check, Tag, List, PlusCircle } from "lucide-react";
import ShareButtons from "@/components/ShareButtons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), { ssr: false });

type Tab = "add" | "list";

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

function isImageUrl(url: string) {
    return /\.(jpg|jpeg|png|gif|webp|avif|svg)(\?.*)?$/i.test(url);
}

function TabToggle({ tab, onChange }: { tab: Tab; onChange: (t: Tab) => void }) {
    return (
        <div className="inline-flex items-center bg-slate-200 rounded-xl p-1 gap-1 mb-6">
            <button
                onClick={() => onChange("add")}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                    tab === "add" ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
            >
                <PlusCircle className="h-4 w-4" /> Add
            </button>
            <button
                onClick={() => onChange("list")}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                    tab === "list" ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
            >
                <List className="h-4 w-4" /> List View
            </button>
        </div>
    );
}

function TagsInput({ tags, onChange }: { tags: string[]; onChange: (tags: string[]) => void }) {
    const [input, setInput] = useState("");
    const addTag = () => {
        const trimmed = input.trim();
        if (trimmed && !tags.includes(trimmed)) onChange([...tags, trimmed]);
        setInput("");
    };
    const removeTag = (tag: string) => onChange(tags.filter((t) => t !== tag));
    return (
        <div className="space-y-2">
            <div className="flex gap-2">
                <Input value={input} onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                    placeholder="Add a tag..." />
                <Button type="button" variant="outline" size="icon" onClick={addTag}><Plus className="h-4 w-4" /></Button>
            </div>
            {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {tags.map((tag) => (
                        <span key={tag} className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                            <Tag className="h-3 w-3" />{tag}
                            <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500"><X className="h-3 w-3" /></button>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}

function PhotoForm({ initial, onSave, onCancel, submitting, error, editMode }: {
    initial: ReturnType<typeof emptyForm>;
    onSave: (form: ReturnType<typeof emptyForm>) => Promise<void>;
    onCancel: () => void;
    submitting: boolean;
    error: string;
    editMode?: boolean;
}) {
    const [form, setForm] = useState(initial);
    const [uploading, setUploading] = useState(false);
    const set = (key: string, val: unknown) => setForm((f) => ({ ...f, [key]: val }));

    const handleFileUpload = async (file: File | null) => {
        if (!file) return;
        setUploading(true);
        try {
            const fd = new FormData(); fd.append("file", file);
            const res = await fetch("/api/upload", { method: "POST", body: fd });
            const data = await res.json();
            set("link", data.url);
        } finally { setUploading(false); }
    };

    return (
        <form onSubmit={async (e) => { e.preventDefault(); await onSave(form); }} className="space-y-4">
            <div className="space-y-1">
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={form.title} onChange={(e) => set("title", e.target.value)} required />
            </div>
            <div className="space-y-1">
                <Label>Photo Link or Upload</Label>
                <Input type="url" value={form.link} onChange={(e) => set("link", e.target.value)} placeholder="https://..." />
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-400">or upload:</span>
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e.target.files?.[0] ?? null)}
                        className="block text-xs text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer" />
                    {uploading && <span className="text-xs text-slate-400">Uploading...</span>}
                </div>
                {form.link && (
                    <div className="mt-2">
                        <img src={form.link} alt="Preview" className="h-20 w-auto object-cover rounded border border-slate-200"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    </div>
                )}
            </div>
            <div className="space-y-1">
                <Label>Description</Label>
                <RichTextEditor value={form.description} onChange={(html) => set("description", html)} placeholder="Enter photo description..." />
            </div>
            <div className="space-y-1">
                <Label>Tags</Label>
                <TagsInput tags={form.tags} onChange={(tags) => set("tags", tags)} />
            </div>
            {error && <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded px-3 py-2">{error}</p>}
            <div className="flex gap-2 pt-1">
                <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>{editMode ? "Cancel" : "Reset"}</Button>
                <Button type="submit" className="flex-1" disabled={submitting || uploading}>{submitting ? "Saving..." : editMode ? "Update" : "Add Photo"}</Button>
            </div>
        </form>
    );
}

export default function PhotosPage() {
    const [tab, setTab] = useState<Tab>("add");
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState(emptyForm());
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<ReturnType<typeof emptyForm> | null>(null);

    const fetchPhotos = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/photos");
            setPhotos(await res.json());
        } finally { setLoading(false); }
    };

    useEffect(() => { fetchPhotos(); }, []);

    const handleAdd = async (f: ReturnType<typeof emptyForm>) => {
        setError(""); setSubmitting(true);
        try {
            const res = await fetch("/api/admin/photos", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) });
            if (!res.ok) { const d = await res.json(); setError(d.error || "Failed"); return; }
            setForm(emptyForm());
            await fetchPhotos();
            setTab("list");
        } finally { setSubmitting(false); }
    };

    const handleEdit = async (id: string, f: ReturnType<typeof emptyForm>) => {
        setError(""); setSubmitting(true);
        try {
            const res = await fetch(`/api/admin/photos/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) });
            if (!res.ok) { const d = await res.json(); setError(d.error || "Failed"); return; }
            setEditingId(null); setEditForm(null);
            await fetchPhotos();
            setTab("list");
        } finally { setSubmitting(false); }
    };

    const handleDelete = async (id: string) => {
        await fetch(`/api/admin/photos/${id}`, { method: "DELETE" });
        await fetchPhotos();
    };

    const handleStatus = async (id: string, status: "APPROVED" | "REJECTED") => {
        await fetch(`/api/admin/photos/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
        await fetchPhotos();
    };

    const startEdit = (p: Photo) => {
        setEditingId(p.id);
        setEditForm({ title: p.title, link: p.link, description: p.description, tags: p.tags });
        setTab("add");
    };

    const cancelEdit = () => { setEditingId(null); setEditForm(null); setError(""); };

    const pending = photos.filter((p) => p.status === "PENDING");
    const rest = photos.filter((p) => p.status !== "PENDING");

    return (
        <div className="min-h-screen bg-slate-50 px-6 py-8">
            <TabToggle tab={tab} onChange={(t) => { setTab(t); if (t === "list") cancelEdit(); }} />

            {tab === "add" && (
                <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <h3 className="text-base font-semibold text-slate-800 mb-5">{editingId ? "Edit Photo" : "Add Photo"}</h3>
                    <PhotoForm
                        key={editingId ?? "new"}
                        initial={editForm ?? form}
                        onSave={editingId ? (f) => handleEdit(editingId, f) : handleAdd}
                        onCancel={editingId ? cancelEdit : () => setForm(emptyForm())}
                        submitting={submitting}
                        error={error}
                        editMode={!!editingId}
                    />
                </div>
            )}

            {tab === "list" && (
                <div className="max-w-4xl mx-auto">
                    {loading ? (
                        <div className="text-center py-16 text-slate-400">Loading...</div>
                    ) : (
                        <>
                            {pending.length > 0 && (
                                <div className="mb-6 space-y-4">
                                    {pending.map((p) => (
                                        <PendingPhotoCard key={p.id} photo={p}
                                            onApprove={() => handleStatus(p.id, "APPROVED")}
                                            onReject={() => handleStatus(p.id, "REJECTED")} />
                                    ))}
                                </div>
                            )}
                            {rest.length === 0 && pending.length === 0 ? (
                                <div className="text-center py-16 text-slate-400">No photos yet.</div>
                            ) : (
                                <div className="space-y-4">
                                    {rest.map((p) => (
                                        <PhotoCard key={p.id} photo={p}
                                            onEdit={() => startEdit(p)}
                                            onDelete={() => handleDelete(p.id)} />
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

function PendingPhotoCard({ photo: p, onApprove, onReject }: { photo: Photo; onApprove: () => void; onReject: () => void }) {
    return (
        <div className="bg-white rounded-xl border border-amber-200 shadow-sm p-5">
            <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                    <h3 className="font-semibold text-slate-800">{p.title}</h3>
                    {p.uploadedByName && <p className="text-xs text-slate-400 mt-0.5">Submitted by {p.uploadedByName}</p>}
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
                            <Button size="sm" variant="destructive" onClick={onDelete}><Check className="h-3.5 w-3.5 mr-1" /> Confirm</Button>
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
                <a href={p.link} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm text-primary hover:underline mb-3">
                    <LinkIcon className="h-3.5 w-3.5" /> Link
                </a>
            )}
            {p.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                    {p.tags.map((tag) => (
                        <span key={tag} className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                            <Tag className="h-3 w-3" />{tag}
                        </span>
                    ))}
                </div>
            )}
            {p.description && p.description !== "<p></p>" && (
                <div className="prose prose-sm max-w-none text-slate-600 text-sm line-clamp-3 mb-3" dangerouslySetInnerHTML={{ __html: p.description }} />
            )}
            <ShareButtons url={p.link} title={p.title} />
        </div>
    );
}
