"use client";

import Link from "next/link";
import {
    Users,
    Calendar,
    BookOpen,
    Award,
    Stethoscope,
    TrendingUp,
    Heart,
    FileText,
    UserCheck,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

function MemberApplicationsTab() {
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
        } catch {
            // ignore
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

    const specialtyLabel = (val: string, other: string | null) => {
        const map: Record<string, string> = {
            hepatologist: "Hepatologist",
            hepatobiliary_surgeon: "Hepatobiliary Surgeon",
            intervention_hepatologist: "Intervention Hepatologist",
            other: other || "Other",
        };
        return map[val] ?? val;
    };

    return (
        <div className="space-y-4">
            <div className="flex gap-2 flex-wrap">
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
                <div className="text-center py-10 text-slate-500">Loading...</div>
            ) : members.length === 0 ? (
                <div className="text-center py-10 text-slate-500">
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
                                                {m.designation} •{" "}
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
                                <p>
                                    <span className="font-medium">Email:</span> {m.email}
                                </p>
                                <p>
                                    <span className="font-medium">Mobile:</span> {m.mobileNo}
                                </p>
                                <p>
                                    <span className="font-medium">BMDC No:</span> {m.bmdcNo}
                                </p>
                                <p>
                                    <span className="font-medium">Qualifications:</span>{" "}
                                    {m.academicQualifications}
                                </p>
                                {m.rejectionReason && (
                                    <p className="text-red-600">
                                        <span className="font-medium">Rejection reason:</span>{" "}
                                        {m.rejectionReason}
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
    );
}

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-slate-50">
            <div className="container mx-auto px-4 py-12 max-w-7xl">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold tracking-tight text-slate-800 mb-4">
                        BSLCTR Dashboard
                    </h2>
                    <p className="text-lg text-slate-600 mb-6 max-w-3xl mx-auto">
                        Bangladesh Society of Liver, Cholangiocarcinoma and
                        Transplant Research
                    </p>
                    <div className="flex flex-wrap gap-3 justify-center">
                        <Badge className="bg-blue-500 text-white px-4 py-2">
                            Active Society
                        </Badge>
                        <Badge
                            variant="outline"
                            className="border-green-500 text-green-700 px-4 py-2"
                        >
                            Research Active
                        </Badge>
                        <Badge
                            variant="outline"
                            className="border-purple-500 text-purple-700 px-4 py-2"
                        >
                            Educational Programs
                        </Badge>
                    </div>
                </div>

                <Tabs defaultValue="overview" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-2 max-w-sm mx-auto">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="members">Member Applications</TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-8">
                        {/* Statistics Cards */}
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            <Card className="border-l-4 border-l-blue-500 w-full max-w-sm mx-auto">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-xl flex items-center gap-2">
                                        <Users className="h-5 w-5 text-blue-500" />
                                        Total Members
                                    </CardTitle>
                                    <CardDescription>
                                        Active society members
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold text-blue-600">
                                        1,245
                                    </div>
                                    <p className="text-sm text-slate-600">
                                        +15% from last quarter
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-l-4 border-l-green-500 w-full max-w-sm mx-auto">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-xl flex items-center gap-2">
                                        <FileText className="h-5 w-5 text-green-500" />
                                        Research Papers
                                    </CardTitle>
                                    <CardDescription>
                                        Published this year
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold text-green-600">
                                        87
                                    </div>
                                    <p className="text-sm text-slate-600">
                                        International journals
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-l-4 border-l-purple-500 w-full max-w-sm mx-auto">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-xl flex items-center gap-2">
                                        <Calendar className="h-5 w-5 text-purple-500" />
                                        Events Conducted
                                    </CardTitle>
                                    <CardDescription>
                                        Medical conferences & workshops
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold text-purple-600">
                                        24
                                    </div>
                                    <p className="text-sm text-slate-600">This year</p>
                                </CardContent>
                            </Card>

                            <Card className="border-l-4 border-l-orange-500 w-full max-w-sm mx-auto">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-xl flex items-center gap-2">
                                        <Heart className="h-5 w-5 text-orange-500" />
                                        Patients Helped
                                    </CardTitle>
                                    <CardDescription>
                                        Through our initiatives
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold text-orange-600">
                                        3,420
                                    </div>
                                    <p className="text-sm text-slate-600">
                                        Lives impacted
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Main Feature Cards */}
                        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                            <Card className="hover:shadow-lg transition-shadow w-full max-w-sm mx-auto">
                                <CardHeader>
                                    <CardTitle className="text-2xl flex items-center gap-2">
                                        <BookOpen className="h-6 w-6 text-blue-500" />
                                        Research Hub
                                    </CardTitle>
                                    <CardDescription>
                                        Access latest research papers and publications
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <p className="text-sm text-slate-600">
                                            • Latest liver research findings
                                        </p>
                                        <p className="text-sm text-slate-600">
                                            • Cholangiocarcinoma studies
                                        </p>
                                        <p className="text-sm text-slate-600">
                                            • Transplant success stories
                                        </p>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Link href="/research" className="w-full">
                                        <Button className="w-full" variant="outline">
                                            <BookOpen className="mr-2 h-4 w-4" />
                                            Explore Research
                                        </Button>
                                    </Link>
                                </CardFooter>
                            </Card>

                            <Card className="hover:shadow-lg transition-shadow w-full max-w-sm mx-auto">
                                <CardHeader>
                                    <CardTitle className="text-2xl flex items-center gap-2">
                                        <Stethoscope className="h-6 w-6 text-green-500" />
                                        Medical Events
                                    </CardTitle>
                                    <CardDescription>
                                        Upcoming conferences and workshops
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <p className="text-sm text-slate-600">
                                            • Annual Medical Conference
                                        </p>
                                        <p className="text-sm text-slate-600">
                                            • Liver Surgery Workshop
                                        </p>
                                        <p className="text-sm text-slate-600">
                                            • Research Symposium
                                        </p>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Link href="/events" className="w-full">
                                        <Button className="w-full" variant="outline">
                                            <Calendar className="mr-2 h-4 w-4" />
                                            View Events
                                        </Button>
                                    </Link>
                                </CardFooter>
                            </Card>

                            <Card className="hover:shadow-lg transition-shadow w-full max-w-sm mx-auto">
                                <CardHeader>
                                    <CardTitle className="text-2xl flex items-center gap-2">
                                        <UserCheck className="h-6 w-6 text-purple-500" />
                                        Membership
                                    </CardTitle>
                                    <CardDescription>
                                        Join our medical community
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <p className="text-sm text-slate-600">
                                            • Professional networking
                                        </p>
                                        <p className="text-sm text-slate-600">
                                            • Access to resources
                                        </p>
                                        <p className="text-sm text-slate-600">
                                            • Continuing education
                                        </p>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Link href="/membership" className="w-full">
                                        <Button className="w-full" variant="outline">
                                            <Users className="mr-2 h-4 w-4" />
                                            Join Now
                                        </Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        </div>

                        {/* Quick Actions */}
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 justify-items-center">
                            <Link href="/research">
                                <Button
                                    size="lg"
                                    className="w-full bg-blue-500 hover:bg-blue-600"
                                >
                                    <BookOpen className="mr-2 h-5 w-5" />
                                    Research Portal
                                </Button>
                            </Link>
                            <Link href="/events">
                                <Button
                                    size="lg"
                                    className="w-full bg-green-500 hover:bg-green-600"
                                >
                                    <Calendar className="mr-2 h-5 w-5" />
                                    Medical Events
                                </Button>
                            </Link>
                            <Link href="/membership">
                                <Button
                                    size="lg"
                                    className="w-full bg-purple-500 hover:bg-purple-600"
                                >
                                    <Users className="mr-2 h-5 w-5" />
                                    Membership
                                </Button>
                            </Link>
                            <Link href="/publications">
                                <Button
                                    size="lg"
                                    className="w-full bg-orange-500 hover:bg-orange-600"
                                >
                                    <FileText className="mr-2 h-5 w-5" />
                                    Publications
                                </Button>
                            </Link>
                        </div>

                        {/* Recent Activity Section */}
                        <div>
                            <h3 className="text-2xl font-bold text-slate-800 mb-8 text-center">
                                Recent Activity
                            </h3>
                            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
                                <Card className="w-full max-w-lg mx-auto">
                                    <CardHeader>
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <Award className="h-5 w-5 text-blue-500" />
                                            Latest Achievements
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            <div className="flex items-start gap-3">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                                <div>
                                                    <p className="text-sm font-medium">
                                                        Research Grant Awarded
                                                    </p>
                                                    <p className="text-xs text-slate-600">
                                                        ৳50L funding for liver cancer research
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                                                <div>
                                                    <p className="text-sm font-medium">
                                                        International Collaboration
                                                    </p>
                                                    <p className="text-xs text-slate-600">
                                                        Partnership with Johns Hopkins
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                                                <div>
                                                    <p className="text-sm font-medium">
                                                        New Treatment Protocol
                                                    </p>
                                                    <p className="text-xs text-slate-600">
                                                        Approved by medical board
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="w-full max-w-lg mx-auto">
                                    <CardHeader>
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <TrendingUp className="h-5 w-5 text-green-500" />
                                            Impact Metrics
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div>
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-sm font-medium">
                                                        Patient Care
                                                    </span>
                                                    <span className="text-sm text-slate-600">
                                                        95%
                                                    </span>
                                                </div>
                                                <div className="w-full bg-slate-200 rounded-full h-2">
                                                    <div
                                                        className="bg-blue-500 h-2 rounded-full"
                                                        style={{ width: "95%" }}
                                                    ></div>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-sm font-medium">
                                                        Research Progress
                                                    </span>
                                                    <span className="text-sm text-slate-600">
                                                        78%
                                                    </span>
                                                </div>
                                                <div className="w-full bg-slate-200 rounded-full h-2">
                                                    <div
                                                        className="bg-green-500 h-2 rounded-full"
                                                        style={{ width: "78%" }}
                                                    ></div>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-sm font-medium">
                                                        Member Satisfaction
                                                    </span>
                                                    <span className="text-sm text-slate-600">
                                                        92%
                                                    </span>
                                                </div>
                                                <div className="w-full bg-slate-200 rounded-full h-2">
                                                    <div
                                                        className="bg-purple-500 h-2 rounded-full"
                                                        style={{ width: "92%" }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Member Applications Tab */}
                    <TabsContent value="members">
                        <MemberApplicationsTab />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
