"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { Download, RefreshCw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type Column<T> = {
    header: string;
    cell: (row: T) => ReactNode;
};

/** A one-click filter shown beside "All", with its own count. */
export type QuickFilter<T> = {
    label: string;
    test: (row: T) => boolean;
};

const dateTime = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Dhaka",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
});

/** "10 Oct 2026, 21:05" in Bangladesh time, whatever timezone the admin's browser is in. */
export function bangladeshDateTime(iso: string): string {
    return dateTime.format(new Date(iso));
}

// One shared empty list, so that a page without quick filters does not hand the memo
// below a new array on every render.
const NO_FILTERS: QuickFilter<unknown>[] = [];

type Props<T> = {
    title: string;
    description: string;
    /** GET returns the rows as JSON; `${endpoint}/export` returns them as a CSV file. */
    endpoint: string;
    /** What the rows are called, in the plural: "registrations". */
    noun: string;
    columns: Column<T>[];
    /** The text the search box looks through for each row. */
    searchText: (row: T) => string;
    searchPlaceholder: string;
    filters?: QuickFilter<T>[];
};

/**
 * A read-only dashboard list of what a public form has collected: search, quick filters and a
 * CSV export. A table from md up, and one card per row on a phone.
 */
export default function SubmissionsList<T extends { id: string }>({
    title,
    description,
    endpoint,
    noun,
    columns,
    searchText,
    searchPlaceholder,
    filters = NO_FILTERS,
}: Props<T>) {
    const [rows, setRows] = useState<T[]>([]);
    const [state, setState] = useState<"loading" | "ready" | "error">("loading");
    const [query, setQuery] = useState("");
    // Index into `filters`, or null for "All".
    const [filter, setFilter] = useState<number | null>(null);
    const [exporting, setExporting] = useState(false);
    const [exportFailed, setExportFailed] = useState(false);

    const load = useCallback(async () => {
        setState("loading");
        try {
            const res = await fetch(endpoint, { cache: "no-store" });
            if (res.status === 401) {
                window.location.href = "/";
                return;
            }
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            setRows(await res.json());
            setState("ready");
        } catch {
            setState("error");
        }
    }, [endpoint]);

    useEffect(() => {
        load();
    }, [load]);

    // Fetched rather than linked to, so that an expired session or a server error is reported
    // here instead of being saved to the admin's computer as the "export".
    async function exportCsv() {
        setExporting(true);
        setExportFailed(false);
        try {
            const res = await fetch(`${endpoint}/export`, { cache: "no-store" });
            if (res.status === 401) {
                window.location.href = "/";
                return;
            }
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const named = /filename="([^"]+)"/.exec(res.headers.get("content-disposition") ?? "");
            const url = URL.createObjectURL(await res.blob());
            const link = document.createElement("a");
            link.href = url;
            link.download = named?.[1] ?? `${noun}.csv`;
            link.click();
            // Released a moment later: the download reads from it after the click returns.
            setTimeout(() => URL.revokeObjectURL(url), 1000);
        } catch {
            setExportFailed(true);
        } finally {
            setExporting(false);
        }
    }

    const visible = useMemo(() => {
        const q = query.trim().toLowerCase();
        const test = filter === null ? null : filters[filter]?.test;
        return rows.filter(
            (row) => (!test || test(row)) && (!q || searchText(row).toLowerCase().includes(q))
        );
    }, [rows, query, filter, filters, searchText]);

    const narrowed = visible.length !== rows.length;
    const clear = () => {
        setQuery("");
        setFilter(null);
    };

    const chip = (active: boolean) =>
        `inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 ${
            active
                ? "border-secondary bg-secondary text-white"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
        }`;
    const count = (active: boolean) =>
        `rounded-full px-1.5 text-xs tabular-nums ${active ? "bg-white/20" : "bg-slate-100 text-slate-600"}`;

    return (
        <div className="mx-auto max-w-6xl">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-secondary">{title}</h1>
                    <p className="mt-1 text-sm text-body">{description}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button variant="outline" onClick={load} disabled={state === "loading"}>
                        <RefreshCw aria-hidden="true" />
                        Refresh
                    </Button>
                    <Button
                        onClick={exportCsv}
                        disabled={exporting || state !== "ready" || rows.length === 0}
                        className="bg-secondary text-white hover:bg-secondary/90"
                    >
                        <Download aria-hidden="true" />
                        {exporting ? "Preparing..." : "Export all as CSV"}
                    </Button>
                </div>
            </div>

            {exportFailed && (
                <p role="alert" className="mt-3 text-sm text-destructive">
                    Could not export the {noun}. Try again.
                </p>
            )}

            {state === "error" ? (
                <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
                    <p role="alert" className="text-sm text-destructive">
                        Could not load the {noun}.
                    </p>
                    <Button variant="outline" onClick={load} className="mt-3">
                        Try again
                    </Button>
                </div>
            ) : state === "loading" && rows.length === 0 ? (
                <p className="mt-8 text-sm text-body">Loading...</p>
            ) : rows.length === 0 ? (
                <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
                    <p className="font-medium text-slate-700">No {noun} yet.</p>
                    <p className="mt-1 text-sm text-body">
                        They will be listed here as people submit the form on the site.
                    </p>
                </div>
            ) : (
                <>
                    <div className="mt-6 flex flex-wrap items-center gap-3">
                        {filters.length > 0 && (
                        <div role="group" aria-label="Filter" className="flex flex-wrap gap-2">
                            <button
                                type="button"
                                aria-pressed={filter === null}
                                onClick={() => setFilter(null)}
                                className={chip(filter === null)}
                            >
                                All
                                <span className={count(filter === null)}>{rows.length}</span>
                            </button>
                            {filters.map((f, i) => (
                                <button
                                    key={f.label}
                                    type="button"
                                    aria-pressed={filter === i}
                                    onClick={() => setFilter(i)}
                                    className={chip(filter === i)}
                                >
                                    {f.label}
                                    <span className={count(filter === i)}>
                                        {rows.filter(f.test).length}
                                    </span>
                                </button>
                            ))}
                        </div>
                        )}

                        <div
                            className={`relative min-w-56 flex-1 sm:max-w-sm ${
                                filters.length > 0 ? "sm:ml-auto" : ""
                            }`}
                        >
                            <label htmlFor="submissions-search" className="sr-only">
                                Search {noun}
                            </label>
                            <Search
                                aria-hidden="true"
                                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                            />
                            <Input
                                id="submissions-search"
                                type="search"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder={searchPlaceholder}
                                className="bg-white pl-9"
                            />
                        </div>
                    </div>

                    <p aria-live="polite" className="mt-3 text-xs text-body">
                        {narrowed
                            ? `Showing ${visible.length} of ${rows.length} ${noun}.`
                            : `${rows.length} ${noun}, newest first.`}{" "}
                        {narrowed && (
                            <button
                                type="button"
                                onClick={clear}
                                className="font-medium text-secondary underline underline-offset-2"
                            >
                                Show all
                            </button>
                        )}
                    </p>

                    {visible.length === 0 ? (
                        <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
                            <p className="font-medium text-slate-700">
                                No {noun} match what you are looking for.
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* md and up: a table. */}
                            <div className="mt-4 hidden overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm md:block">
                                <table className="w-full text-left text-sm">
                                    <caption className="sr-only">{title}</caption>
                                    <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
                                        <tr>
                                            {columns.map((c) => (
                                                <th
                                                    key={c.header}
                                                    scope="col"
                                                    className="whitespace-nowrap px-4 py-3 font-semibold"
                                                >
                                                    {c.header}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {visible.map((row) => (
                                            <tr key={row.id} className="align-top hover:bg-slate-50/70">
                                                {columns.map((c) => (
                                                    <td key={c.header} className="px-4 py-3">
                                                        {c.cell(row)}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Phones: the same cells, one card per row. */}
                            <ul className="mt-4 grid gap-3 md:hidden">
                                {visible.map((row) => (
                                    <li
                                        key={row.id}
                                        className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                                    >
                                        <dl className="grid gap-3">
                                            {columns.map((c) => (
                                                <div key={c.header}>
                                                    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                                                        {c.header}
                                                    </dt>
                                                    <dd className="mt-0.5 text-sm">{c.cell(row)}</dd>
                                                </div>
                                            ))}
                                        </dl>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </>
            )}
        </div>
    );
}
