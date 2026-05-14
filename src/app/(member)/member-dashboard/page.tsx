"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, Link as LinkIcon, LogOut, Radio, Video, ImageIcon, Tag } from "lucide-react";
import ShareButtons from "@/components/ShareButtons";

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
}
interface VideoItem {
    id: string;
    title: string;
    link: string;
    description: string;
    tags: string[];
}
interface PhotoItem {
    id: string;
    title: string;
    link: string;
    description: string;
    tags: string[];
}

type Tab = "webinars" | "videos" | "photos";

function isImageUrl(url: string) {
    return /\.(jpg|jpeg|png|gif|webp|avif|svg)(\?.*)?$/i.test(url);
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

    useEffect(() => {
        fetch("/api/member/me")
            .then((r) => r.json())
            .then((d) => {
                if (!d.member) { router.replace("/"); return; }
                setMember(d.member);
            });

        fetch("/api/webinars")
            .then((r) => r.json())
            .then(setWebinars)
            .finally(() => setLoadingWebinars(false));
    }, [router]);

    useEffect(() => {
        if (activeTab === "videos" && videos.length === 0) {
            setLoadingVideos(true);
            fetch("/api/videos")
                .then((r) => r.json())
                .then(setVideos)
                .finally(() => setLoadingVideos(false));
        }
        if (activeTab === "photos" && photos.length === 0) {
            setLoadingPhotos(true);
            fetch("/api/photos")
                .then((r) => r.json())
                .then(setPhotos)
                .finally(() => setLoadingPhotos(false));
        }
    }, [activeTab]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleLogout = async () => {
        await fetch("/api/member/logout", { method: "POST" });
        router.push("/");
    };

    if (!member) return null;

    const navItems: { key: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
        { key: "webinars", label: "Webinars", icon: Radio },
        { key: "videos", label: "Videos", icon: Video },
        { key: "photos", label: "Photos", icon: ImageIcon },
    ];

    return (
        <div className="flex min-h-screen bg-slate-100">
            {/* Sidebar */}
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
                        <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                                activeTab === key
                                    ? "bg-white/15 text-white cursor-default"
                                    : "text-white/70 hover:bg-white/10 hover:text-white"
                            }`}
                        >
                            <Icon className="h-4 w-4 shrink-0" />
                            {label}
                        </button>
                    ))}
                </nav>

                <div className="px-3 py-4 border-t border-white/20">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors text-sm"
                    >
                        <LogOut className="h-4 w-4 shrink-0" />
                        Log Out
                    </button>
                </div>
            </aside>

            {/* Main */}
            <main className="flex-1 overflow-y-auto">
                <div className="container mx-auto px-6 py-10 max-w-4xl">

                    {/* Webinars Tab */}
                    {activeTab === "webinars" && (
                        <>
                            <h2 className="text-2xl font-bold text-slate-800 mb-1">Webinars</h2>
                            <p className="text-slate-500 text-sm mb-6">Upcoming and recent live sessions.</p>

                            {loadingWebinars ? (
                                <div className="text-center py-16 text-slate-400">Loading...</div>
                            ) : webinars.length === 0 ? (
                                <div className="text-center py-16 text-slate-400">No webinars available.</div>
                            ) : (
                                <div className="grid gap-4">
                                    {webinars.map((w) => (
                                        <div key={w.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                                            <h3 className="font-semibold text-slate-800 text-lg mb-3">{w.headline}</h3>

                                            <div className="flex flex-wrap gap-4 text-sm text-slate-600 mb-3">
                                                <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{w.date}</span>
                                                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{w.time}</span>
                                                <a href={w.link} target="_blank" rel="noreferrer"
                                                    className="flex items-center gap-1 text-primary hover:underline font-medium">
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

                    {/* Videos Tab */}
                    {activeTab === "videos" && (
                        <>
                            <h2 className="text-2xl font-bold text-slate-800 mb-1">Videos</h2>
                            <p className="text-slate-500 text-sm mb-6">Watch our latest videos.</p>

                            {loadingVideos ? (
                                <div className="text-center py-16 text-slate-400">Loading...</div>
                            ) : videos.length === 0 ? (
                                <div className="text-center py-16 text-slate-400">No videos available.</div>
                            ) : (
                                <div className="grid gap-4">
                                    {videos.map((v) => (
                                        <div key={v.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                                            <h3 className="font-semibold text-slate-800 text-lg mb-2">{v.title}</h3>

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
                                                    className="prose prose-sm max-w-none text-slate-600 text-sm mb-3"
                                                    dangerouslySetInnerHTML={{ __html: v.description }}
                                                />
                                            )}

                                            <div className="flex items-center justify-between flex-wrap gap-3">
                                                <a href={v.link} target="_blank" rel="noreferrer"
                                                    className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline font-medium">
                                                    <LinkIcon className="h-3.5 w-3.5" /> Watch Video
                                                </a>
                                                <ShareButtons url={v.link} title={v.title} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}

                    {/* Photos Tab */}
                    {activeTab === "photos" && (
                        <>
                            <h2 className="text-2xl font-bold text-slate-800 mb-1">Photos</h2>
                            <p className="text-slate-500 text-sm mb-6">Browse our photo gallery.</p>

                            {loadingPhotos ? (
                                <div className="text-center py-16 text-slate-400">Loading...</div>
                            ) : photos.length === 0 ? (
                                <div className="text-center py-16 text-slate-400">No photos available.</div>
                            ) : (
                                <div className="grid gap-4">
                                    {photos.map((p) => (
                                        <div key={p.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                                            <h3 className="font-semibold text-slate-800 text-lg mb-2">{p.title}</h3>

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

                                            {p.link && isImageUrl(p.link) ? (
                                                <div className="mb-3">
                                                    <img src={p.link} alt={p.title} className="max-h-64 w-auto object-cover rounded-lg border border-slate-200" />
                                                </div>
                                            ) : p.link ? (
                                                <div className="mb-3">
                                                    <a href={p.link} target="_blank" rel="noreferrer"
                                                        className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline font-medium">
                                                        <LinkIcon className="h-3.5 w-3.5" /> View Photo
                                                    </a>
                                                </div>
                                            ) : null}

                                            {p.description && p.description !== "<p></p>" && (
                                                <div
                                                    className="prose prose-sm max-w-none text-slate-600 text-sm mb-3"
                                                    dangerouslySetInnerHTML={{ __html: p.description }}
                                                />
                                            )}

                                            <ShareButtons url={p.link} title={p.title} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
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
