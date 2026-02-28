// Unified icon map — single source of truth for all icon key → path resolutions.
// Used by FileIcon (desktop icons), DesktopEnv (window icons), and Start Menu.

const ICON_MAP = {
    // ─── System / Special Folders ───
    "desktop": "/assets/icons/win10/desktop-folder.ico",
    "documents": "/assets/icons/win10/document-folder.ico",
    "downloads": "/assets/icons/win10/downloads-folder.ico",
    "pictures": "/assets/icons/win10/pictures-folder.ico",
    "music": "/assets/icons/win10/music-folder.ico",
    "videos": "/assets/icons/win10/video-folder.ico",

    // ─── Items ───
    "folder": "/assets/icons/win10/folder.ico",
    "this-pc": "/assets/icons/win10/this-pc.ico",
    "trash": "/assets/icons/win10/trash.ico",
    "hard-drive": "/assets/icons/win10/hard-drive.ico",

    // ─── File Types ───
    "file-text": "/assets/icons/win10/file-text.ico",
    "file-pdf": "/assets/icons/win10/file-pdf.ico",
    "file-image": "/assets/icons/win10/file-image.ico",
    "video-file": "/assets/icons/win10/video-file.ico",
    "music-file": "/assets/icons/win10/music-file.ico",
    "exe-file": "/assets/icons/win10/exe-file.ico",
    "text": "/assets/icons/win10/file-text.ico",
    "markdown": "/assets/icons/win10/file-text.ico",
    "image": "/assets/icons/win10/file-image.ico",

    // ─── Apps ───
    "edge": "/assets/icons/win10/edge.png",
    "vscode": "/assets/icons/win10/vscode.png",
    "photos": "/assets/icons/win10/photos.ico",
    "settings": "/assets/icons/win10/settings.png",
    "terminal": "/assets/icons/terminal.ico",
    "github": "/assets/icons/win10/github-mark-white.svg",
    "linkedin": "/assets/icons/win10/linkedin.png",
    "task-manager": "/assets/icons/win10/task-manager.webp",

    // ─── Custom ───
    "user-circle": "/assets/icons/win10/user-circle.ico",
    "imageres_1023": "/assets/icons/win10/imageres_1023.ico",
    "shortcut": "/assets/icons/win10/edge.png",
};

const DEFAULT_ICON = "/assets/icons/win10/file-text.ico";
const FALLBACK_ICON = "/assets/icons/win10/application.ico";

/**
 * Resolve an icon key to its asset path.
 * Accepts raw paths (starting with / or http), named keys, or returns a fallback.
 */
export const getIconPath = (iconName) => {
    if (!iconName) return DEFAULT_ICON;
    if (iconName.startsWith("/") || iconName.startsWith("http")) return iconName;
    return ICON_MAP[iconName] || DEFAULT_ICON;
};

export { ICON_MAP, DEFAULT_ICON, FALLBACK_ICON };
