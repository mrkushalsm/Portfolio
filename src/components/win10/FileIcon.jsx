import React from 'react';

// Icon mapping - ensuring we handle both new Win10 icons and fallback
const getIconPath = (iconName) => {
    // If it's a full path (legacy), return it
    if (iconName && (iconName.startsWith('/') || iconName.startsWith('http'))) return iconName;

    const iconMap = {
        // System
        "desktop": "/assets/icons/win10/this-pc.ico",
        "documents": "/assets/icons/win10/document-folder.ico", 
        "downloads": "/assets/icons/win10/downloads-folder.ico", 
        "pictures": "/assets/icons/win10/pictures-folder.ico",
        "music": "/assets/icons/win10/music-folder.ico",
        "videos": "/assets/icons/win10/video-folder.ico",
        
        // Items
        "folder": "/assets/icons/win10/folder.ico",
        "this-pc": "/assets/icons/win10/this-pc.ico",
        "trash": "/assets/icons/win10/trash.ico",
        "hard-drive": "/assets/icons/win10/hard-drive.ico",
        
        // Files
        "file-text": "/assets/icons/win10/file-text.ico",
        "file-pdf": "/assets/icons/win10/file-pdf.ico",
        "file-image": "/assets/icons/win10/file-image.ico",
        "video-file": "/assets/icons/win10/video-file.ico",
        "music-file": "/assets/icons/win10/music-file.ico",
        "exe-file": "/assets/icons/win10/exe-file.ico",
        
        // Apps
        "edge": "/assets/icons/win10/edge.png",
        "vscode": "/assets/icons/win10/vscode.png",
        "photos": "/assets/icons/win10/photos.ico",
        "settings": "/assets/icons/win10/settings.png",
        "terminal": "/assets/icons/terminal.ico",
        "github": "/assets/icons/win10/github-mark-white.svg", 
        "linkedin": "/assets/icons/win10/linkedin.png",
        
        // Custom
        "user-circle": "/assets/icons/win10/user-circle.ico",
        "imageres_1023": "/assets/icons/win10/imageres_1023.ico", // User requested specific icon

        // Fallbacks for common file types if specific key missing
        "text": "/assets/icons/win10/file-text.ico",
        "markdown": "/assets/icons/win10/file-text.ico",
        "image": "/assets/icons/win10/file-image.ico",
        "shortcut": "/assets/icons/win10/edge.png", // Default shortcut icon if unknown? Or generic?
    };

    // Logic for item type (passed as name sometimes, or we need to check item object if we had it here, but we only have iconName)
    // Actually, FileIcon passes item.icon to this function. 
    // If item.icon is undefined, we need to handle it in FileIcon component or here fallback.
    // But since we only get "iconName", we rely on the caller to pass "folder" if it is a folder.

    if (iconMap[iconName]) return iconMap[iconName];

    // logic for file-types if icon is just "file-text" or similar
    if (iconName === 'file-text') return "/assets/icons/win10/file-text.ico";
    if (iconName === 'file-image') return "/assets/icons/win10/file-image.ico";
    if (iconName === 'file-pdf') return "/assets/icons/win10/file-pdf.ico";
    if (iconName === 'video' || iconName === 'file-video') return "/assets/icons/win10/video-file.ico";
    if (iconName === 'music' || iconName === 'audio' || iconName === 'file-audio') return "/assets/icons/win10/music-file.ico";
    if (iconName === 'exe' || iconName === 'application' || iconName === 'binary') return "/assets/icons/win10/exe-file.ico";
    
    return "/assets/icons/win10/file-text.ico";

    return iconMap[iconName] || "/assets/icons/win10/file-text.ico";
};

const FileIcon = ({ name, item, onOpen, isSelected, onSelect }) => {
    return (
        <div 
            className={`
                flex flex-col items-center justify-start w-24 p-2 rounded-sm cursor-pointer border border-transparent
                ${isSelected ? 'bg-blue-500/40 border-blue-500/50' : 'hover:bg-white/10'}
                transition-all duration-75 group
            `}
            onClick={(e) => {
                e.stopPropagation();
                onSelect && onSelect(name);
                onOpen && onOpen(name, item); // Trigger open on single click
            }}
            // Data-open attribute for potential debug or future styling
            data-open-action="single-click"
        >
            <div className="w-12 h-12 mb-1 relative flex items-center justify-center">
                <img 
                    src={getIconPath(item.icon || (item.type === 'folder' || item.type === 'drive' ? 'folder' : 'text'))} 
                    onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src = "/assets/icons/win10/application.ico";
                    }}
                    alt={name}
                    className="max-w-full max-h-full drop-shadow-md select-none"
                    draggable={false}
                />
                {/* Shortcut overlay if needed */}
                {item.type === 'shortcut' && (
                    <div className="absolute bottom-0 left-0 bg-white rounded-sm w-4 h-4 flex items-center justify-center shadow-sm">
                        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="black" strokeWidth="3">
                            <path d="M10 17l5-5-5-5M15 12H3" /> 
                        </svg>
                    </div>
                )}
            </div>
            
            <span className={`
                text-xs text-center select-none truncate w-full px-1 rounded-sm
                ${isSelected ? 'text-white' : 'text-white text-shadow-sm'}
            `}>
                {name}
            </span>
        </div>
    );
};

export default FileIcon;
