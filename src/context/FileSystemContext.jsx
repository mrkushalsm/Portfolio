"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { projects } from '../data/projectsData';
import { skillsData } from '../data/skillsData';
import { educationData } from '../data/educationData';
import { experienceData } from '../data/experienceData';
import certificateData from '../data/certificateData';

const FileSystemContext = createContext();

export const useFileSystem = () => useContext(FileSystemContext);

const INITIAL_FS = {
    "C:": {
        type: "drive",
        name: "Local Disk (C:)",
        icon: "hard-drive",
        children: {
            "Users": {
                type: "folder",
                children: {
                    "Kushal": {
                        type: "folder",
                        children: {
                            "Desktop": {
                                type: "folder",
                                icon: "desktop",
                                children: {
                                    // Clean Desktop
                                    "This PC": { type: "file", fileType: "app", appName: "File Explorer", icon: "this-pc" },
                                    "Microsoft Edge": { type: "shortcut", target: "https://www.google.com/webhp?igu=1", icon: "edge" },
                                    "Terminal": { type: "file", fileType: "app", appName: "Terminal", icon: "terminal" },
                                    "GitHub": { type: "shortcut", target: "https://github.com/mrkushalsm", icon: "github" },
                                    "LinkedIn": { type: "shortcut", target: "https://www.linkedin.com/in/mrkushalsm/", icon: "linkedin" },
                                }
                            },
                            "Documents": {
                                type: "folder",
                                icon: "documents",
                                children: {
                                    "Resume.pdf": { type: "file", fileType: "pdf", content: "/assets/resume.pdf", icon: "file-pdf" },
                                    "Projects": { type: "folder", icon: "folder", children: {} }, 
                                    "Skills.txt": { 
                                        type: "file", 
                                        fileType: "text", 
                                        content: Object.entries(skillsData).map(([category, skills]) => 
                                            `${category}:\n${skills.map(s => `- ${s.name} (${s.proficiency})`).join('\n')}`
                                        ).join('\n\n'), 
                                        icon: "file-text" 
                                    },
                                    "Certificates": { type: "folder", icon: "folder", children: {} }, 
                                    "Project_Ideas.txt": { type: "file", fileType: "text", content: "1. Build a cool OS in React\n2. Make it pixel perfect", icon: "file-text" },
                                    "Notes.md": { type: "file", fileType: "markdown", content: "# Daily Notes\n- Drink water\n- Code more", icon: "file-text" }
                                }
                            },
                            "Downloads": {
                                type: "folder",
                                icon: "downloads",
                                children: {
                                    "installer.exe": { type: "file", fileType: "binary", icon: "application" },
                                    "funny_cat.png": { type: "file", fileType: "image", content: "/assets/icons/win10/photos.ico", icon: "file-image" }
                                }
                            },
                            "Pictures": {
                                type: "folder",
                                icon: "pictures",
                                children: {
                                    "Wallpaper.jpg": { type: "file", fileType: "image", content: "/assets/wallpaper.jpg", icon: "file-image" }
                                }
                            },
                            "Music": {
                                type: "folder",
                                icon: "music",
                                children: {
                                    "Song.mp3": { type: "file", fileType: "audio", icon: "music" }
                                }
                            },
                            "Videos": {
                                type: "folder",
                                icon: "videos",
                                children: {
                                    "Demo.mp4": { type: "file", fileType: "video", icon: "videos" }
                                }
                            }
                        }
                    }
                }
            },
            "Windows": {
                type: "folder",
                children: {
                    "System32": {
                        type: "folder",
                        children: {
                            "cmd.exe": { type: "file", fileType: "app", appName: "Terminal", icon: "terminal" },
                            "explorer.exe": { type: "file", fileType: "app", appName: "File Explorer", icon: "folder" }
                        }
                    }
                }
            }
        }
    }
};

// Helper to populate dynamic content
const populateFS = (fs) => {
    // const desktop = fs["C:"].children["Users"].children["Kushal"].children["Desktop"]; // No longer needed for projects
    const docs = fs["C:"].children["Users"].children["Kushal"].children["Documents"];
    const pics = fs["C:"].children["Users"].children["Kushal"].children["Pictures"];

    // Populate Projects
    projects.forEach(project => {
        const safeName = project.name.replace(/[^a-zA-Z0-9 ]/g, "").trim();
        docs.children["Projects"].children[safeName] = {
            type: "folder",
            icon: "folder",
            children: {
                // Convert README to a shortcut to the GitHub1s view of the readme
                "README.md": { 
                    type: "shortcut", 
                    target: project.github.replace("github.com", "github1s.com") + "/blob/main/README.md", 
                    icon: "file-text" 
                },
                ...(project.link ? {
                    "Visit Link": { type: "shortcut", target: project.link, icon: "edge" }
                } : {}),
                "GitHub Repo": { type: "shortcut", target: project.github, icon: "github" }
            }
        };
        // Also add project images to Pictures
        if(project.image) {
             pics.children[`${safeName}.png`] = { type: "file", fileType: "image", content: project.image, icon: "file-image" };
        }
    });

    // Populate Certificates
    certificateData.forEach(cert => {
         const safeName = cert.title.replace(/[^a-zA-Z0-9 ]/g, "").trim();
         docs.children["Certificates"].children[`${safeName}.png`] = {
             type: "file",
             fileType: "image",
             content: cert.image,
             icon: "file-image",
             meta: cert
         };
    });

    return fs;
};

export const FileSystemProvider = ({ children }) => {
    const [fs, setFs] = useState(() => populateFS(JSON.parse(JSON.stringify(INITIAL_FS)))); // Deep copy init

    // Path navigation helper
    const resolvePath = (path) => {
        const parts = path.split('/').filter(p => p);
        let current = fs;
        for (let part of parts) {
            if (current.children && current.children[part]) {
                current = current.children[part];
            } else if (current[part]) { // Handle root drive case "C:"
                 current = current[part];
            } else {
                return null;
            }
        }
        return current;
    };

    const getDirContent = (path) => {
        const node = resolvePath(path);
        if (node && (node.type === 'folder' || node.type === 'drive')) {
            return node.children;
        }
        return null;
    };

    return (
        <FileSystemContext.Provider value={{ fs, resolvePath, getDirContent }}>
            {children}
        </FileSystemContext.Provider>
    );
};
