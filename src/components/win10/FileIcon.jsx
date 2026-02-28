import React from 'react';
import { getIconPath, FALLBACK_ICON } from '../../data/iconMap';

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
                onOpen && onOpen(name, item);
            }}
            data-open-action="single-click"
        >
            <div className="w-12 h-12 mb-1 relative flex items-center justify-center">
                <img 
                    src={getIconPath(item.icon || (item.type === 'folder' || item.type === 'drive' ? 'folder' : 'text'))} 
                    onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src = FALLBACK_ICON;
                    }}
                    alt={name}
                    className="max-w-full max-h-full drop-shadow-md select-none"
                    draggable={false}
                />
                {/* Shortcut overlay */}
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
