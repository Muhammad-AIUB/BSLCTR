"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, Stethoscope } from "lucide-react";
import DistrictCombobox from "@/components/DistrictCombobox";
import { DOCTORS, type Doctor } from "@/lib/doctors";

export default function DoctorsPage() {
    const [district, setDistrict] = useState("");

    const visible = useMemo(
        () =>
            district
                ? DOCTORS.filter((d) => d.district === district)
                : DOCTORS,
        [district],
    );

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

                {visible.length === 0 ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="w-full max-w-sm rounded-xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center sm:px-10">
                            <Stethoscope className="mx-auto mb-3 h-10 w-10 text-slate-400" />
                            <p className="font-medium text-slate-600">
                                No doctors in {district}.
                            </p>
                            <p className="mt-1 text-sm text-slate-500">
                                Try another district.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2">
                        {visible.map((d) => (
                            <DoctorCard key={d.slug} doctor={d} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function DoctorCard({ doctor: d }: { doctor: Doctor }) {
    return (
        <Link
            href={`/doctors/${d.slug}`}
            className="group flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm outline-none transition-shadow hover:shadow-md focus-visible:ring-2 focus-visible:ring-primary/50"
        >
            <div className="flex items-start gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={d.photo}
                    alt=""
                    className="h-20 w-20 shrink-0 rounded-full border-2 border-primary/15 object-cover"
                />
                <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-slate-800 group-hover:text-secondary">
                        {d.name}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-secondary">
                        {d.qualifications}
                    </p>
                    <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
                        {d.title}
                    </p>
                </div>
            </div>

            <p className="mt-4 line-clamp-2 text-sm text-slate-600">
                {d.posting}
            </p>

            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-secondary">
                View details
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
        </Link>
    );
}
