import React, { useState, useEffect, useRef } from "react";
const windowsIcon = "/assets/taskbar/windows-icon.png";
const volumeMute = "/assets/taskbar/volume-mute.png";
const wifi = "/assets/taskbar/wifi.png";
const battery = "/assets/taskbar/battery.png";
import StartMenu from "./StartMenu";

const Taskbar = ({ 
    openWindows, 
    activeWindow, 
    setActiveWindow, 
    desktopIcons,
    windowVisibility = {},
    onToggleMinimize,
    onOpenApp
}) => {
    const [time, setTime] = useState(new Date());
    const [showStartMenu, setShowStartMenu] = useState(false);
    const startButtonRef = useRef(null);

    useEffect(() => {
        // Update immediately to avoid initial delay
        setTime(new Date());
        
        // Then update every second
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

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
        <div className="fixed bottom-0 left-0 w-full bg-zinc-900/95 backdrop-blur-sm text-white p-1.5 flex justify-between items-center border-t border-zinc-700 z-[9998] overflow-hidden">
            {/* Left side: Windows button + Opened Apps */}
            <div className="flex-1 flex items-center h-12">
                <div className="flex items-center h-full pl-2 pr-1 relative" style={{ zIndex: 10000 }}>
                    <button 
                        ref={startButtonRef}
                        data-start-button
                        className={`p-2 rounded w-10 h-10 flex-shrink-0 flex items-center justify-center transition-colors ${
                            showStartMenu ? 'bg-zinc-600/50' : 'hover:bg-zinc-700/50'
                        }`}
                        onClick={() => setShowStartMenu(!showStartMenu)}
                    >
                        <img src={windowsIcon} alt="Windows icon" className="w-6 h-6" />
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
                                        <img 
                                            src={iconData.icon} 
                                            alt={window} 
                                            className="w-6 h-6" 
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
                        <button className="p-2 rounded hover:bg-zinc-800 w-10 h-10 flex items-center justify-center">
                            <img src={wifi} alt="WiFi" className="w-5 h-5" />
                        </button>
                        <button className="p-2 rounded hover:bg-zinc-800 w-10 h-10 flex items-center justify-center">
                            <img src={battery} alt="Battery" className="w-5 h-5" />
                        </button>
                        <button className="p-2 rounded hover:bg-zinc-800 w-10 h-10 flex items-center justify-center">
                            <img src={volumeMute} alt="Volume" className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="h-8 w-px bg-zinc-600 mx-1"></div>
                    <div className="text-sm px-3 h-9 flex items-center bg-zinc-800/50 rounded hover:bg-zinc-700/70 ml-5">
                        {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
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
