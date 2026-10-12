import type { NextConfig } from "next";

// Sent with every response. The policy stops short of script-src on purpose: Next's own
// inline scripts would need a fresh nonce on every request, and a policy that blocks them
// leaves a blank site. What is here keeps the site out of other sites' frames, pins <base>
// and form targets to this origin, and rules out plugins.
const securityHeaders = [
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    // Only honoured over HTTPS, so it does nothing on http://localhost.
    { key: "Strict-Transport-Security", value: "max-age=15552000" },
    {
        key: "Content-Security-Policy",
        value: "frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'",
    },
];

const nextConfig: NextConfig = {
    poweredByHeader: false,
    // The site runs on shared hosting that cannot build it, so the build writes a
    // self-contained server to .next/standalone and that is what gets uploaded
    // (see docs/deploy-namecheap.md).
    output: "standalone",
    // Nothing uses next/image today. This keeps a future <Image> from pointing at the
    // optimiser, which cannot run on the host: it needs sharp, whose binary is built per
    // platform, and the packaging script leaves the build machine's out of the bundle.
    images: { unoptimized: true },
    async headers() {
        return [{ source: "/:path*", headers: securityHeaders }];
    },
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
