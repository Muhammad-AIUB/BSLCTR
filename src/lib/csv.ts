export type CsvColumn<T> = {
    header: string;
    value: (row: T) => string | number | null | undefined;
    /**
     * Keep the cell as text when a spreadsheet opens the file. Phone and registration
     * numbers need it: read as numbers they lose a leading zero or plus.
     */
    text?: boolean;
};

// A cell that begins like this is run as a formula by the spreadsheet that opens the file.
const FORMULA_START = /^[=+\-@\t\r]/;

const quote = (s: string) => `"${s.replace(/"/g, '""')}"`;

/**
 * Builds a CSV file that opens correctly in Excel: a byte-order mark so Bangla names are read
 * as UTF-8, CRLF line ends, and every cell quoted.
 *
 * The rows come from public forms, so no cell may reach the spreadsheet as a formula. A
 * `text` column is led by a tab, which makes the cell text; any other cell that starts like a
 * formula is led by an apostrophe.
 */
export function toCsv<T>(columns: CsvColumn<T>[], rows: T[]): string {
    const lines = rows.map((row) =>
        columns
            .map((column) => {
                const raw = column.value(row);
                const s = raw == null ? "" : String(raw);
                if (column.text) return quote(s ? `\t${s}` : "");
                return quote(FORMULA_START.test(s) ? `'${s}` : s);
            })
            .join(",")
    );
    const header = columns.map((column) => quote(column.header)).join(",");
    return "﻿" + [header, ...lines].join("\r\n") + "\r\n";
}

/** A CSV download. Never cached: these files hold people's contact details. */
export function csvResponse(csv: string, filename: string): Response {
    return new Response(csv, {
        headers: {
            "Content-Type": "text/csv; charset=utf-8",
            "Content-Disposition": `attachment; filename="${filename}"`,
            "Cache-Control": "no-store",
        },
    });
}
