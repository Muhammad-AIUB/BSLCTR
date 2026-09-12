"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen, MapPin, Phone } from "lucide-react";
import LanguageToggle, { useLang } from "@/components/LanguageToggle";
import { UI, type Doctor } from "@/lib/doctors";

export default function DoctorProfile({ doctor }: { doctor: Doctor }) {
    const { lang } = useLang();
    const t = UI[lang];

    return (
        <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white">
            <div className="container mx-auto max-w-4xl px-4 py-12 md:px-6">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <Link
                        href="/doctors"
                        className="inline-flex min-h-11 items-center gap-1.5 text-sm text-slate-600 outline-none transition-colors hover:text-secondary focus-visible:ring-2 focus-visible:ring-primary/50"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        {t.backToDoctors}
                    </Link>
                    <LanguageToggle />
                </div>

                {/* Profile: photo left, details right */}
                <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <div className="mb-6 flex flex-col items-center gap-5 border-b border-slate-100 pb-6 text-center sm:flex-row sm:items-start sm:text-left">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={doctor.photo}
                            alt={doctor.name[lang]}
                            className="h-32 w-32 shrink-0 rounded-full border-4 border-primary/15 object-cover"
                        />
                        <div className="min-w-0">
                            <h1 className="text-2xl font-medium">
                                {doctor.name[lang]}
                            </h1>
                            <p className="mt-1 text-sm font-medium text-secondary">
                                {doctor.qualifications}
                            </p>
                            <p className="mt-2 text-sm font-semibold text-slate-700">
                                {doctor.designation[lang]}
                            </p>
                            <p className="mt-1 text-sm text-slate-600">
                                {doctor.posting[lang]}
                            </p>

                            <dl className="mt-4 space-y-1.5 text-sm">
                                <div className="flex flex-wrap gap-x-2">
                                    <dt className="text-slate-400">
                                        {t.specialities}:
                                    </dt>
                                    <dd className="font-medium text-slate-700">
                                        {doctor.specialities[lang]}
                                    </dd>
                                </div>
                                {doctor.experienceSummary && (
                                    <div className="flex flex-wrap gap-x-2">
                                        <dt className="text-slate-400">
                                            {t.experienceSummary}:
                                        </dt>
                                        <dd className="text-slate-700">
                                            {doctor.experienceSummary}
                                        </dd>
                                    </div>
                                )}
                                {doctor.practicingBranch && (
                                    <div className="flex flex-wrap gap-x-2">
                                        <dt className="text-slate-400">
                                            {t.practicingBranch}:
                                        </dt>
                                        <dd className="text-slate-700">
                                            {doctor.practicingBranch[lang]}
                                        </dd>
                                    </div>
                                )}
                            </dl>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {doctor.bio[lang].map((para, i) => (
                            <p
                                key={i}
                                className={`text-justify text-[15px] text-slate-700 ${
                                    lang === "bn"
                                        ? "leading-8"
                                        : "leading-relaxed"
                                }`}
                            >
                                {para}
                            </p>
                        ))}
                    </div>
                </section>

                {/* Journals */}
                <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <h2 className="mb-4 flex items-center gap-2 text-lg font-medium">
                        <BookOpen className="h-5 w-5 text-secondary" />
                        {t.journals}
                    </h2>
                    {doctor.journals.length === 0 ? (
                        <p className="text-sm text-slate-500">
                            {t.journalsEmpty}
                        </p>
                    ) : (
                        <ol className="list-decimal space-y-3 pl-5">
                            {doctor.journals.map((j, i) => (
                                <li
                                    key={i}
                                    className="pl-1 text-sm leading-relaxed text-slate-700"
                                >
                                    {j}
                                </li>
                            ))}
                        </ol>
                    )}
                </section>

                {/* Chamber address */}
                <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <h2 className="mb-4 flex items-center gap-2 text-lg font-medium">
                        <MapPin className="h-5 w-5 text-secondary" />
                        {t.chamber}
                    </h2>
                    {doctor.chambers.length === 0 ? (
                        <p className="text-sm text-slate-500">
                            {t.chamberEmpty}
                        </p>
                    ) : (
                        <ul className="space-y-4">
                            {doctor.chambers.map((c, i) => (
                                <li
                                    key={i}
                                    className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                                >
                                    <p className="font-medium text-slate-800">
                                        {c.name[lang]}
                                    </p>
                                    <p className="mt-2 flex items-start gap-1.5 text-sm text-slate-600">
                                        <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
                                        {c.address[lang]}
                                    </p>
                                    {c.phones.length > 0 && (
                                        <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                                            <span className="flex items-center gap-1.5 text-slate-400">
                                                <Phone className="h-3.5 w-3.5" />
                                                {t.callForSerial}:
                                            </span>
                                            {c.phones.map((p) => (
                                                <a
                                                    key={p}
                                                    href={`tel:${p.replace(/\s+/g, "")}`}
                                                    className="font-medium text-secondary outline-none hover:underline focus-visible:ring-2 focus-visible:ring-primary/50"
                                                >
                                                    {p}
                                                </a>
                                            ))}
                                        </p>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </div>
    );
}
