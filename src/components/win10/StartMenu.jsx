import React, { useRef, useEffect } from "react";
import { FaUserCircle, FaCog, FaPowerOff, FaBars } from "react-icons/fa";

const StartMenu = ({ isOpen, onClose, apps = [] }) => {
    const menuRef = useRef(null);

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Check if click is on Start Button (which is outside this component)
            // This is usually handled by the toggle logic in Taskbar, but safety check helps
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                // Determine if we should close. If the click was on the start button,
                // the toggle logic there will handle it. We can rely on Taskbar's state.
                // But generally "click outside" listeners attached to document are good.
                // For now, simpler: DesktopEnv/Taskbar handles it?
                // Standard React pattern:
                onClose && onClose(); 
            }
        };

        if (isOpen) {
             // Delay adding listener to avoid immediate close from the opening click
             setTimeout(() => window.addEventListener("click", handleClickOutside), 0);
        }
        return () => window.removeEventListener("click", handleClickOutside);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div 
            ref={menuRef}
            className="absolute bottom-10 left-0 w-[600px] h-[500px] bg-[#1e1e1e]/95 backdrop-blur-md text-white shadow-2xl flex border border-[#333] z-[9999]"
            style={{ 
                animation: "slideUp 0.2s ease-out",
                maxHeight: "80vh",
                maxWidth: "100vw"
            }}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
        >
            {/* Left Sidebar (Slim) */}
            <div className="w-12 h-full flex flex-col items-center justify-end pb-2 gap-4 text-gray-400">
                <div className="w-full flex justify-center p-2 hover:bg-white/10 cursor-pointer group tooltip" title="Expand">
                    <FaBars size={14} />
                </div>
                <div className="flex-1"></div>
                
                <div className="w-full flex justify-center p-3 hover:bg-white/10 cursor-pointer rounded-sm" title="User">
                     <FaUserCircle size={18} />
                </div>
                <div className="w-full flex justify-center p-3 hover:bg-white/10 cursor-pointer rounded-sm" title="Settings">
                     <FaCog size={18} />
                </div>
                <div className="w-full flex justify-center p-3 hover:bg-white/10 cursor-pointer rounded-sm" title="Power">
                     <FaPowerOff size={18} />
                </div>
            </div>

            {/* Middle: App List */}
            <div className="w-64 h-full overflow-y-auto custom-scrollbar p-2">
                <div className="text-xs font-semibold px-2 py-1 mb-2 text-gray-400">Most Used</div>
                {apps.map((app, index) => (
                    <div 
                        key={index}
                        className="flex items-center gap-3 p-2 hover:bg-white/10 rounded-sm cursor-pointer select-none group"
                        onClick={() => {
                            app.action && app.action();
                            onClose();
                        }}
                    >
                         {/* Icon Box */}
                         <div className={`w-8 h-8 flex items-center justify-center rounded-sm ${app.bgColor || 'bg-transparent'}`}>
                             {typeof app.icon === 'string' ? (
                                 <img 
                                    src={app.icon} 
                                    alt="" 
                                    className="w-6 h-6 object-contain drop-shadow-sm" 
                                    onError={(e) => {
                                        // Fallback if image fails (e.g. if it was a raw 'folder' string without path)
                                        e.target.style.display = 'none';
                                    }}
                                />
                             ) : (
                                 <div className="text-white text-lg">
                                     {app.icon}
                                 </div>
                             )}
                         </div>
                         <span className="text-sm text-gray-200 group-hover:text-white">{app.name}</span>
                    </div>
                ))}
            </div>

            {/* Right: Tiles */}
            <div className="flex-1 h-full p-4 bg-[#1f1f1f]/50 overflow-y-auto custom-scrollbar">
                <div className="text-xs font-semibold mb-3 text-gray-400">Life at a glance</div>
                <div className="grid grid-cols-2 gap-2">
                    {/* Placeholder Tiles */}
                    <div className="bg-blue-600 p-2 h-24 flex flex-col justify-end cursor-pointer hover:border-2 border-white/50">
                        <span className="text-xs font-semibold">Calendar</span>
                        <span className="text-xs">Thursday 18</span>
                    </div>
                    <div className="bg-sky-500 p-2 h-24 flex flex-col justify-end cursor-pointer hover:border-2 border-white/50">
                        <span className="text-xs font-semibold">Weather</span>
                        <span className="text-xs">24°C Sunny</span>
                    </div>
                     <div className="bg-indigo-600 p-2 h-24 flex flex-col justify-end cursor-pointer hover:border-2 border-white/50 col-span-2">
                        <span className="text-xs font-semibold">Photos</span>
                    </div>
                </div>
                
                <div className="text-xs font-semibold mb-3 mt-6 text-gray-400">Play and Explore</div>
                <div className="grid grid-cols-2 gap-2">
                     <div className="bg-green-600 p-2 h-24 flex flex-col justify-end cursor-pointer hover:border-2 border-white/50">
                        <span className="text-xs font-semibold">Xbox</span>
                    </div>
                     <div className="bg-red-600 p-2 h-24 flex flex-col justify-end cursor-pointer hover:border-2 border-white/50">
                        <span className="text-xs font-semibold">Netflix</span>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #555;
                    border-radius: 2px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #888;
                }
            `}</style>
        </div>
    );
};

export default StartMenu;
