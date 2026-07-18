"use client";

import React, { useState, useEffect } from "react";
import { useFileSystem } from "../../context/FileSystemContext";

const PICTURES_PATH = "C:/Users/Kushal/Pictures";

const WPPhotos = ({ initialImageUrl, setBackHandler }) => {
    const { getDirContent } = useFileSystem();
    const [images, setImages] = useState([]);
    const [viewerUrl, setViewerUrl] = useState(initialImageUrl || null);

    useEffect(() => {
        if (setBackHandler) {
            setBackHandler(() => {
                if (viewerUrl && !initialImageUrl) {
                    setViewerUrl(null);
                    return true;
                }
                return false;
            });
        }
        return () => { if (setBackHandler) setBackHandler(null); };
    }, [viewerUrl, initialImageUrl, setBackHandler]);

    useEffect(() => {
        if (initialImageUrl) return;

        // Collect all images in Pictures and subfolders
        const picsDir = getDirContent("C:/Users/Kushal/Pictures");
        let collected = [];

        if (picsDir) {
            Object.values(picsDir).forEach(item => {
                if (item.type === "file" && item.fileType === "image") {
                    collected.push(item.url || item.content);
                }
            });
        }

        setImages(collected);
    }, [initialImageUrl, getDirContent]);

    if (viewerUrl) {
        return (
            <div className="fixed inset-0 bg-black z-50 flex items-center justify-center" onClick={() => !initialImageUrl && setViewerUrl(null)}>
                <img src={viewerUrl} alt="Viewer" className="max-w-full max-h-full object-contain" />
            </div>
        );
    }

    return (
        <div className="w-full h-full bg-black text-white flex flex-col font-sans select-none pb-12 overflow-x-hidden">
            <div className="px-4 pt-6 pb-2 shrink-0">
                <h1 className="text-[54px] font-light leading-none tracking-tight mb-2 whitespace-nowrap" style={{ fontFamily: "'Segoe UI', sans-serif", marginLeft: "-4px" }}>
                    photos
                </h1>
            </div>

            <div className="flex-1 overflow-y-auto px-4 mt-2">
                <div className="grid grid-cols-3 gap-1">
                    {images.map((imgSrc, i) => (
                        <div 
                            key={i} 
                            className="aspect-square bg-gray-800 cursor-pointer overflow-hidden active:opacity-50 transition-opacity"
                            onClick={() => setViewerUrl(imgSrc)}
                        >
                            <img src={imgSrc} alt="" className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WPPhotos;
