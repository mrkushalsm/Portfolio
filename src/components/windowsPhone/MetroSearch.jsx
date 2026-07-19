import React, { useEffect, useRef } from "react";
import { useGlobalSearch } from "../../hooks/useGlobalSearch";
import { FaSearch } from "react-icons/fa";

const MetroSearch = ({ onClose, onLaunchApp }) => {
    const { query, setQuery, searchResults } = useGlobalSearch();
    const inputRef = useRef(null);

    // Auto focus
    useEffect(() => {
        if (inputRef.current) inputRef.current.focus();
    }, []);

    return (
        <div className="absolute inset-0 z-[9999] bg-black text-white flex flex-col font-sans overflow-hidden">
            {/* Massive Header */}
            <div className="px-6 pt-12 pb-6">
                <h1 className="text-[54px] font-light leading-none tracking-tight lowercase text-[#0078d7] mb-6">
                    search
                </h1>
                
                {/* Search Input Box */}
                <div className="relative">
                    <input
                        ref={inputRef}
                        type="text"
                        className="w-full bg-white text-black pl-3 pr-10 py-3 border-[3px] border-transparent focus:border-[#0078d7] outline-none text-lg"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    {query.length > 0 && (
                        <button 
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                            onClick={() => setQuery("")}
                        >
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            {/* Results Area */}
            <div className="flex-1 overflow-y-auto px-6 pb-20 custom-scrollbar">
                {query.length > 0 ? (
                    searchResults.length > 0 ? (
                        <div className="flex flex-col gap-6">
                            {searchResults.map((res, i) => (
                                <div 
                                    key={i}
                                    onClick={() => {
                                        if (res.type === "app") {
                                            if (res.action === "link") window.open(res.url, "_blank");
                                            else onLaunchApp(res.id, res.title, res.componentKey);
                                        } else {
                                            onLaunchApp("files", "Files", "FileExplorer");
                                        }
                                        onClose();
                                    }}
                                    className="flex items-start gap-4 active:scale-95 transition-transform cursor-pointer"
                                >
                                    {res.type === "app" && res.mobileIcon ? (
                                        <div className="w-16 h-16 shrink-0 flex items-center justify-center shadow-md" style={{ background: res.color || "#0078d7" }}>
                                            <res.mobileIcon className={`text-3xl ${res.color === "#ffffff" ? "text-black" : "text-white"}`} />
                                        </div>
                                    ) : (
                                        <div className="w-16 h-16 shrink-0 bg-[#0078d7] flex items-center justify-center shadow-md">
                                            <FaSearch className="text-3xl text-white" />
                                        </div>
                                    )}
                                    <div className="flex flex-col justify-center h-16 overflow-hidden">
                                        <span className="text-2xl font-normal truncate tracking-wide">{res.title}</span>
                                        <span className="text-[#0078d7] text-sm truncate uppercase tracking-widest mt-1">{res.type}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-gray-500 text-lg font-light">no results found for '{query}'</div>
                    )
                ) : (
                    <div className="text-gray-500 text-lg font-light">type to search your phone</div>
                )}
            </div>
        </div>
    );
};

export default MetroSearch;
