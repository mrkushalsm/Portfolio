import React, { useState, useRef, useEffect } from "react";
import { FiSearch, FiPower, FiUser, FiSettings, FiLock } from "react-icons/fi";
import Image from "next/image";

const StartMenu = ({ 
    isOpen,
    onClose, 
    desktopIcons, 
    onAppClick,
    userName = "User" 
}: {
    isOpen: boolean;
    onClose: () => void;
    desktopIcons: { name: string; icon: string }[];
    onAppClick: (appName: string) => void;
    userName?: string;
}) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("pinned");
    const menuRef = useRef(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                // Check if click was on the Windows start button
                const startButton = document.querySelector('[data-start-button]');
                if (!startButton || !startButton.contains(event.target)) {
                    onClose();
                }
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    // Filter apps based on search query
    const filteredApps = desktopIcons.filter(app =>
        app.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pinned apps (you can customize this list)
    const pinnedApps = desktopIcons.filter(app => 
        ["Projects", "Skills", "About Me", "Terminal"].includes(app.name)
    );

    // User profile actions
    const userActions = [
        { icon: <FiUser className="w-4 h-4" />, label: `${userName}`, action: () => {} },
        { icon: <FiSettings className="w-4 h-4" />, label: "Settings", action: () => {} },
        { icon: <FiLock className="w-4 h-4" />, label: "Lock", action: () => {} },
        { icon: <FiPower className="w-4 h-4" />, label: "Sign out", action: () => {} }
    ];

    if (!isOpen) return null;

    return (
        <div
            ref={menuRef}
            className="absolute left-0 w-80 bg-zinc-800/95 backdrop-blur-md rounded-lg overflow-hidden shadow-2xl border border-zinc-700 text-white"
            style={{
                bottom: '70px',
                height: '450px',
                zIndex: 50,
                position: 'absolute'
            }}
        >
            {/* Search Bar */}
            <div className="p-2 border-b border-zinc-700">
                <div className="relative">
                    <FiSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Type here to search"
                        className="w-full bg-zinc-700/50 text-white pl-8 pr-3 py-1.5 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                    />
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-col h-[calc(100%-3rem)]">
                {/* Tabs */}
                <div className="flex border-b border-zinc-700">
                    <button
                        className={`px-3 py-1.5 text-xs font-medium transition-colors ${activeTab === 'pinned' ? 'text-white bg-zinc-600/50' : 'text-gray-300 hover:bg-zinc-700/50'}`}
                        onClick={() => setActiveTab('pinned')}
                    >
                        Pinned
                    </button>
                    <button
                        className={`px-3 py-1.5 text-xs font-medium transition-colors ${activeTab === 'all' ? 'text-white bg-zinc-600/50' : 'text-gray-300 hover:bg-zinc-700/50'}`}
                        onClick={() => setActiveTab('all')}
                    >
                        All apps
                    </button>
                </div>

                {/* App Grid */}
                <div className="flex-1 overflow-y-auto p-2">
                    {searchQuery ? (
                        <div className="grid grid-cols-5 gap-2">
                            {filteredApps.map((app, index) => (
                                <button
                                    key={index}
                                    className="flex flex-col items-center p-1.5 rounded-md hover:bg-zinc-700/50 transition-colors"
                                    onClick={() => {
                                        onAppClick(app.name);
                                        onClose();
                                    }}
                                >
                                    <Image src={app.icon} alt={app.name} width={32} height={32} className="mb-1" />
                                    <span className="text-xs text-center truncate w-full">{app.name}</span>
                                </button>
                            ))}
                        </div>
                    ) : activeTab === 'pinned' ? (
                        <>
                            <h3 className="text-xs font-medium text-gray-400 mb-1">Pinned</h3>
                            <div className="grid grid-cols-5 gap-2">
                                {pinnedApps.map((app, index) => (
                                    <button
                                        key={index}
                                        className="flex flex-col items-center p-1.5 rounded-md hover:bg-zinc-700/50 transition-colors"
                                        onClick={() => {
                                            onAppClick(app.name);
                                            onClose();
                                        }}
                                    >
                                        <Image src={app.icon} alt={app.name} width={32} height={32} className="mb-1" />
                                        <span className="text-xs text-center truncate w-full">{app.name}</span>
                                    </button>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="grid grid-cols-5 gap-2">
                            {desktopIcons.map((app, index) => (
                                <button
                                    key={index}
                                    className="flex flex-col items-center p-1.5 rounded-md hover:bg-zinc-700/50 transition-colors"
                                    onClick={() => {
                                        onAppClick(app.name);
                                        onClose();
                                    }}
                                >
                                    <Image src={app.icon} alt={app.name} width={32} height={32} className="mb-1" />
                                    <span className="text-xs text-center truncate w-full">{app.name}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* User Profile & Power Options */}
                <div className="border-t border-zinc-700 p-1.5">
                    <div className="flex items-center justify-between">
                        {userActions.map((action, index) => (
                            <button
                                key={index}
                                onClick={action.action}
                                className="flex flex-col items-center p-1.5 rounded-md hover:bg-zinc-700/50 transition-colors w-1/4"
                            >
                                <div className="w-6 h-6 flex items-center justify-center text-gray-300">
                                    {action.icon}
                                </div>
                                <span className="text-xs text-center mt-0.5 truncate w-full">{action.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StartMenu;
