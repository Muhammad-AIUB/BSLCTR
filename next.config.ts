import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
