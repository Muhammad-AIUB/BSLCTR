import { useEffect, useRef, type RefObject } from "react";

const FOCUSABLE =
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Makes a hand-built overlay behave like a dialog while `open`: focus moves into it (to the
 * element marked `data-autofocus`, else the first control) and back to where it was on close,
 * Tab cycles inside it, and the page behind does not scroll. Every other key goes to `onKey`.
 */
export function useModal(
    open: boolean,
    container: RefObject<HTMLElement | null>,
    onKey: (e: KeyboardEvent) => void
): void {
    // Callers pass a new function each render; reading it through a ref keeps the listener in place.
    const latestOnKey = useRef(onKey);
    useEffect(() => {
        latestOnKey.current = onKey;
    });

    useEffect(() => {
        if (!open) return;
        const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        const controls = () =>
            Array.from(container.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);
        (container.current?.querySelector<HTMLElement>("[data-autofocus]") ?? controls()[0])?.focus();

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key !== "Tab") {
                // Combinations with Ctrl, Alt or the command key are the browser's own
                // (Alt+Left is Back, Ctrl+0 resets page zoom).
                if (!e.ctrlKey && !e.altKey && !e.metaKey) latestOnKey.current(e);
                return;
            }
            const items = controls();
            if (items.length === 0) return;
            const first = items[0];
            const last = items[items.length - 1];
            const active = document.activeElement;
            if (!container.current?.contains(active)) {
                e.preventDefault();
                first.focus();
            } else if (e.shiftKey && active === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && active === last) {
                e.preventDefault();
                first.focus();
            }
        };
        document.addEventListener("keydown", onKeyDown);
        const overflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = overflow;
            opener?.focus();
        };
    }, [open, container]);
}
