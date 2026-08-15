"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { searchDistricts } from "@/lib/districts";

type DistrictComboboxProps = {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    placeholder?: string;
    id?: string;
};

/**
 * Type-ahead district picker. Behaves like a native select (click to open the
 * full list of 64) but filters as you type, so a district can be reached with
 * two or three keystrokes instead of scrolling.
 */
export default function DistrictCombobox({
    value,
    onChange,
    disabled,
    placeholder = "Select district...",
    id,
}: DistrictComboboxProps) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [active, setActive] = useState(0);

    const wrapRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLUListElement>(null);

    const autoId = useId();
    const inputId = id ?? `district-${autoId}`;
    const listId = `${inputId}-list`;

    // While closed the input shows the selection; while open it shows what the
    // user is typing, so the whole list stays reachable after a pick.
    const results = useMemo(() => searchDistricts(query), [query]);

    useEffect(() => setActive(0), [query]);

    useEffect(() => {
        if (!open) return;
        const onPointerDown = (e: MouseEvent | TouchEvent) => {
            if (!wrapRef.current?.contains(e.target as Node)) close();
        };
        document.addEventListener("mousedown", onPointerDown);
        document.addEventListener("touchstart", onPointerDown);
        return () => {
            document.removeEventListener("mousedown", onPointerDown);
            document.removeEventListener("touchstart", onPointerDown);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    // Keep the highlighted option in view during keyboard navigation.
    useEffect(() => {
        if (!open) return;
        listRef.current
            ?.querySelector(`[data-idx="${active}"]`)
            ?.scrollIntoView({ block: "nearest" });
    }, [active, open]);

    function close() {
        setOpen(false);
        setQuery("");
    }

    function pick(district: string) {
        onChange(district);
        close();
        inputRef.current?.blur();
    }

    function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            if (!open) {
                setOpen(true);
                return;
            }
            if (results.length === 0) return;
            setActive((i) =>
                e.key === "ArrowDown"
                    ? (i + 1) % results.length
                    : (i - 1 + results.length) % results.length,
            );
        } else if (e.key === "Enter") {
            if (open && results[active]) {
                e.preventDefault();
                pick(results[active]);
            }
        } else if (e.key === "Escape") {
            if (open) {
                e.preventDefault();
                close();
            }
        } else if (e.key === "Tab") {
            close();
        }
    }

    return (
        <div ref={wrapRef} className="relative">
            <div className="relative">
                <input
                    ref={inputRef}
                    id={inputId}
                    type="text"
                    role="combobox"
                    aria-expanded={open}
                    aria-controls={listId}
                    aria-autocomplete="list"
                    aria-activedescendant={
                        open && results[active]
                            ? `${listId}-opt-${active}`
                            : undefined
                    }
                    autoComplete="off"
                    disabled={disabled}
                    placeholder={placeholder}
                    value={open ? query : value}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        if (!open) setOpen(true);
                    }}
                    onFocus={() => setOpen(true)}
                    onClick={() => setOpen(true)}
                    onKeyDown={onKeyDown}
                    className="flex h-9 w-full min-w-0 rounded-md border border-input bg-transparent py-1 pl-3 pr-16 text-base shadow-xs outline-none transition-[color,box-shadow] selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                />

                <div className="absolute inset-y-0 right-0 flex items-center gap-0.5 pr-2">
                    {value && !disabled && (
                        <button
                            type="button"
                            aria-label="Clear district"
                            onClick={() => {
                                onChange("");
                                setQuery("");
                                inputRef.current?.focus();
                            }}
                            className="rounded p-1 text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    )}
                    <ChevronDown
                        className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${
                            open ? "rotate-180" : ""
                        }`}
                        aria-hidden="true"
                    />
                </div>
            </div>

            {open && !disabled && (
                <ul
                    ref={listRef}
                    id={listId}
                    role="listbox"
                    aria-label="Districts"
                    className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-slate-200 bg-white py-1 shadow-lg"
                >
                    {results.length === 0 ? (
                        <li className="px-3 py-2 text-sm text-muted-foreground">
                            No district found
                        </li>
                    ) : (
                        results.map((d, i) => {
                            const selected = d === value;
                            return (
                                <li
                                    key={d}
                                    id={`${listId}-opt-${i}`}
                                    data-idx={i}
                                    role="option"
                                    aria-selected={selected}
                                    onMouseEnter={() => setActive(i)}
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() => pick(d)}
                                    className={`flex cursor-pointer items-center justify-between px-3 py-2 text-sm ${
                                        i === active
                                            ? "bg-secondary/10 text-slate-900"
                                            : "text-slate-700"
                                    }`}
                                >
                                    {d}
                                    {selected && (
                                        <Check className="h-4 w-4 text-secondary" />
                                    )}
                                </li>
                            );
                        })
                    )}
                </ul>
            )}
        </div>
    );
}
