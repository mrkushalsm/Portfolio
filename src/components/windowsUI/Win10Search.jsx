import React, { useState, useEffect } from "react";
import { FaSearch, FaThumbtack, FaCog } from "react-icons/fa";
import { useGlobalSearch } from "../../hooks/useGlobalSearch";
import { getIconPath } from "../../data/iconMap";

const Win10Search = ({ isSearchOpen, onClose, onLaunchItem, searchRef, query, setQuery, searchResults }) => {
    const [selectedItem, setSelectedItem] = useState(null);

    // Auto-select first item
    useEffect(() => {
        if (searchResults.length > 0) {
            setSelectedItem(searchResults[0]);
        } else {
            setSelectedItem(null);
        }
    }, [searchResults]);

    // Handle Enter key to launch selected item and Escape key to close
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isSearchOpen) return;
            if (e.key === "Enter" && selectedItem) {
                e.preventDefault();
                onLaunch(selectedItem);
            } else if (e.key === "Escape") {
                setQuery("");
                onClose();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isSearchOpen, selectedItem, onClose, setQuery]);

    // Handle click outside to close
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (isSearchOpen && searchRef.current && !searchRef.current.contains(e.target)) {
                // Ignore if clicked on the taskbar search bar
                if (!e.target.closest('.taskbar-search-bar')) {
                    setQuery("");
                    onClose();
                }
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isSearchOpen, onClose, setQuery, searchRef]);

    if (!isSearchOpen) return null;

    const handleItemClick = (res) => {
        setSelectedItem(res);
        onLaunch(res);
    };

    const onLaunch = (res) => {
        onClose();
        setQuery("");
        if (res.type === "app") {
            if (res.action === "link") window.open(res.url, "_blank");
            else onLaunchItem(res);
        } else {
            // It's a file
            onLaunchItem({ id: "files", title: "Files", componentKey: "FileExplorer" });
        }
    };

    return (
        <div 
            ref={searchRef}
            className="absolute bottom-10 left-0 flex flex-col shadow-2xl z-[10001] bg-[#e4e4e4] dark:bg-[#1f1f1f] border border-[#333] select-none text-white font-sans animate-fadeIn overflow-hidden"
            style={{ width: "650px", height: "600px" }}
        >
            {/* Top Navigation Tabs */}
            <div className="flex items-center gap-6 px-6 pt-3 pb-2 text-xs font-semibold bg-[#2a2a2a] border-b border-[#333]">
                <span className="border-b-2 border-white pb-1 cursor-pointer">All</span>
                <span className="text-gray-400 hover:text-white cursor-pointer pb-1 transition-colors">Web</span>
                <span className="text-gray-400 hover:text-white cursor-pointer pb-1 transition-colors">Apps</span>
                <span className="text-gray-400 hover:text-white cursor-pointer pb-1 transition-colors">Documents</span>
                <span className="text-gray-400 hover:text-white cursor-pointer pb-1 transition-colors">Email</span>
                <span className="text-gray-400 hover:text-white cursor-pointer pb-1 transition-colors flex items-center gap-1">More <span className="text-[8px]">▼</span></span>
            </div>

            {/* Main Content Area: Two Panes */}
            <div className="flex-1 flex overflow-hidden">
                
                {/* Left Pane: Search List */}
                <div className="w-[45%] h-full flex flex-col border-r border-[#333] bg-[#232323]">
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                        {query.length > 0 ? (
                            searchResults.length > 0 ? (
                                <div className="flex flex-col gap-1">
                                    <p className="text-xs text-black bg-[#999999] font-semibold px-2 py-1 mb-1">Best match</p>
                                    {searchResults.map((res, i) => {
                                        const isSelected = selectedItem?.id === res.id;
                                        return (
                                            <button 
                                                key={i}
                                                onClick={() => handleItemClick(res)}
                                                onMouseEnter={() => setSelectedItem(res)}
                                                className={`w-full flex items-center gap-3 p-2 text-left transition-colors
                                                    ${isSelected ? 'bg-white/20 border border-white/30' : 'hover:bg-white/10 border border-transparent'}
                                                `}
                                            >
                                                <div className="w-8 h-8 shrink-0 flex items-center justify-center p-1 bg-transparent">
                                                    {res.type === "app" ? (
                                                        <img src={getIconPath(res.desktopIcon)} alt={res.title} className="w-full h-full object-contain" />
                                                    ) : (
                                                        <img src={getIconPath("file-text")} alt="file" className="w-full h-full object-contain" />
                                                    )}
                                                </div>
                                                <div className="flex flex-col overflow-hidden">
                                                    <span className="text-white text-sm truncate">{res.title}</span>
                                                    <span className="text-gray-400 text-xs truncate capitalize">{res.type}</span>
                                                </div>
                                            </button>
                                        );
                                    })}
                                    
                                    <p className="text-xs text-white font-semibold px-2 pt-4 pb-1">Search the web</p>
                                    <button className="w-full flex items-center justify-between p-2 text-left hover:bg-white/10 transition-colors group">
                                        <div className="flex items-center gap-3">
                                            <FaSearch className="text-gray-400 w-4 h-4 ml-2" />
                                            <span className="text-white text-sm">{query} - <span className="text-gray-400">See web results</span></span>
                                        </div>
                                        <span className="text-gray-500 mr-2 group-hover:text-white transition-colors">›</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                                    No results found for "{query}"
                                </div>
                            )
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500 text-sm gap-4">
                                <span>Type here to search</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Pane: Details View */}
                <div className="flex-1 h-full bg-[#1b1b1b] flex flex-col">
                    {selectedItem ? (
                        <div className="flex flex-col h-full animate-fadeIn p-8">
                            <div className="flex flex-col items-center justify-center gap-4 mb-8">
                                <div className="w-24 h-24 shrink-0 bg-transparent flex items-center justify-center">
                                    {selectedItem.type === "app" ? (
                                        <img src={getIconPath(selectedItem.desktopIcon)} alt={selectedItem.title} className="w-full h-full object-contain drop-shadow-md" />
                                    ) : (
                                        <img src={getIconPath("file-text")} alt="file" className="w-full h-full object-contain drop-shadow-md" />
                                    )}
                                </div>
                                <div className="flex flex-col items-center text-center">
                                    <h2 className="text-2xl font-normal text-white">{selectedItem.title}</h2>
                                    <span className="text-gray-400 text-sm capitalize">{selectedItem.type}</span>
                                </div>
                            </div>

                            <div className="h-[1px] w-full bg-[#333] mb-4"></div>

                            <div className="flex flex-col gap-1 w-full max-w-[200px]">
                                <button 
                                    onClick={() => onLaunch(selectedItem)}
                                    className="flex items-center gap-3 w-full p-2 hover:bg-white/10 transition-colors text-left text-sm text-gray-200 group"
                                >
                                    <span className="w-5 h-5 flex items-center justify-center border border-gray-400 group-hover:border-white shrink-0">
                                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3"><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg>
                                    </span>
                                    Open
                                </button>
                                
                                <button className="flex items-center gap-3 w-full p-2 hover:bg-white/10 transition-colors text-left text-sm text-gray-200">
                                    <span className="w-5 h-5 flex items-center justify-center opacity-70 shrink-0"><FaThumbtack /></span>
                                    Pin to Start
                                </button>
                                
                                <button className="flex items-center gap-3 w-full p-2 hover:bg-white/10 transition-colors text-left text-sm text-gray-200">
                                    <span className="w-5 h-5 flex items-center justify-center opacity-70 shrink-0"><FaCog /></span>
                                    App settings
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-600 text-sm font-light">
                            Select an item to see details
                        </div>
                    )}
                </div>
            </div>
            
        </div>
    );
};

export default Win10Search;
