import React, { useState, useRef } from "react";
import StartMenu from "@/components/windowsUI/StartMenu";
import Image from "next/image";

const Taskbar = ({ 
    openWindows, 
    activeWindow, 
    setActiveWindow, 
    desktopIcons,
    windowVisibility = {},
    onToggleMinimize,
    onOpenApp
}: {
    openWindows: string[];
    activeWindow: string | null;
    setActiveWindow: (window: string) => void;
    desktopIcons: { name: string; icon: string }[];
    windowVisibility?: Record<string, boolean>;
    onToggleMinimize?: (window: string) => void;
    onOpenApp?: (appName: string) => void;
}) => {
    const [showStartMenu, setShowStartMenu] = useState(false);
    const startButtonRef = useRef(null);

    const handleWindowClick = (window) => {
        if (windowVisibility[window] === false) {
            // If window is minimized, restore it
            onToggleMinimize?.(window);
            setActiveWindow(window);
        } else if (activeWindow === window) {
            // If window is active, minimize it
            onToggleMinimize?.(window);
        } else {
            // Bring to front and focus
            setActiveWindow(window);
        }
    };

    return (
        <div className="absolute bottom-0 left-0 w-full bg-zinc-900/95 backdrop-blur-sm text-white p-1.5 flex justify-between items-center border-t border-zinc-700 z-[50]">
            {/* Left side: Windows button + Opened Apps */}
            <div className="flex-1 flex items-center h-12">
                <div className="flex items-center h-full pl-2 pr-1 relative" style={{ zIndex: 10000 }}>
                    <div className="relative">
                        <button
                            ref={startButtonRef}
                            data-start-button
                            className={`p-2 rounded w-10 h-10 flex-shrink-0 flex items-center justify-center transition-colors ${
                                showStartMenu ? 'bg-zinc-600/50' : 'hover:bg-zinc-700/50'
                            }`}
                            onClick={() => setShowStartMenu(!showStartMenu)}
                        >
                            <Image src="/assets/taskbar/windows-icon.png" alt="Windows icon" width={24} height={24} />
                        </button>
                        {showStartMenu && (
                            <StartMenu
                                isOpen={showStartMenu}
                                onClose={() => setShowStartMenu(false)}
                                desktopIcons={desktopIcons}
                                onAppClick={onOpenApp}
                            />
                        )}
                    </div>
                </div>
                <div className="h-8 w-px bg-zinc-600 mx-1 mr-2"></div>

                {/* App Icons */}
                <div className="flex-1 flex items-center h-full overflow-x-auto hide-scrollbar px-1">
                    <div className="flex items-center space-x-1 h-full">
                        {openWindows.map((window) => {
                            const iconData = desktopIcons.find((icon) => icon.name === window);
                            return (
                                <button
                                    key={window}
                                    className={`p-2 rounded cursor-pointer flex items-center justify-center w-10 h-10 flex-shrink-0 ${
                                        activeWindow === window && windowVisibility[window] !== false
                                            ? "bg-gray-500/30" 
                                            : "hover:bg-gray-600/30"
                                    }`}
                                    onClick={() => handleWindowClick(window)}
                                >
                                    {iconData && (
                                        <Image
                                            src={iconData.icon} 
                                            alt={window}
                                            width={32}
                                            height={32}
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Right side: System Tray */}
            <div className="flex items-center h-12 pr-2">
                <div className="flex items-center space-x-1 h-full">
                    <div className="hidden sm:flex items-center space-x-1 h-full">
                        <button className="relative p-2 rounded hover:bg-zinc-800 w-10 h-10 flex items-center justify-center">
                            <Image src="/assets/taskbar/wifi.png" alt="WiFi" width={20} height={20} />
                        </button>
                        <button className="p-2 rounded hover:bg-zinc-800 w-10 h-10 flex items-center justify-center">
                            <Image src="/assets/taskbar/battery.png" alt="Battery" width={20} height={20} />
                        </button>
                        <button className="p-2 rounded hover:bg-zinc-800 w-10 h-10 flex items-center justify-center">
                            <Image src="/assets/taskbar/volume-mute.png" alt="Volume" width={20} height={20} />
                        </button>
                    </div>
                    <div className="h-8 w-px bg-zinc-600 mx-1"></div>
                    <div className="text-sm px-3 h-9 flex items-center bg-zinc-800/50 rounded hover:bg-zinc-700/70 ml-5">
                        120:05
                    </div>
                </div>
            </div>

            <style>{`
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
};

export default Taskbar;
