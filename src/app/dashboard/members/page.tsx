"use client";

import SubmissionsList, {
    bangladeshDateTime,
    type Column,
} from "@/components/dashboard/SubmissionsList";

type MemberSignup = {
    id: string;
    name: string;
    designation: string;
    specialtySubject: string;
    /** The "Affiliated Institution" field of the signup form. */
    currentPosting: string | null;
    bmdcNo: string;
    mobileNo: string;
    email: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    createdAt: string;
};

const contactLink = "text-secondary underline-offset-2 hover:underline";

const STATUS: Record<MemberSignup["status"], { label: string; className: string }> = {
    PENDING: { label: "Pending", className: "bg-amber-100 text-amber-900" },
    APPROVED: { label: "Approved", className: "bg-green-100 text-green-800" },
    REJECTED: { label: "Rejected", className: "bg-slate-100 text-slate-700" },
};

const COLUMNS: Column<MemberSignup>[] = [
    {
        header: "Name",
        cell: (m) => (
            <>
                <p className="font-medium text-foreground">{m.name}</p>
                <p className="text-xs text-body">{m.designation}</p>
            </>
        ),
    },
    { header: "Specialty", cell: (m) => m.specialtySubject },
    { header: "Institution", cell: (m) => m.currentPosting ?? "" },
    {
        header: "BMDC reg. no",
        cell: (m) => <span className="whitespace-nowrap">{m.bmdcNo}</span>,
    },
    {
        header: "Contact",
        cell: (m) => (
            <>
                <a href={`tel:${m.mobileNo}`} className={`block whitespace-nowrap ${contactLink}`}>
                    {m.mobileNo}
                </a>
                <a href={`mailto:${m.email}`} className={`block break-all text-xs ${contactLink}`}>
                    {m.email}
                </a>
            </>
        ),
    },
    {
        header: "Status",
        cell: (m) => {
            const status = STATUS[m.status] ?? STATUS.PENDING;
            return (
                <span
                    className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}
                >
                    {status.label}
                </span>
            );
        },
    },
    {
        header: "Applied (Bangladesh time)",
        cell: (m) => <span className="whitespace-nowrap">{bangladeshDateTime(m.createdAt)}</span>,
    },
];

const searchText = (m: MemberSignup) =>
    [m.name, m.designation, m.specialtySubject, m.currentPosting, m.bmdcNo, m.mobileNo, m.email].join(" ");

export default function DashboardMembersPage() {
    return (
        <SubmissionsList
            title="Member signups"
            description="Membership applications sent through the site's Membership form."
            endpoint="/api/admin/members"
            noun="member signups"
            columns={COLUMNS}
            searchText={searchText}
            searchPlaceholder="Search by name, institution, BMDC no, phone or email"
        />
    );
}
