"use client";

const RecentUpdates = () => {
    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-12">
            {/* Header */}
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-sky-800 mb-4">
                    Recent Updates & News
                </h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                    Stay informed with the latest developments in hepatobiliary
                    medicine, upcoming events, and important announcements from
                    BSLCTR.
                </p>
            </div>

            {/* Main Content - Building Message */}
            <div className="text-center py-20">
                <div className="max-w-md mx-auto">
                    <h3 className="text-2xl font-semibold text-sky-800 mb-4">
                        We are building
                    </h3>
                    <p className="text-gray-600">
                        This section is currently under development. Please
                        check back soon for updates.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RecentUpdates;
