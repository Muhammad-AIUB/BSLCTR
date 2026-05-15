"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, Link as LinkIcon, LogOut, Radio, Video, ImageIcon, Tag, Plus, X, Clock3, CheckCircle2, XCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import ShareButtons from "@/components/ShareButtons";
import dynamic from "next/dynamic";

const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), { ssr: false });

interface Sponsor { name: string; logo: string; }
interface Webinar {
    id: string; headline: string; date: string; time: string; link: string;
    keynoteSpeakers: string[]; moderators: string[]; chairpersons: string[]; coChairmen: string[]; sponsors: Sponsor[];
}
interface VideoItem { id: string; title: string; link: string; description: string; tags: string[]; status: string; }
interface PhotoItem { id: string; title: string; link: string; description: string; tags: string[]; status: string; }

type Tab = "webinars" | "videos" | "photos";

function isImageUrl(url: string) {
    return /\.(jpg|jpeg|png|gif|webp|avif|svg)(\?.*)?$/i.test(url);
}

function StatusBadge({ status }: { status: string }) {
    if (status === "APPROVED") return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
            <CheckCircle2 className="h-3 w-3" /> Approved
        </span>
    );
    if (status === "REJECTED") return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
            <XCircle className="h-3 w-3" /> Rejected
        </span>
    );
    return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
            <Clock3 className="h-3 w-3" /> Pending Review
        </span>
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
        <div className="space-y-1.5">
            <div className="flex gap-2">
                <input value={input} onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
                    placeholder="Add tag..." className="flex-1 border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                <button type="button" onClick={add} className="border border-slate-200 rounded-lg px-2.5 hover:bg-slate-50">
                    <Plus className="h-4 w-4 text-slate-500" />
                </button>
            </div>
            {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {tags.map(t => (
                        <span key={t} className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                            <Tag className="h-3 w-3" />{t}
                            <button type="button" onClick={() => onChange(tags.filter(x => x !== t))}><X className="h-3 w-3 hover:text-red-500" /></button>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function MemberDashboard() {
    const router = useRouter();
    const [member, setMember] = useState<{ name: string; email: string } | null>(null);
    const [activeTab, setActiveTab] = useState<Tab>("webinars");

    const [webinars, setWebinars] = useState<Webinar[]>([]);
    const [videos, setVideos] = useState<VideoItem[]>([]);
    const [photos, setPhotos] = useState<PhotoItem[]>([]);

    const [loadingWebinars, setLoadingWebinars] = useState(true);
    const [loadingVideos, setLoadingVideos] = useState(false);
    const [loadingPhotos, setLoadingPhotos] = useState(false);

    // Upload form state - video
    const [vForm, setVForm] = useState({ title: "", link: "", description: "", tags: [] as string[] });
    const [vSubmitting, setVSubmitting] = useState(false);
    const [vError, setVError] = useState("");

    // Upload form state - photo
    const [pForm, setPForm] = useState({ title: "", link: "", description: "", tags: [] as string[] });
    const [pSubmitting, setPSubmitting] = useState(false);
    const [pError, setPError] = useState("");
    const [pUploading, setPUploading] = useState(false);

    useEffect(() => {
        fetch("/api/member/me").then(r => r.json()).then(d => {
            if (!d.member) { router.replace("/"); return; }
            setMember(d.member);
        });
        fetch("/api/webinars").then(r => r.json()).then(setWebinars).finally(() => setLoadingWebinars(false));
    }, [router]);

    useEffect(() => {
        if (activeTab === "videos" && videos.length === 0) {
            setLoadingVideos(true);
            fetch("/api/member/videos").then(r => r.json()).then(setVideos).finally(() => setLoadingVideos(false));
        }
        if (activeTab === "photos" && photos.length === 0) {
            setLoadingPhotos(true);
            fetch("/api/member/photos").then(r => r.json()).then(setPhotos).finally(() => setLoadingPhotos(false));
        }
    }, [activeTab]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleLogout = async () => {
        await fetch("/api/member/logout", { method: "POST" });
        router.push("/");
    };

    const submitVideo = async (e: React.FormEvent) => {
        e.preventDefault();
        setVError(""); setVSubmitting(true);
        try {
            const res = await fetch("/api/member/videos", {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify(vForm),
            });
            if (!res.ok) { const d = await res.json(); setVError(d.error || "Failed"); return; }
            const newVid = await res.json();
            setVideos(prev => [newVid, ...prev]);
            setVForm({ title: "", link: "", description: "", tags: [] });
        } finally { setVSubmitting(false); }
    };

    const handlePhotoFile = async (file: File | null) => {
        if (!file) return;
        setPUploading(true);
        try {
            const fd = new FormData(); fd.append("file", file);
            const res = await fetch("/api/upload", { method: "POST", body: fd });
            const data = await res.json();
            setPForm(f => ({ ...f, link: data.url }));
        } finally { setPUploading(false); }
    };

    const submitPhoto = async (e: React.FormEvent) => {
        e.preventDefault();
        setPError(""); setPSubmitting(true);
        try {
            const res = await fetch("/api/member/photos", {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify(pForm),
            });
            if (!res.ok) { const d = await res.json(); setPError(d.error || "Failed"); return; }
            const newPhoto = await res.json();
            setPhotos(prev => [newPhoto, ...prev]);
            setPForm({ title: "", link: "", description: "", tags: [] });
        } finally { setPSubmitting(false); }
    };

    if (!member) return null;

    const navItems: { key: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
        { key: "webinars", label: "Webinars", icon: Radio },
        { key: "videos", label: "Videos", icon: Video },
        { key: "photos", label: "Photos", icon: ImageIcon },
    ];

    return (
        <div className="flex min-h-screen bg-slate-100">
            <aside className="w-64 bg-primary text-white flex flex-col shrink-0">
                <div className="px-6 py-5 border-b border-white/20">
                    <div className="text-2xl font-bold tracking-wide">BSLCTR</div>
                    <div className="text-xs text-white/60 mt-0.5">Member Panel</div>
                </div>
                <div className="px-6 py-4 border-b border-white/20">
                    <div className="text-xs text-white/50 uppercase tracking-widest mb-1">Welcome</div>
                    <div className="text-sm font-medium truncate">{member.name}</div>
                    <div className="text-xs text-white/50 truncate">{member.email}</div>
                </div>
                <nav className="flex-1 px-3 py-4 space-y-1">
                    {navItems.map(({ key, label, icon: Icon }) => (
                        <button key={key} onClick={() => setActiveTab(key)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors ${activeTab === key ? "bg-white/15 text-white cursor-default" : "text-white/70 hover:bg-white/10 hover:text-white"}`}>
                            <Icon className="h-4 w-4 shrink-0" />{label}
                        </button>
                    ))}
                </nav>
                <div className="px-3 py-4 border-t border-white/20 space-y-1">
                    <Link href="/" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors text-sm">
                        <ArrowLeft className="h-4 w-4 shrink-0" />Back to Site
                    </Link>
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors text-sm">
                        <LogOut className="h-4 w-4 shrink-0" />Log Out
                    </button>
                </div>
            </aside>

            <main className="flex-1 overflow-y-auto">
                <div className="container mx-auto px-6 py-10 max-w-4xl">

                    {/* Webinars */}
                    {activeTab === "webinars" && (
                        <>
                            <h2 className="text-2xl font-bold text-slate-800 mb-1">Webinars</h2>
                            <p className="text-slate-500 text-sm mb-6">Upcoming and recent live sessions.</p>
                            {loadingWebinars ? <div className="text-center py-16 text-slate-400">Loading...</div>
                                : webinars.length === 0 ? <div className="text-center py-16 text-slate-400">No webinars available.</div>
                                : (
                                    <div className="grid gap-4">
                                        {webinars.map(w => (
                                            <div key={w.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                                                <h3 className="font-semibold text-slate-800 text-lg mb-3">{w.headline}</h3>
                                                <div className="flex flex-wrap gap-4 text-sm text-slate-600 mb-3">
                                                    <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{w.date}</span>
                                                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{w.time}</span>
                                                    <a href={w.link} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-primary hover:underline font-medium">
                                                        <LinkIcon className="h-3.5 w-3.5" /> Join
                                                    </a>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-sm mb-3">
                                                    {w.keynoteSpeakers.length > 0 && <Row label="Keynote Speaker" values={w.keynoteSpeakers} />}
                                                    {w.moderators.length > 0 && <Row label="Moderator" values={w.moderators} />}
                                                    {w.chairpersons.length > 0 && <Row label="Chairperson" values={w.chairpersons} />}
                                                    {w.coChairmen.length > 0 && <Row label="Co-Chairman" values={w.coChairmen} />}
                                                </div>
                                                {w.sponsors.length > 0 && (
                                                    <div className="flex flex-wrap gap-3 mt-2">
                                                        {w.sponsors.map((s, i) => (
                                                            <div key={i} className="flex items-center gap-2 bg-slate-50 border rounded-lg px-3 py-1.5">
                                                                {s.logo && <img src={s.logo} alt={s.name} className="h-6 object-contain" />}
                                                                <span className="text-sm text-slate-700">{s.name}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                        </>
                    )}

                    {/* Videos */}
                    {activeTab === "videos" && (
                        <div className="flex gap-6">
                            {/* Upload form */}
                            <div className="w-80 shrink-0">
                                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 sticky top-8">
                                    <p className="text-sm font-semibold text-slate-700 mb-4">Submit Video</p>
                                    <form onSubmit={submitVideo} className="space-y-3">
                                        <input required value={vForm.title} onChange={e => setVForm(f => ({ ...f, title: e.target.value }))}
                                            placeholder="Title" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                                        <input required type="url" value={vForm.link} onChange={e => setVForm(f => ({ ...f, link: e.target.value }))}
                                            placeholder="Video URL" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                                        <RichTextEditor value={vForm.description} onChange={v => setVForm(f => ({ ...f, description: v }))} placeholder="Description..." />
                                        <TagsInput tags={vForm.tags} onChange={t => setVForm(f => ({ ...f, tags: t }))} />
                                        {vError && <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded px-3 py-2">{vError}</p>}
                                        <button type="submit" disabled={vSubmitting}
                                            className="w-full bg-primary text-white rounded-lg py-2 text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors">
                                            {vSubmitting ? "Submitting..." : "Submit for Review"}
                                        </button>
                                    </form>
                                </div>
                            </div>

                            {/* My uploads */}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-slate-700 mb-4">My Uploads</p>
                                {loadingVideos ? <div className="text-center py-16 text-slate-400">Loading...</div>
                                    : videos.length === 0 ? <div className="text-center py-16 text-slate-400">No uploads yet.</div>
                                    : (
                                        <div className="grid gap-4">
                                            {videos.map(v => (
                                                <div key={v.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                                                    <div className="flex items-start justify-between gap-3 mb-2">
                                                        <h3 className="font-semibold text-slate-800">{v.title}</h3>
                                                        <StatusBadge status={v.status} />
                                                    </div>
                                                    {v.tags.length > 0 && (
                                                        <div className="flex flex-wrap gap-1.5 mb-2">
                                                            {v.tags.map(tag => (
                                                                <span key={tag} className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                                                                    <Tag className="h-3 w-3" />{tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                    {v.description && v.description !== "<p></p>" && (
                                                        <div className="prose prose-sm max-w-none text-slate-600 text-sm mb-2"
                                                            dangerouslySetInnerHTML={{ __html: v.description }} />
                                                    )}
                                                    {v.status === "APPROVED" && (
                                                        <div className="flex items-center justify-between flex-wrap gap-3 mt-2">
                                                            <a href={v.link} target="_blank" rel="noreferrer"
                                                                className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline font-medium">
                                                                <LinkIcon className="h-3.5 w-3.5" /> Watch Video
                                                            </a>
                                                            <ShareButtons url={v.link} title={v.title} />
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                            </div>
                        </div>
                    )}

                    {/* Photos */}
                    {activeTab === "photos" && (
                        <div className="flex gap-6">
                            {/* Upload form */}
                            <div className="w-80 shrink-0">
                                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 sticky top-8">
                                    <p className="text-sm font-semibold text-slate-700 mb-4">Submit Photo</p>
                                    <form onSubmit={submitPhoto} className="space-y-3">
                                        <input required value={pForm.title} onChange={e => setPForm(f => ({ ...f, title: e.target.value }))}
                                            placeholder="Title" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                                        <input type="url" value={pForm.link} onChange={e => setPForm(f => ({ ...f, link: e.target.value }))}
                                            placeholder="Image URL (optional)" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                                        <div>
                                            <span className="text-xs text-slate-400">or upload file:</span>
                                            <input type="file" accept="image/*" onChange={e => handlePhotoFile(e.target.files?.[0] ?? null)}
                                                className="block w-full mt-1 text-xs text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-primary/10 file:text-primary cursor-pointer" />
                                            {pUploading && <span className="text-xs text-slate-400">Uploading...</span>}
                                        </div>
                                        {pForm.link && <img src={pForm.link} alt="preview" className="h-20 w-auto object-cover rounded border border-slate-200" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />}
                                        <RichTextEditor value={pForm.description} onChange={v => setPForm(f => ({ ...f, description: v }))} placeholder="Description..." />
                                        <TagsInput tags={pForm.tags} onChange={t => setPForm(f => ({ ...f, tags: t }))} />
                                        {pError && <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded px-3 py-2">{pError}</p>}
                                        <button type="submit" disabled={pSubmitting || pUploading}
                                            className="w-full bg-primary text-white rounded-lg py-2 text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors">
                                            {pSubmitting ? "Submitting..." : "Submit for Review"}
                                        </button>
                                    </form>
                                </div>
                            </div>

                            {/* My uploads */}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-slate-700 mb-4">My Uploads</p>
                                {loadingPhotos ? <div className="text-center py-16 text-slate-400">Loading...</div>
                                    : photos.length === 0 ? <div className="text-center py-16 text-slate-400">No uploads yet.</div>
                                    : (
                                        <div className="grid gap-4">
                                            {photos.map(p => (
                                                <div key={p.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                                                    <div className="flex items-start justify-between gap-3 mb-2">
                                                        <h3 className="font-semibold text-slate-800">{p.title}</h3>
                                                        <StatusBadge status={p.status} />
                                                    </div>
                                                    {p.tags.length > 0 && (
                                                        <div className="flex flex-wrap gap-1.5 mb-2">
                                                            {p.tags.map(tag => (
                                                                <span key={tag} className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                                                                    <Tag className="h-3 w-3" />{tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                    {p.link && isImageUrl(p.link) && (
                                                        <div className="mb-2"><img src={p.link} alt={p.title} className="max-h-48 w-auto object-cover rounded-lg border border-slate-200" /></div>
                                                    )}
                                                    {p.description && p.description !== "<p></p>" && (
                                                        <div className="prose prose-sm max-w-none text-slate-600 text-sm mb-2"
                                                            dangerouslySetInnerHTML={{ __html: p.description }} />
                                                    )}
                                                    {p.status === "APPROVED" && (
                                                        <ShareButtons url={p.link} title={p.title} />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

function Row({ label, values }: { label: string; values: string[] }) {
    return (
        <div>
            <span className="font-medium text-slate-600">{label}: </span>
            <span className="text-slate-700">{values.join(", ")}</span>
        </div>
    );
}
