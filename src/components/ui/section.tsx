import type React from "react";
import { cn } from "@/lib/utils";

type SectionProps = {
    /** Oversized pale word behind the heading. Omit for a section with no watermark. */
    watermark?: string;
    /** Small uppercase label above the title. */
    eyebrow?: string;
    /** The section heading. */
    title?: string;
    className?: string;
    children: React.ReactNode;
};

/**
 * The ILCA section wrapper: a giant pale watermark word behind a
 * light-weight title, with generous vertical rhythm.
 *
 * The header block is only rendered when there is something to put in it, so
 * a bare <Section> adds spacing and a container without reserving header space.
 */
export function Section({
    watermark,
    eyebrow,
    title,
    className,
    children,
}: SectionProps) {
    const hasHeader = Boolean(watermark || eyebrow || title);

    return (
        <section className={cn("page-container py-16 lg:py-24", className)}>
            {hasHeader && (
                // overflow-hidden clips the watermark: it is absolutely
                // positioned, so a long word (or a non-Latin script, which does
                // not abbreviate under uppercase) would otherwise extend the
                // scrollable area and scroll the whole page sideways.
                <header className="relative mb-10 overflow-hidden pt-6 lg:mb-14">
                    {watermark && (
                        <span aria-hidden="true" className="watermark">
                            {watermark}
                        </span>
                    )}
                    <div className="relative">
                        {eyebrow && (
                            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary-deep">
                                {eyebrow}
                            </p>
                        )}
                        {title && <h2>{title}</h2>}
                    </div>
                </header>
            )}
            {children}
        </section>
    );
}
