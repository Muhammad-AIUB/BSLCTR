"use client";

const RecentUpdates = () => {
    return (
        <div className="page-container py-16">
            {/* Header */}
            <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight text-secondary mb-4">
                    Recent Updates &amp; News
                </h2>
                <p className="text-slate-600 text-lg leading-relaxed max-w-2xl mx-auto">
                    Stay informed with the latest developments in hepatobiliary
                    medicine, upcoming events, and important announcements from
                    BSLCTR.
                </p>
            </div>

            {/* Main Content - Building Message */}
            <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                    <h3 className="text-2xl font-semibold tracking-tight text-secondary mb-4">
                        We are building
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                        This section is currently under development. Please
                        check back soon for updates.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RecentUpdates;
