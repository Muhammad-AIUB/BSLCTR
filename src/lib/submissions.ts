import type { ConferenceRegistration, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { CsvColumn } from "@/lib/csv";

// What the public forms have collected, for the dashboard's Registrations and Member
// signups tabs: the same rows as a list and as a CSV export.

const BANGLADESH_OFFSET_MS = 6 * 60 * 60 * 1000;

/** "2026-10-10 21:05" in Bangladesh time (UTC+6 all year), whatever timezone the server is in. */
export function bangladeshTimestamp(date: Date): string {
    return new Date(date.getTime() + BANGLADESH_OFFSET_MS)
        .toISOString()
        .slice(0, 16)
        .replace("T", " ");
}

/** Today's date in Bangladesh, for naming an export file. */
export function bangladeshDateStamp(): string {
    return bangladeshTimestamp(new Date()).slice(0, 10);
}

export function listRegistrations() {
    return prisma.conferenceRegistration.findMany({ orderBy: { createdAt: "desc" } });
}

export const REGISTRATION_CSV: CsvColumn<ConferenceRegistration>[] = [
    { header: "Name", value: (r) => r.name },
    { header: "Degree", value: (r) => r.degree },
    { header: "Speciality", value: (r) => r.speciality },
    { header: "Designation", value: (r) => r.designation },
    { header: "Institution", value: (r) => r.institution },
    { header: "Contact no", value: (r) => r.contactNo, text: true },
    { header: "Email", value: (r) => r.email },
    { header: "Category", value: (r) => (r.category === "student" ? "Student" : "Delegate") },
    { header: "Registered (Bangladesh time)", value: (r) => bangladeshTimestamp(r.createdAt) },
];

// What an admin sees of a membership application. Named column by column, so that
// `password` can never be part of it.
const MEMBER_SIGNUP_SELECT = {
    id: true,
    name: true,
    designation: true,
    specialtySubject: true,
    currentPosting: true,
    bmdcNo: true,
    mobileNo: true,
    email: true,
    status: true,
    createdAt: true,
} satisfies Prisma.MemberSelect;

export type MemberSignup = Prisma.MemberGetPayload<{ select: typeof MEMBER_SIGNUP_SELECT }>;

export function listMemberSignups() {
    return prisma.member.findMany({
        orderBy: { createdAt: "desc" },
        select: MEMBER_SIGNUP_SELECT,
    });
}

export const MEMBER_SIGNUP_CSV: CsvColumn<MemberSignup>[] = [
    { header: "Name", value: (m) => m.name },
    { header: "Designation", value: (m) => m.designation },
    { header: "Specialty", value: (m) => m.specialtySubject },
    { header: "Institution", value: (m) => m.currentPosting },
    { header: "BMDC reg. no", value: (m) => m.bmdcNo, text: true },
    { header: "Mobile no", value: (m) => m.mobileNo, text: true },
    { header: "Email", value: (m) => m.email },
    { header: "Status", value: (m) => m.status.charAt(0) + m.status.slice(1).toLowerCase() },
    { header: "Applied (Bangladesh time)", value: (m) => bangladeshTimestamp(m.createdAt) },
];
