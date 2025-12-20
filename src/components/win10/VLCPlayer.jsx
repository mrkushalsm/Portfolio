import React, { useState, useRef, useEffect } from 'react';
import { FaPlay, FaPause, FaStop, FaStepBackward, FaStepForward, FaVolumeUp, FaVolumeMute, FaExpand, FaSlidersH } from 'react-icons/fa';

const VLCPlayer = ({ url, type = 'video', title }) => {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const updateProgress = () => {
            setCurrentTime(video.currentTime);
            const val = (video.currentTime / video.duration) * 100;
            setProgress(isNaN(val) ? 0 : val);
        };

        const handleLoadedMetadata = () => {
            setDuration(video.duration);
        };

        video.addEventListener('timeupdate', updateProgress);
        video.addEventListener('loadedmetadata', handleLoadedMetadata);
        
        return () => {
            video.removeEventListener('timeupdate', updateProgress);
            video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        };
    }, [url]);

    const togglePlay = () => {
        if (videoRef.current.paused) {
            videoRef.current.play().catch(e => console.error("Play error:", e));
            setIsPlaying(true);
        } else {
            videoRef.current.pause();
            setIsPlaying(false);
        }
    };

    const stop = () => {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
        setIsPlaying(false);
    };

    const handleSeek = (e) => {
        const val = parseFloat(e.target.value);
        const seekTime = (val / 100) * duration;
        videoRef.current.currentTime = seekTime;
        setProgress(val);
    };

    const handleVolume = (e) => {
        const vol = parseFloat(e.target.value);
        setVolume(vol);
        videoRef.current.volume = vol;
        setIsMuted(vol === 0);
    };

    const formatTime = (time) => {
        if(isNaN(time)) return "00:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col h-full bg-[#121212] text-[#dadada] font-sans select-none border border-[#333]">
            {/* Top Menu Bar (VLC Style) */}
            <div className="flex items-center gap-4 px-2 py-1 text-[11px] bg-[#2d2d2d] border-b border-[#3e3e3e] cursor-default">
                <span className="hover:bg-white/10 px-1 cursor-pointer">Media</span>
                <span className="hover:bg-white/10 px-1 cursor-pointer">Playback</span>
                <span className="hover:bg-white/10 px-1 cursor-pointer">Audio</span>
                <span className="hover:bg-white/10 px-1 cursor-pointer">Video</span>
                <span className="hover:bg-white/10 px-1 cursor-pointer">Subtitle</span>
                <span className="hover:bg-white/10 px-1 cursor-pointer">Tools</span>
                <span className="hover:bg-white/10 px-1 cursor-pointer">View</span>
                <span className="hover:bg-white/10 px-1 cursor-pointer">Help</span>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
                {/* VLC Cone Logo for Audio or IDLE */}
                {(type === 'audio' || (type === 'video' && !isPlaying && currentTime === 0)) && (
                     <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-50">
                        {/* Use the webp icon as the 'cone' */}
                        <img src="/assets/icons/win10/video-player.webp" alt="VLC" className="w-32 h-32 object-contain" />
                     </div>
                )}
                
                
                {type === 'audio' ? (
                     <audio 
                        ref={videoRef}
                        src={url} 
                        autoPlay
                        className="opacity-0 absolute pointer-events-none"
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                    />
                ) : (
                    <video 
                        ref={videoRef}
                        src={url} 
                        autoPlay
                        className="max-w-full max-h-full outline-none z-10 block cursor-pointer"
                        onClick={togglePlay}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                    />
                )}
            </div>

            {/* Control Bar */}
            <div className="bg-[#2d2d2d] flex flex-col border-t border-[#3e3e3e] flex-shrink-0">
                {/* Seek Bar */}
                <div className="px-3 pt-2 pb-1 group">
                    <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={progress} 
                        onChange={handleSeek}
                        style={{
                            background: `linear-gradient(to right, #ff8800 ${progress}%, #555 ${progress}%)`
                        }}
                        className="w-full h-2 rounded-full appearance-none cursor-pointer border border-[#444]
                            [&::-webkit-slider-thumb]:appearance-none 
                            [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 
                            [&::-webkit-slider-thumb]:bg-[#ff8800] 
                            [&::-webkit-slider-thumb]:rounded-full 
                            [&::-webkit-slider-thumb]:hover:scale-125 
                            [&::-webkit-slider-thumb]:transition-transform"
                    />
                     <div className="flex justify-between text-[10px] text-gray-400 mt-1 cursor-default">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>

                {/* Buttons Area */}
                <div className="flex items-center justify-between px-6 pb-4 pt-1">
                    {/* Play Controls */}
                    <div className="flex items-center gap-6">
                        <FaStop size={14} className="cursor-pointer hover:text-white" onClick={stop}/>
                        <div className="flex items-center gap-4">
                            <FaStepBackward size={12} className="cursor-pointer hover:text-white text-gray-400"/>
                            <div className="p-2 border border-white/20 rounded-full hover:bg-white/10 cursor-pointer" onClick={togglePlay}>
                                {isPlaying ? <FaPause size={14} /> : <FaPlay size={14} className="ml-1"/>}
                            </div>
                            <FaStepForward size={12} className="cursor-pointer hover:text-white text-gray-400"/>
                        </div>
                    </div>
                    
                    {/* Volume & Tools */}
                    <div className="flex items-center gap-4">
                         <div className="flex items-center gap-2 group">
                             <div onClick={() => setIsMuted(!isMuted)} className="cursor-pointer">
                                {isMuted || volume === 0 ? <FaVolumeMute size={14}/> : <FaVolumeUp size={14}/>}
                             </div>
                             <input 
                                type="range" 
                                min="0" 
                                max="1" 
                                step="0.05"
                                value={isMuted ? 0 : volume} 
                                onChange={handleVolume}
                                className="w-20 h-1 bg-[#555] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:bg-[#ff8800] [&::-webkit-slider-thumb]:rounded-full"
                             />
                         </div>
                         <FaSlidersH size={16} className="cursor-pointer hover:text-white"/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VLCPlayer;
