"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import type { Lang } from "@/lib/doctors";

const STORAGE_KEY = "bslctr-lang";

type Ctx = { lang: Lang; setLang: (l: Lang) => void };

const LanguageContext = createContext<Ctx>({ lang: "en", setLang: () => {} });

export const useLang = () => useContext(LanguageContext);

export function LanguageProvider({ children }: { children: ReactNode }) {
    // Always "en" on the first render so the server and client markup agree;
    // any stored preference is applied right after mount.
    const [lang, setLangState] = useState<Lang>("en");

    useEffect(() => {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved === "bn" || saved === "en") setLangState(saved);
    }, []);

    const setLang = (l: Lang) => {
        setLangState(l);
        try {
            window.localStorage.setItem(STORAGE_KEY, l);
        } catch {
            // Private mode / storage disabled — the choice just won't persist.
        }
    };

    return (
        <LanguageContext.Provider value={{ lang, setLang }}>
            {children}
        </LanguageContext.Provider>
    );
}

const OPTIONS: { key: Lang; label: string; full: string }[] = [
    { key: "en", label: "EN", full: "English" },
    { key: "bn", label: "বাং", full: "বাংলা" },
];

export default function LanguageToggle() {
    const { lang, setLang } = useLang();

    return (
        <div
            role="group"
            aria-label="Content language"
            className="inline-flex rounded-full border border-slate-300 bg-white p-0.5"
        >
            {OPTIONS.map((o) => {
                const active = lang === o.key;
                return (
                    <button
                        key={o.key}
                        type="button"
                        onClick={() => setLang(o.key)}
                        aria-pressed={active}
                        title={o.full}
                        className={`min-h-9 cursor-pointer rounded-full px-4 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary/50 ${
                            active
                                ? "bg-secondary text-white"
                                : "text-slate-600 hover:text-slate-900"
                        }`}
                    >
                        {o.label}
                    </button>
                );
            })}
        </div>
    );
}
