// src/data/windowsPhoneData.js

import { FaGithub, FaLinkedin, FaFolder, FaFileAlt, FaAward, FaTerminal, FaTasks, FaUser, FaFileCode, FaFileSignature, FaLaptopCode, FaImage } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export const METRO_COLORS = {
    blue:    "#0078d7",
    darkBlue:"#003e8a",
    teal:    "#008272",
    green:   "#107c10",
    orange:  "#da3b01",
    red:     "#e81123",
    magenta: "#b4009e",
    purple:  "#744da9",
    indigo:  "#4a4a8f",
    dark:    "#1a1a2e",
    cyan:    "#00b4d8",
    charcoal:"#252525",
    white:   "#ffffff",
};

export const MOBILE_APPS = [
    { id: "aboutme",      label: "About Me",       icon: FaUser,           color: METRO_COLORS.blue,     action: "app",  componentKey: "AboutMe" },
    { id: "certificates", label: "Certificates",   icon: FaAward,          color: METRO_COLORS.orange,   action: "app",  componentKey: "Certificates" },
    { id: "files",        label: "Files",          icon: FaFolder,         color: METRO_COLORS.blue,     action: "app",  componentKey: "FileExplorer" },
    { id: "github",       label: "GitHub",         icon: FaGithub,         color: METRO_COLORS.charcoal, action: "link", url: "https://github.com/mrkushalsm", isSocial: true, imgSrc: "/assets/icons/win10/github-mark-white.svg" },
    { id: "linkedin",     label: "LinkedIn",       icon: FaLinkedin,       color: METRO_COLORS.blue,     action: "link", url: "https://www.linkedin.com/in/mrkushalsm/", isSocial: true, imgSrc: "/assets/icons/win10/linkedin.png" },
    { id: "photos",       label: "Photos",         icon: FaImage,         color: METRO_COLORS.teal,     action: "app",  componentKey: "Photos" },
    { id: "projects",     label: "Projects",       icon: FaLaptopCode,         color: METRO_COLORS.teal,     action: "app",  componentKey: "Projects" },
    { id: "resume",       label: "Resume",         icon: FaFileSignature,  color: METRO_COLORS.red,      action: "app",  componentKey: "Resume" },
    { id: "skills",       label: "Skills",         icon: FaFileCode,       color: METRO_COLORS.purple,   action: "app",  componentKey: "Skills" },
    { id: "taskmanager",  label: "Task Manager",   icon: FaTasks,          color: METRO_COLORS.magenta,  action: "app",  componentKey: "TaskManager" },
    { id: "terminal",     label: "Terminal",       icon: FaTerminal,       color: METRO_COLORS.green,    action: "app",  componentKey: "Terminal" },
    { id: "twitter",      label: "X (Twitter)",    icon: FaXTwitter,       color: METRO_COLORS.white,    action: "link", url: "https://x.com/kspiderman69", isSocial: true, imgSrc: "/assets/icons/win10/x-twitter.png" },
];
