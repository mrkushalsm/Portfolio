// AppList.jsx - Windows Phone "All Apps" alphabetical list
"use client";

import React, { useState, useRef } from "react";
import { MOBILE_APPS } from "../../data/windowsPhoneData";

// Group apps alphabetically
const groupByLetter = (apps) => {
    const groups = {};
    apps.forEach(app => {
        const letter = app.label[0].toUpperCase();
        if (!groups[letter]) groups[letter] = [];
        groups[letter].push(app);
    });
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
};

const AppList = ({ onOpenApp, onBack }) => {
    const grouped = groupByLetter(MOBILE_APPS);
    const containerRef = useRef(null);
    const touchStartX = useRef(null);
    const [activeLetterMenu, setActiveLetterMenu] = useState(false);

    // Swipe right to go back to Start Screen
    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
    };
    const handleTouchEnd = (e) => {
        if (touchStartX.current === null) return;
        const deltaX = e.changedTouches[0].clientX - touchStartX.current;
        if (deltaX > 60) {
            onBack?.();
        }
        touchStartX.current = null;
    };

    const handleAppClick = (app) => {
        if (app.action === "link") {
            window.open(app.url, "_blank");
        } else {
            onOpenApp(app.id, app.label, app.id.charAt(0).toUpperCase() + app.id.slice(1));
        }
    };

    const scrollToLetter = (letter) => {
        const el = document.getElementById(`wp-alpha-${letter}`);
        if (el) el.scrollIntoView({ behavior: "smooth" });
        setActiveLetterMenu(false);
    };

    const allLetters = grouped.map(([l]) => l);

    return (
        <div
            ref={containerRef}
            className="flex-1 overflow-y-auto overflow-x-hidden"
            style={{
                touchAction: "pan-y",
                overscrollBehaviorX: "none",
            }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            {/* "all apps" heading - Metro oversized typography */}
            <div className="px-4 pt-2 mb-3 overflow-hidden">
                <h1
                    className="text-white font-thin whitespace-nowrap"
                    style={{
                        fontSize: "clamp(36px, 10vw, 52px)",
                        fontFamily: "'Segoe UI', 'Segoe WP', sans-serif",
                        fontWeight: 100,
                        letterSpacing: "-0.5px",
                        lineHeight: 1,
                        marginRight: "-20px",
                    }}
                >
                    all apps
                </h1>
            </div>

            {/* Alphabet Jump Menu (overlays) */}
            {activeLetterMenu && (
                <div
                    className="fixed inset-0 z-50 flex flex-col justify-center items-start px-6"
                    style={{ background: "rgba(0,0,0,0.92)" }}
                    onClick={() => setActiveLetterMenu(false)}
                >
                    <div className="grid grid-cols-4 gap-x-6 gap-y-2">
                        {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(letter => {
                            const active = allLetters.includes(letter);
                            return (
                                <button
                                    key={letter}
                                    onClick={() => active && scrollToLetter(letter)}
                                    className="text-left font-light"
                                    style={{
                                        fontFamily: "'Segoe UI', sans-serif",
                                        fontSize: "28px",
                                        fontWeight: 300,
                                        color: active ? "#fff" : "rgba(255,255,255,0.25)",
                                        lineHeight: 1.1,
                                        cursor: active ? "pointer" : "default",
                                    }}
                                >
                                    {letter.toLowerCase()}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Grouped App List */}
            <div className="pb-20">
                {grouped.map(([letter, apps]) => (
                    <div key={letter} id={`wp-alpha-${letter}`}>
                        {/* Letter Header - tappable to open jump menu */}
                        <button
                            onClick={() => setActiveLetterMenu(true)}
                            className="w-full text-left px-4 pt-2 pb-1 flex items-end"
                            style={{ background: "transparent" }}
                        >
                            <span
                                className="text-white leading-none font-light"
                                style={{
                                    fontSize: "28px",
                                    fontFamily: "'Segoe UI', sans-serif",
                                    fontWeight: 300,
                                }}
                            >
                                {letter.toLowerCase()}
                            </span>
                        </button>

                        {/* Apps in this letter group */}
                        {apps.map(app => {
                            const Icon = app.icon;
                            return (
                                <button
                                    key={app.id}
                                    onClick={() => handleAppClick(app)}
                                    className="w-full flex items-center gap-4 px-4 py-2.5 active:bg-white/10 transition-colors"
                                >
                                    {/* App Icon Tile */}
                                    <div
                                        className="w-9 h-9 flex items-center justify-center shrink-0"
                                        style={{ background: app.color }}
                                    >
                                        <Icon className={`text-lg ${app.color === "#ffffff" ? "text-black" : "text-white"}`} />
                                    </div>
                                    {/* App Name */}
                                    <span
                                        className="text-white font-light text-base"
                                        style={{ fontFamily: "'Segoe UI', sans-serif" }}
                                    >
                                        {app.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AppList;
