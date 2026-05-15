"use client";

import { useEffect, useState } from "react";
import { Plus, X, Trash2, Pencil, Link as LinkIcon, Calendar, Clock, Check, List, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Sponsor { name: string; logo: string; }
interface Webinar {
    id: string;
    headline: string;
    date: string;
    time: string;
    link: string;
    keynoteSpeakers: string[];
    moderators: string[];
    chairpersons: string[];
    coChairmen: string[];
    sponsors: Sponsor[];
    createdAt: string;
}

type Tab = "add" | "list";

const emptyForm = () => ({
    headline: "",
    date: "",
    time: "",
    link: "",
    keynoteSpeakers: [""],
    moderators: [""],
    chairpersons: [""],
    coChairmen: [""],
    sponsors: [{ name: "", logo: "" }] as Sponsor[],
});

function TabToggle({ tab, onChange }: { tab: Tab; onChange: (t: Tab) => void }) {
    return (
        <div className="inline-flex items-center bg-slate-200 rounded-xl p-1 gap-1 mb-6">
            <button
                onClick={() => onChange("add")}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                    tab === "add"
                        ? "bg-white text-primary shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                }`}
            >
                <PlusCircle className="h-4 w-4" /> Add
            </button>
            <button
                onClick={() => onChange("list")}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                    tab === "list"
                        ? "bg-white text-primary shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                }`}
            >
                <List className="h-4 w-4" /> List View
            </button>
        </div>
    );
}

function MultiField({ label, values, onChange }: { label: string; values: string[]; onChange: (v: string[]) => void }) {
    const update = (i: number, v: string) => onChange(values.map((x, idx) => (idx === i ? v : x)));
    const add = () => onChange([...values, ""]);
    const remove = (i: number) => onChange(values.filter((_, idx) => idx !== i));
    return (
        <div className="space-y-1">
            <Label>{label}</Label>
            <div className="space-y-2">
                {values.map((v, i) => (
                    <div key={i} className="flex gap-2">
                        <Input value={v} onChange={(e) => update(i, e.target.value)} />
                        {values.length > 1 && (
                            <Button type="button" variant="outline" size="icon" onClick={() => remove(i)}>
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={add}>
                    <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
            </div>
        </div>
    );
}

function SponsorField({ sponsors, onChange }: { sponsors: Sponsor[]; onChange: (s: Sponsor[]) => void }) {
    const update = (i: number, key: keyof Sponsor, v: string) =>
        onChange(sponsors.map((s, idx) => (idx === i ? { ...s, [key]: v } : s)));
    const add = () => onChange([...sponsors, { name: "", logo: "" }]);
    const remove = (i: number) => onChange(sponsors.filter((_, idx) => idx !== i));

    const handleLogoFile = async (i: number, file: File | null) => {
        if (!file) return;
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        update(i, "logo", data.url);
    };

    return (
        <div className="space-y-1">
            <Label>Sponsor</Label>
            <div className="space-y-3">
                {sponsors.map((s, i) => (
                    <div key={i} className="border rounded-lg p-3 space-y-2 bg-slate-50">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-500 font-medium">Sponsor {i + 1}</span>
                            <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-red-400 hover:text-red-600" onClick={() => remove(i)}>
                                <X className="h-3 w-3" />
                            </Button>
                        </div>
                        <Input placeholder="Sponsor name" value={s.name} onChange={(e) => update(i, "name", e.target.value)} />
                        <div className="space-y-1">
                            <span className="text-xs text-slate-500">Logo (optional)</span>
                            {s.logo && <img src={s.logo} alt="logo" className="h-10 object-contain mb-1" />}
                            <input type="file" accept="image/*"
                                onChange={(e) => handleLogoFile(i, e.target.files?.[0] ?? null)}
                                className="block w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                            />
                        </div>
                    </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={add}>
                    <Plus className="h-4 w-4 mr-1" /> Add Sponsor
                </Button>
            </div>
        </div>
    );
}

function WebinarForm({
    initial,
    onSave,
    onCancel,
    submitting,
    error,
    editMode,
}: {
    initial: ReturnType<typeof emptyForm>;
    onSave: (form: ReturnType<typeof emptyForm>) => Promise<void>;
    onCancel: () => void;
    submitting: boolean;
    error: string;
    editMode?: boolean;
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
                <Label htmlFor="headline">Headline</Label>
                <Input id="headline" value={form.headline} onChange={(e) => set("headline", e.target.value)} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" type="date" value={form.date} onChange={(e) => set("date", e.target.value)} required />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="time">Time</Label>
                    <Input id="time" type="time" value={form.time} onChange={(e) => set("time", e.target.value)} required />
                </div>
            </div>
            <div className="space-y-1">
                <Label htmlFor="link">Link</Label>
                <Input id="link" type="url" value={form.link} onChange={(e) => set("link", e.target.value)}
                    placeholder="https://zoom.us/... or YouTube, Facebook..." required />
            </div>
            <MultiField label="Keynote Speaker" values={form.keynoteSpeakers} onChange={(v) => set("keynoteSpeakers", v)} />
            <MultiField label="Moderator" values={form.moderators} onChange={(v) => set("moderators", v)} />
            <MultiField label="Chairperson" values={form.chairpersons} onChange={(v) => set("chairpersons", v)} />
            <MultiField label="Co-Chairman" values={form.coChairmen} onChange={(v) => set("coChairmen", v)} />
            <SponsorField sponsors={form.sponsors} onChange={(v) => set("sponsors", v)} />
            {error && <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded px-3 py-2">{error}</p>}
            <div className="flex gap-2 pt-1">
                <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
                    {editMode ? "Cancel" : "Reset"}
                </Button>
                <Button type="submit" className="flex-1" disabled={submitting}>
                    {submitting ? "Saving..." : editMode ? "Update" : "Add Webinar"}
                </Button>
            </div>
        </form>
    );
}

export default function WebinarsPage() {
    const [tab, setTab] = useState<Tab>("add");
    const [webinars, setWebinars] = useState<Webinar[]>([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState(emptyForm());
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<ReturnType<typeof emptyForm> | null>(null);

    const fetchWebinars = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/webinars");
            setWebinars(await res.json());
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchWebinars(); }, []);

    const handleAdd = async (f: ReturnType<typeof emptyForm>) => {
        setError("");
        setSubmitting(true);
        try {
            const payload = {
                ...f,
                keynoteSpeakers: f.keynoteSpeakers.filter(Boolean),
                moderators: f.moderators.filter(Boolean),
                chairpersons: f.chairpersons.filter(Boolean),
                coChairmen: f.coChairmen.filter(Boolean),
                sponsors: f.sponsors.filter((s) => s.name.trim()),
            };
            const res = await fetch("/api/admin/webinars", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) { const d = await res.json(); setError(d.error || "Failed"); return; }
            setForm(emptyForm());
            await fetchWebinars();
            setTab("list");
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = async (id: string, f: ReturnType<typeof emptyForm>) => {
        setError("");
        setSubmitting(true);
        try {
            const payload = {
                ...f,
                keynoteSpeakers: f.keynoteSpeakers.filter(Boolean),
                moderators: f.moderators.filter(Boolean),
                chairpersons: f.chairpersons.filter(Boolean),
                coChairmen: f.coChairmen.filter(Boolean),
                sponsors: f.sponsors.filter((s) => s.name.trim()),
            };
            const res = await fetch(`/api/admin/webinars/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) { const d = await res.json(); setError(d.error || "Failed"); return; }
            setEditingId(null);
            setEditForm(null);
            await fetchWebinars();
            setTab("list");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        await fetch(`/api/admin/webinars/${id}`, { method: "DELETE" });
        await fetchWebinars();
    };

    const startEdit = (w: Webinar) => {
        setEditingId(w.id);
        setEditForm({
            headline: w.headline,
            date: w.date,
            time: w.time,
            link: w.link,
            keynoteSpeakers: w.keynoteSpeakers.length ? w.keynoteSpeakers : [""],
            moderators: w.moderators.length ? w.moderators : [""],
            chairpersons: w.chairpersons.length ? w.chairpersons : [""],
            coChairmen: w.coChairmen.length ? w.coChairmen : [""],
            sponsors: w.sponsors.length ? w.sponsors : [{ name: "", logo: "" }],
        });
        setTab("add");
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditForm(null);
        setError("");
    };

    return (
        <div className="min-h-screen bg-slate-50 px-6 py-8">
            <TabToggle tab={tab} onChange={(t) => { setTab(t); if (t === "add" && !editingId) { setError(""); } if (t === "list") cancelEdit(); }} />

            {tab === "add" && (
                <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <h3 className="text-base font-semibold text-slate-800 mb-5">
                        {editingId ? "Edit Webinar" : "Add Webinar"}
                    </h3>
                    <WebinarForm
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
                    ) : webinars.length === 0 ? (
                        <div className="text-center py-16 text-slate-400">No webinars yet.</div>
                    ) : (
                        <div className="space-y-4">
                            {webinars.map((w) => (
                                <WebinarCard
                                    key={w.id}
                                    webinar={w}
                                    onEdit={() => startEdit(w)}
                                    onDelete={() => handleDelete(w.id)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function WebinarCard({ webinar: w, onEdit, onDelete }: { webinar: Webinar; onEdit: () => void; onDelete: () => void }) {
    const [confirm, setConfirm] = useState(false);

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="font-semibold text-slate-800">{w.headline}</h3>
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
                <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{w.date}</span>
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{w.time}</span>
                <a href={w.link} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-primary hover:underline">
                    <LinkIcon className="h-3.5 w-3.5" /> Link
                </a>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm mb-3">
                {w.keynoteSpeakers.length > 0 && <InfoRow label="Keynote Speaker" values={w.keynoteSpeakers} />}
                {w.moderators.length > 0 && <InfoRow label="Moderator" values={w.moderators} />}
                {w.chairpersons.length > 0 && <InfoRow label="Chairperson" values={w.chairpersons} />}
                {w.coChairmen.length > 0 && <InfoRow label="Co-Chairman" values={w.coChairmen} />}
            </div>

            {w.sponsors.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                    {w.sponsors.map((s, i) => (
                        <div key={i} className="flex items-center gap-2 bg-slate-50 border rounded-lg px-3 py-1.5">
                            {s.logo && <img src={s.logo} alt={s.name} className="h-5 object-contain" />}
                            <span className="text-sm text-slate-700">{s.name}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function InfoRow({ label, values }: { label: string; values: string[] }) {
    return (
        <div className="col-span-2 sm:col-span-1">
            <span className="font-medium text-slate-600">{label}: </span>
            <span className="text-slate-700">{values.join(", ")}</span>
        </div>
    );
}
