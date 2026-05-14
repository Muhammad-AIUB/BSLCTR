export default function Live() {
    return (
        <section className="min-h-screen bg-gradient-to-b from-sky-100 to-white flex flex-col items-center justify-center px-4 py-16">
            <div className="text-center max-w-2xl mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold text-sky-800 mb-4">
                    📡 Watch Our Live Broadcast
                </h1>
                <p className="text-lg text-gray-700">
                    Stay connected with us through our live sessions. Join the
                    conversation, watch events, and stay up to date — all in
                    real time.
                </p>
            </div>

            <div className="w-full max-w-6xl aspect-video shadow-2xl rounded-2xl overflow-hidden border border-sky-200">
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

            <p className="mt-8 text-sm text-gray-500 text-center">
                Having trouble viewing? Refresh the page or watch directly on{" "}
                <a
                    href="https://www.youtube.com/watch?v=YXmTvo24hUs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-600 underline hover:text-sky-800"
                >
                    YouTube
                </a>
                .
            </p>
        </section>
    );
}
