import React, { useState, useRef } from "react";
import WindowCard from "./WindowCard.jsx";
import Taskbar from "./Taskbar.jsx";
const wallpaper = "/assets/wallpaper.jpg";
const projectIcon = "/assets/icons/project.png";
const skillsIcon = "/assets/icons/skills.png";
const aboutMeIcon = "/assets/icons/info.png";
const terminalIcon = "/assets/icons/terminal.png";
const certificateIcon = "/assets/icons/certificate.png";
const blogsIcon = "/assets/icons/blogs.png";
const resumeIcon = "/assets/icons/resume.png";
import AboutMe from "../../pages/windowsUI/AboutMe";
import Projects from "../../pages/windowsUI/Projects";
import Skills from "../../pages/windowsUI/Skills";
import Certificates from "../../pages/windowsUI/Certificates.jsx";
import Blogs from "../../pages/windowsUI/Blogs.jsx";
import Resume from "../../pages/windowsUI/Resume.jsx";
import Terminal from "./Terminal.jsx";

const DesktopEnv = () => {
    const [openWindows, setOpenWindows] = useState([]);
    const [activeWindow, setActiveWindow] = useState(null);
    const [windowVisibility, setWindowVisibility] = useState({});
    const windowRefs = useRef({});

    // Define a mapping of components
    const componentMap = {
        "Projects": <Projects />,
        "Skills": <Skills />,
        "About Me": <AboutMe />,
        "Certificates": <Certificates />,
        "Blogs": <Blogs />,
        "Resume": <Resume />,
        "Terminal": (
            <Terminal 
                onCommand={(cmd) => {
                    if (cmd === 'clear') return [];
                    return [`$ ${cmd}`, `Command not found: ${cmd}`];
                }}
                onExit={() => closeFolder("Terminal")}
            />
        ),
        "Terminal": (
            <Terminal 
                onCommand={(cmd) => {
                    if (cmd === 'clear') return [];
                    return [`$ ${cmd}`, `Command not found: ${cmd}`];
                }}
                onExit={() => closeFolder("Terminal")}
            />
        ),
    };


    const openFolder = (folderName) => {
        // If window exists but is hidden, show it
        if (openWindows.includes(folderName) && windowVisibility[folderName] === false) {
            setWindowVisibility(prev => ({
                ...prev,
                [folderName]: true
            }));
            setActiveWindow(folderName);
            return;
        }

        // If window doesn't exist, create it
        if (!openWindows.includes(folderName)) {
            setOpenWindows(prev => [...prev, folderName]);
            windowRefs.current[folderName] = React.createRef();
            setWindowVisibility(prev => ({
                ...prev,
                [folderName]: true
            }));
        }
        
        setActiveWindow(folderName);
    };

    const closeFolder = (folderName) => {
        setOpenWindows(prev => prev.filter((name) => name !== folderName));
        setWindowVisibility(prev => {
            const newVis = {...prev};
            delete newVis[folderName];
            return newVis;
        });
        if (activeWindow === folderName) {
            setActiveWindow(null);
        }
    };

    const toggleMinimizeWindow = (windowName) => {
        setWindowVisibility(prev => ({
            ...prev,
            [windowName]: !prev[windowName]
        }));
        
        // If we're minimizing the active window, clear the active window
        if (activeWindow === windowName && windowVisibility[windowName] !== false) {
            setActiveWindow(null);
        }
    };

    const desktopIcons = [
        { name: "Projects", icon: projectIcon },
        { name: "Skills", icon: skillsIcon },
        { name: "About Me", icon: aboutMeIcon },
        { name: "Certificates", icon: certificateIcon },
        { name: "Blogs", icon: blogsIcon },
        { name: "Resume", icon: resumeIcon },
    ];
    
    // Apps that should appear in the Start Menu but not on desktop
    const startMenuApps = [
        ...desktopIcons,
        { name: "Terminal", icon: terminalIcon }
    ];

    return (
        <div className="relative w-full h-screen overflow-hidden bg-cover bg-center"
            style={{
                backgroundImage: `url(${wallpaper})`,
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 0
            }}
        >
            {/* Desktop Icons - Higher z-index to stay above windows */}
            <div className="absolute top-10 left-10 flex flex-col gap-6 z-40">
                {desktopIcons.map((icon) => (
                    <div
                        key={icon.name}
                        className="flex flex-col cursor-pointer text-white justify-center items-center p-2 hover:bg-gray-700/50 rounded transition-colors"
                        onClick={() => openFolder(icon.name)}
                    >
                        <div className="p-2">
                            <img src={icon.icon} alt={icon.name} height="32px" width="32px" className="pointer-events-none" />
                        </div>
                        <span className="text-sm text-white/90 text-shadow">{icon.name}</span>
                    </div>
                ))}
            </div>

            {/* Windows - Container with pointer-events-none to allow clicks through to desktop */}
            <div className="absolute inset-0 pointer-events-none">
                {openWindows.map((folder) => (
                    <div 
                        key={folder} 
                        className="pointer-events-auto"
                        style={{
                            display: windowVisibility[folder] === false ? 'none' : 'block',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            overflow: 'hidden',
                            pointerEvents: 'auto'
                        }}
                        onClick={(e) => {
                            // Stop propagation to prevent clicks from going through the window
                            e.stopPropagation();
                            setActiveWindow(folder);
                        }}
                    >
                        <WindowCard
                            ref={windowRefs.current[folder]}
                            title={folder}
                            onClose={() => closeFolder(folder)}
                            isActive={activeWindow === folder}
                            isVisible={windowVisibility[folder] !== false}
                            onMinimize={() => toggleMinimizeWindow(folder)}
                            onClick={() => setActiveWindow(folder)}
                        >
                            {componentMap[folder] || `Content for ${folder} goes here.`}
                        </WindowCard>
                    </div>
                ))}
            </div>

            {/* Taskbar */}
            <Taskbar
                openWindows={openWindows}
                activeWindow={activeWindow}
                setActiveWindow={setActiveWindow}
                desktopIcons={startMenuApps}
                windowVisibility={windowVisibility}
                onToggleMinimize={toggleMinimizeWindow}
                onOpenApp={openFolder}
            />
        </div>
    );
};

export default DesktopEnv;
