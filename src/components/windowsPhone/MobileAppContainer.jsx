// MobileAppContainer.jsx - Full-screen app container for Windows Phone
"use client";

import React, { useEffect } from "react";
import NavigationBar from "./NavigationBar";

const MobileAppContainer = ({ app, onClose, onHome, openApp, setBackHandler, onSearch }) => {
    // Prevent body scroll while app is open
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    // Helper to get accent color
    const getAccentColor = () => {
        if (app?.color) return app.color;
        return "#0078d7"; // Fallback blue
    };

    return (
        <div 
            className="w-full h-full flex flex-col font-sans select-none overflow-hidden" 
            style={{ backgroundColor: "#000000" }} // True black base
        >


            {/* App Header (optional, usually apps render their own, but we can provide a small one) */}
            {/* <div 
                className="w-full px-4 pt-4 pb-1 shrink-0" 
                style={{ 
                    backgroundColor: "#000000",
                }}
            >
                <h1
                    className="text-white font-light tracking-wide pb-1"
                    style={{
                        fontSize: "16px",
                        letterSpacing: "0.08em",
                        textTransform: "lowercase",
                    }}
                >
                    {app?.title?.toLowerCase() || "app"}
                </h1>
            </div> */}

            {/* App Content */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden" style={{ paddingBottom: "52px" }}>
                {app?.component && React.createElement(app.component, { ...(app.appProps || {}), setBackHandler, openApp })}
            </div>

            {/* Navigation Bar */}
            <NavigationBar onBack={onClose} onHome={onHome} onSearch={onSearch} />
        </div>
    );
};

export default MobileAppContainer;
