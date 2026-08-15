import { notFound } from "next/navigation";
import { DOCTORS, getDoctor } from "@/lib/doctors";
import DoctorProfile from "./DoctorProfile";

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
        title: `${doctor.name.en} | BSLCTR`,
        description: `${doctor.designation.en} — ${doctor.posting.en}`,
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

    return <DoctorProfile doctor={doctor} />;
}
