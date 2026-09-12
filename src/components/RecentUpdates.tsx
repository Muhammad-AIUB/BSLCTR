"use client";

const RecentUpdates = () => {
    return (
        // Heading and page container now come from the wrapping <Section>.
        <div>
            <p className="max-w-2xl text-lg leading-relaxed text-body">
                Stay informed with the latest developments in hepatobiliary
                medicine, upcoming events, and important announcements from
                BSLCTR.
            </p>

            {/* Main Content - Building Message */}
            <div className="py-16 text-center">
                <div className="mx-auto max-w-md">
                    <h3 className="mb-4">We are building</h3>
                    <p className="leading-relaxed text-body">
                        This section is currently under development. Please
                        check back soon for updates.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RecentUpdates;
