"use client";

import { useEffect, useRef, useState } from "react";
import { Share2 } from "lucide-react";

type ShareMenuProps = {
    /** Site-root-relative path to the resource being shared, e.g. "/guidelines/x.pdf". */
    path: string;
    /** Used as the message text on networks that accept one. */
    title: string;
};

type Target = {
    name: string;
    color: string;
    href: (url: string, title: string) => string;
    icon: React.ReactNode;
};

const q = encodeURIComponent;

const TARGETS: Target[] = [
    {
        name: "Facebook",
        color: "#1877F2",
        href: (url) => `https://www.facebook.com/sharer/sharer.php?u=${q(url)}`,
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
            </svg>
        ),
    },
    {
        name: "LinkedIn",
        color: "#0A66C2",
        href: (url) =>
            `https://www.linkedin.com/sharing/share-offsite/?url=${q(url)}`,
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
        ),
    },
    {
        name: "X",
        color: "#000000",
        href: (url, title) =>
            `https://x.com/intent/tweet?url=${q(url)}&text=${q(title)}`,
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
            </svg>
        ),
    },
    {
        name: "WhatsApp",
        color: "#25D366",
        href: (url, title) => `https://wa.me/?text=${q(`${title} ${url}`)}`,
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.825 9.825 0 0 1 6.988 2.896 9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
            </svg>
        ),
    },
];

export default function ShareMenu({ path, title }: ShareMenuProps) {
    const [open, setOpen] = useState(false);
    // Resolved after mount: the absolute URL is what the networks need, and
    // window is not available during server rendering.
    const [origin, setOrigin] = useState("");
    const wrapRef = useRef<HTMLDivElement>(null);

    useEffect(() => setOrigin(window.location.origin), []);

    useEffect(() => {
        if (!open) return;

        const onPointerDown = (e: MouseEvent | TouchEvent) => {
            if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
        };
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };

        document.addEventListener("mousedown", onPointerDown);
        document.addEventListener("touchstart", onPointerDown);
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("mousedown", onPointerDown);
            document.removeEventListener("touchstart", onPointerDown);
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [open]);

    const shareUrl = origin ? `${origin}${path}` : "";

    return (
        <div ref={wrapRef} className="relative">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={open}
                aria-label={`Share ${title}`}
                className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 outline-none transition-colors hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-primary/50"
            >
                <Share2 className="h-4 w-4" />
                Share
            </button>

            {open && (
                <div
                    role="menu"
                    className="absolute left-0 top-full z-40 mt-2 min-w-[13rem] overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
                >
                    {TARGETS.map((t) => (
                        <a
                            key={t.name}
                            role="menuitem"
                            href={shareUrl ? t.href(shareUrl, title) : undefined}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setOpen(false)}
                            aria-disabled={!shareUrl}
                            className={`flex min-h-11 items-center gap-3 px-4 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50 ${
                                shareUrl ? "" : "pointer-events-none opacity-50"
                            }`}
                        >
                            <span
                                className="inline-flex h-5 w-5 shrink-0 items-center justify-center"
                                style={{ color: t.color }}
                            >
                                {t.icon}
                            </span>
                            {t.name}
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
}
