// WindowsPhoneUI.jsx - Main Windows Phone UI container
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StartScreen from "./StartScreen";
import AppList from "./AppList";
import MobileAppContainer from "./MobileAppContainer";
import NavigationBar from "./NavigationBar";

// ─── App Components ──────────────────────────────────────────────────────────
import AboutMe from "../../pages/windowsUI/AboutMe";
import Resume from "../../pages/windowsUI/Resume";
import Skills from "../../pages/windowsUI/Skills";
import Projects from "../../pages/windowsUI/Projects";
import Certificates from "../../pages/windowsUI/Certificates";
import Terminal from "../windowsUI/Terminal";
import GitHubTaskManager from "../win10/GitHubTaskManager";

// ─── Config ───────────────────────────────────────────────────────────────────
const CARRIER_NAME = "Airtel"; // Variable: replace with carrier name when ready
const WALLPAPER = "/assets/wallpaper.jpg";

// ─── App Registry ─────────────────────────────────────────────────────────────
const APP_REGISTRY = {
    AboutMe:      { component: AboutMe,          title: "about me" },
    Projects:     { component: Projects,         title: "projects" },
    Skills:       { component: Skills,           title: "skills" },
    Resume:       { component: Resume,           title: "resume" },
    Certificates: { component: Certificates,     title: "certificates" },
    Terminal:     { component: Terminal,         title: "terminal" },
    TaskManager:  { component: GitHubTaskManager, title: "task manager" },
};

// ─── Status Bar ───────────────────────────────────────────────────────────────
const StatusBar = () => {
    const [time, setTime] = useState(null);

    useEffect(() => {
        setTime(new Date());
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Windows Phone style: strip AM/PM, show "1:00" format
    const formatTime = (d) =>
        d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true })
          .replace(/\s?(AM|PM)/i, "");

    return (
        <div
            className="flex items-center justify-between px-3 shrink-0"
            style={{
                height: "30px",
                background: "transparent",
                fontFamily: "'Segoe UI', sans-serif",
            }}
        >
            {/* Left: carrier + signal + wifi */}
            <div className="flex items-center gap-1.5">
                {CARRIER_NAME && (
                    <span className="text-white text-[12px] font-light tracking-wide mr-1">{CARRIER_NAME}</span>
                )}
                <img src="/assets/icons/win10/cellular.ico" alt="Signal" className="h-4 object-contain" />
                <img src="/assets/taskbar/wifi.ico" alt="Wifi" className="h-3.5 object-contain" />
            </div>

            {/* Right: battery + time */}
            <div className="flex items-center gap-1.5">
                <img src="/assets/taskbar/battery.png" alt="Battery" className="h-4 object-contain" />
                <span className="text-white text-[12px] font-semibold tracking-wide">
                    {time ? formatTime(time) : "\u00A0"}
                </span>
            </div>
        </div>
    );
};

// ─── Slide transition variants ─────────────────────────────────────────────────
const slideVariants = {
    enterFromRight: { x: "100%", opacity: 0 },
    enterFromLeft:  { x: "-100%", opacity: 0 },
    center:         { x: 0, opacity: 1 },
    exitToLeft:     { x: "-100%", opacity: 0 },
    exitToRight:    { x: "100%", opacity: 0 },
};

// ─── Main Component ───────────────────────────────────────────────────────────
const WindowsPhoneUI = () => {
    // "start" | "applist" | "app"
    const [view, setView] = useState("start");
    const [prevView, setPrevView] = useState(null);
    const [activeApp, setActiveApp] = useState(null);

    const navigateTo = (newView) => {
        setPrevView(view);
        setView(newView);
    };

    const openApp = (id, label, componentKey) => {
        const registered = APP_REGISTRY[componentKey];
        if (registered) {
            setActiveApp({ id, title: label, component: registered.component });
        }
        setPrevView(view);
        setView("app");
    };

    const goBack = () => {
        if (view === "app") {
            setActiveApp(null);
            navigateTo(prevView === "applist" ? "applist" : "start");
        } else if (view === "applist") {
            navigateTo("start");
        }
    };

    const goHome = () => {
        setActiveApp(null);
        navigateTo("start");
    };

    // Windows button: start→applist, applist→start, app→start
    const handleWindowsBtn = () => {
        if (view === "app") {
            setActiveApp(null);
            navigateTo("start");
        } else if (view === "start") {
            navigateTo("applist");
        } else {
            navigateTo("start");
        }
    };

    // Determine slide direction
    const slideDirection = () => {
        if (view === "app") return "right";
        if (view === "applist") {
            return prevView === "start" ? "right" : "left";
        }
        return "left"; // going back to start
    };

    const dir = slideDirection();
    const enterVariant = dir === "right" ? "enterFromRight" : "enterFromLeft";
    const exitVariant  = dir === "right" ? "exitToLeft"    : "exitToRight";

    return (
        <div
            className="fixed inset-0 flex flex-col overflow-hidden"
            style={{
                overscrollBehavior: "none",
                touchAction: "pan-y",
            }}
        >
            {/* Blurred wallpaper background */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: `url(${WALLPAPER})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: "blur(18px) brightness(0.45)",
                    transform: "scale(1.1)", // avoids blur edges showing
                }}
            />
            {/* Dark overlay for readability */}
            <div className="absolute inset-0 z-0 bg-black/40" />

            {/* Status Bar */}
            <div className="relative z-10 shrink-0">
                <StatusBar />
            </div>

            {/* Main content area — animated transitions */}
            <div className="relative z-10 flex-1 flex flex-col overflow-hidden">
                <AnimatePresence mode="wait" initial={false}>
                    {view === "start" && (
                        <motion.div
                            key="start"
                            className="absolute inset-0 flex flex-col"
                            variants={slideVariants}
                            initial={enterVariant}
                            animate="center"
                            exit={exitVariant}
                            transition={{ type: "tween", duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
                        >
                            <StartScreen
                                onOpenApp={openApp}
                                onSwipeToList={() => navigateTo("applist")}
                            />
                        </motion.div>
                    )}

                    {view === "applist" && (
                        <motion.div
                            key="applist"
                            className="absolute inset-0 flex flex-col"
                            variants={slideVariants}
                            initial={enterVariant}
                            animate="center"
                            exit={exitVariant}
                            transition={{ type: "tween", duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
                        >
                            <AppList
                                onOpenApp={openApp}
                                onBack={() => navigateTo("start")}
                            />
                        </motion.div>
                    )}

                    {view === "app" && activeApp && (
                        <motion.div
                            key={`app-${activeApp.id}`}
                            className="absolute inset-0 flex flex-col"
                            variants={slideVariants}
                            initial="enterFromRight"
                            animate="center"
                            exit="exitToRight"
                            transition={{ type: "tween", duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
                        >
                            <MobileAppContainer
                                app={activeApp}
                                onClose={goBack}
                                onHome={goHome}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Global Navigation Bar (only shown when NOT in an app — MobileAppContainer has its own) */}
            {view !== "app" && (
                <div className="relative z-10">
                    <NavigationBar onBack={goBack} onHome={goHome} onWindowsBtn={handleWindowsBtn} />
                </div>
            )}
        </div>
    );
};

export default WindowsPhoneUI;
