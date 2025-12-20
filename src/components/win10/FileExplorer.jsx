import React, { useState, useEffect } from 'react';
import { useFileSystem } from '../../context/FileSystemContext';
import FileIcon from './FileIcon';
import { FaArrowUp, FaArrowLeft, FaArrowRight, FaSearch } from 'react-icons/fa';

const FileExplorer = ({ initialPath = "C:/Users/Kushal/Desktop", onClose, onOpenFile }) => {
    const { getDirContent, resolvePath } = useFileSystem();
    const [currentPath, setCurrentPath] = useState(initialPath);
    const [history, setHistory] = useState([initialPath]);
    const [historyIndex, setHistoryIndex] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");

    const dirContent = getDirContent(currentPath) || {};

    const navigate = (path) => {
        if (path === currentPath) return;
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(path);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
        setCurrentPath(path);
    };

    const goBack = () => {
        if (historyIndex > 0) {
            setHistoryIndex(historyIndex - 1);
            setCurrentPath(history[historyIndex - 1]);
        }
    };

    const goForward = () => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex(historyIndex + 1);
            setCurrentPath(history[historyIndex + 1]);
        }
    };

    const goUp = () => {
        const parts = currentPath.split('/').filter(p => p);
        if (parts.length > 1) {
            // Remove last part, handles "C:" case carefully
            parts.pop();
            const parentPath = parts.join('/') || "C:";
            navigate(parentPath);
        } else if (parts.length === 1 && currentPath !== "C:") {
             navigate("C:");
        }
    };

    const handleItemOpen = (name, item) => {
        if (item.type === 'folder' || item.type === 'drive') {
            const newPath = currentPath.endsWith('/') 
                ? `${currentPath}${name}` 
                : `${currentPath}/${name}`;
            navigate(newPath);
        } else {
             // Delegate file opening to parent (DesktopEnv)
             if (item.type === 'file' || item.type === 'shortcut') {
                 // We need to pass this up. 
                 // Since FileExplorer is rendered by DesktopEnv, we can pass a prop.
                 // But wait, the prop isn't passed yet. We need to add it to the component signature and DesktopEnv.
                 onOpenFile && onOpenFile(name, item);
             }
        }
    };

    const sortedItems = Object.entries(dirContent).sort((a, b) => {
        // Folders first
        if (a[1].type === 'folder' && b[1].type !== 'folder') return -1;
        if (a[1].type !== 'folder' && b[1].type === 'folder') return 1;
        return a[0].localeCompare(b[0]);
    });

    return (
        <div className="flex flex-col h-full bg-[#191919] text-gray-200 select-none">
            {/* Ribbon / Toolbar (Simplified) */}
            <div className="flex items-center gap-2 p-2 border-b border-[#333] bg-[#202020]">
                <div className="flex gap-1 text-gray-400">
                    <button onClick={goBack} disabled={historyIndex === 0} className="p-1 hover:bg-[#333] rounded disabled:opacity-30 cursor-pointer"><FaArrowLeft /></button>
                    <button onClick={goForward} disabled={historyIndex === history.length - 1} className="p-1 hover:bg-[#333] rounded disabled:opacity-30 cursor-pointer"><FaArrowRight /></button>
                    <button onClick={goUp} className="p-1 hover:bg-[#333] rounded cursor-pointer"><FaArrowUp /></button>
                </div>
                
                {/* Address Bar */}
                <div className="flex-1 flex items-center border border-[#444] px-2 py-1 bg-[#191919] text-sm text-gray-200">
                    <img src="/assets/icons/win10/folder.ico" className="w-4 h-4 mr-2" alt="icon" />
                    <span className="flex-1 truncate">{currentPath.replace(/\//g, ' > ')}</span>
                </div>

                {/* Search Bar */}
                <div className="w-48 flex items-center border border-[#444] px-2 py-1 bg-[#191919] text-sm group focus-within:border-blue-500">
                    <span className="text-gray-400 mr-2"><FaSearch /></span>
                    <input 
                        type="text" 
                        placeholder={`Search ${currentPath.split('/').pop() || 'PC'}`}
                        className="w-full bg-transparent border-none outline-none text-gray-200 placeholder-gray-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-auto p-2 bg-[#191919]">
                <div className="grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-1">
                    {sortedItems.length > 0 ? (
                        sortedItems.map(([name, item]) => (
                            <div key={name} className="flex justify-center hover:bg-[#white]/10 rounded cursor-pointer">
                                <FileIcon 
                                    name={name} 
                                    item={item} 
                                    onOpen={handleItemOpen}
                                    // isSelected={...} 
                                />
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center text-gray-500 mt-10">
                            Folder is empty.
                        </div>
                    )}
                </div>
            </div>
            
            {/* Status Bar */}
            <div className="bg-[#202020] border-t border-[#333] px-2 py-0.5 text-xs text-gray-400 flex justify-between">
                <span>{sortedItems.length} items</span>
                <span></span>
            </div>
        </div>
    );
};

export default FileExplorer;
