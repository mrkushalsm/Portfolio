// NavigationBar.jsx - Classic Windows Phone hardware-style navigation bar
"use client";

import React, { useState } from "react";

// Back arrow (left-pointing arrow, like WP hardware button)
const BackIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
    </svg>
);

// Search icon (magnifying glass)
const SearchIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
    </svg>
);

// onWindowsBtn: called when Windows button is pressed (handles start ↔ applist toggle)
const NavigationBar = ({ onBack, onHome, onWindowsBtn }) => {
    const [showToast, setShowToast] = useState(false);

    const handleSearch = () => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
    };

    const handleWindows = () => {
        // If a special override is provided (e.g. start↔applist), use it; else fall back to onHome
        if (onWindowsBtn) {
            onWindowsBtn();
        } else {
            onHome?.();
        }
    };

    return (
        <>
            {/* Toast notification */}
            {showToast && (
                <div
                    className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[99999] px-5 py-2.5 rounded-sm text-white text-sm font-light tracking-wide"
                    style={{
                        background: "rgba(0, 120, 215, 0.95)",
                        fontFamily: "'Segoe UI', sans-serif",
                        animation: "fadeInOut 2s ease forwards",
                    }}
                >
                    coming soon
                </div>
            )}

            {/* Navigation Bar */}
            <div
                className="fixed bottom-0 left-0 right-0 z-[9999] flex items-center justify-around select-none"
                style={{
                    height: "52px",
                    background: "#1a1a1a",
                    borderTop: "1px solid #2a2a2a",
                }}
            >
                {/* Back Button */}
                <button
                    onClick={onBack}
                    className="flex items-center justify-center w-1/3 h-full transition-all active:bg-white/10"
                    style={{ color: "rgba(255,255,255,0.85)" }}
                    aria-label="Back"
                >
                    <BackIcon />
                </button>

                {/* Windows Button — uses existing windows-icon.png asset */}
                <button
                    onClick={handleWindows}
                    className="flex items-center justify-center w-1/3 h-full transition-all active:bg-white/10"
                    aria-label="Start"
                >
                    <img
                        src="/assets/taskbar/windows-icon.png"
                        alt="Start"
                        className="object-contain"
                        style={{ width: "20px", height: "20px", opacity: 0.85 }}
                    />
                </button>

                {/* Search Button */}
                <button
                    onClick={handleSearch}
                    className="flex items-center justify-center w-1/3 h-full transition-all active:bg-white/10"
                    style={{ color: "rgba(255,255,255,0.85)" }}
                    aria-label="Search"
                >
                    <SearchIcon />
                </button>
            </div>

            <style>{`
                @keyframes fadeInOut {
                    0% { opacity: 0; transform: translateX(-50%) translateY(10px); }
                    15% { opacity: 1; transform: translateX(-50%) translateY(0); }
                    80% { opacity: 1; transform: translateX(-50%) translateY(0); }
                    100% { opacity: 0; transform: translateX(-50%) translateY(-5px); }
                }
            `}</style>
        </>
    );
};

export default NavigationBar;
