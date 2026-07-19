import { useMemo, useState } from "react";
import { MOBILE_APPS } from "../data/windowsPhoneData";
import { useFileSystem } from "../context/FileSystemContext";

export const useGlobalSearch = () => {
    const { fileSystem } = useFileSystem();
    const [query, setQuery] = useState("");

    const searchResults = useMemo(() => {
        if (!query || query.trim() === "") return [];

        const q = query.toLowerCase().trim();
        const results = [];

        // 1. Search Apps
        MOBILE_APPS.forEach(app => {
            if (app.label.toLowerCase().includes(q) || app.id.toLowerCase().includes(q)) {
                results.push({
                    type: "app",
                    id: app.id,
                    title: app.label,
                    mobileIcon: app.icon,
                    desktopIcon: app.desktopIconKey || app.imgSrc || app.iconKey || app.id,
                    color: app.color,
                    action: app.action,
                    componentKey: app.componentKey,
                    url: app.url
                });
            }
        });

        // 2. Search Files
        // Flatten the file system to easily search through all files
        const flattenFiles = (node, path = "") => {
            let files = [];
            Object.entries(node || {}).forEach(([name, content]) => {
                const currentPath = path === "" ? name : `${path}/${name}`;
                if (content && typeof content === 'object' && content.type === 'file') {
                    if (name.toLowerCase().includes(q)) {
                        files.push({
                            type: "file",
                            id: currentPath,
                            title: name,
                            path: currentPath,
                            content: content
                        });
                    }
                } else if (content && typeof content === 'object' && !content.type) {
                    files = [...files, ...flattenFiles(content, currentPath)];
                }
            });
            return files;
        };

        const fileResults = flattenFiles(fileSystem);
        results.push(...fileResults);

        return results;
    }, [query, fileSystem]);

    return { query, setQuery, searchResults };
};
