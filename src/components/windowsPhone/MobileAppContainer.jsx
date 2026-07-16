// MobileAppContainer.jsx - Full-screen app container for Windows Phone
"use client";

import React, { useEffect } from "react";
import NavigationBar from "./NavigationBar";

const MobileAppContainer = ({ app, onClose, onHome }) => {
    // Prevent body scroll while app is open
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    return (
        <div
            className="fixed inset-0 z-[9000] flex flex-col"
            style={{
                background: "#000",
                fontFamily: "'Segoe UI', sans-serif",
            }}
        >
            {/* App Title Bar */}
            <div
                className="flex items-end px-4 shrink-0"
                style={{
                    height: "44px",
                    background: "#000",
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
            </div>

            {/* App Content */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden" style={{ paddingBottom: "52px" }}>
                {app?.component && React.createElement(app.component)}
            </div>

            {/* Navigation Bar */}
            <NavigationBar onBack={onClose} onHome={onHome} />
        </div>
    );
};

export default MobileAppContainer;
