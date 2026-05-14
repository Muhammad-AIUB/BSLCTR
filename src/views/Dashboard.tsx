"use client";

import { Clock, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

interface MemberApplication {
    id: string;
    name: string;
    email: string;
    mobileNo: string;
    bmdcNo: string;
    designation: string;
    specialtySubject: string;
    otherSpecialty: string | null;
    academicQualifications: string;
    specializedTraining: string | null;
    currentPosting: string | null;
    chamberAddresses: string[];
    shortBiography: string | null;
    journals: string | null;
    profilePicture: string | null;
    backgroundPicture: string | null;
    interventions: string[];
    status: "PENDING" | "APPROVED" | "REJECTED";
    createdAt: string;
}

const SPECIALTY_LABELS: Record<string, string> = {
    hepatologist: "Hepatologist",
    hepatobiliary_surgeon: "Hepatobiliary Surgeon",
    intervention_hepatologist: "Intervention Hepatologist",
    other: "Other",
};

export default function Dashboard() {
    const [members, setMembers] = useState<MemberApplication[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("ALL");
    const [processingId, setProcessingId] = useState<string | null>(null);

    const fetchMembers = async () => {
        setLoading(true);
        try {
            const url = filter === "ALL" ? "/api/admin/members" : `/api/admin/members?status=${filter}`;
            const res = await fetch(url);
            setMembers(await res.json());
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchMembers(); }, [filter]);

    const handleAction = async (id: string, action: "approve" | "reject") => {
        setProcessingId(id);
        try {
            await fetch(`/api/admin/members/${id}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action }),
            });
            await fetchMembers();
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="container mx-auto px-4 py-10 max-w-4xl">
                <h2 className="text-2xl font-bold text-slate-800 mb-1">Member Applications</h2>
                <p className="text-slate-500 mb-6 text-sm">Review and manage membership applications.</p>

                <div className="flex gap-2 flex-wrap mb-6">
                    {(["ALL", "PENDING", "APPROVED", "REJECTED"] as const).map((f) => (
                        <Button
                            key={f}
                            size="sm"
                            variant={filter === f ? "default" : "outline"}
                            onClick={() => setFilter(f)}
                        >
                            {f === "ALL" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()}
                        </Button>
                    ))}
                </div>

                {loading ? (
                    <div className="text-center py-16 text-slate-400">Loading...</div>
                ) : members.length === 0 ? (
                    <div className="text-center py-16 text-slate-400">No applications found.</div>
                ) : (
                    <div className="grid gap-5">
                        {members.map((m) => (
                            <div key={m.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                {/* Background picture */}
                                {m.backgroundPicture && (
                                    <div className="h-28 w-full overflow-hidden">
                                        <img src={m.backgroundPicture} alt="" className="w-full h-full object-cover" />
                                    </div>
                                )}

                                <div className="p-5">
                                    {/* Header row */}
                                    <div className="flex items-start justify-between gap-3 mb-4">
                                        <div className="flex items-center gap-3">
                                            {m.profilePicture ? (
                                                <img
                                                    src={m.profilePicture}
                                                    alt={m.name}
                                                    className="w-14 h-14 rounded-full object-cover border-2 border-white shadow"
                                                />
                                            ) : (
                                                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl shrink-0">
                                                    {m.name.charAt(0)}
                                                </div>
                                            )}
                                            <div>
                                                <div className="font-semibold text-slate-800 text-lg">{m.name}</div>
                                                <div className="text-sm text-slate-500">
                                                    {m.designation} &bull; {SPECIALTY_LABELS[m.specialtySubject] ?? m.specialtySubject}
                                                </div>
                                            </div>
                                        </div>
                                        <Badge
                                            variant="outline"
                                            className={
                                                m.status === "PENDING"
                                                    ? "bg-yellow-50 text-yellow-700 border-yellow-300"
                                                    : m.status === "APPROVED"
                                                    ? "bg-green-50 text-green-700 border-green-300"
                                                    : "bg-red-50 text-red-700 border-red-300"
                                            }
                                        >
                                            {m.status === "PENDING" && <Clock className="h-3 w-3 mr-1" />}
                                            {m.status === "APPROVED" && <CheckCircle className="h-3 w-3 mr-1" />}
                                            {m.status === "REJECTED" && <XCircle className="h-3 w-3 mr-1" />}
                                            {m.status}
                                        </Badge>
                                    </div>

                                    {/* All info */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm mb-4">
                                        <Info label="Email" value={m.email} />
                                        <Info label="Mobile No" value={m.mobileNo} />
                                        <Info label="BMDC No" value={m.bmdcNo} />
                                        <Info label="Academic Qualifications" value={m.academicQualifications} />
                                        {m.specializedTraining && (
                                            <Info label="Specialized Training" value={m.specializedTraining} />
                                        )}
                                        {m.currentPosting && (
                                            <Info label="Current Posting / Institution" value={m.currentPosting} />
                                        )}
                                    </div>

                                    {m.chamberAddresses.length > 0 && (
                                        <div className="text-sm mb-2">
                                            <span className="font-medium text-slate-600">Chamber Address: </span>
                                            <span className="text-slate-700">{m.chamberAddresses.join(" | ")}</span>
                                        </div>
                                    )}

                                    {m.shortBiography && (
                                        <div className="text-sm mb-2">
                                            <span className="font-medium text-slate-600">Biography: </span>
                                            <span className="text-slate-700">{m.shortBiography}</span>
                                        </div>
                                    )}

                                    {m.journals && (
                                        <div className="text-sm mb-2">
                                            <span className="font-medium text-slate-600">Journals: </span>
                                            <span className="text-slate-700">{m.journals}</span>
                                        </div>
                                    )}

                                    {m.interventions.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mb-3">
                                            {m.interventions.map((tag) => (
                                                <span key={tag} className="bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-full">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    <div className="text-xs text-slate-400 mb-4">
                                        Applied: {new Date(m.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                                    </div>

                                    {/* Actions */}
                                    {m.status === "PENDING" && (
                                        <div className="flex gap-3">
                                            <Button
                                                size="sm"
                                                className="bg-green-600 hover:bg-green-700"
                                                disabled={processingId === m.id}
                                                onClick={() => handleAction(m.id, "approve")}
                                            >
                                                <CheckCircle className="h-4 w-4 mr-1" />
                                                Approve
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                disabled={processingId === m.id}
                                                onClick={() => handleAction(m.id, "reject")}
                                            >
                                                <XCircle className="h-4 w-4 mr-1" />
                                                Reject
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function Info({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <span className="font-medium text-slate-600">{label}: </span>
            <span className="text-slate-700">{value}</span>
        </div>
    );
}
