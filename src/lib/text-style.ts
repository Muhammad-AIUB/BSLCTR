import type { CSSProperties } from "react";

/** Admin-chosen look for a block of text. Everything is whitelisted or clamped, so it is safe to turn into inline CSS. */
export type TextStyle = {
    bold: boolean;
    /** px */
    size: number;
    font: FontKey;
    /** #rrggbb */
    color: string;
};

export const FONTS = {
    default: { label: "Site default", css: "inherit" },
    sans: { label: "Sans-serif", css: "Arial, Helvetica, sans-serif" },
    serif: { label: "Serif", css: "Georgia, 'Times New Roman', serif" },
    mono: { label: "Monospace", css: "'Courier New', monospace" },
} as const;

export type FontKey = keyof typeof FONTS;

export const MIN_SIZE = 10;
export const MAX_SIZE = 64;

export const DEFAULT_SPEAKERS_STYLE: TextStyle = { bold: true, size: 16, font: "default", color: "#232323" };
export const DEFAULT_DESCRIPTION_STYLE: TextStyle = { bold: false, size: 14, font: "default", color: "#616161" };

/** Coerces untrusted JSON into a valid TextStyle, falling back to `fallback` per field. */
export function parseTextStyle(input: unknown, fallback: TextStyle): TextStyle {
    const o = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
    const size = Number(o.size);
    return {
        bold: typeof o.bold === "boolean" ? o.bold : fallback.bold,
        size:
            Number.isFinite(size) && size >= MIN_SIZE && size <= MAX_SIZE
                ? Math.round(size)
                : fallback.size,
        font: typeof o.font === "string" && o.font in FONTS ? (o.font as FontKey) : fallback.font,
        color:
            typeof o.color === "string" && /^#[0-9a-fA-F]{6}$/.test(o.color)
                ? o.color
                : fallback.color,
    };
}

export function textStyleToCss(style: TextStyle): CSSProperties {
    return {
        fontWeight: style.bold ? 700 : 400,
        fontSize: `${style.size}px`,
        fontFamily: FONTS[style.font].css,
        color: style.color,
    };
}
