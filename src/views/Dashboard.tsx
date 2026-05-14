"use client";

import {
    Clock,
    CheckCircle,
    XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
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
    profilePicture: string | null;
    status: "PENDING" | "APPROVED" | "REJECTED";
    rejectionReason: string | null;
    createdAt: string;
}

const SPECIALTY_LABELS: Record<string, string> = {
    hepatologist: "Hepatologist",
    hepatobiliary_surgeon: "Hepatobiliary Surgeon",
    intervention_hepatologist: "Intervention Hepatologist",
};

export default function Dashboard() {
    const [members, setMembers] = useState<MemberApplication[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("ALL");
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [rejectReason, setRejectReason] = useState<{ [id: string]: string }>({});

    const fetchMembers = async () => {
        setLoading(true);
        try {
            const url =
                filter === "ALL"
                    ? "/api/admin/members"
                    : `/api/admin/members?status=${filter}`;
            const res = await fetch(url);
            const data = await res.json();
            setMembers(data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, [filter]);

    const handleAction = async (id: string, action: "approve" | "reject") => {
        setProcessingId(id);
        try {
            await fetch(`/api/admin/members/${id}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action,
                    rejectionReason: rejectReason[id] || "",
                }),
            });
            await fetchMembers();
        } finally {
            setProcessingId(null);
        }
    };

    const specialtyLabel = (val: string, other: string | null) =>
        SPECIALTY_LABELS[val] ?? other ?? val;

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="container mx-auto px-4 py-10 max-w-4xl">
                <h2 className="text-3xl font-bold text-slate-800 mb-2">Member Applications</h2>
                <p className="text-slate-500 mb-6">Review and manage membership applications.</p>

                {/* Filter buttons */}
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
                    <div className="text-center py-16 text-slate-400">
                        No {filter === "ALL" ? "" : filter.toLowerCase() + " "}applications found.
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {members.map((m) => (
                            <Card key={m.id} className="border-l-4 border-l-primary">
                                <CardHeader className="pb-2">
                                    <div className="flex items-start justify-between gap-2 flex-wrap">
                                        <div className="flex items-center gap-3">
                                            {m.profilePicture ? (
                                                <img
                                                    src={m.profilePicture}
                                                    alt={m.name}
                                                    className="w-12 h-12 rounded-full object-cover border"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                                                    {m.name.charAt(0)}
                                                </div>
                                            )}
                                            <div>
                                                <CardTitle className="text-lg">{m.name}</CardTitle>
                                                <CardDescription>
                                                    {m.designation} &bull;{" "}
                                                    {specialtyLabel(m.specialtySubject, m.otherSpecialty)}
                                                </CardDescription>
                                            </div>
                                        </div>
                                        <Badge
                                            className={
                                                m.status === "PENDING"
                                                    ? "bg-yellow-100 text-yellow-700 border-yellow-300"
                                                    : m.status === "APPROVED"
                                                    ? "bg-green-100 text-green-700 border-green-300"
                                                    : "bg-red-100 text-red-700 border-red-300"
                                            }
                                            variant="outline"
                                        >
                                            {m.status === "PENDING" && <Clock className="h-3 w-3 mr-1" />}
                                            {m.status === "APPROVED" && <CheckCircle className="h-3 w-3 mr-1" />}
                                            {m.status === "REJECTED" && <XCircle className="h-3 w-3 mr-1" />}
                                            {m.status}
                                        </Badge>
                                    </div>
                                </CardHeader>

                                <CardContent className="text-sm text-slate-600 space-y-1 pb-3">
                                    <p><span className="font-medium">Email:</span> {m.email}</p>
                                    <p><span className="font-medium">Mobile:</span> {m.mobileNo}</p>
                                    <p><span className="font-medium">BMDC No:</span> {m.bmdcNo}</p>
                                    <p><span className="font-medium">Qualifications:</span> {m.academicQualifications}</p>
                                    {m.rejectionReason && (
                                        <p className="text-red-600">
                                            <span className="font-medium">Rejection reason:</span> {m.rejectionReason}
                                        </p>
                                    )}
                                    <p className="text-xs text-slate-400 pt-1">
                                        Applied:{" "}
                                        {new Date(m.createdAt).toLocaleDateString("en-GB", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </p>
                                </CardContent>

                                {m.status === "PENDING" && (
                                    <CardFooter className="gap-3 flex-wrap pt-0">
                                        <Button
                                            size="sm"
                                            className="bg-green-600 hover:bg-green-700"
                                            disabled={processingId === m.id}
                                            onClick={() => handleAction(m.id, "approve")}
                                        >
                                            <CheckCircle className="h-4 w-4 mr-1" />
                                            Approve
                                        </Button>
                                        <div className="flex gap-2 items-center flex-1 min-w-[220px]">
                                            <input
                                                className="flex-1 border rounded px-2 py-1 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-red-400"
                                                placeholder="Rejection reason (optional)"
                                                value={rejectReason[m.id] || ""}
                                                onChange={(e) =>
                                                    setRejectReason((prev) => ({
                                                        ...prev,
                                                        [m.id]: e.target.value,
                                                    }))
                                                }
                                            />
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
                                    </CardFooter>
                                )}
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
