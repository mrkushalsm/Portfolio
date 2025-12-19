import React, { forwardRef, useState, useEffect } from "react";
import Draggable from "react-draggable";
import { FaWindowMinimize, FaWindowMaximize, FaTimes } from 'react-icons/fa';

const WindowCard = forwardRef(({ 
    title, 
    icon,
    onClose, 
    children, 
    isActive, 
    zIndex,
    onMinimize,
    onClick 
}, externalRef) => {
    const internalRef = React.useRef(null);
    // Use external ref if provided, otherwise internal
    const ref = externalRef || internalRef; 
    
    const [isMaximized, setIsMaximized] = useState(false);
    const [position, setPosition] = useState({ x: 50, y: 50 });
    const [lastPosition, setLastPosition] = useState({ x: 50, y: 50 });
    
    // Default size
    const [size, setSize] = useState({ width: '60vw', height: '60vh' });

    const [isDragging, setIsDragging] = useState(false);

    const handleMaximize = () => {
        if (!isDragging) { // Prevent maximize trigger after drag release if slight movement
             if (!isMaximized) {
                setLastPosition(position);
                setPosition({ x: 0, y: 0 });
            } else {
                setPosition(lastPosition);
            }
            setIsMaximized(!isMaximized);
        }
    };

    const handleMinimize = (e) => {
        e.stopPropagation();
        onMinimize?.();
    };
    
    const handleDragStart = () => {
        setIsDragging(true);
        if (onClick) onClick(); // Focus on drag start
    };

    const handleDrag = (e, data) => {
        setPosition({ x: data.x, y: data.y });
    };

    const handleDragStop = () => {
        setIsDragging(false);
    };

    const getIconPath = (iconName) => {
       if (!iconName) return "/assets/icons/win10/file-text.ico";
       if (iconName.startsWith('/') || iconName.startsWith('http')) return iconName;
       return `/assets/icons/win10/${iconName}.ico`;
    };

    return (
        <Draggable 
            nodeRef={ref} 
            handle=".drag-handle"
            bounds="parent"
            disabled={isMaximized}
            position={position}
            onStart={handleDragStart}
            onDrag={handleDrag}
            onStop={handleDragStop}
        >
            <div
                ref={ref}
                className={`absolute flex flex-col bg-[#1e1e1e] shadow-2xl rounded-md overflow-hidden border border-[#333]
                ${isActive ? "shadow-[0_0_20px_rgba(0,0,0,0.5)] border-[#0078d7]" : "opacity-95 border-[#333]"}
                transition-all duration-200 pointer-events-auto ${isMaximized ? 'inset-0 w-full h-full rounded-none' : ''}`}
                style={{
                    width: isMaximized ? '100% ' : size.width,
                    height: isMaximized ? 'calc(100% - 2.5rem)' : size.height, // 2.5rem = h-10 (40px)
                    top: isMaximized ? 0 : position.y, // Force top 0
                    left: isMaximized ? 0 : position.x, // Force left 0
                    zIndex: zIndex,
                    transition: isMaximized ? 'none' : 'width 0.2s, height 0.2s, opacity 0.2s'
                }}
                onMouseDown={onClick}
            >
                {/* Windows 10 Title Bar */}
                {/* Reverting to Clean Dark Theme matching valid Win10 Dark Mode */}
                <div className={`drag-handle h-8 flex items-center justify-between select-none ${isActive ? 'bg-[#202020]' : 'bg-[#2d2d2d]'} text-white`}>
                    <div className="flex items-center px-3 gap-3 flex-1 h-full overflow-hidden">
                        {icon && (
                             <img src={getIconPath(icon)} alt="" className="w-4 h-4" draggable={false}/>
                        )}
                        <span className="text-xs font-normal tracking-wide truncate opacity-100">{title}</span>
                    </div>

                    {/* Win10 Native Control Buttons */}
                    <div className="flex h-full no-drag">
                        <button 
                            onClick={handleMinimize}
                            title="Minimize"
                            className="w-12 h-full flex items-center justify-center hover:bg-[#3facfa]/10 active:bg-[#3facfa]/20 transition-colors group"
                        >
                            <svg className="w-[10px]" viewBox="0 0 10 1">
                                <rect width="10" height="1" fill="white" />
                            </svg>
                        </button>
                        
                        <button 
                            onClick={handleMaximize}
                            title={isMaximized ? "Restore Down" : "Maximize"}
                            className="w-12 h-full flex items-center justify-center hover:bg-[#3facfa]/10 active:bg-[#3facfa]/20 transition-colors group"
                        >
                           {isMaximized ? (
                                // Restore Icon (Two overlapping squares)
                                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth="1">
                                    <path d="M2.5 2.5H9.5V9.5H2.5V2.5Z" /> {/* Front */}
                                    <path d="M0.5 0.5H7.5V7.5H0.5V0.5Z" strokeOpacity="1" /> {/* Back */}
                                    {/* Clean Path: M2.5 2.5h7v7h-7z M0.5 0.5h7v7h-7z but cut out? No, simple overlap is fine usually */}
                                    <mask id="cut">
                                        <rect width="10" height="10" fill="white"/>
                                        <rect x="2" y="2" width="8" height="8" fill="black"/>
                                    </mask>
                                    <path d="M0.5 2.5V0.5H7.5V7.5H5.5" stroke="white"/>
                                    <rect x="2.5" y="2.5" width="7" height="7" stroke="white" fill="transparent"/>
                                </svg>
                           ) : (
                                // Maximize Icon (One square)
                                <div className="w-[10px] h-[10px] border border-white bg-transparent"></div>
                           )}
                        </button>
                        
                        <button 
                            onClick={(e) => { e.stopPropagation(); onClose(); }}
                            title="Close"
                            className="w-12 h-full flex items-center justify-center hover:bg-[#e81123] active:bg-[#ca0b1b] transition-colors group"
                        >
                            <svg className="w-[10px] h-[10px]" viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth="1">
                                <path d="M0.5 0.5L9.5 9.5M9.5 0.5L0.5 9.5" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto bg-[#191919] relative text-gray-200 cursor-auto p-1">
                    {children}
                </div>
                
                 {/* Focus Overlay: Sits ON TOP of everything when inactive OR dragging */}
                 {/* This guarantees capture of clicks to focus, and blocks heavy iframe events during drag */}
                 {(!isActive || isDragging) && (
                    <div 
                        className="absolute inset-x-0 bottom-0 top-8 z-[9999] bg-transparent"
                        style={{ cursor: 'default' }}
                        onMouseDown={(e) => {
                            // Stop propagation to prevent Draggable from getting confused if clicked here
                            // But mostly to ensure we trigger the focus explicit action
                            e.stopPropagation(); 
                            if (onClick) onClick();
                        }}
                    />
                )}
            </div>
        </Draggable>
    );
});

WindowCard.displayName = "WindowCard";

export default WindowCard;
