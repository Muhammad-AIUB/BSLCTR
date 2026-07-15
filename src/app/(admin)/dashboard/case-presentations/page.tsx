"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Plus, X, Trash2, Pencil, Check, Tag, FileText, List, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), { ssr: false });

type Tab = "add" | "list";

interface CasePresentation {
    id: string;
    title: string;
    files: string[];
    description: string;
    tags: string[];
    createdAt: string;
}

const emptyForm = () => ({
    title: "",
    files: [] as string[],
    description: "",
    tags: [] as string[],
});

const isPptUrl = (url: string) => /\.pptx?([?#]|$)/i.test(url);

function TabToggle({ tab, onChange }: { tab: Tab; onChange: (t: Tab) => void }) {
    return (
        <div className="inline-flex items-center bg-slate-200 rounded-xl p-1 gap-1 mb-6">
            <button onClick={() => onChange("add")}
                className={`flex items-center gap-2 px-5 py-2 rounded-md text-sm font-semibold transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 ${tab === "add" ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                <PlusCircle className="h-4 w-4" /> Add
            </button>
            <button onClick={() => onChange("list")}
                className={`flex items-center gap-2 px-5 py-2 rounded-md text-sm font-semibold transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 ${tab === "list" ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                <List className="h-4 w-4" /> List View
            </button>
        </div>
    );
}

function TagsInput({ tags, onChange }: { tags: string[]; onChange: (t: string[]) => void }) {
    const [input, setInput] = useState("");
    const add = () => {
        const t = input.trim();
        if (t && !tags.includes(t)) onChange([...tags, t]);
        setInput("");
    };
    return (
        <div className="space-y-2">
            <div className="flex gap-2">
                <Input value={input} onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
                    placeholder="Add a tag..." />
                <Button type="button" variant="outline" size="icon" onClick={add}>
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
            {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {tags.map(t => (
                        <span key={t} className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                            <Tag className="h-3 w-3" />{t}
                            <button type="button" onClick={() => onChange(tags.filter(x => x !== t))} className="outline-none focus-visible:ring-2 focus-visible:ring-destructive/40 focus-visible:ring-offset-2"><X className="h-3 w-3 hover:text-red-500 transition-colors" /></button>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}

function FilesField({ files, onChange }: { files: string[]; onChange: (f: string[]) => void }) {
    const [uploading, setUploading] = useState<number | null>(null);

    const uploadFile = async (file: File, index: number) => {
        setUploading(index);
        try {
            const fd = new FormData();
            fd.append("file", file);
            const res = await fetch("/api/upload", { method: "POST", body: fd });
            const data = await res.json();
            const updated = [...files];
            updated[index] = data.url;
            onChange(updated);
        } finally { setUploading(null); }
    };

    const addEntry = () => onChange([...files, ""]);
    const removeEntry = (i: number) => onChange(files.filter((_, idx) => idx !== i));
    const updateUrl = (i: number, val: string) => {
        const updated = [...files];
        updated[i] = val;
        onChange(updated);
    };

    const getFileType = (url: string) => (isPptUrl(url) ? "PPT" : "PDF");

    return (
        <div className="space-y-2">
            {files.map((file, i) => (
                <div key={i} className="border border-slate-200 rounded-xl p-3 space-y-2 bg-slate-50">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                            <FileText className="h-3 w-3" /> File {i + 1}
                        </span>
                        <button type="button" onClick={() => removeEntry(i)} className="text-red-400 hover:text-red-600 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-destructive/40 focus-visible:ring-offset-2">
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                    <Input
                        value={file}
                        onChange={e => updateUrl(i, e.target.value)}
                        placeholder="Paste PDF or PPT URL..."
                        className="text-sm"
                    />
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs text-slate-500">or upload:</span>
                        <input
                            type="file"
                            accept=".pdf,.ppt,.pptx"
                            onChange={e => { const f = e.target.files?.[0]; if (f) uploadFile(f, i); }}
                            className="block max-w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                        />
                        {uploading === i && <span className="text-xs text-slate-500">Uploading...</span>}
                    </div>
                    {file && (
                        <a href={file} target="_blank" rel="noreferrer"
                            className="text-xs text-primary hover:underline flex items-center gap-1 outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2">
                            <FileText className="h-3 w-3" /> View {getFileType(file)}
                        </a>
                    )}
                </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={addEntry} className="w-full border-dashed">
                <Plus className="h-4 w-4 mr-1" /> Add PDF / PPT
            </Button>
        </div>
    );
}

function CaseForm({ initial, onSave, onCancel, submitting, error, editMode }: {
    initial: ReturnType<typeof emptyForm>;
    onSave: (f: ReturnType<typeof emptyForm>) => Promise<void>;
    onCancel: () => void;
    submitting: boolean;
    error: string;
    editMode?: boolean;
}) {
    const [form, setForm] = useState(initial);
    const set = (key: string, val: unknown) => setForm(f => ({ ...f, [key]: val }));

    return (
        <form onSubmit={async e => { e.preventDefault(); await onSave(form); }} className="space-y-5">
            <div className="space-y-1">
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={form.title} onChange={e => set("title", e.target.value)}
                    placeholder="Case presentation title..." required />
            </div>

            <div className="space-y-2">
                <Label>Upload <span className="text-slate-500 text-xs">(PDF / PPT)</span></Label>
                <FilesField files={form.files} onChange={v => set("files", v)} />
            </div>

            <div className="space-y-2">
                <Label>Description</Label>
                <RichTextEditor
                    value={form.description}
                    onChange={html => set("description", html)}
                    placeholder="Enter case description..."
                />
            </div>

            <div className="space-y-2">
                <Label>Tags</Label>
                <TagsInput tags={form.tags} onChange={v => set("tags", v)} />
            </div>

            {error && <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded px-3 py-2">{error}</p>}

            <div className="flex gap-2 pt-1">
                <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
                    {editMode ? "Cancel" : "Reset"}
                </Button>
                <Button type="submit" className="flex-1" disabled={submitting}>
                    {submitting ? "Saving..." : editMode ? "Update" : "Add Case"}
                </Button>
            </div>
        </form>
    );
}

export default function CasePresentationsPage() {
    const [tab, setTab] = useState<Tab>("add");
    const [cases, setCases] = useState<CasePresentation[]>([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState(emptyForm());
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<ReturnType<typeof emptyForm> | null>(null);

    const fetchCases = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/case-presentations");
            setCases(await res.json());
        } finally { setLoading(false); }
    };

    useEffect(() => { fetchCases(); }, []);

    const handleAdd = async (f: ReturnType<typeof emptyForm>) => {
        setError(""); setSubmitting(true);
        try {
            const res = await fetch("/api/admin/case-presentations", {
                method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f),
            });
            if (!res.ok) { const d = await res.json(); setError(d.error || "Failed"); return; }
            setForm(emptyForm());
            await fetchCases();
            setTab("list");
        } finally { setSubmitting(false); }
    };

    const handleEdit = async (id: string, f: ReturnType<typeof emptyForm>) => {
        setError(""); setSubmitting(true);
        try {
            const res = await fetch(`/api/admin/case-presentations/${id}`, {
                method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f),
            });
            if (!res.ok) { const d = await res.json(); setError(d.error || "Failed"); return; }
            setEditingId(null); setEditForm(null);
            await fetchCases();
            setTab("list");
        } finally { setSubmitting(false); }
    };

    const handleDelete = async (id: string) => {
        await fetch(`/api/admin/case-presentations/${id}`, { method: "DELETE" });
        await fetchCases();
    };

    const startEdit = (c: CasePresentation) => {
        setEditingId(c.id);
        setEditForm({ title: c.title, files: c.files, description: c.description, tags: c.tags });
        setTab("add");
    };

    const cancelEdit = () => { setEditingId(null); setEditForm(null); setError(""); };

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 sm:py-8">
            <TabToggle tab={tab} onChange={t => { setTab(t); if (t === "list") cancelEdit(); }} />

            {tab === "add" && (
                <div className="max-w-2xl mx-auto bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <h3 className="text-base font-semibold text-slate-800 mb-5">
                        {editingId ? "Edit Case Presentation" : "Add Case Presentation"}
                    </h3>
                    <CaseForm
                        key={editingId ?? "new"}
                        initial={editForm ?? form}
                        onSave={editingId ? f => handleEdit(editingId, f) : handleAdd}
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
                        <div className="text-center py-16 text-slate-500">Loading...</div>
                    ) : cases.length === 0 ? (
                        <div className="text-center py-16 text-slate-500">No case presentations yet.</div>
                    ) : (
                        <div className="space-y-4">
                            {cases.map(c => (
                                <CaseCard key={c.id} caseItem={c}
                                    onEdit={() => startEdit(c)}
                                    onDelete={() => handleDelete(c.id)} />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function CaseCard({ caseItem: c, onEdit, onDelete }: { caseItem: CasePresentation; onEdit: () => void; onDelete: () => void }) {
    const [confirm, setConfirm] = useState(false);

    const getFileLabel = (url: string, i: number) => (isPptUrl(url) ? `PPT ${i + 1}` : `PDF ${i + 1}`);

    const getFileColor = (url: string) =>
        isPptUrl(url)
            ? "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100"
            : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100";

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3 mb-3">
                <h3 className="font-semibold text-slate-800 min-w-0 break-words">{c.title}</h3>
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
                            <Button size="sm" variant="outline" className="text-slate-500 hover:text-red-500 hover:border-red-300" onClick={() => setConfirm(true)}>
                                <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {c.files.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                    {c.files.map((f, i) => (
                        <a key={i} href={f} target="_blank" rel="noreferrer"
                            className={`inline-flex items-center gap-1.5 text-xs border px-3 py-1.5 rounded-md transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 ${getFileColor(f)}`}>
                            <FileText className="h-3.5 w-3.5" /> {getFileLabel(f, i)}
                        </a>
                    ))}
                </div>
            )}

            {c.description && c.description !== "<p></p>" && (
                <div className="prose prose-sm max-w-none text-slate-600 text-sm line-clamp-3 mb-3"
                    dangerouslySetInnerHTML={{ __html: c.description }} />
            )}

            {c.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {c.tags.map(t => (
                        <span key={t} className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                            <Tag className="h-3 w-3" />{t}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}
