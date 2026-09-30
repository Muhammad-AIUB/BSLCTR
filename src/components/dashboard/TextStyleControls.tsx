"use client";

import { Bold } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { FONTS, MAX_SIZE, MIN_SIZE, type FontKey, type TextStyle } from "@/lib/text-style";

type Props = {
    /** Used to give each control a unique id/label. */
    idPrefix: string;
    label: string;
    value: TextStyle;
    onChange: (next: TextStyle) => void;
};

/** Bold toggle, font size, font style and colour for one block of text. */
export default function TextStyleControls({ idPrefix, label, value, onChange }: Props) {
    const set = (patch: Partial<TextStyle>) => onChange({ ...value, ...patch });

    return (
        <div role="group" aria-label={`${label} style`} className="flex flex-wrap items-end gap-4">
            <button
                type="button"
                aria-pressed={value.bold}
                onClick={() => set({ bold: !value.bold })}
                className={cn(
                    "inline-flex h-9 items-center gap-1.5 rounded-md border px-3 text-sm font-medium transition-colors",
                    value.bold
                        ? "border-primary bg-accent text-primary-deep"
                        : "border-slate-200 hover:bg-slate-50"
                )}
            >
                <Bold className="h-4 w-4" aria-hidden="true" />
                Bold
            </button>

            <div className="grid gap-1">
                <label htmlFor={`${idPrefix}-size`} className="text-xs text-body">
                    Size (px)
                </label>
                <Input
                    id={`${idPrefix}-size`}
                    type="number"
                    min={MIN_SIZE}
                    max={MAX_SIZE}
                    value={value.size}
                    onChange={(e) => set({ size: Number(e.target.value) })}
                    className="h-9 w-20"
                />
            </div>

            <div className="grid gap-1">
                <label htmlFor={`${idPrefix}-font`} className="text-xs text-body">
                    Font style
                </label>
                <select
                    id={`${idPrefix}-font`}
                    value={value.font}
                    onChange={(e) => set({ font: e.target.value as FontKey })}
                    className="h-9 rounded-md border border-input bg-transparent px-2 text-sm"
                >
                    {Object.entries(FONTS).map(([key, f]) => (
                        <option key={key} value={key}>
                            {f.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="grid gap-1">
                <label htmlFor={`${idPrefix}-color`} className="text-xs text-body">
                    Color
                </label>
                <input
                    id={`${idPrefix}-color`}
                    type="color"
                    value={value.color}
                    onChange={(e) => set({ color: e.target.value })}
                    className="h-9 w-14 cursor-pointer rounded-md border border-input bg-transparent p-1"
                />
            </div>
        </div>
    );
}
