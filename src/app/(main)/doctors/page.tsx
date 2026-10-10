"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronRight, Stethoscope } from "lucide-react";
import DistrictCombobox from "@/components/DistrictCombobox";
import LanguageToggle, { useLang } from "@/components/LanguageToggle";
import { DOCTORS, DOCTOR_CATEGORIES, UI, type Doctor, type Lang } from "@/lib/doctors";
import { Section } from "@/components/ui/section";

// useSearchParams needs a Suspense boundary for the page to prerender, and only the fallback
// is in the prerendered HTML. The fallback is therefore the unfiltered directory, so the page
// has the doctors in it before JavaScript runs.
export default function DoctorsPage() {
    return (
        <Suspense fallback={<DoctorsDirectory type={null} />}>
            <FilteredDirectory />
        </Suspense>
    );
}

function FilteredDirectory() {
    // ?type=<category slug>, set by the Doctors menu in the nav and the chips below.
    return <DoctorsDirectory type={useSearchParams().get("type")} />;
}

function DoctorsDirectory({ type }: { type: string | null }) {
    const [district, setDistrict] = useState("");
    const { lang } = useLang();
    const t = UI[lang];

    const category = DOCTOR_CATEGORIES.find((c) => c.slug === type);

    const visible = useMemo(
        () =>
            DOCTORS.filter(
                (d) =>
                    (!category || d.category === category.slug) &&
                    (!district || d.district === district),
            ),
        [category, district],
    );

    const chip = (active: boolean) =>
        `rounded-full border px-4 py-2 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
            active
                ? "border-primary bg-primary text-primary-foreground"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
        }`;

    return (
        <Section watermark={t.doctors} eyebrow="Directory" title={t.doctors}>
            <div className="max-w-6xl">
                {/* The toggle used to sit in the heading row; the heading now
                    lives on <Section>, so it moves above the intro. */}
                <div className="mb-6 flex justify-end">
                    <LanguageToggle />
                </div>
                <p className="mb-6 max-w-2xl text-body">{t.intro}</p>

                <div className="mb-6 flex flex-wrap gap-2">
                    <Link
                        href="/doctors"
                        aria-current={category ? undefined : "true"}
                        className={chip(!category)}
                    >
                        {t.allDoctors}
                    </Link>
                    {DOCTOR_CATEGORIES.map((c) => (
                        <Link
                            key={c.slug}
                            href={`/doctors?type=${c.slug}`}
                            aria-current={category?.slug === c.slug ? "true" : undefined}
                            className={chip(category?.slug === c.slug)}
                        >
                            {c.name[lang]}
                        </Link>
                    ))}
                </div>

                <div className="mb-8 max-w-xs">
                    <label
                        htmlFor="district-filter"
                        className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500"
                    >
                        {t.filterByDistrict}
                    </label>
                    <DistrictCombobox
                        id="district-filter"
                        value={district}
                        onChange={setDistrict}
                        placeholder={t.allDistricts}
                    />
                </div>

                {visible.length === 0 ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="w-full max-w-sm rounded-xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center sm:px-10">
                            <Stethoscope className="mx-auto mb-3 h-10 w-10 text-slate-400" />
                            {district ? (
                                <>
                                    <p className="font-medium text-slate-600">
                                        {t.noneInDistrict} {district}.
                                    </p>
                                    <p className="mt-1 text-sm text-slate-500">
                                        {t.tryAnother}
                                    </p>
                                </>
                            ) : (
                                <p className="font-medium text-slate-600">
                                    {t.noneInCategory}
                                </p>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2">
                        {visible.map((d) => (
                            <DoctorCard key={d.slug} doctor={d} lang={lang} />
                        ))}
                    </div>
                )}
            </div>
        </Section>
    );
}

function DoctorCard({ doctor: d, lang }: { doctor: Doctor; lang: Lang }) {
    const t = UI[lang];

    return (
        <Link
            href={`/doctors/${d.slug}`}
            className="group flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm outline-none transition-shadow hover:shadow-md focus-visible:ring-2 focus-visible:ring-primary"
        >
            <div className="flex items-start gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={d.photo}
                    alt=""
                    className="h-20 w-20 shrink-0 rounded-full border-2 border-primary/15 object-cover"
                />
                <div className="min-w-0 flex-1">
                    <h3 className="font-medium group-hover:text-secondary">
                        {d.name[lang]}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-secondary">
                        {d.qualifications}
                    </p>
                    <p className="mt-2 text-xs font-medium text-slate-600">
                        {d.designation[lang]}
                    </p>
                </div>
            </div>

            <p className="mt-4 text-sm text-slate-600">
                <span className="text-slate-400">{t.specialities}: </span>
                {d.specialities[lang]}
            </p>
            <p className="mt-1 text-sm text-slate-600">{d.posting[lang]}</p>

            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-secondary">
                {t.viewDetails}
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
        </Link>
    );
}
