"use client";

import { useEffect, useMemo, useState } from "react";
import { BadgeCheck, MapPin, Stethoscope, User } from "lucide-react";
import DistrictCombobox from "@/components/DistrictCombobox";
import { districtFromChamber } from "@/lib/districts";

interface Member {
    id: string;
    name: string;
    bmdcNo: string;
    designation: string;
    specialtySubject: string;
    otherSpecialty: string | null;
    academicQualifications: string;
    specializedTraining: string | null;
    currentPosting: string | null;
    pastPostings: string[];
    chamberAddresses: string[];
    shortIntroduction: string | null;
    shortBiography: string | null;
    journals: string | null;
    profilePicture: string | null;
    interventions: string[];
}

// Mirrors the options offered at member signup.
const SPECIALTY_LABELS: Record<string, string> = {
    hepatologist: "Hepatologist",
    hepatobiliary_surgeon: "Hepatobiliary Surgeon",
    intervention_hepatologist: "Intervention Hepatologist",
    other: "Other",
};

const specialtyLabel = (m: Member) =>
    m.specialtySubject === "other" && m.otherSpecialty
        ? m.otherSpecialty
        : (SPECIALTY_LABELS[m.specialtySubject] ?? m.specialtySubject);

export default function DoctorsPage() {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [district, setDistrict] = useState("");

    useEffect(() => {
        fetch("/api/members")
            .then((r) => r.json())
            .then((d: Member[]) => setMembers(Array.isArray(d) ? d : []))
            .catch(() => setMembers([]))
            .finally(() => setLoading(false));
    }, []);

    const visible = useMemo(() => {
        if (!district) return members;
        return members.filter((m) =>
            m.chamberAddresses.some(
                (a) => districtFromChamber(a) === district,
            ),
        );
    }, [members, district]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white">
            <div className="container mx-auto max-w-6xl px-4 py-12 md:px-6">
                <div className="mb-2 flex items-center gap-3">
                    <h2 className="text-2xl font-bold text-slate-800">Doctors</h2>
                    <div className="h-px flex-1 bg-slate-200" />
                </div>
                <p className="mb-6 max-w-2xl text-sm text-slate-600">
                    Hepatologists, hepatobiliary surgeons and intervention
                    hepatologists registered with the society.
                </p>

                {/* District filter */}
                <div className="mb-8 max-w-xs">
                    <label
                        htmlFor="district-filter"
                        className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500"
                    >
                        Filter by district
                    </label>
                    <DistrictCombobox
                        id="district-filter"
                        value={district}
                        onChange={setDistrict}
                        placeholder="All districts"
                    />
                </div>

                {loading ? (
                    <div className="py-10 text-center text-muted-foreground">
                        Loading...
                    </div>
                ) : visible.length === 0 ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="w-full max-w-sm rounded-xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center sm:px-10">
                            <Stethoscope className="mx-auto mb-3 h-10 w-10 text-slate-400" />
                            <p className="font-medium text-slate-600">
                                {members.length === 0
                                    ? "No doctors listed yet."
                                    : `No doctors in ${district}.`}
                            </p>
                            <p className="mt-1 text-sm text-slate-500">
                                {members.length === 0
                                    ? "Approved members will appear here."
                                    : "Try another district."}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {visible.map((m) => (
                            <DoctorCard key={m.id} member={m} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function DoctorCard({ member: m }: { member: Member }) {
    return (
        <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-start gap-4">
                {m.profilePicture ? (
                    // Stored as a data URI / uploaded path, so plain img rather
                    // than next/image (no known loader or remote host).
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={m.profilePicture}
                        alt=""
                        className="h-16 w-16 shrink-0 rounded-full border border-slate-200 object-cover"
                    />
                ) : (
                    <span className="inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-slate-400">
                        <User className="h-7 w-7" />
                    </span>
                )}

                <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold text-slate-800">
                        {m.name}
                    </h3>
                    {m.designation && (
                        <p className="truncate text-sm text-slate-600">
                            {m.designation}
                        </p>
                    )}
                    <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        <Stethoscope className="h-3 w-3" />
                        {specialtyLabel(m)}
                    </span>
                </div>
            </div>

            <dl className="mt-4 space-y-2 text-sm">
                {m.academicQualifications && (
                    <div>
                        <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Qualifications
                        </dt>
                        <dd className="text-slate-700">
                            {m.academicQualifications}
                        </dd>
                    </div>
                )}
                {m.currentPosting && (
                    <div>
                        <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Current posting
                        </dt>
                        <dd className="text-slate-700">{m.currentPosting}</dd>
                    </div>
                )}
                {m.chamberAddresses.filter(Boolean).length > 0 && (
                    <div>
                        <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Chamber
                        </dt>
                        {m.chamberAddresses.filter(Boolean).map((a, i) => (
                            <dd
                                key={i}
                                className="flex items-start gap-1.5 text-slate-700"
                            >
                                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
                                <span>{a}</span>
                            </dd>
                        ))}
                    </div>
                )}
            </dl>

            {m.interventions.filter(Boolean).length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                    {m.interventions.filter(Boolean).map((iv, i) => (
                        <span
                            key={i}
                            className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
                        >
                            {iv}
                        </span>
                    ))}
                </div>
            )}

            {m.bmdcNo && (
                <p className="mt-4 inline-flex items-center gap-1.5 border-t border-slate-100 pt-3 text-xs text-slate-500">
                    <BadgeCheck className="h-3.5 w-3.5 text-slate-400" />
                    BMDC Reg. {m.bmdcNo}
                </p>
            )}
        </div>
    );
}
