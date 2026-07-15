export default function Live() {
    return (
        <section className="min-h-screen bg-gradient-to-b from-primary/10 to-white flex flex-col items-center justify-center px-4 py-16">
            <div className="text-center max-w-2xl mb-12">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-secondary mb-4">
                    📡 Watch Our Live Broadcast
                </h1>
                <p className="text-lg leading-relaxed text-slate-700">
                    Stay connected with us through our live sessions. Join the
                    conversation, watch events, and stay up to date — all in
                    real time.
                </p>
            </div>

            <div className="w-full max-w-6xl aspect-video shadow-xl rounded-xl overflow-hidden border border-slate-200">
                <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/YXmTvo24hUs?si=EwZwQbPcHaNcrcsD&autoplay=1"
                    title="Live Broadcast"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                ></iframe>
            </div>

            <p className="mt-8 text-sm text-slate-500 text-center">
                Having trouble viewing? Refresh the page or watch directly on{" "}
                <a
                    href="https://www.youtube.com/watch?v=YXmTvo24hUs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline underline-offset-2 outline-none transition-colors hover:text-secondary focus-visible:text-secondary"
                >
                    YouTube
                </a>
                .
            </p>
        </section>
    );
}
