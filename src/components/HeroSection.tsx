"use client";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const HeroSection: React.FC = () => {
    const [showRegistrationPopup, setShowRegistrationPopup] = useState(false);

    return (
        <>
            <section className="w-full">
                {/* Hero Image Container */}
                <div className="w-full">
                    <img
                        src="/Tanvir-vai.jpg"
                        alt="Hero banner"
                        className="w-full h-auto object-contain"
                    />
                </div>

                {/* Registration Button Container - Positioned below the image */}
                <div className="flex justify-center py-6 md:py-8 lg:py-10 bg-gradient-to-b from-gray-50 to-white">
                    <Button
                        onClick={() => setShowRegistrationPopup(true)}
                        className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-600 hover:via-yellow-600 hover:to-amber-700 text-black font-bold text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl px-4 sm:px-6 md:px-8 lg:px-12 py-2 sm:py-3 md:py-4 lg:py-6 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 border-2 sm:border-3 md:border-4 border-white animate-pulse"
                    >
                        🎯 Registration Now!
                    </Button>
                </div>
            </section>

            {/* Registration Popup Modal */}
            {showRegistrationPopup && (
                <div
                    className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm"
                    onClick={() => setShowRegistrationPopup(false)}
                >
                    <div
                        className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 max-w-md mx-4 shadow-2xl border-4 border-yellow-400 transform scale-100 animate-in"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="text-center">
                            {/* Icon */}
                            <div className="mb-6 flex justify-center">
                                <div className="w-20 h-20 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                                    <span className="text-4xl">⏳</span>
                                </div>
                            </div>

                            {/* Title */}
                            <h2 className="text-3xl font-bold mb-4 text-gray-800 bg-gradient-to-r from-amber-600 to-yellow-600 text-transparent bg-clip-text">
                                Registration
                            </h2>

                            {/* Highlighted Message */}
                            <div className="mb-6 p-4 bg-gradient-to-r from-yellow-100 via-amber-100 to-yellow-100 border-l-4 border-amber-500 rounded-r-lg shadow-inner">
                                <p className="text-xl font-semibold text-gray-800">
                                    Registration is not started yet
                                </p>
                            </div>

                            <p className="text-gray-600 mb-6">
                                Please check back later for registration
                                details.
                            </p>

                            {/* Close Button */}
                            <Button
                                onClick={() => setShowRegistrationPopup(false)}
                                className="w-full bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-semibold py-3 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default HeroSection;
