// DesktopEnv.jsx - Responsive layout switcher:
//   Mobile  (< 768px) → Windows Phone UI
//   Desktop (≥ 768px) → Windows 10 Desktop
"use client";

import React, { useState, useEffect } from "react";
import WindowsPhoneUI from "../windowsPhone/WindowsPhoneUI";
import Win10Desktop from "./Win10Desktop";

const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    return isMobile;
};

const DesktopEnv = () => {
    const isMobile = useIsMobile();

    if (isMobile) {
        return <WindowsPhoneUI />;
    }

    return <Win10Desktop />;
};

export default DesktopEnv;
