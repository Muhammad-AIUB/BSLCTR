"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CalendarIcon, Clock, ExternalLink, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import ShareButtons from "@/components/ShareButtons";
import { Section } from "@/components/ui/section";

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

export default function LiveWebinars() {
    const [webinars, setWebinars] = useState<Webinar[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/webinars")
            .then((r) => r.json())
            .then(setWebinars)
            .finally(() => setLoading(false));
    }, []);

    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const live = webinars.filter((w) => w.date <= today);
    const upcoming = webinars.filter((w) => w.date > today);

    return (
        <Section watermark="Webinars" eyebrow="Events" title="Live Webinars">
            <div className="max-w-5xl space-y-14">

                {/* Live / Recent Webinars */}
                <section>
                    <SectionHeading title="Live &amp; Recent" dot />
                    {loading ? (
                        <div className="text-center py-10 text-muted-foreground">Loading...</div>
                    ) : live.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground text-sm">No live webinars at the moment.</div>
                    ) : (
                        <div className="flex flex-col gap-6">
                            {live.map((w, i) => <WebinarCard key={w.id} webinar={w} index={i} />)}
                        </div>
                    )}
                </section>

                {/* Upcoming Webinars */}
                <section>
                    <SectionHeading title="Upcoming Webinars" />
                    {loading ? (
                        <div className="text-center py-10 text-muted-foreground">Loading...</div>
                    ) : upcoming.length === 0 ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center border border-dashed border-slate-300 rounded-xl px-6 py-10 sm:px-10 bg-white max-w-sm w-full">
                                <div className="text-4xl mb-3">📅</div>
                                <p className="text-slate-600 font-medium">No upcoming webinars scheduled yet.</p>
                                <p className="text-slate-500 text-sm mt-1">Check back soon for new sessions.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-6">
                            {upcoming.map((w, i) => <WebinarCard key={w.id} webinar={w} index={i} upcoming />)}
                        </div>
                    )}
                </section>

            </div>
        </Section>
    );
}

function SectionHeading({ title, dot }: { title: string; dot?: boolean }) {
    return (
        <div className="flex items-center gap-3 mb-6">
            {dot && (
                <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
            )}
            <h2 className="text-2xl font-medium">{title}</h2>
            <div className="flex-1 h-px bg-slate-200" />
        </div>
    );
}

const gradients = [
    "from-primary to-secondary",
    "from-primary to-secondary",
    "from-primary to-secondary",
    "from-primary to-secondary",
];

function WebinarCard({ webinar: w, index, upcoming }: { webinar: Webinar; index: number; upcoming?: boolean }) {
    const gradient = upcoming
        ? ["from-slate-600 to-slate-400", "from-gray-700 to-slate-500", "from-zinc-600 to-gray-400", "from-slate-700 to-zinc-500"][index % 4]
        : gradients[index % gradients.length];

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            whileHover={{ y: -3 }}
            className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 overflow-hidden"
        >
            <div className="flex flex-col md:flex-row">
                {/* Preview panel */}
                <div className={`bg-gradient-to-br ${gradient} md:w-72 shrink-0 flex flex-col justify-between p-6 min-h-[200px]`}>
                    <div className="flex items-center gap-2">
                        {!upcoming && (
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
                            </span>
                        )}
                        <p className="text-white/90 text-xs font-semibold uppercase tracking-widest">
                            {upcoming ? "Upcoming Webinar" : "Live Webinar"}
                        </p>
                    </div>

                    <p className="text-white font-bold text-lg leading-snug line-clamp-4 my-4">{w.headline}</p>

                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-white/90 text-sm">
                            <CalendarIcon className="h-3.5 w-3.5 shrink-0" />
                            <span>{w.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/90 text-sm">
                            <Clock className="h-3.5 w-3.5 shrink-0" />
                            <span>{w.time}</span>
                        </div>
                    </div>
                </div>

                {/* Details */}
                <div className="flex-1 p-6 flex flex-col justify-between gap-4">
                    <div>
                        <h3 className="text-xl font-medium leading-snug mb-4">{w.headline}</h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-1 text-sm">
                            {w.keynoteSpeakers.length > 0 && (
                                <SpeakerRow label="Keynote Speaker" names={w.keynoteSpeakers} />
                            )}
                            {w.moderators.length > 0 && (
                                <SpeakerRow label="Moderator" names={w.moderators} />
                            )}
                            {w.chairpersons.length > 0 && (
                                <SpeakerRow label="Chairperson" names={w.chairpersons} />
                            )}
                            {w.coChairmen.length > 0 && (
                                <SpeakerRow label="Co-Chairman" names={w.coChairmen} />
                            )}
                        </div>

                        {w.sponsors && w.sponsors.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-4">
                                {w.sponsors.map((s, i) => (
                                    <div key={i} className="flex items-center gap-2 bg-muted border rounded-md px-3 py-1.5">
                                        {s.logo && <img src={s.logo} alt={s.name} className="h-5 object-contain" />}
                                        <span className="text-xs text-slate-600">{s.name}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-between gap-4 flex-wrap">
                        <ShareButtons url={w.link} title={w.headline} />
                        <a href={w.link} target="_blank" rel="noreferrer">
                            <Button className="bg-secondary text-white hover:bg-secondary/90 shadow-sm hover:shadow-md transition-all duration-300 px-8">
                                Join Now
                                <ExternalLink className="h-4 w-4 ml-2" />
                            </Button>
                        </a>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function SpeakerRow({ label, names }: { label: string; names: string[] }) {
    return (
        <div className="py-0.5">
            <span className="font-semibold text-slate-500">{label}: </span>
            <span className="text-slate-700">{names.join(", ")}</span>
        </div>
    );
}
