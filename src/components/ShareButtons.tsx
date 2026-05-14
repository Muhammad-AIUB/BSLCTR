"use client";

interface Props {
    url: string;
    title: string;
}

export default function ShareButtons({ url, title }: Props) {
    const encoded = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);

    return (
        <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Share:</span>

            {/* Facebook */}
            <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encoded}`}
                target="_blank" rel="noreferrer"
                title="Share on Facebook"
                className="flex items-center justify-center h-7 w-7 rounded-full bg-[#1877F2] hover:bg-[#1464d1] transition-colors"
            >
                <svg className="h-3.5 w-3.5 fill-white" viewBox="0 0 24 24">
                    <path d="M24 12.073C24 5.404 18.627 0 12 0S0 5.404 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.313 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
                </svg>
            </a>

            {/* LinkedIn */}
            <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`}
                target="_blank" rel="noreferrer"
                title="Share on LinkedIn"
                className="flex items-center justify-center h-7 w-7 rounded-full bg-[#0A66C2] hover:bg-[#0856a8] transition-colors"
            >
                <svg className="h-3.5 w-3.5 fill-white" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
            </a>

            {/* X (Twitter) */}
            <a
                href={`https://twitter.com/intent/tweet?url=${encoded}&text=${encodedTitle}`}
                target="_blank" rel="noreferrer"
                title="Share on X (Twitter)"
                className="flex items-center justify-center h-7 w-7 rounded-full bg-black hover:bg-slate-800 transition-colors"
            >
                <svg className="h-3.5 w-3.5 fill-white" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.261 5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
            </a>
        </div>
    );
}
