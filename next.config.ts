import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // The site runs on shared hosting that cannot build it, so the build writes a
    // self-contained server to .next/standalone and that is what gets uploaded
    // (see docs/deploy-namecheap.md).
    output: "standalone",
    // Nothing uses next/image today. This keeps a future <Image> from pointing at the
    // optimiser, which cannot run on the host: it needs sharp, whose binary is built per
    // platform, and the packaging script leaves the build machine's out of the bundle.
    images: { unoptimized: true },
    async redirects() {
        return [
            {
                // The Doctors page originally pointed at this truncated slug
                // and 404'd. Kept as a permanent redirect so any existing
                // link or bookmark still lands on the page.
                source: "/hepatologist-surgeon-interventiona",
                destination: "/doctors",
                permanent: true,
            },
        ];
    },
};

export default nextConfig;
