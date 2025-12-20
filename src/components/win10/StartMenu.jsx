import React, { useRef, useEffect } from "react";
import { FaUserCircle, FaCog, FaPowerOff, FaBars } from "react-icons/fa";

const StartMenu = ({ isOpen, onClose, apps = [], onLaunchItem }) => {
    const menuRef = useRef(null);
    const [date, setDate] = React.useState(new Date());
    const [weather, setWeather] = React.useState({ temp: '--', condition: 'Sunny', code: 0 });

    // Weather Codes mapping (simplified)
    const getWeatherIcon = (code) => {
        if (code <= 1) return '☀'; // Clear
        if (code <= 3) return '⛅'; // Cloudy
        if (code <= 67) return '🌧'; // Rain
        if (code > 67) return '⛈'; // Storm/Snow/Other
        return '☀';
    };

    // Update Date & Weather
    useEffect(() => {
        if (isOpen) {
            // Update time immediately and every minute
            setDate(new Date());
            
            // Fetch Weather (Bangalore)
            fetch('https://api.open-meteo.com/v1/forecast?latitude=12.97&longitude=77.59&current_weather=true')
                .then(res => res.json())
                .then(data => {
                    if (data.current_weather) {
                        setWeather({
                            temp: Math.round(data.current_weather.temperature),
                            code: data.current_weather.weathercode,
                            condition: 'Bangalore'
                        });
                    }
                })
                .catch(err => console.error("Weather fetch failed", err));
        }
    }, [isOpen]);

    // Click outside to close (simpler handling)
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                 if (!event.target.closest('.start-button')) {
                    onClose && onClose();
                 }
            }
        };

        if (isOpen) {
             setTimeout(() => window.addEventListener("click", handleClickOutside), 0);
        }
        return () => window.removeEventListener("click", handleClickOutside);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div 
            ref={menuRef}
            className="absolute bottom-12 left-0 w-[640px] h-[550px] bg-[#1e1e1e]/85 backdrop-blur-xl text-white shadow-[0_0_40px_rgba(0,0,0,0.6)] flex border border-[#333]/50 z-[9999] rounded-t-lg overflow-hidden animate-slideUp cursor-default"
            onClick={(e) => e.stopPropagation()} 
        >
            {/* Left Sidebar (Controls) */}
            <div className="w-12 h-full flex flex-col items-center justify-end pb-4 gap-2 text-gray-400 bg-black/20">
                <div className="w-full h-12 flex items-center justify-center hover:bg-white/10 cursor-pointer transition-colors" title="Expand">
                    <FaBars size={14} />
                </div>
                <div className="flex-1"></div>
                
                <div className="w-10 h-10 flex items-center justify-center rounded-sm hover:bg-white/10 cursor-pointer transition-colors" title="Profile">
                     <div className="w-6 h-6 rounded-full bg-gray-600 border border-gray-400 overflow-hidden">
                        {/* Custom User Image */}
                         <img src="/assets/icons/win10/user-icon.png" alt="" className="w-full h-full opacity-100" />
                     </div>
                </div>
                <div 
                    className="w-10 h-10 flex items-center justify-center rounded-sm hover:bg-white/10 cursor-pointer transition-colors" 
                    title="Documents"
                    onClick={() => {
                        if(onLaunchItem) onLaunchItem("Documents", { type: 'file', fileType: 'app', appName: 'File Explorer', initialPath: 'C:/Users/Kushal/Documents' });
                        onClose();
                    }}
                >
                     <img src="/assets/icons/win10/document-folder.ico" className="w-4 h-4 opacity-70" alt=""/>
                </div>
                <div 
                    className="w-10 h-10 flex items-center justify-center rounded-sm hover:bg-white/10 cursor-pointer transition-colors" 
                    title="Pictures"
                    onClick={() => {
                        if(onLaunchItem) onLaunchItem("Pictures", { type: 'file', fileType: 'app', appName: 'File Explorer', initialPath: 'C:/Users/Kushal/Pictures' });
                        onClose();
                    }}
                >
                     <img src="/assets/icons/win10/pictures-folder.ico" className="w-4 h-4 opacity-70" alt=""/>
                </div>
                <div className="w-10 h-10 flex items-center justify-center rounded-sm hover:bg-white/10 cursor-pointer transition-colors" title="Settings">
                     <FaCog size={16} />
                </div>
                <div className="w-10 h-10 flex items-center justify-center rounded-sm hover:bg-white/10 cursor-pointer transition-colors hover:text-red-400" title="Power">
                     <FaPowerOff size={16} />
                </div>
            </div>

            {/* Middle: App List (Alphabetical Mockup) */}
            <div className="w-60 h-full overflow-y-auto custom-scrollbar p-2 py-4">
                <div className="text-xs font-semibold px-4 py-1 mb-2 text-gray-400 tracking-wider">APPS</div>
                <div className="flex flex-col gap-1">
                    {apps.map((app, index) => (
                        <div 
                            key={index}
                            className="flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-sm cursor-pointer select-none group transition-colors"
                            onClick={() => {
                                app.action && app.action();
                                onClose();
                            }}
                        >
                             {/* Icon */}
                             <div className={`w-6 h-6 flex items-center justify-center ${app.bgColor || 'bg-transparent'}`}>
                                 {typeof app.icon === 'string' ? (
                                     <img 
                                        src={app.icon} 
                                        alt="" 
                                        className="w-full h-full object-contain" 
                                    />
                                 ) : (
                                     <div className="text-white text-sm">{app.icon}</div>
                                 )}
                             </div>
                             <span className="text-sm font-light text-gray-200 group-hover:text-white truncate">{app.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right: Live Tiles */}
            <div className="flex-1 h-full p-6 bg-black/10 overflow-y-auto custom-scrollbar">
                <div className="text-xs font-semibold mb-3 text-gray-400 tracking-wider">LIFE AT A GLANCE</div>
                <div className="grid grid-cols-4 gap-1.5 auto-rows-[6rem]">
                    
                    {/* Calendar Tile (Medium) */}
                    <div className="col-span-2 bg-[#881798]/90 p-3 flex flex-col justify-between hover:scale-[1.02] hover:shadow-lg transition-transform cursor-pointer border border-white/5 group">
                        <div className="flex justify-end"><span className="text-6xl opacity-20 group-hover:opacity-30 transition-opacity">{date.getDate()}</span></div>
                        <div>
                            <span className="block text-sm font-semibold">{date.toLocaleDateString('en-US', { weekday: 'long' })}</span>
                        </div>
                    </div>

                    {/* Weather Tile (Small) */}
                    <div 
                        className="col-span-2 bg-[#1e90ff]/80 p-3 flex flex-col justify-between hover:scale-[1.02] cursor-pointer border border-white/5"
                        title="Weather provided by Open-Meteo"
                    >
                         <div className="flex items-center gap-2">
                             <span className="text-2xl">{getWeatherIcon(weather.code)}</span>
                             <span className="text-lg">{weather.temp}°</span>
                         </div>
                         <span className="text-xs">{weather.condition}</span>
                    </div>

                    {/* Quote Tile (Wide) */}
                    <div className="col-span-4 bg-gradient-to-r from-[#d13a0e] to-[#c92e00] relative group overflow-hidden cursor-pointer hover:border border-white/20 p-3 flex flex-col justify-center">
                         <div className="text-white text-md font-serif italic text-center drop-shadow-md">"Talk is cheap. Show me the code."</div>
                         <div className="text-right text-xs mt-2 opacity-80 font-semibold">- Linus Torvalds</div>
                    </div>
                </div>
                
                <div className="text-xs font-semibold mb-3 mt-8 text-gray-400 tracking-wider">DEVELOPER</div>
                <div className="grid grid-cols-4 gap-1.5 auto-rows-[6rem]">
                     {/* GitHub Tile */}
                     <div 
                        className="col-span-2 bg-[#24292e] p-3 flex flex-col items-center justify-center gap-2 hover:bg-[#2b3137] cursor-pointer transition-colors"
                        onClick={() => window.open("https://github.com/mrkushalsm", "_blank")}
                    >
                         <img src="/assets/icons/win10/github-mark-white.svg" className="w-8 h-8" alt="GitHub"/>
                         <span className="text-xs font-medium">GitHub</span>
                    </div>

                    {/* LinkedIn Tile */}
                    <div 
                        className="col-span-2 bg-[#0077b5] p-3 flex flex-col items-center justify-center gap-2 hover:bg-[#006097] cursor-pointer transition-colors"
                        onClick={() => window.open("https://www.linkedin.com/in/mrkushalsm/", "_blank")}
                    >
                        <img src="/assets/icons/win10/linkedin.png" className="w-8 h-8" alt="LinkedIn"/>
                        <span className="text-xs font-medium">LinkedIn</span>
                    </div>

                    {/* X Tile */}
                     <div 
                        className="col-span-2 bg-black p-3 flex flex-col items-center justify-center gap-2 hover:bg-[#2b3137] cursor-pointer transition-colors"
                        onClick={() => window.open("https://x.com/mrkushalsm", "_blank")}
                    >
                         <img src="/assets/icons/win10/x-twitter.png" className="w-8 h-8 bg-white rounded-lg" alt="X"/>
                         <span className="text-xs font-medium">X</span>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes slideUp {
                    from { transform: translateY(100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .animate-slideUp {
                    animation: slideUp 0.25s cubic-bezier(0.1, 0.9, 0.2, 1);
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 2px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #555;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #888;
                }
            `}</style>
        </div>
    );
};

export default StartMenu;
