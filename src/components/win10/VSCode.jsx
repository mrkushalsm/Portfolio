import React, { useState, useEffect } from 'react';

const VSCode = ({ initialUrl }) => {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <div className="flex flex-col h-full bg-[#1e1e1e] select-none">
            {/* Minimal VS Code Title Bar hint (optional, or just full frame) */}
            {/* Loading Overlay */}
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#1e1e1e] z-10">
                        <div className="flex flex-col items-center gap-2">
                            <img src="/assets/icons/win10/vscode.png" alt="Loading" className="w-12 h-12 opacity-80 animate-pulse" />
                            <span className="text-xs text-gray-500 font-mono">Loading VS Code...</span>
                        </div>
                </div>
            )}
            
            <iframe 
                src={initialUrl}
                title="VS Code"
                className="w-full h-full border-none bg-[#1e1e1e]"
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals"
                onLoad={() => setIsLoading(false)}
            />
        </div>
    );
};

export default VSCode;
