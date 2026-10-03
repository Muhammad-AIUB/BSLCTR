/** Extracts the video id from a YouTube watch / share / embed / shorts / live URL, or null. */
export function youtubeId(url: string): string | null {
    try {
        const u = new URL(url);
        const host = u.hostname.replace(/^(www|m)\./, "");
        let id: string | null = null;
        if (host === "youtu.be") id = u.pathname.slice(1);
        else if (host === "youtube.com" || host === "youtube-nocookie.com") {
            id =
                u.searchParams.get("v") ??
                /^\/(?:embed|shorts|live)\/([^/]+)/.exec(u.pathname)?.[1] ??
                null;
        }
        return id && /^[\w-]{11}$/.test(id) ? id : null;
    } catch {
        return null;
    }
}
