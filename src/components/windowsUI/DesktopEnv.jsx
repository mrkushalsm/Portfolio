import React, { useState, useRef, useEffect } from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { useFileSystem } from "../../context/FileSystemContext";
import WindowCard from "./WindowCard.jsx";
import Taskbar from "./Taskbar.jsx";
import FileIcon from "../win10/FileIcon";
import FileExplorer from "../win10/FileExplorer";
import VSCode from "../win10/VSCode";
import Notepad from "../win10/Notepad"; // New Component
import Obsidian from "../win10/Obsidian.jsx";

import Terminal from "./Terminal.jsx"; 
import AboutMe from "../../pages/windowsUI/AboutMe";
import Resume from "../../pages/windowsUI/Resume.jsx";
import VLCPlayer from "../win10/VLCPlayer.jsx"; // Revamped VLC Player

const wallpaper = "/assets/wallpaper.jpg";

const DesktopEnv = () => {
    const { getDirContent } = useFileSystem();
    // Windows state: [{ id, title, icon, component, isMinimized, zIndex }]
    const [windows, setWindows] = useState([]);
    const [activeWindowId, setActiveWindowId] = useState(null);
    const zIndexRef = useRef(100);
    
    // Fetch desktop content
    const desktopContent = getDirContent("C:/Users/Kushal/Desktop") || {};

    const openWindow = (id, title, component, icon = "application") => {
        // Check if window already exists
        const existingWindow = windows.find(w => w.id === id);
        if (existingWindow) {
            if (existingWindow.isMinimized) {
                toggleMinimize(id);
            }
            focusWindow(id);
            return;
        }

        // Increment global Z-index counter strictly
        zIndexRef.current += 1;
        const newZ = zIndexRef.current;

        const newWindow = {
            id,
            title,
            icon,
            component,
            isMinimized: false,
            zIndex: newZ
        };

        setWindows(prev => [...prev, newWindow]);
        setActiveWindowId(id);
    };

    const closeWindow = (id) => {
        setWindows(prev => prev.filter(w => w.id !== id));
        if (activeWindowId === id) {
             setActiveWindowId(null);
        }
    };

    const focusWindow = (id) => {
        // Increment global counter for every focus action
        zIndexRef.current += 1;
        const newZ = zIndexRef.current;

        setActiveWindowId(id);
        setWindows(prev => prev.map(w => 
            w.id === id ? { ...w, zIndex: newZ, isMinimized: false } : w
        ));
    };

    const toggleMinimize = (id) => {
        setWindows(prev => prev.map(w => {
            if (w.id === id) {
                // If we are minimizing the active window, clear active
                if (!w.isMinimized && activeWindowId === id) {
                    setActiveWindowId(null);
                }
                return { ...w, isMinimized: !w.isMinimized };
            }
            return w;
        }));
    };

    // Start Menu Icons Helper - Moved up to be reusable
    const getIconSrc = (iconName) => {
        const map = {
            "folder": "/assets/icons/win10/folder.ico",
            "file-text": "/assets/icons/win10/file-text.ico",
            "file-pdf": "/assets/icons/win10/file-pdf.ico",
            "edge": "/assets/icons/win10/edge.png",
            "terminal": "/assets/icons/terminal.ico", // Corrected: It is in root icons folder
            "vscode": "/assets/icons/win10/vscode.png",
            "this-pc": "/assets/icons/win10/this-pc.ico",
            "photos": "/assets/icons/win10/photos.ico",
            "settings": "/assets/icons/win10/settings.png",
            "user-circle": "/assets/icons/win10/user-circle.ico", 
            "github": "/assets/icons/win10/github-mark-white.svg", // Correct SVG
            "linkedin": "/assets/icons/win10/linkedin.png", 
            "documents": "/assets/icons/win10/document-folder.ico",
            "downloads": "/assets/icons/win10/downloads-folder.ico",
            "pictures": "/assets/icons/win10/pictures-folder.ico",
            "music": "/assets/icons/win10/music-folder.ico",
            "videos": "/assets/icons/win10/video-folder.ico", 
            "desktop": "/assets/icons/win10/desktop-folder.ico",
            "imageres_1023": "/assets/icons/win10/imageres_1023.ico"
        };
        // Normalize: if it looks like a path, return it. If it's a key, map it.
        if (iconName && (iconName.startsWith('/') || iconName.startsWith('http'))) return iconName;
        return map[iconName] || "/assets/icons/win10/application.ico";
    };

    // File Open Handler
    const handleFileOpen = (name, item) => {
        if (item.type === 'folder' || item.type === 'drive') {
            // Use provided path or default to Desktop 
            const path = item.path || `C:/Users/Kushal/Desktop/${name}`; 
            
            openWindow(
                `explorer-${name}`, 
                name, 
                <FileExplorer 
                    initialPath={path} 
                    onOpenFile={handleFileOpen}
                />,
                getIconSrc("folder")
            );
        } else if (item.type === 'file' || item.type === 'shortcut') {
             // Handle Shortcuts (Website links)
             if (item.type === 'shortcut' || (item.target && typeof item.target === 'string' && item.target.startsWith('http'))) {
                 const targetUrl = item.target;
                 if (targetUrl && typeof targetUrl === 'string' && targetUrl.startsWith('http')) {
                     
                     // SPECIAL CASE: README shortcuts (which we pointed to github1s) -> Smart Notepad Reader
                     // This gives the "Native App" feel for Readmes, separate from Browser
                     if (name === "README.md" || targetUrl.includes("/blob/main/README.md")) {
                         // Ensure we have a unique ID for multiple readmes
                         const readmeId = `readme-${name}-${Date.now()}`;
                         
                         // 1. Raw URL for the Reader (Notepad)
                         // Convert github1s.com (or github.com) -> raw.githubusercontent.com
                         const rawUrl = targetUrl
                            .replace('github1s.com', 'raw.githubusercontent.com') 
                            .replace('github.com', 'raw.githubusercontent.com')
                            .replace('/blob/', '/'); // Remove 'blob' part for raw

                         // 2. Workspace URL for the Button (VS Code)
                         const workspaceUrl = targetUrl.replace('github.com', 'github1s.com');
                         
                         // Extract Project Name from URL for the Window Title
                         let projectTitle = "README.md";
                         try {
                             const urlParts = targetUrl.split('/');
                             if (urlParts.length >= 5) {
                                 projectTitle = urlParts[4].replace(/-/g, ' '); 
                             }
                         } catch (e) { console.error(e); }

                         // Define the "Open Workspace" action
                         const handleOpenWorkspace = () => {
                             // Keep the readme window open as per user request
                             // closeWindow(readmeId); 
                             
                             // Open the full VS Code window
                             openWindow(
                                 `vscode-${projectTitle}-${Date.now()}`, 
                                 `VSCode - ${projectTitle}`, 
                                 <VSCode initialUrl={workspaceUrl} />, 
                                 getIconSrc("vscode")
                             );
                         };

                         openWindow(
                             readmeId, 
                             `${projectTitle} - ReadMe`, 
                             <Obsidian 
                                content={null} // It will fetch via URL logic inside (wait, Obsidian needs URL logic added!)
                                // Wait, Obsidian rewrite didn't include URL fetching logic like Notepad had!
                                // Use the content/url logic or fetch inside Obsidian? 
                                // Notepad had internal fetch. Obsidian currently expects 'content'.
                                // I must update Obsidian to accept URL or fetch here. 
                                // NOTE: The new Obsidian component I wrote takes `content`. 
                                // The fetching logic was in Notepad. I should move it or pass content.
                                // But here we have a URL.
                                // Let's pass the URL and update Obsidian to handle it, OR fetch here.
                                // Notepad handled it internally. Let's make Obsidian handle it too for consistency.
                                // I will pass `url` to Obsidian and update Obsidian to fetch it.
                                url={rawUrl} 
                                fileName="README.md"
                                projectTitle={projectTitle} // Pass Title for Zen Header
                                projectRepo={true}
                                onOpenWorkspace={handleOpenWorkspace}
                             />, 
                             getIconSrc("file-text")
                         ); 
                         return;
                     }

                     // All other links -> Open in Real Browser
                     window.open(targetUrl, '_blank');
                     return;
                 }
             }

             // Handle Apps
             if (item.fileType === 'app') {
                  const uniqueId = `${item.appName.toLowerCase().replace(/\s/g, '-')}-${Date.now()}`;
                  
                  if (item.appName === 'Edge') {
                      window.open('https://google.com', '_blank');
                      return;
                  } else if (item.appName === 'File Explorer') {
                      // If specific icon is provided (like imageres_1023), use it, otherwise default to this-pc or folder
                      const useIcon = item.icon === 'imageres_1023' ? "imageres_1023" : "this-pc";
                      const startPath = item.initialPath || "C:";
                      openWindow(uniqueId, "File Explorer", <FileExplorer initialPath={startPath} onOpenFile={handleFileOpen} />, getIconSrc(useIcon));
                  } else if (item.appName === 'Terminal') {
                      openWindow(uniqueId, "Terminal", <Terminal />, getIconSrc("terminal"));
                  } 
                  return;
             }
            
            // Handle Generic File Types
             const fileName = item.name || name;
             
             // SPECIAL CASE: Skills.txt -> Obsidian App
             if (fileName === 'Skills.txt') {
                 openWindow(`obsidian-skills`, "Obsidian - Skills Vault", <Obsidian />, getIconSrc("file-text")); 
                 return;
             }
 
             // Markdown / Text Files
             if (item.fileType === 'markdown' || fileName.endsWith('.md')) {
                 // Check if it's the specific "About Me" legacy content
                 if (item.content === "about-me") {
                     // Open About Me in a clean window (Native App style, no fake VS Code)
                     openWindow(`aboutme`, "About Me", <AboutMe />, getIconSrc("user-circle")); 
                 } else {
                     // NEW: Open all Markdown in Obsidian
                     openWindow(`obsidian-${fileName}`, `${fileName} - Obsidian`, 
                         <Obsidian 
                            content={item.content}
                            url={item.url} // PASS URL!
                            fileName={fileName}
                         />, 
                         getIconSrc("file-text")
                     );
                 }
             } else if (item.fileType === 'text' || fileName.endsWith('.txt')) {
                 // Notepad Fallback (Text files stay in Notepad as requested)
                 openWindow(`notepad-${fileName}`, `${fileName} - Notepad`, 
                    <Notepad 
                        content={item.content} 
                        url={item.url} // PASS URL!
                    />, 
                    getIconSrc("file-text")
                 );
             } else if (item.fileType === 'pdf' || fileName.endsWith('.pdf')) {
                 openWindow("resume-viewer", fileName, <Resume />, getIconSrc("file-pdf"));
             } else if (item.fileType === 'image') {
                 openWindow(
                    `img-${name}`, 
                    name, 
                    <div className="flex items-center justify-center h-full bg-[#222]">
                        <img src={item.url || item.content} alt={name} className="max-w-full max-h-full object-contain" />
                    </div>, 
                     getIconSrc("photos")
                );
             } else if (item.fileType === 'video' || item.fileType === 'audio' || fileName.endsWith('.mp4') || fileName.endsWith('.mp3')) {
                 // Open VLC Player (Revamped)
                 // Determine type for UI logic (show cone or video)
                 const type = (item.fileType === 'audio' || fileName.endsWith('.mp3')) ? 'audio' : 'video';
                 
                 openWindow(
                     `vlc-${name}`,
                     `${name} - VLC Media Player`,
                     <VLCPlayer url={item.url || item.content} type={type} title={name} />,
                     "/assets/icons/win10/video-player.webp"
                 );
             } else if (item.appName === 'File Explorer') {
                 openWindow(`explorer-${Date.now()}`, "This PC", <FileExplorer initialPath="C:" onOpenFile={handleFileOpen} />, getIconSrc("this-pc"));
             }
        }
    };

    // Helper to launch pinned items that need specific content from VFS
    const handlePinnedLaunch = (appName) => {
        // We know where these live in Documents now.
        const docs = getDirContent("C:/Users/Kushal/Documents");
        if (!docs) return;

        if (appName === "Skills.md") {
            const item = docs["Skills.md"];
            if (item) handleFileOpen("Skills.md", item);
        } else if (appName === "Projects") {
             // Pass explicit path so it doesn't look in Desktop
             handleFileOpen("Projects", { type: "folder", path: "C:/Users/Kushal/Documents/Projects" }); 
        } else if (appName === "Certificates") {
             handleFileOpen("Certificates", { type: "folder", path: "C:/Users/Kushal/Documents/Certificates" });
        } else if (appName === "Resume.pdf") {
            const item = docs["Resume.pdf"];
            if (item) handleFileOpen("Resume.pdf", item);
        }
    };

    // Generate start menu items
    // First, standard desktop items (minus the ones we want specific behavior for if needed, or just include all)
    const desktopApps = Object.entries(desktopContent).map(([name, item]) => ({
        name: name.replace(/\.(md|pdf|txt|lnk|exe)$/, ""),
        icon: item.icon, 
        action: () => handleFileOpen(name, item)
    }));



    // Specific requested items for Start Menu
    const specificStartApps = [
        { name: "Projects", icon: getIconSrc("folder"), action: () => handlePinnedLaunch("Projects") },
        { name: "Skills.md", icon: getIconSrc("file-text"), action: () => handlePinnedLaunch("Skills.md") },
        { name: "Certificates", icon: getIconSrc("folder"), action: () => handlePinnedLaunch("Certificates") },
        { name: "Resume.pdf", icon: getIconSrc("file-pdf"), action: () => handlePinnedLaunch("Resume.pdf") },
    ];

    // Combine for Start Menu, filtering out the manual ones from the auto-generated list
    const allStartApps = [
        ...specificStartApps, 
        ...desktopApps
            .filter(app => !["Projects", "Skills", "Certificates", "Resume", "GitHub", "LinkedIn"].includes(app.name))
            .map(app => ({...app, icon: getIconSrc(app.icon)})) // Resolve icon strings to paths for Start Menu
    ];

    return (
        <div className="relative w-full h-screen overflow-hidden bg-cover bg-center select-none"
            style={{ backgroundImage: `url(${wallpaper})` }}
        >
            {/* Desktop Icons Grid */}
            <div className="absolute top-0 left-0 bottom-12 right-0 p-2 flex flex-col flex-wrap content-start gap-2 z-0">
                {Object.entries(desktopContent).map(([name, item]) => (
                    <FileIcon 
                        key={name} 
                        name={name} 
                        item={item} 
                        onOpen={handleFileOpen}
                        // isSelected={...}
                    />
                ))}
            </div>

            {/* Windows Area */}
            <div className="absolute inset-0 pointer-events-none z-10">
                {windows.map((win) => (
                   <div 
                        key={win.id}
                        className={`absolute inset-0 ${win.isMinimized ? 'hidden' : 'block'}`}
                        style={{ zIndex: win.zIndex }}
                   >
                        <WindowCard
                            id={win.id}
                            title={win.title}
                            icon={win.icon} // Pass icon to window card
                            isActive={activeWindowId === win.id}
                            zIndex={win.zIndex}
                            onClose={() => closeWindow(win.id)}
                            onMinimize={() => toggleMinimize(win.id)}
                            onClick={() => focusWindow(win.id)}
                        >
                            {win.component}
                        </WindowCard>
                   </div>
                ))}
            </div>

            {/* Taskbar */}
            <Taskbar
                windows={windows}
                activeWindowId={activeWindowId}
                onToggleMinimize={toggleMinimize}
                onFocus={focusWindow}
                startApps={allStartApps}
                onLaunchItem={handleFileOpen}
                // pinnedApps={realPinnedApps} // REMOVED as per user request (not taskbar)
            />
        </div>
    );
};

export default DesktopEnv;
