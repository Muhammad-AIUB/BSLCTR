"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, Link as LinkIcon, LogOut, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";

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

export default function MemberDashboard() {
    const router = useRouter();
    const [member, setMember] = useState<{ name: string; email: string } | null>(null);
    const [webinars, setWebinars] = useState<Webinar[]>([]);
    const [loading, setLoading] = useState(true);

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
            .finally(() => setLoading(false));
    }, [router]);

    const handleLogout = async () => {
        await fetch("/api/member/logout", { method: "POST" });
        router.push("/");
    };

    if (!member) return null;

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
                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/15 text-white font-medium text-sm cursor-default">
                        <Radio className="h-4 w-4 shrink-0" />
                        Webinars
                    </div>
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
                    <h2 className="text-2xl font-bold text-slate-800 mb-1">Webinars</h2>
                    <p className="text-slate-500 text-sm mb-6">Upcoming and recent live sessions.</p>

                    {loading ? (
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
