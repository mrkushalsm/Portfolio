// StartScreen.jsx - Windows Phone Metro UI Start Screen
// Auto-flowing 4-column grid with randomly shuffled 2x2 tiles
"use client";

import React, { useRef, useState, useEffect } from "react";
import { MOBILE_APPS, METRO_COLORS as A } from "../../data/windowsPhoneData";

// ─── Base Tile ────────────────────────────────────────────────────────────────
const Tile = ({ color, label, icon: Icon, imgSrc, onClick, children }) => {
    return (
        <div
            className="relative w-full h-full cursor-pointer select-none overflow-hidden"
            style={{
                background: color,
                transition: "transform 0.15s ease, filter 0.15s ease",
            }}
            onClick={onClick}
            onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.95)"; e.currentTarget.style.filter = "brightness(1.25)"; }}
            onMouseUp={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.filter = ""; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.filter = ""; }}
            onTouchStart={(e) => { e.currentTarget.style.transform = "scale(0.95)"; e.currentTarget.style.filter = "brightness(1.25)"; }}
            onTouchEnd={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.filter = ""; }}
        >
            {children ?? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 p-2">
                    {/* Centered icon (bigger) */}
                    {imgSrc ? (
                        <img src={imgSrc} alt={label} className="object-contain" style={{ width: "40px", height: "40px" }} />
                    ) : Icon ? (
                        <Icon className="text-white" style={{ fontSize: "34px" }} />
                    ) : null}
                    {/* Label bottom-left, WP style */}
                    {label && (
                        <span
                            className="absolute bottom-[6px] left-[7px] text-white font-light lowercase leading-tight"
                            style={{
                                fontSize: "12px",
                                fontFamily: "'Segoe UI', sans-serif",
                                letterSpacing: "0.02em",
                            }}
                        >
                            {label}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};

// ─── Small 1×1 Tile (used inside the Socials cluster) ────────────────────────
const SmallTile = ({ color, imgSrc, onClick }) => {
    return (
        <div
            className="relative w-full h-full cursor-pointer select-none overflow-hidden flex items-center justify-center"
            style={{ background: color, transition: "transform 0.15s ease" }}
            onClick={onClick}
            onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.93)"; }}
            onMouseUp={(e) => { e.currentTarget.style.transform = ""; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = ""; }}
            onTouchStart={(e) => { e.currentTarget.style.transform = "scale(0.93)"; }}
            onTouchEnd={(e) => { e.currentTarget.style.transform = ""; }}
        >
            {imgSrc && (
                <img src={imgSrc} alt="" className="object-contain" style={{ width: "28px", height: "28px" }} />
            )}
        </div>
    );
};

// ─── Date Live Tile content ───────────────────────────────────────────────────
const DateContent = () => {
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const now   = new Date();
    return (
        <div className="absolute inset-0 flex flex-col justify-between p-3">
            <span
                className="text-white/80 font-light lowercase"
                style={{ fontSize: "12px", fontFamily: "'Segoe UI', sans-serif" }}
            >
                {days[now.getDay()]}
            </span>
            <span
                className="text-white font-thin leading-none"
                style={{
                    fontSize: "64px",
                    fontFamily: "'Segoe UI', sans-serif",
                    fontWeight: 100,
                }}
            >
                {now.getDate()}
            </span>
        </div>
    );
};

// ─── Start Screen ─────────────────────────────────────────────────────────────
const StartScreen = ({ onOpenApp, onSwipeToList }) => {
    const containerRef = useRef(null);
    const touchStartX  = useRef(null);
    const [tiles, setTiles] = useState([]);

    useEffect(() => {
        // Base custom tiles that aren't mapped directly from a single standard app
        const customTiles = [
            {
                id: "aboutme",
                render: () => (
                    <Tile color={A.blue} onClick={() => onOpenApp("aboutme", "about me", "AboutMe")}>
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-3 gap-2">
                            <img
                                src="/assets/profile.jpeg"
                                alt="Profile"
                                className="rounded-full object-cover border-2 border-white/30"
                                style={{ width: "52px", height: "52px" }}
                                onError={(e) => { e.target.style.display = "none"; }}
                            />
                            <div className="w-full text-center">
                                <p className="text-white font-semibold leading-tight" style={{ fontSize: "14px", fontFamily: "'Segoe UI', sans-serif" }}>
                                    Kushal S. M.
                                </p>
                                <p className="text-blue-100 font-light lowercase" style={{ fontSize: "11px", fontFamily: "'Segoe UI', sans-serif" }}>
                                    about me
                                </p>
                            </div>
                        </div>
                    </Tile>
                ),
            },
            {
                id: "date",
                render: () => (
                    <Tile color={A.teal}>
                        <DateContent />
                    </Tile>
                ),
            },
            {
                id: "quote",
                render: () => (
                    <Tile color="linear-gradient(to bottom right, #d13a0e, #c92e00)">
                        <div className="absolute inset-0 flex flex-col justify-center items-center p-3">
                            <div className="text-white text-sm font-serif italic text-center drop-shadow-md">"Talk is cheap. Show me the code."</div>
                            <div className="text-right text-[10px] mt-2 text-white/80 font-semibold w-full">- Linus Torvalds</div>
                        </div>
                    </Tile>
                ),
            },
            {
                id: "socials",
                render: () => {
                    const socials = MOBILE_APPS.filter(app => app.isSocial);
                    return (
                        <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-[3px]">
                            {socials.map(s => (
                                <SmallTile key={s.id} color={s.color} imgSrc={s.imgSrc} onClick={() => window.open(s.url, "_blank")} />
                            ))}
                            <Tile color={A.charcoal} /> {/* The 4th empty tile */}
                        </div>
                    );
                },
            },
        ];

        // Generate standard app tiles directly from data
        const standardAppTiles = MOBILE_APPS
            .filter(app => app.action === "app" && app.id !== "aboutme")
            .map(app => ({
                id: app.id,
                render: () => (
                    <Tile 
                        color={app.color} 
                        label={app.label.toLowerCase()} 
                        icon={app.icon} 
                        onClick={() => onOpenApp(app.id, app.label.toLowerCase(), app.componentKey)} 
                    />
                ),
            }));

        const allTiles = [...customTiles, ...standardAppTiles];

        // Separate pinned tiles from shufflable ones
        const pinned = allTiles.filter(t => t.id === "aboutme" || t.id === "date");
        const shufflable = allTiles.filter(t => t.id !== "aboutme" && t.id !== "date");

        // Shuffle the remaining tiles
        const shuffled = shufflable.sort(() => Math.random() - 0.5);

        // Keep About Me and Date on top, shuffle the rest
        setTiles([...pinned, ...shuffled]);
    }, []);

    const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
    const handleTouchEnd   = (e) => {
        if (touchStartX.current === null) return;
        const delta = e.changedTouches[0].clientX - touchStartX.current;
        if (delta < -60 && touchStartX.current > 40) onSwipeToList?.();
        touchStartX.current = null;
    };

    // 4-col grid: padding=12px*2=24px, gaps=3px*3=9px → cell=(100vw-33px)/4
    const CELL = "calc((100vw - 33px) / 4)";

    return (
        <div
            ref={containerRef}
            className="flex-1 overflow-y-auto overflow-x-hidden pb-4"
            style={{ touchAction: "pan-y", overscrollBehaviorX: "none" }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            {/* ── "start" Metro heading ── */}
            <div className="overflow-hidden pt-2 pb-3 px-3">
                <h1
                    className="text-white whitespace-nowrap"
                    style={{
                        fontSize:     "clamp(38px, 11vw, 56px)",
                        fontFamily:   "'Segoe UI', 'Segoe WP', sans-serif",
                        fontWeight:   100,
                        letterSpacing:"-0.5px",
                        lineHeight:   1,
                        marginRight:  "-20px",
                    }}
                >
                    start
                </h1>
            </div>

            {/* ── Auto-Flowing Grid ── */}
            <div
                style={{
                    display:             "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gridAutoRows:        CELL,
                    gap:                 "3px",
                    padding:             "0 12px",
                }}
            >
                {tiles.map((tile) => (
                    // Each main item spans 2 columns and 2 rows automatically
                    <div key={tile.id} style={{ gridColumn: "span 2", gridRow: "span 2" }}>
                        {tile.render()}
                    </div>
                ))}
            </div>

            {/* Spacer for nav bar */}
            <div className="h-16" />
        </div>
    );
};

export default StartScreen;
