"use client";
import React, { useState } from 'react';
import { FaFile, FaFileAlt, FaFolder, FaCode, FaSearch, FaCog, FaTimes } from 'react-icons/fa';
import dynamic from 'next/dynamic';
import { useFileSystem } from '../../context/FileSystemContext';

// Dynamic import for Markdown Viewer
const MarkdownViewer = dynamic(() => import('./MarkdownViewer'), {
    loading: () => <div className="p-8 text-gray-500">Loading vault content...</div>,
    ssr: false
});

const Obsidian = ({ content: initialContent, url, fileName = "Untitled.md", onOpenWorkspace, projectRepo, projectTitle }) => {
    // We'll use the FileSystem to populate the "Vault" sidebar
    const { getDirContent } = useFileSystem();
    const docs = getDirContent("C:/Users/Kushal/Documents") || {};
    
    // State for fetching remote content
    const [content, setContent] = useState(initialContent || (url ? "Loading..." : ""));
    const [loading, setLoading] = useState(!!url);

    // Fetch content if URL is provided (for READMEs)
    React.useEffect(() => {
        if (url) {
            setLoading(true);
            fetch(`/api/proxy?url=${encodeURIComponent(url)}&raw=true`)
                .then(res => {
                    if (!res.ok) throw new Error("Failed to load content");
                    return res.text();
                })
                .then(text => {
                    setContent(text);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Obsidian fetch error:", err);
                    setContent("# Error\nCould not load file content.");
                    setLoading(false);
                });
        }
    }, [url]);

    // Transform docs into a list for the sidebar
    const vaultFiles = Object.entries(docs).map(([name, item]) => ({
        name,
        type: item.type, // 'file' or 'folder'
        icon: item.type === 'folder' ? <FaFolder className="text-gray-500" /> : <FaFileAlt className="text-purple-400" />
    }));

    return (
        <div className="flex h-full bg-[#1e1e1e] text-[#dcddde] font-sans selection:bg-[#4d4d68] selection:text-white">
            {/* Zen Mode: No Sidebar, just content */}
            
            {/* Main Editor Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-[#1e1e1e]">
                {/* Clean Title Bar */}
                <div className="h-10 border-b border-[#111] flex items-center justify-between px-4 bg-[#1e1e1e]">
                    <div className="text-sm text-gray-400 font-medium flex items-center gap-2">
                        {projectTitle ? (
                             <>
                                <span className="opacity-50">Project:</span>
                                <span className="text-purple-300 font-bold">{projectTitle}</span>
                             </>
                        ) : (
                             <>
                                <span className="opacity-50">Active File:</span>
                                <span className="text-purple-300">{fileName}</span>
                             </>
                        )}
                    </div>

                    {/* Toolbar Actions */}
                    <div className="flex items-center gap-3">
                         {projectRepo && (
                            <button 
                                onClick={onOpenWorkspace}
                                className="flex items-center gap-2 px-3 py-1 bg-[#7b2cbf] text-white text-xs rounded hover:bg-[#9d4edd] transition-colors shadow-sm"
                                title="Open Project Workspace in VS Code"
                            >
                                <FaCode />
                                <span>Open Workspace</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Content View */}
                <div className="flex-1 overflow-y-auto w-full"> 
                    <div className="max-w-4xl mx-auto p-4 md:p-10 min-h-full">
                         {/* We wrap the content in a div that styles markdown specifically for Obsidian's look */}
                         <div className="prose prose-invert prose-purple max-w-none prose-headings:font-bold prose-h1:text-4xl prose-h1:border-b prose-h1:border-gray-800 prose-h1:pb-4 prose-a:text-[#dba6ff]">
                             <MarkdownViewer content={content} isDark={true} />
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Obsidian;
