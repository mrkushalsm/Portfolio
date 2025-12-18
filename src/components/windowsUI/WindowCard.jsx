import React, { forwardRef, useState, useRef, useEffect } from "react";
import Draggable from "react-draggable";

const WindowCard = forwardRef(({ 
    title, 
    onClose, 
    children, 
    isActive, 
    isVisible = true, 
    onMinimize,
    onClick 
}, ref) => {
    const [isMaximized, setIsMaximized] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    
    // Desktop and mobile size presets
    const desktopSize = React.useMemo(() => ({ width: '20vw', height: '50vh' }), []);
    const mobileSize = React.useMemo(() => ({ width: '95vw', height: '70vh' }), []);
    
    const [size, setSize] = useState(isMobile ? mobileSize : desktopSize);
    const originalPosition = useRef({ x: 0, y: 0 });
    const originalSize = useRef(isMobile ? { ...mobileSize } : { ...desktopSize });
    const isInitialMount = useRef(true);

    // Handle window resize and mobile/desktop detection
    useEffect(() => {
        const handleResize = () => {
            const mobileCheck = window.innerWidth < 768;
            if (mobileCheck !== isMobile) {
                setIsMobile(mobileCheck);
                // Update size based on new viewport
                const newSize = mobileCheck ? mobileSize : desktopSize;
                setSize(newSize);
                originalSize.current = { ...newSize };
            }
            
            // Update position
            if (ref?.current) {
                const windowEl = ref.current;
                const maxX = window.innerWidth - windowEl.offsetWidth;
                const maxY = window.innerHeight - windowEl.offsetHeight;
                
                let newX = (window.innerWidth - windowEl.offsetWidth) / 2;
                let newY = (window.innerHeight - windowEl.offsetHeight) / 3;
                
                // Ensure window stays within viewport bounds
                newX = Math.max(10, Math.min(newX, maxX - 10));
                newY = Math.max(10, Math.min(newY, maxY - 10));
                
                setPosition({ x: newX, y: newY });
                originalPosition.current = { x: newX, y: newY };
            }
        };
        
        if (isInitialMount.current) {
            handleResize();
            isInitialMount.current = false;
        }
        
        // Add event listener for window resize
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [ref, isMobile, mobileSize, desktopSize]);

    const handleMaximize = () => {
        if (isMaximized) {
            // Restore to original position and size
            setPosition(originalPosition.current);
            setSize(originalSize.current);
        } else {
            // Save current position and size before maximizing
            if (ref?.current) {
                const rect = ref.current.getBoundingClientRect();
                originalPosition.current = { x: rect.left, y: rect.top };
                originalSize.current = { width: `${rect.width}px`, height: `${rect.height}px` };
                
                // Set to fullscreen
                setPosition({ x: 0, y: 0 });
                setSize({ 
                    width: '100vw', 
                    height: '100vh',
                    margin: 0,
                    borderRadius: 0
                });
            }
        }
        setIsMaximized(!isMaximized);
    };

    const handleMinimize = () => onMinimize?.();

    const handleDrag = (e, data) => {
        if (!isMaximized && ref?.current) {
            const windowEl = ref.current;
            const maxX = window.innerWidth - windowEl.offsetWidth;
            const maxY = window.innerHeight - windowEl.offsetHeight;
            
            // Constrain position to viewport bounds with 10px padding
            const newX = Math.max(10, Math.min(data.x, maxX - 10));
            const newY = Math.max(10, Math.min(data.y, maxY - 10));
            
            setPosition({ x: newX, y: newY });
        }
    };

    if (!isVisible) return null;

    return (
        <Draggable 
            nodeRef={ref} 
            handle=".drag-handle"
            bounds={isMaximized ? '' : 'parent'}
            cancel=".window-control"
            position={isMaximized ? { x: 0, y: 0 } : position}
            onDrag={handleDrag}
        >
            <div
                ref={ref}
                className={`flex flex-col ${isActive ? 'bg-white' : 'bg-white/90'} shadow-lg border rounded-lg overflow-hidden resize
                ${isActive ? "border-blue-400/30 shadow-lg" : "border-gray-300/50 opacity-90"}
                ${isMaximized ? "!rounded-none" : ""}
                touch-none md:touch-auto
                transition-all duration-200 ease-out
                will-change-transform`}
                style={{
                    position: isMaximized ? 'fixed' : 'absolute',
                    width: isMaximized ? '100%' : size.width,
                    height: isMaximized ? '100%' : `calc(${size.height} - ${window.innerWidth < 768 ? '10%' : '0%'})`,
                    left: isMaximized ? 0 : 'auto',
                    top: isMaximized ? 0 : 'auto',
                    zIndex: isActive ? (isMaximized ? 1000 : 50) : 40,
                    maxWidth: isMaximized ? '100%' : (isMobile ? '95vw' : '90vw'),
                    maxHeight: isMaximized ? '100%' : (isMobile ? '80vh' : '85vh'),
                    touchAction: 'none',
                    ...(isMaximized ? size : {})
                }}
            >
                <div className="flex flex-col h-full">
                    {/* Windows 10 Style Title Bar */}
                    <div 
                        className="drag-handle flex items-center justify-between h-9 px-0 cursor-default select-none bg-zinc-900/95 backdrop-blur-sm"
                        style={{
                            borderTopLeftRadius: isMaximized ? '0' : '0.5rem',
                            borderTopRightRadius: isMaximized ? '0' : '0.5rem',
                            borderBottom: '1px solid rgba(63, 63, 70, 0.5)'
                        }}
                        onMouseDown={onClick}
                    >
                        {/* Left side with icon and title */}
                        <div className="flex items-center h-full pl-3 pr-2">
                            <span className="text-gray-200 text-sm font-normal">{title}</span>
                        </div>

                        {/* Window controls */}
                        <div className="flex items-stretch h-full">
                            <button 
                                onClick={handleMinimize}
                                className="window-control w-12 h-full flex items-center justify-center hover:bg-[#404040] transition-colors duration-100 group"
                                aria-label="Minimize"
                            >
                                <div className="w-4 h-4 flex items-center justify-center">
                                    <div className="w-2.5 h-px bg-gray-300 group-hover:bg-white" />
                                </div>
                            </button>
                            
                            <button 
                                onClick={handleMaximize}
                                className="window-control w-12 h-full flex items-center justify-center hover:bg-[#404040] transition-colors duration-100 group"
                                aria-label={isMaximized ? "Restore" : "Maximize"}
                            >
                                <div className="w-4 h-4 flex items-center justify-center">
                                    {isMaximized ? (
                                        <div className="relative w-3 h-3">
                                            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-gray-300 group-hover:border-white" />
                                            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-gray-300 group-hover:border-white" />
                                            <div className="absolute top-0.5 left-0.5 w-2 h-2 border-t border-l border-gray-300 group-hover:border-white" />
                                        </div>
                                    ) : (
                                        <div className="w-2.5 h-2.5 border border-gray-300 group-hover:border-white" />
                                    )}
                                </div>
                            </button>
                            
                            <button 
                                onClick={onClose}
                                className="window-control w-12 h-full flex items-center justify-center hover:bg-red-600 transition-colors duration-100 group"
                                aria-label="Close"
                            >
                                <div className="w-4 h-4 relative">
                                    <div className="absolute top-1/2 left-1/2 w-2.5 h-px bg-gray-300 group-hover:bg-white transform -translate-x-1/2 -translate-y-1/2 rotate-45" />
                                    <div className="absolute top-1/2 left-1/2 w-2.5 h-px bg-gray-300 group-hover:bg-white transform -translate-x-1/2 -translate-y-1/2 -rotate-45" />
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Window Content */}
                    <div 
                        className="flex-1 overflow-auto text-gray-700"
                        style={{
                            WebkitOverflowScrolling: 'touch',
                            overscrollBehavior: 'contain',
                        }}
                    >
                        {children}
                    </div>
                </div>
            </div>
        </Draggable>
    );
});

export default WindowCard;
