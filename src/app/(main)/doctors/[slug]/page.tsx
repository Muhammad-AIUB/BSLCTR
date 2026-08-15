import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen, MapPin } from "lucide-react";
import { DOCTORS, getDoctor } from "@/lib/doctors";

export function generateStaticParams() {
    return DOCTORS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const doctor = getDoctor(slug);
    if (!doctor) return { title: "Doctor | BSLCTR" };
    return {
        title: `${doctor.name} | BSLCTR`,
        description: doctor.title,
    };
}

export default async function DoctorDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const doctor = getDoctor(slug);
    if (!doctor) notFound();

    return (
        <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white">
            <div className="container mx-auto max-w-4xl px-4 py-12 md:px-6">
                <Link
                    href="/doctors"
                    className="mb-6 inline-flex min-h-11 items-center gap-1.5 text-sm text-slate-600 outline-none transition-colors hover:text-secondary focus-visible:ring-2 focus-visible:ring-primary/50"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to doctors
                </Link>

                {/* Profile: photo left, bio right */}
                <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <div className="mb-6 flex flex-col items-center gap-5 border-b border-slate-100 pb-6 text-center sm:flex-row sm:items-start sm:text-left">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={doctor.photo}
                            alt={doctor.name}
                            className="h-32 w-32 shrink-0 rounded-full border-4 border-primary/15 object-cover"
                        />
                        <div className="min-w-0">
                            <h1 className="text-2xl font-bold text-slate-800">
                                {doctor.name}
                            </h1>
                            <p className="mt-1 text-sm font-medium text-secondary">
                                {doctor.qualifications}
                            </p>
                            <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-slate-700">
                                {doctor.title}
                            </p>
                            <p className="mt-1 text-sm text-slate-600">
                                {doctor.posting}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {doctor.bio.map((para, i) => (
                            <p
                                key={i}
                                className="text-justify text-[15px] leading-8 text-slate-700"
                            >
                                {para}
                            </p>
                        ))}
                    </div>
                </section>

                {/* Journals */}
                <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-800">
                        <BookOpen className="h-5 w-5 text-secondary" />
                        Journals
                    </h2>
                    {doctor.journals.length === 0 ? (
                        <p className="text-sm text-slate-500">
                            Publication list not yet provided.
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
                    <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-800">
                        <MapPin className="h-5 w-5 text-secondary" />
                        Chamber Address
                    </h2>
                    {doctor.chambers.length === 0 ? (
                        <p className="text-sm text-slate-500">
                            Chamber details not yet provided.
                        </p>
                    ) : (
                        <ul className="space-y-4">
                            {doctor.chambers.map((c, i) => (
                                <li
                                    key={i}
                                    className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                                >
                                    <p className="font-medium text-slate-800">
                                        {c.name}
                                    </p>
                                    <p className="mt-1 flex items-start gap-1.5 text-sm text-slate-600">
                                        <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
                                        {c.address}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </div>
    );
}
