import React from 'react';

const VideoPlayer = ({ url }) => {
    return (
        <div className="flex flex-col h-full bg-black text-white">
            {/* Simple Native Title/Controls Area (Top) */}
            <div className="h-0"></div> 

            {/* Video Area */}
            <div className="flex-1 flex items-center justify-center overflow-hidden bg-black relative">
                <video 
                    src={url} 
                    controls 
                    autoPlay 
                    className="max-w-full max-h-full object-contain outline-none"
                    style={{
                        boxShadow: "0 0 20px rgba(0,0,0,0.5)" 
                    }}
                >
                    Your browser does not support the video tag.
                </video>
            </div>

            {/* Bottom Controls Bar Mockup (Optional - Native player has overlay controls usually, kept minimal) */}
            {/* <div className="h-12 bg-[#1f1f1f] flex items-center px-4 gap-4 border-t border-[#333]">
                <span className="text-xs">00:00 / 01:23</span>
            </div> */}
        </div>
    );
};

export default VideoPlayer;
