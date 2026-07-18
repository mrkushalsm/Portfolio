"use client";

import React, { useState, useEffect } from "react";
import { useFileSystem } from "../../context/FileSystemContext";
import { FaHome, FaChevronRight } from "react-icons/fa";
import { getIconPath } from "../../data/iconMap";

const getIcon = (type, fileType) => {
    if (type === "folder" || type === "drive") return "📁";
    if (fileType === "image") return "🖼️";
    if (fileType === "text" || fileType === "markdown") return "📄";
    return "📄";
};

let cachedExplorerPath = ["C:", "Users", "Kushal"];

const WPFileExplorer = ({ openApp, setBackHandler }) => {
    const { getDirContent } = useFileSystem();
    const [path, setPath] = useState(cachedExplorerPath);

    useEffect(() => {
        cachedExplorerPath = path;
    }, [path]);

    useEffect(() => {
        if (setBackHandler) {
            setBackHandler(() => {
                if (path.length > 3) {
                    setPath(prev => prev.slice(0, -1));
                    return true;
                }
                return false;
            });
        }
        return () => { if (setBackHandler) setBackHandler(null); };
    }, [path.length, setBackHandler]);

    const currentPathStr = path.join("/");
    const dirContent = getDirContent(currentPathStr) || {};

    const handleItemClick = (name, item) => {
        const lowerName = name.toLowerCase();

        // 1. Intercept specific apps (like Desktop pinned items)
        if (lowerName === "projects" && openApp) {
            return openApp("projects", "projects", "Projects");
        }
        if (lowerName === "certificates" && openApp) {
            return openApp("certificates", "certificates", "Certificates");
        }
        if (lowerName === "resume.pdf" && openApp) {
            return openApp("resume", "resume", "Resume");
        }
        if (lowerName === "skills.md" && openApp) {
            return openApp("skills", "skills", "Skills");
        }
        if ((lowerName === "about me.md" || item.content === "about-me") && openApp) {
            return openApp("aboutme", "about me", "AboutMe");
        }

        // 2. Normal File System Navigation
        if (item.type === "folder" || item.type === "drive") {
            setPath([...path, name]);
        } else if (item.type === "file" && item.fileType === "image") {
            // Open photos app viewer
            if (openApp) {
                openApp("photos", "photos", "Photos", { initialImageUrl: item.url || item.content });
            }
        }
    };

    const accentColor = "#a200ff"; // Authentic WP purple

    const getChildCount = (item) => {
        if (!item.children) return 0;
        return Object.keys(item.children).length;
    };

    const getFileIconSrc = (item) => {
        if (item.icon) return getIconPath(item.icon);
        if (item.type === "folder" || item.type === "drive") return getIconPath("folder");
        if (item.fileType) return getIconPath(item.fileType);
        return getIconPath("file-text");
    };

    const currentFolderName = path[path.length - 1].toLowerCase();

    return (
        <div className="w-full h-full bg-black text-white flex flex-col font-sans select-none overflow-x-hidden">
            {/* Header */}
            <div className="px-4 pt-8 pb-4 shrink-0">
                <div 
                    className="flex flex-wrap items-center text-sm font-semibold tracking-wide mb-1" 
                    style={{ color: accentColor, fontFamily: "'Segoe UI', sans-serif" }}
                >
                    <FaHome className="mr-2 text-sm" />
                    {["phone", ...path.slice(2)].map((p, i, arr) => (
                        <React.Fragment key={i}>
                            <span className="lowercase">{p}</span>
                            <FaChevronRight className="mx-1 text-[10px] opacity-70" />
                        </React.Fragment>
                    ))}
                </div>
                <h1 
                    className="font-light leading-none tracking-tight break-words" 
                    style={{ fontSize: "46px", fontFamily: "'Segoe UI', sans-serif", marginLeft: "-4px" }}
                >
                    {currentFolderName}
                </h1>
            </div>

            {/* Content List */}
            <div className="flex-1 overflow-y-auto px-4">
                {Object.entries(dirContent).map(([name, item]) => {
                    const isFolder = item.type === "folder" || item.type === "drive";
                    const isImage = item.type === "file" && item.fileType === "image";
                    
                    return (
                        <div 
                            key={name} 
                            className="flex items-start mb-6 cursor-pointer active:opacity-50 transition-opacity"
                            onClick={() => handleItemClick(name, item)}
                        >
                            {/* Left Square / Icon */}
                            <div 
                                className="relative shrink-0 flex items-center justify-center mr-4"
                                style={{
                                    width: "60px",
                                    height: "60px",
                                }}
                            >
                                <img src={getFileIconSrc(item)} alt="" className="w-12 h-12 object-contain drop-shadow-md" />
                                {isFolder && getChildCount(item) > 0 && (
                                    <div className="absolute -bottom-1 -right-1 bg-[#a200ff] text-white text-[11px] font-bold px-1.5 py-0.5 rounded-sm">
                                        {getChildCount(item)}
                                    </div>
                                )}
                            </div>

                            {/* Right Text */}
                            <div className="flex-1 flex flex-col pt-0.5 min-w-0">
                                <div 
                                    className="text-white text-[24px] font-normal leading-tight tracking-wide break-words" 
                                    style={{ fontFamily: "'Segoe UI', sans-serif" }}
                                >
                                    {name}
                                </div>
                                <div 
                                    className="text-white/60 text-[13px] mt-0.5" 
                                    style={{ fontFamily: "'Segoe UI', sans-serif" }}
                                >
                                    {/* Mock date for authenticity */}
                                    12/2/2013 7:29:57 PM
                                    {!isFolder && (
                                        <>
                                            <br />
                                            {Math.floor(Math.random() * 50 + 10)}.{Math.floor(Math.random() * 99)} KB
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
                {Object.keys(dirContent).length === 0 && (
                    <div className="text-white/50 italic mt-4 text-lg">empty folder</div>
                )}
            </div>
        </div>
    );
};

export default WPFileExplorer;
