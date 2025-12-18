"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
const windowsIcon = "/assets/taskbar/windows-icon.png";

const BootScreen = () => {
    const router = useRouter();

    useEffect(() => {
        // ⏳ Redirect to Desktop after 3 seconds
        const timer = setTimeout(() => {
            router.push("/desktop");
        }, 3000);

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="h-screen w-screen bg-black flex flex-col items-center justify-center">
            {/* 🔹 Windows 10 Logo */}
            <img className="w-48 h-48" src={windowsIcon} alt="Windows" />

            {/* 🛑 Margin between logo & loader */}
            <div className="mt-40 relative w-20 h-20 flex items-center justify-center">
                {/* 🔄 Circular Loading Dots */}
                {[...Array(12)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 bg-white rounded-full animate-spin"
                        style={{
                            transform: `rotate(${i * 30}deg) translate(35px)`,
                            animationDelay: `${i * 0.1}s`,
                        }}
                    ></div>
                ))}
            </div>

            {/* 🔄 Tailwind CSS Animation */}
            <style>
                {`
                @keyframes spin {
                    0% { opacity: 0.2; }
                    50% { opacity: 1; }
                    100% { opacity: 0.2; }
                }
                .animate-spin {
                    animation: spin 1.2s linear infinite;
                }
                `}
            </style>
        </div>
    );
};

export default BootScreen;
