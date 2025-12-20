import React, { useState, useEffect, useRef } from "react";
import { FaWifi, FaBatteryFull, FaVolumeUp, FaChevronUp, FaSearch } from "react-icons/fa";
import StartMenu from "../win10/StartMenu";

const Taskbar = ({ 
    windows = [], 
    activeWindowId, 
    onToggleMinimize, 
    onFocus,
    startApps = [],
    pinnedApps = [],
    onLaunchItem // NEW prop
}) => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isStartOpen, setIsStartOpen] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (date) => {
        return date.toLocaleDateString([], { month: '2-digit', day: '2-digit', year: 'numeric' });
    };

    return (
        <>
            <StartMenu 
                isOpen={isStartOpen} 
                onClose={() => setIsStartOpen(false)} 
                apps={startApps} 
                onLaunchItem={onLaunchItem}
            />
            
            <div className="absolute bottom-0 w-full h-10 bg-[#101010cc] backdrop-blur-md flex items-center justify-between z-[10000] select-none text-white border-t border-[#333]">
                {/* Left Section: Start & Search */}
                <div className="flex items-center h-full">
                    {/* Start Button */}
                    <div 
                        className={`h-full w-12 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer group ${isStartOpen ? 'bg-white/10' : ''}`}
                        onClick={() => setIsStartOpen(!isStartOpen)}
                    >
                       <img src="/assets/icons/win10/win-start.png" alt="Start" className="h-4 w-4 drop-shadow-[0_0_2px_rgba(255,255,255,0.5)] group-hover:brightness-125 transition-transform group-active:scale-95" 
                            onError={(e) => e.target.src = "https://img.icons8.com/color/48/windows-10.png"}
                       />
                    </div>

                    {/* Search Bar */}
                    <div className="hidden md:flex items-center h-full">
                        <div className="flex items-center bg-white h-full w-[20rem] px-3 border border-[#333] hover:border-[#666] focus-within:border-[#0078d7] transition-colors">
                            <FaSearch className="text-gray-500 mr-3 w-3 h-3" />
                            <input 
                                type="text" 
                                placeholder="Type here to search" 
                                className="bg-transparent border-none outline-none text-black text-xs w-full placeholder-gray-500 font-normal"
                            />
                        </div>
                    </div>

                    {/* Cortana/Task View (Optional Icons) */}
                    <div className="h-full w-10 flex items-center justify-center hover:bg-white/10 cursor-pointer">
                        <div className="w-4 h-4 rounded-full border-2 border-white/80"></div>
                    </div>
                </div>

                {/* Middle Section: Active Apps */}
                <div className="flex-1 flex items-center h-full pl-2 overflow-x-auto no-scrollbar">
                    {windows.map((win) => (
                        <div
                            key={win.id}
                            className={`h-full min-w-[3rem] px-3 flex items-center justify-center hover:bg-white/10 transition-all cursor-pointer relative group
                                ${activeWindowId === win.id && !win.isMinimized ? 'bg-white/5' : 'hover:bg-white/5'}
                            `}
                            onClick={() => win.isMinimized || activeWindowId !== win.id ? onFocus(win.id) : onToggleMinimize(win.id)}
                            title={win.title}
                        >
                            <img 
                               src={win.icon && (win.icon.startsWith('/') || win.icon.startsWith('http')) ? win.icon : `/assets/icons/win10/${win.icon || 'file-text'}.ico`} 
                               onError={(e) => {
                                   if (!e.target.src.includes('file-text')) e.target.src = "/assets/icons/win10/file-text.ico";
                               }}
                               alt={win.title} 
                               className={`w-5 h-5 ${win.isMinimized ? 'opacity-70' : 'opacity-100'} transition-transform group-hover:scale-105`} 
                            />
                            {/* Running Indicator - Windows 10 Style (Blue line at bottom) */}
                             <div className={`absolute bottom-0 left-0 right-0 h-[3px] transition-all rounded-full mx-1
                                ${activeWindowId === win.id ? 'bg-[#76b9ed] scale-x-100' : 'bg-gray-400 scale-x-0 group-hover:scale-x-50'}
                            `}></div>
                        </div>
                    ))}
                </div>

                {/* Right Section: System Tray */}
                <div className="flex items-center h-full px-2 text-xs font-light gap-1">
                    <div className="h-full px-1 flex items-center justify-center hover:bg-white/10 cursor-pointer">
                        <FaChevronUp size={10} />
                    </div>
                    <div className="h-full px-1 flex items-center justify-center hover:bg-white/10 cursor-pointer">
                        <img src="/assets/taskbar/wifi.ico" alt="Wifi" className="h-4" />
                    </div>
                    <div className="h-full px-1 flex items-center justify-center hover:bg-white/10 cursor-pointer">
                        <img src="/assets/taskbar/battery.png" alt="Battery" className="h-4" />
                    </div>
                    <div className="h-full px-1 flex items-center justify-center hover:bg-white/10 cursor-pointer">
                         <FaVolumeUp size={14} />
                    </div>
                    
                    {/* Clock */}
                    <div className="flex flex-col items-end justify-center h-full px-2 hover:bg-white/10 cursor-pointer text-center leading-tight">
                        <span>{formatTime(currentTime)}</span>
                        <span className="text-[10px]">{formatDate(currentTime)}</span>
                    </div>


                    
                    {/* Show Desktop Line */}
                    <div className="w-1.5 h-full border-l border-gray-500/50 cursor-pointer hover:bg-white/20 ml-1"></div>
                </div>
            </div>
        </>
    );
};

export default Taskbar;
