"use client";
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { FaExternalLinkAlt, FaCode } from 'react-icons/fa';

// Dynamically import MarkdownViewer to avoid ESM/SSR issues with react-markdown
const MarkdownViewer = dynamic(() => import('./MarkdownViewer'), {
    loading: () => <div className="p-4 text-gray-400">Loading viewer...</div>,
    ssr: false
});

const Notepad = ({ content: initialContent, url, isMarkdown = false, projectRepo, onOpenWorkspace, title }) => {
    const [content, setContent] = useState(initialContent || (url ? "Loading..." : ""));
    const [loading, setLoading] = useState(!!url);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (url) {
            setLoading(true);
            
            // Checks if it's a local file (starts with /) to bypass proxy
            const isLocal = url.startsWith('/');
            const fetchUrl = isLocal ? url : `/api/proxy?url=${encodeURIComponent(url)}&raw=true`;

            fetch(fetchUrl)
                .then(res => {
                    if (!res.ok) throw new Error("Failed to load content");
                    return res.text();
                })
                .then(text => {
                    setContent(text);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Notepad fetch error:", err);
                    setError("Could not load file content.");
                    setLoading(false);
                });
        }
    }, [url]);

    return (
        <div className="flex flex-col h-full bg-white text-black font-sans select-text">
            {/* Menu Bar */}
            <div className="flex items-center gap-4 px-2 py-1 border-b border-gray-200 text-xs text-gray-600 bg-white shadow-sm shrink-0">
                <span className="cursor-pointer hover:bg-gray-100 px-2 py-0.5 rounded">File</span>
                <span className="cursor-pointer hover:bg-gray-100 px-2 py-0.5 rounded">Edit</span>
                <span className="cursor-pointer hover:bg-gray-100 px-2 py-0.5 rounded">Format</span>
                <span className="cursor-pointer hover:bg-gray-100 px-2 py-0.5 rounded">View</span>
                <span className="cursor-pointer hover:bg-gray-100 px-2 py-0.5 rounded">Help</span>
                
                {/* Special Toolbar for Projects */}
                {projectRepo && (
                    <div className="ml-auto flex items-center gap-2">
                        <span className="text-gray-400">|</span>
                        <button 
                            onClick={onOpenWorkspace}
                            className="flex items-center gap-2 px-3 py-1 bg-[#0078d7] text-white hover:bg-[#0063b1] rounded transition-colors"
                            title="Open in full VS Code Environment"
                        >
                            <FaCode size={12} />
                            <span className="font-medium">Open Workspace</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Content Area */}
            <div className={`flex-1 overflow-auto ${isMarkdown ? 'p-6 md:p-8' : 'p-0'}`}>
                {loading ? (
                    <div className="flex items-center justify-center h-full text-gray-400">
                        <div className="flex flex-col items-center">
                            <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin mb-2"></div>
                            <span>Loading document...</span>
                        </div>
                    </div>
                ) : error ? (
                    <div className="p-4 text-red-500 font-mono">{error}</div>
                ) : isMarkdown ? (
                    <MarkdownViewer content={content} />
                ) : (
                    <textarea 
                        readOnly 
                        className="w-full h-full p-2 resize-none outline-none border-none font-mono text-sm leading-relaxed" 
                        value={content} 
                        spellCheck="false"
                    />
                )}
            </div>
            
            {/* Status Bar */}
            <div className="bg-[#f0f0f0] border-t border-gray-300 px-3 py-0.5 text-xs text-gray-500 flex justify-end gap-6 shrink-0 h-6 items-center">
                <span>UTF-8</span>
                <span>Windows (CRLF)</span>
                <span>100%</span>
            </div>
        </div>
    );
};

export default Notepad;
