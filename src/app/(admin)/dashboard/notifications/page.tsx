"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, X, Video, Image as ImageIcon, ArrowLeft, Bell } from "lucide-react";

interface PendingItem {
    id: string;
    title: string;
    link: string;
    uploadedByName?: string;
    createdAt: string;
    type: "video" | "photo";
}

export default function NotificationsPage() {
    const [items, setItems] = useState<PendingItem[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPending = async () => {
        setLoading(true);
        try {
            const [vRes, pRes] = await Promise.all([
                fetch("/api/admin/videos"),
                fetch("/api/admin/photos"),
            ]);
            const videos = await vRes.json();
            const photos = await pRes.json();
            const pending: PendingItem[] = [
                ...(Array.isArray(videos) ? videos : [])
                    .filter((v: { status: string }) => v.status === "PENDING")
                    .map((v: { id: string; title: string; link: string; uploadedByName?: string; createdAt: string }) => ({ ...v, type: "video" as const })),
                ...(Array.isArray(photos) ? photos : [])
                    .filter((p: { status: string }) => p.status === "PENDING")
                    .map((p: { id: string; title: string; link: string; uploadedByName?: string; createdAt: string }) => ({ ...p, type: "photo" as const })),
            ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setItems(pending);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPending(); }, []);

    const handleStatus = async (item: PendingItem, status: "APPROVED" | "REJECTED") => {
        const url = item.type === "video"
            ? `/api/admin/videos/${item.id}`
            : `/api/admin/photos/${item.id}`;
        await fetch(url, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
        });
        await fetchPending();
    };

    return (
        <div className="min-h-screen bg-slate-50 px-6 py-8">
            <div className="max-w-2xl mx-auto">

                {/* Back to Site */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary mb-6 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" /> Back to Site
                </Link>

                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Bell className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800">Notifications</h1>
                        <p className="text-sm text-slate-400">Member upload requests</p>
                    </div>
                    {items.length > 0 && (
                        <span className="ml-auto inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold">
                            {items.length}
                        </span>
                    )}
                </div>

                {/* Content */}
                {loading ? (
                    <div className="text-center py-16 text-slate-400">Loading...</div>
                ) : items.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
                        <Bell className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                        <p className="text-slate-400 font-medium">No pending uploads</p>
                        <p className="text-slate-300 text-sm mt-1">Member submissions will appear here</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {items.map((item) => (
                            <div key={`${item.type}-${item.id}`} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                                <div className="flex items-start gap-3">
                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${item.type === "video" ? "bg-blue-100" : "bg-purple-100"}`}>
                                        {item.type === "video"
                                            ? <Video className="h-4 w-4 text-blue-600" />
                                            : <ImageIcon className="h-4 w-4 text-purple-600" />
                                        }
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-slate-800 truncate">{item.title}</p>
                                        {item.uploadedByName && (
                                            <p className="text-xs text-slate-400 mt-0.5">
                                                Submitted by <span className="font-medium text-slate-600">{item.uploadedByName}</span>
                                            </p>
                                        )}
                                        <a
                                            href={item.link}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-xs text-primary hover:underline mt-1 inline-block truncate max-w-full"
                                        >
                                            {item.link}
                                        </a>
                                    </div>
                                </div>

                                <div className="flex gap-2 mt-4">
                                    <button
                                        onClick={() => handleStatus(item, "APPROVED")}
                                        className="flex-1 flex items-center justify-center gap-1.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-xl transition-colors"
                                    >
                                        <Check className="h-4 w-4" /> Approve
                                    </button>
                                    <button
                                        onClick={() => handleStatus(item, "REJECTED")}
                                        className="flex-1 flex items-center justify-center gap-1.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl transition-colors"
                                    >
                                        <X className="h-4 w-4" /> Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
