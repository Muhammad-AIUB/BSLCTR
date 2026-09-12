import { Section } from "@/components/ui/section";

export default function Live() {
    return (
        <Section
            watermark="Live"
            eyebrow="Streaming"
            title="Watch our live broadcast"
        >
            <p className="mb-12 max-w-2xl text-lg leading-relaxed text-body">
                Stay connected with us through our live sessions. Join the
                conversation, watch events, and stay up to date — all in real
                time.
            </p>

            <div className="aspect-video w-full overflow-hidden rounded-xl border border-slate-200 shadow-xl">
                <iframe
                    className="h-full w-full"
                    src="https://www.youtube.com/embed/YXmTvo24hUs?si=EwZwQbPcHaNcrcsD&autoplay=1"
                    title="Live Broadcast"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                ></iframe>
            </div>

            <p className="mt-8 text-sm text-body">
                Having trouble viewing? Refresh the page or watch directly on{" "}
                <a
                    href="https://www.youtube.com/watch?v=YXmTvo24hUs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-deep underline underline-offset-2 outline-none transition-colors hover:text-secondary focus-visible:text-secondary"
                >
                    YouTube
                </a>
                .
            </p>
        </Section>
    );
}
