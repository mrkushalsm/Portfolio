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
                                    "About Me": { type: "file", fileType: "markdown", content: "about-me", icon: "user-circle" },
                                    "This PC": { type: "file", fileType: "app", appName: "File Explorer", icon: "this-pc" },
                                    "Terminal": { type: "file", fileType: "app", appName: "Terminal", icon: "terminal" },
                                    "GitHub": { type: "shortcut", target: "https://github.com/mrkushalsm", icon: "github" },
                                    "LinkedIn": { type: "shortcut", target: "https://www.linkedin.com/in/mrkushalsm/", icon: "linkedin" },
                                }
                            },
                            "Documents": {
                                type: "folder",
                                icon: "documents",
                                children: {
                                    "Resume.pdf": { 
                                        type: "file", 
                                        fileType: "pdf", 
                                        url: "/C/Users/Kushal/Documents/Resume.pdf", 
                                        icon: "file-pdf" 
                                    },
                                    "Projects": { type: "folder", icon: "folder", children: {} }, 
                                    "Skills.md": { 
                                        type: "file", 
                                        fileType: "markdown", 
                                        url: "/C/Users/Kushal/Documents/Skills.md", 
                                        icon: "file-text" 
                                    },
                                    "Certificates": { type: "folder", icon: "folder", children: {} }, 
                                    "Project_Ideas.txt": { 
                                        type: "file", 
                                        fileType: "text", 
                                        url: "/C/Users/Kushal/Documents/Project_Ideas.txt", 
                                        icon: "file-text" 
                                    },
                                    "Notes.md": { 
                                        type: "file", 
                                        fileType: "markdown", 
                                        url: "/C/Users/Kushal/Documents/Notes.md", 
                                        icon: "file-text" 
                                    }
                                }
                            },
                            "Downloads": {
                                type: "folder",
                                icon: "downloads",
                                children: {
                                    "installer.exe": { type: "file", fileType: "binary", icon: "exe-file" },
                                    "funny_cat.png": { 
                                        type: "file", 
                                        fileType: "image", 
                                        url: "/C/Users/Kushal/Downloads/funny_cat.png", 
                                        icon: "file-image" 
                                    }
                                }
                            },
                            "Pictures": {
                                type: "folder",
                                icon: "pictures",
                                children: {
                                    "Wallpaper.jpg": { 
                                        type: "file", 
                                        fileType: "image", 
                                        url: "/C/Users/Kushal/Pictures/Wallpaper.jpg", 
                                        icon: "file-image" 
                                    }
                                }
                            },
                            "Music": {
                                type: "folder",
                                icon: "music",
                                children: {
                                    "Song.mp3": { type: "file", fileType: "audio", icon: "music-file" }
                                }
                            },
                            "Videos": {
                                type: "folder",
                                icon: "videos",
                                children: {
                                    "Demo.mp4": { type: "file", fileType: "video", icon: "video-file" }
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
                            "explorer.exe": { type: "file", fileType: "app", appName: "File Explorer", icon: "imageres_1023" }
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
         // Determine extension based on original image path (simplified)
         const ext = cert.image.endsWith('.jpg') ? '.jpg' : '.png';
         

         docs.children["Certificates"].children[`${safeName}${ext}`] = {
             type: "file",
             fileType: "image",
             // Point to the REAL file in the C: drive structure (now in cert.image)
             url: cert.image,
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
