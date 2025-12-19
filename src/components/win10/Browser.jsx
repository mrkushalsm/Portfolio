import React, { useState, useEffect, useRef } from 'react';
import { FaArrowLeft, FaArrowRight, FaRedo, FaHome, FaSearch, FaTimes, FaGlobeAmericas, FaStar, FaPlus } from 'react-icons/fa';

const Browser = ({ initialUrl = "edge://newtab", chromeless = false }) => {
    // Normalization: If no URL provided, go to new tab
    const [url, setUrl] = useState(initialUrl === "about:blank" ? "edge://newtab" : initialUrl);
    const [inputValue, setInputValue] = useState(url === "edge://newtab" ? "" : url);
    const [isLoading, setIsLoading] = useState(false);
    const [history, setHistory] = useState([url]);
    const [historyIndex, setHistoryIndex] = useState(0);
    const [iframeSrc, setIframeSrc] = useState("");
    
    // Derived state for what to show
    const isNewTab = url === "edge://newtab";

    useEffect(() => {
        let isMounted = true;
        
        const loadContent = () => {
             // Sync input with valid URLs
             if (!isNewTab) setInputValue(url);
             else setInputValue("");

             if (isNewTab) {
                 setIframeSrc("");
                 return;
             }

             setIsLoading(true);

             // URL Handling Logic
             let target = url;
             
             // 1. Proxy Mode for known X-Frame-Options blockers (GitHub, Vercel)
             // This uses our local Next.js API route to fetch the page server-side, 
             // strip the security headers, and inject a <base> tag.
             const needsProxy = target.includes('github.com') || target.includes('vercel.app');
             
             if (needsProxy) {
                 // Use local proxy
                 setIframeSrc(`/api/proxy?url=${encodeURIComponent(target)}`);
             } 
             // 2. Google Iframe Hack (still commonly works better direct with params)
             else if (target.includes('google.com') && !target.includes('igu=1')) {
                 // Try to force iframe mode, but Google often blocks this now.
                 // Better to use Bing for the "embedded browser" experience
                 // For now, let's just let it load or fail, user has "Open Ext" as backup
                 setIframeSrc(target); 
             }
             // 3. Direct Load for others
             else {
                 setIframeSrc(target);
             }

             // Fake load time if it's an iframe (since we can't always detect onLoad for cross-origin)
             setTimeout(() => { if (isMounted) setIsLoading(false); }, 1500);
        };

        loadContent();
        return () => { isMounted = false; };
    }, [url, isNewTab]);

    const navigate = (newUrl) => {
        const updatedHistory = history.slice(0, historyIndex + 1);
        updatedHistory.push(newUrl);
        setHistory(updatedHistory);
        setHistoryIndex(updatedHistory.length - 1);
        setUrl(newUrl);
    };

    const handleNavigate = (e) => {
        e.preventDefault();
        let target = inputValue.trim();
        if (!target) return;

        if (!target.startsWith('http') && !target.includes('://')) {
             // Default to Bing Search for better embedding support
             // target = `https://www.bing.com/search?q=${encodeURIComponent(target)}`;
             // Actually, Google with igu=1 might still work for some, but Bing is safer.
             // Let's try Google first as user expected it, but with the hack.
             target = `https://www.google.com/search?q=${encodeURIComponent(target)}&igu=1`;
        }
        navigate(target);
    };

    const goBack = () => {
        if (historyIndex > 0) {
            setHistoryIndex(prev => prev - 1);
            setUrl(history[historyIndex - 1]);
        }
    };

    const goForward = () => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex(prev => prev + 1);
            setUrl(history[historyIndex + 1]);
        }
    };

    const refresh = () => {
        const current = iframeSrc;
        setIframeSrc('');
        setTimeout(() => setIframeSrc(current), 10);
    };

    const goHome = () => navigate("edge://newtab");

    return (
        <div className="flex flex-col h-full bg-white select-none w-full">
            {/* Top Bar - Hidden in chromeless mode */}
            {!chromeless && (
                <div className="flex flex-col bg-[#dfe1e5] shadow-sm z-20">
                    {/* Tabs Bar */}
                    <div className="flex items-end px-2 pt-2 space-x-1 bg-[#dee1e6]">
                        {/* Active Tab */}
                        <div className="bg-white rounded-t-md px-3 py-2 text-xs flex items-center max-w-[200px] shadow-[0_0_5px_rgba(0,0,0,0.1)] relative z-10 border-t border-x border-gray-300 h-8">
                            {isLoading ? (
                                <div className="w-3 h-3 mr-2 border-2 border-[#0078d7] border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <img src="/assets/icons/win10/edge.png" alt="" className="w-3.5 h-3.5 mr-2" />
                            )}
                            <span className="truncate flex-1 font-normal text-gray-700">
                                {isNewTab ? "New Tab" : (url.replace('https://', '').replace('www.', '').split('/')[0] || "Loading...")}
                            </span>
                            <span className="ml-2 hover:bg-gray-200 rounded-full p-0.5 cursor-pointer text-gray-500" onClick={goHome}>
                                <FaTimes size={10} />
                            </span>
                        </div>
                        {/* New Tab Button */}
                        <button className="p-1.5 hover:bg-gray-300 rounded-md mb-0.5 text-gray-600" onClick={goHome}>
                            <FaPlus size={10} />
                        </button>
                    </div>

                    {/* Navigation Bar */}
                    <div className="flex items-center p-1.5 bg-white border-b border-gray-300 gap-2">
                        <div className="flex items-center text-gray-600 px-1">
                            <button className={`p-1.5 rounded-full hover:bg-gray-100 ${historyIndex === 0 ? 'opacity-30' : ''}`} onClick={goBack} disabled={historyIndex === 0}>
                                <FaArrowLeft size={12} />
                            </button>
                            <button className={`p-1.5 rounded-full hover:bg-gray-100 ${historyIndex === history.length - 1 ? 'opacity-30' : ''}`} onClick={goForward} disabled={historyIndex === history.length - 1}>
                                <FaArrowRight size={12} />
                            </button>
                            <button className="p-1.5 rounded-full hover:bg-gray-100" onClick={refresh}>
                                <FaRedo size={11} />
                            </button>
                            <button className="p-1.5 rounded-full hover:bg-gray-100" onClick={goHome}>
                                <FaHome size={13} />
                            </button>
                        </div>

                        {/* Address Bar */}
                        <form className="flex-1" onSubmit={handleNavigate}>
                            <div className="flex items-center bg-[#f1f3f4] rounded-full px-4 py-1.5 border border-transparent focus-within:border-[#0078d7]/50 focus-within:bg-white focus-within:shadow-sm transition-all">
                                <div className="text-gray-500 mr-2">
                                    {url.includes('google') ? <FaSearch size={12} /> : 
                                     url.includes('github') ? <FaGithubIcon /> :
                                     <FaGlobeAmericas size={12} />}
                                </div>
                                <input 
                                    type="text" 
                                    className="bg-transparent border-none outline-none text-sm w-full text-gray-700 placeholder-gray-500 font-normal"
                                    value={inputValue}
                                    placeholder="Search the web or enter URL"
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onFocus={(e) => e.target.select()}
                                />
                                <div className="text-gray-400 cursor-pointer hover:text-yellow-500 ml-2">
                                    <FaStar size={12} />
                                </div>
                            </div>
                        </form>
                        
                         {/* External Link */}
                        <a 
                            href={url === "edge://newtab" ? "https://www.google.com" : url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-1.5 hover:bg-gray-100 rounded text-gray-500"
                            title="Open in real browser"
                        >
                             <FaExternalLinkIcon />
                        </a>
                    </div>
                </div>
            )}

            {/* Content Area */}
            <div className="flex-1 relative bg-white overflow-hidden w-full h-full">
                {isNewTab ? (
                    <NewTabPage onNavigate={navigate} />
                ) : (
                    <>
                        <iframe 
                            src={iframeSrc || undefined}
                            title="Browser"
                            className="w-full h-full border-none bg-white"
                            sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals"
                        />
                    </>
                )}
            </div>
            
            <style>{`
                @keyframes loading-bar {
                    0% { width: 0%; margin-left: 0; }
                    50% { width: 70%; margin-left: 0; }
                    100% { width: 100%; margin-left: 100%; }
                }
                .animate-loading-bar {
                    animation: loading-bar 1.5s infinite ease-in-out;
                }
            `}</style>
        </div>
    );
};

// Internal Components

const NewTabPage = ({ onNavigate }) => {
    const [search, setSearch] = useState("");

    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim()) {
            onNavigate(`https://www.google.com/search?q=${encodeURIComponent(search)}&igu=1`);
        }
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-[#fcfcfc] bg-[url('/assets/wallpapers/edge_bg.jpg')] bg-cover bg-center">
            <div className="flex flex-col items-center bg-white/80 backdrop-blur-md p-10 rounded-2xl shadow-xl max-w-2xl w-full mx-4 animate-in fade-in zoom-in duration-300">
                <img src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png" alt="Google" className="h-16 mb-8 select-none" />
                
                <form onSubmit={handleSearch} className="w-full relative group">
                    <div className="flex items-center w-full h-12 px-5 bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md focus-within:shadow-md focus-within:border-gray-300 transition-all">
                        <FaSearch className="text-gray-400 mr-3" />
                        <input 
                            type="text" 
                            className="flex-1 bg-transparent outline-none text-base text-gray-700" 
                            placeholder="Search Google or type a URL"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            autoFocus
                        />
                        {search && (
                             <button type="button" onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600">
                                 <FaTimes />
                             </button>
                        )}
                    </div>
                </form>

                <div className="grid grid-cols-4 gap-6 mt-8 w-full px-4">
                     <QuickLink icon="github" label="GitHub" url="https://github.com/mrkushalsm" onClick={() => onNavigate("https://github.com/mrkushalsm")} />
                     <QuickLink icon="linkedin" label="LinkedIn" url="https://linkedin.com" onClick={() => onNavigate("https://www.linkedin.com/in/mrkushalsm")} />
                     <QuickLink icon="folder" label="Portfolio" url="https://mrkushalsm.github.io" onClick={() => onNavigate("https://mrkushalsm.github.io")} />
                     <QuickLink icon="envelope" label="Email" url="mailto:mrkushalsm@gmail.com" onClick={() => window.open("mailto:mrkushalsm@gmail.com")} />
                </div>
            </div>
            <div className="absolute bottom-4 text-xs text-gray-500 font-medium bg-white/50 px-3 py-1 rounded-full backdrop-blur-sm">
                Microsoft Edge (Simulated)
            </div>
        </div>
    );
};

const QuickLink = ({ icon, label, onClick }) => {
    // Simple icon mapping
    const getIcon = () => {
        if (icon === 'github') return <FaGithubIcon className="text-gray-800" size={24} />;
        if (icon === 'linkedin') return <FaLinkedinIcon className="text-[#0077b5]" size={24} />;
        if (icon === 'folder') return <div className="bg-yellow-400 w-6 h-6 rounded-sm flex items-center justify-center text-white text-[10px]">P</div>;
        return <div className="bg-gray-400 w-6 h-6 rounded-full"></div>;
    };

    return (
        <button onClick={onClick} className="flex flex-col items-center gap-2 group p-2 rounded-lg hover:bg-white/50 transition-colors">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                {getIcon()}
            </div>
            <span className="text-xs text-gray-600 font-medium">{label}</span>
        </button>
    );
};

// SVG Components helper
const FaGithubIcon = (props) => (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 496 512" {...props} height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.6-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"></path></svg>
);

const FaLinkedinIcon = (props) => (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" {...props} height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z"></path></svg>
);

const FaExternalLinkIcon = (props) => (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" {...props} height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M432,320H400a16,16,0,0,0-16,16V448H64V128H208a16,16,0,0,0,16-16V80a16,16,0,0,0-16-16H48A48,48,0,0,0,0,112V464a48,48,0,0,0,48,48H400a48,48,0,0,0,48-48V336A16,16,0,0,0,432,320ZM488,0h-128c-21.37,0-32.05,25.91-17,41l35.73,35.73L246.63,208.84c-6.25,6.25-6.25,16.38,0,22.63l22.62,22.62c6.25,6.25,16.38,6.25,22.63,0L424,121.72,460,157.6C475.09,172.69,501,162,501,140.67V13.33A13.33,13.33,0,0,0,488,0Z"></path></svg>
);

export default Browser;
