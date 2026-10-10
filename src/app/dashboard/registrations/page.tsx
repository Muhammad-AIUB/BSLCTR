"use client";

import SubmissionsList, {
    bangladeshDateTime,
    type Column,
    type QuickFilter,
} from "@/components/dashboard/SubmissionsList";

type Registration = {
    id: string;
    name: string;
    degree: string;
    speciality: string;
    designation: string;
    institution: string;
    contactNo: string;
    email: string;
    /** "delegate" or "student", as the registration route stores it. */
    category: string;
    createdAt: string;
};

const contactLink = "text-secondary underline-offset-2 hover:underline";

const COLUMNS: Column<Registration>[] = [
    {
        header: "Name",
        cell: (r) => (
            <>
                <p className="font-medium text-foreground">{r.name}</p>
                <p className="text-xs text-body">{r.degree}</p>
            </>
        ),
    },
    {
        header: "Speciality",
        cell: (r) => (
            <>
                <p>{r.speciality}</p>
                <p className="text-xs text-body">{r.designation}</p>
            </>
        ),
    },
    { header: "Institution", cell: (r) => r.institution },
    {
        header: "Contact",
        cell: (r) => (
            <>
                <a href={`tel:${r.contactNo}`} className={`block whitespace-nowrap ${contactLink}`}>
                    {r.contactNo}
                </a>
                <a href={`mailto:${r.email}`} className={`block break-all text-xs ${contactLink}`}>
                    {r.email}
                </a>
            </>
        ),
    },
    {
        header: "Category",
        cell: (r) => (
            <span
                className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    r.category === "student"
                        ? "bg-accent text-primary-deep"
                        : "bg-secondary/10 text-secondary"
                }`}
            >
                {r.category === "student" ? "Student" : "Delegate"}
            </span>
        ),
    },
    {
        header: "Registered (Bangladesh time)",
        cell: (r) => <span className="whitespace-nowrap">{bangladeshDateTime(r.createdAt)}</span>,
    },
];

const FILTERS: QuickFilter<Registration>[] = [
    { label: "Delegates", test: (r) => r.category !== "student" },
    { label: "Students", test: (r) => r.category === "student" },
];

const searchText = (r: Registration) =>
    [r.name, r.degree, r.speciality, r.designation, r.institution, r.contactNo, r.email].join(" ");

export default function DashboardRegistrationsPage() {
    return (
        <SubmissionsList
            title="Conference registrations"
            description="Everyone who has registered for the conference through the site."
            endpoint="/api/admin/registrations"
            noun="registrations"
            columns={COLUMNS}
            filters={FILTERS}
            searchText={searchText}
            searchPlaceholder="Search by name, institution, phone or email"
        />
    );
}
