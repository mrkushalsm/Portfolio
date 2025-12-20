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
    const ref = externalRef || internalRef; 
    
    // State
    const [isMaximized, setIsMaximized] = useState(false);
    
    // Window dimensions (Resizing)
    const [size, setSize] = useState({ width: 800, height: 600 }); // Pixels for better control
    
    // Uncontrolled Mode: We only track last known position for restoring from Maximize
    // We do NOT update state during drag (lag fix)
    const lastPosRef = React.useRef({ x: 50, y: 50 }); 
    const isDraggingRef = React.useRef(false); // Ref for immediate access without re-render

    const handleMaximize = () => {
        // Prevent accidental maximize trigger after drag release if slightly moved
        if (isDraggingRef.current) return;

        setIsMaximized(!isMaximized);
        // Note: When restoring, we rely on the component re-mounting or key-change 
        // to picking up defaultPosition from lastPosRef.current
    };

    const handleMinimize = (e) => {
        e.stopPropagation();
        onMinimize?.();
    };
    
    const handleDragStart = () => {
        isDraggingRef.current = true;
        if (onClick) onClick(); // Focus on drag start
    };

    const handleDragStop = (e, data) => {
        isDraggingRef.current = false;
        // Save position for restore
        if (!isMaximized) {
             lastPosRef.current = { x: data.x, y: data.y };
        }
    };
    
    // Resizing Logic
    const handleResizeMouseDown = (e) => {
        e.stopPropagation();
        e.preventDefault();
        
        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = size.width;
        const startHeight = size.height;

        const handleMouseMove = (mvEvent) => {
            const newWidth = Math.max(300, startWidth + (mvEvent.clientX - startX));
            const newHeight = Math.max(200, startHeight + (mvEvent.clientY - startY));
            
            // Direct state update (should be fast enough, or use requestAnimationFrame if stuck)
            setSize({ width: newWidth, height: newHeight });
        };

        const handleMouseUp = () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
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
            // KEY TRICK: Change key when maximized state changes to force re-init of position
            key={isMaximized ? 'maximized' : 'restored'} 
            defaultPosition={isMaximized ? {x: 0, y: 0} : lastPosRef.current}
            // Remove 'position' prop -> Uncontrolled mode!
            onStart={handleDragStart}
            onStop={handleDragStop}
            // No onDrag handler -> No 60fps re-renders!
        >
            <div
                ref={ref}
                className={`absolute flex flex-col bg-[#1e1e1e] shadow-2xl rounded-md overflow-hidden border border-[#333]
                ${isActive ? "shadow-[0_0_20px_rgba(0,0,0,0.5)] border-[#0078d7]" : "opacity-95 border-[#333]"}
                transition-all duration-200 pointer-events-auto ${isMaximized ? 'inset-0 w-full h-full rounded-none' : ''}`}
                style={{
                    width: isMaximized ? '100%' : size.width,
                    height: isMaximized ? 'calc(100% - 2.5rem)' : size.height, 
                    // Remove top/left styles, let Draggable handle it via transform
                    zIndex: zIndex,
                    // Remove generic transition to allow smooth drag, keep opacity fade
                    transition: 'opacity 0.2s' 
                }}
                onMouseDown={onClick}
            >
                {/* Windows 10 Title Bar */}
                <div className={`drag-handle h-8 flex items-center justify-between select-none ${isActive ? 'bg-[#202020]' : 'bg-[#2d2d2d]'} text-white`}>
                    <div className="flex items-center px-3 gap-3 flex-1 h-full overflow-hidden">
                        {icon && (
                             <img src={getIconPath(icon)} alt="" className="w-4 h-4" draggable={false}/>
                        )}
                        <span className="text-xs font-normal tracking-wide truncate opacity-100">{title}</span>
                    </div>

                    {/* Controls */}
                    <div className="flex h-full no-drag">
                        <button onClick={handleMinimize} title="Minimize" className="w-12 h-full flex items-center justify-center hover:bg-[#3facfa]/10 transition-colors group">
                           <svg className="w-[10px]" viewBox="0 0 10 1"><rect width="10" height="1" fill="white" /></svg>
                        </button>
                        
                        <button onClick={handleMaximize} title={isMaximized ? "Restore" : "Maximize"} className="w-12 h-full flex items-center justify-center hover:bg-[#3facfa]/10 transition-colors group">
                           {isMaximized ? (
                                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth="1">
                                    <path d="M2.5 2.5V0.5H9.5V7.5H7.5" shapeRendering="crispEdges" />
                                    <rect x="0.5" y="2.5" width="7" height="7" shapeRendering="crispEdges" />
                                </svg>
                           ) : (
                                <div className="w-[10px] h-[10px] border border-white"></div>
                           )}
                        </button>
                        
                        <button onClick={(e) => { e.stopPropagation(); onClose(); }} title="Close" className="w-12 h-full flex items-center justify-center hover:bg-[#e81123] active:bg-[#ca0b1b] transition-colors group">
                             <svg className="w-[10px] h-[10px]" viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth="1"><path d="M0.5 0.5L9.5 9.5M9.5 0.5L0.5 9.5" /></svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto bg-[#191919] relative text-gray-200 cursor-auto p-1">
                    {children}
                </div>
                
                {/* Resize Handle (Bottom-Right) */}
                {!isMaximized && (
                    <div 
                        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-50 flex items-end justify-end p-0.5"
                        onMouseDown={handleResizeMouseDown}
                    >
                         {/* Visual indicator corner */}
                         <svg viewBox="0 0 10 10" className="w-2 h-2 opacity-50">
                             <path d="M10 0 L10 10 L0 10" fill="none" stroke="gray" strokeWidth="2"/>
                         </svg>
                    </div>
                )}

                 {/* Focus Overlay */}
                 {(!isActive || isDraggingRef.current) && (
                    <div 
                        className="absolute inset-x-0 bottom-0 top-8 z-[9999] bg-transparent"
                        style={{ cursor: 'default' }}
                        onMouseDown={(e) => { e.stopPropagation(); if (onClick) onClick(); }}
                    />
                )}
            </div>
        </Draggable>
    );
});

WindowCard.displayName = "WindowCard";

export default WindowCard;
