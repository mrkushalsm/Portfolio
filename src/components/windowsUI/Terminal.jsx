// import React, { useState, useEffect, useRef } from "react";
//
// const Terminal = ({ onCommand, initialLogs = [], prompt = "$", showInput = true, onExit }) => {
//     const [input, setInput] = useState("");
//     const [logs, setLogs] = useState(initialLogs);
//     const terminalRef = useRef(null);
//
//     const handleKeyDown = (e) => {
//         if (e.key === 'Enter' && input.trim()) {
//             const command = input.trim().toLowerCase();
//
//             // Handle clear command directly
//             if (command === 'clear') {
//                 setLogs([]);
//                 setInput("");
//                 return;
//             }
//
//             // Handle exit command
//             if (command === 'exit' && onExit) {
//                 onExit();
//                 return;
//             }
//
//             // Add command to logs
//             setLogs(prev => [...prev, { text: command, type: 'command' }]);
//
//             // Process other commands through the onCommand prop if provided
//             if (onCommand) {
//                 const output = onCommand(command);
//                 if (output && output.length > 0) {
//                     setLogs(prev => [...prev, ...output.map(text => ({ text, type: 'output' }))]);
//                 }
//             }
//
//             setInput("");
//         }
//     };
//
//     // Auto-scroll to bottom when logs change
//     useEffect(() => {
//         if (terminalRef.current) {
//             terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
//         }
//     }, [logs]);
//
//     return (
//         <div
//             ref={terminalRef}
//             className="h-full bg-black text-green-400 font-mono text-sm p-4 overflow-auto"
//             style={{
//                 background: 'rgba(0, 0, 0, 0.95)',
//                 backgroundImage: 'linear-gradient(rgba(0, 255, 0, 0.05) 1px, transparent 1px)',
//                 backgroundSize: '100% 20px',
//             }}
//         >
//             {logs.map((log, index) => (
//                 <div
//                     key={index}
//                     className={`mb-1 ${log.type === 'command' ? 'text-green-400' : log.type === 'error' ? 'text-red-400' : 'text-gray-300'}`}
//                 >
//                     {log.type === 'prompt' ? (
//                         <div className="flex items-center">
//                             <span className="text-green-400">{prompt}</span>
//                             <span className="ml-1.5 inline-block w-1.5 h-4 bg-green-400 animate-pulse"></span>
//                         </div>
//                     ) : log.text}
//                 </div>
//             ))}
//             {showInput && (
//                 <div className="flex items-center">
//                     <span className="text-green-400">{prompt}</span>
//                     <input
//                         type="text"
//                         value={input}
//                         onChange={(e) => setInput(e.target.value)}
//                         onKeyDown={handleKeyDown}
//                         className="terminal-input bg-transparent border-none outline-none ml-1.5 text-green-400 w-full"
//                         autoFocus
//                         spellCheck="false"
//                     />
//                 </div>
//             )}
//         </div>
//     );
// };
//
// export default Terminal;

import React, { useState, useEffect, useRef } from "react";
import { useFileSystem } from "../../context/FileSystemContext";
import { projects } from "../../data/projectsData";
import { skillsData } from "../../data/skillsData";

// ASCII Art for neofetch
const ASCII_ART = `
  _____ _           _ _     _   _       _       _         
 |  __ \\ |         | (_)   | | | |     (_)     (_)        
 | |__) | |__   ___| |_ ___| |_| | ___  _ _ __  _  __ _ 
 |  ___/| '_ \\ / _ \\ | / __| __| |/ _ \\| | '_ \\| |/ _\\ |
 | |    | | | |  __/ | \\__ \\ |_| | (_) | | | | | | (_| |
 |_|    |_| |_|\\___|_|_|___/\\__|_|\\___/|_|_| |_|_|\\__,_|
`;

// Help text
const HELP_TEXT = `
Available commands:

File System (VFS):
  ls / dir  - List accessible files and directories
  cd [dir]  - Change directory
  type [file]- View file contents
  pwd       - Print working directory

Portfolio Information:
  about     - Display a brief bio
  skills    - List technical skills
  projects  - Show featured projects
  contact   - Display contact info

Fun & Easter Eggs:
  neofetch  - Display system information
  cowsay    - Make a cow say something
  fortune   - Show a random quote
  clear     - Clear the terminal
`;

const FORTUNES = [
    "The only way to do great work is to love what you do.",
    "Innovation distinguishes between a leader and a follower.",
    "Stay hungry, stay foolish.",
    "Think different.",
    "The future belongs to those who believe in the beauty of their dreams."
];

const Terminal = ({ onCommand, initialLogs = [], prompt = "$", showInput = true, onExit }) => {
    const { resolvePath, getDirContent } = useFileSystem();
    
    // Default start path in VFS
    const [currentPath, setCurrentPath] = useState("C:/Users/Kushal");
    
    const [input, setInput] = useState("");
    const [logs, setLogs] = useState([]);
    const [isBooting, setIsBooting] = useState(true);
    const terminalRef = useRef(null);

    // Boot sequence
    useEffect(() => {

        if (initialLogs.length > 0) {
            setLogs(initialLogs);
            setIsBooting(false);
            return;
        }

        const bootSequence = [
            { text: "Portfolio OS [Version 10.0.19045.3693]", delay: 100 },
            { text: "(c) 2025 Kushal S. M. All rights reserved.", delay: 200 },
            { text: "", delay: 300 },
            { text: 'Type "help" to see available commands', type: 'output', delay: 400 }
        ];

        let timeouts = [];
        bootSequence.forEach(({ text, type = 'output', delay }) => {
            timeouts.push(setTimeout(() => {
                setLogs(prev => [...prev, { text, type }]);
            }, delay));
        });

        timeouts.push(setTimeout(() => setIsBooting(false), 500));
        return () => timeouts.forEach(clearTimeout);
    }, []);

    // Construct the prompt path (e.g., C:\Users\Kushal)
    // Windows CMD style: C:\Users\Kushal>
    const displayPath = currentPath.replace(/\//g, '\\') + ">";

    // Path Utilities
    const normalizePath = (targetPath) => {
        // Handle ".." and "."
        // If absolute (starts with C:), use as is
        // If relative, append to currentPath
        let absPath = targetPath;
        
        if (!targetPath.startsWith("C:")) {
            // Join with current path
            // Handle root case carefully
            const separator = currentPath.endsWith('/') ? '' : '/';
            absPath = `${currentPath}${separator}${targetPath}`;
        }

        // Resolve ".."
        const parts = absPath.split('/');
        const stack = [];
        
        for (const part of parts) {
            if (part === "" || part === ".") continue;
            if (part === "..") {
                if (stack.length > 0) stack.pop();
            } else {
                stack.push(part);
            }
        }
        
        // Reconstruct
        // If stack is empty (went past root), default to C:
        if (stack.length === 0) return "C:";
        
        // Ensure "C:" is first
        if (stack[0] !== "C:") stack.unshift("C:");
        
        return stack.join('/');
    };

    const executeCommand = (commandLine) => {
        const args = commandLine.trim().split(/\s+/);
        const cmd = args[0].toLowerCase();
        const param = args[1]; // simplified arg handling

        const addLog = (text, type = 'output') => {
            setLogs(prev => [...prev, { text, type }]);
        };

        switch (cmd) {
            case 'help':
                addLog(HELP_TEXT);
                break;

            case 'clear':
            case 'cls':
                setLogs([]);
                break;

            case 'exit':
                if (onExit) onExit();
                break;

            case 'pwd': // Keep pwd for convenience, though prompt shows it
            case 'cd': // 'cd' with no args prints cwd in windows, but we can treat 'pwd' as an alias or just keep 'cd' logic
                if (cmd === 'pwd' || (cmd === 'cd' && !param)) {
                     addLog(currentPath.replace(/\//g, '\\'));
                     return;
                }
                // Fallthrough for cd with param
            
            case 'cd':
                {
                    const target = normalizePath(param);
                    
                    // Validate existence
                    const node = resolvePath(target);
                    if (node && (node.type === 'folder' || node.type === 'drive')) {
                        setCurrentPath(target);
                    } else {
                        addLog(`The system cannot find the path specified.`);
                    }
                }
                break;

            case 'dir':
                {
                    // Get Access
                    const content = getDirContent(currentPath);
                    if (!content) {
                        addLog(`File Not Found`);
                        return;
                    }
                    
                    // List items
                    const items = Object.entries(content);
                    if (items.length === 0) {
                        addLog(" File Not Found");
                    } else {
                        // Windows format:
                        // <DIR>          FolderName
                        //                FileName.ext
                        const output = items.map(([name, item]) => {
                            const isDir = item.type === 'folder' || item.type === 'drive';
                            // Align columns roughly
                            if (isDir) {
                                return `<DIR>          ${name}`;
                            } else {
                                return `               ${name}`;
                            }
                        }).join('\n');
                        
                        addLog(` Directory of ${currentPath.replace(/\//g, '\\')}\n\n${output}`);
                    }
                }
                break;

            case 'type': // Windows equivalent of cat
                {
                    if (!param) {
                        addLog("The syntax of the command is incorrect.");
                        return;
                    }

                    const target = normalizePath(param);
                    const node = resolvePath(target);

                    if (node) {
                        if (node.type === 'folder' || node.type === 'drive') {
                            addLog(`Access is denied.`);
                        } else {
                            // It's a file
                            if (node.content) {
                                addLog(node.content);
                            } else if (node.url) {
                                addLog(`[File Content located at ${node.url}]`);
                            } else {
                                addLog("");
                            }
                        }
                    } else {
                        addLog(`The system cannot find the file specified.`);
                    }
                }
                break;



            case 'whoami':
                addLog(`${hostname}\\${username}`);
                break;

            case 'neofetch':
                addLog(ASCII_ART);
                addLog(`OS: Portfolio OS (React)\nShell: Web Terminal\nHost: ${hostname}\nUptime: Always`);
                break;

            case 'cowsay':
                const msg = args.slice(1).join(' ') || "Moo!";
                addLog(`
 ${'_'.repeat(msg.length + 2)}
< ${msg} >
 ${'-'.repeat(msg.length + 2)}
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||
                `);
                break;
                
            case 'fortune':
                addLog(FORTUNES[Math.floor(Math.random() * FORTUNES.length)]);
                break;

            // --- Keep Legacy Info Commands for convenience ---
            case 'about':
                addLog("I'm a passionate developer building cool things on the web.");
                break;
            case 'skills':
                addLog("Technical Skills:\n" + Object.values(skillsData).flat().map(s => `- ${s.name}`).join('\n'));
                break;
            case 'projects':
                addLog("My Projects:\n" + projects.map(p => `* ${p.name}`).join('\n'));
                break;
             
             case 'open':
            case 'github':
            case 'linkedin':
            case 'twitter':
            case 'resume':
            case 'blog':
            case 'certifications':
                addLog(`'${cmd}' is not recognized as an internal or external command, operable program or batch file.`);
                break;

            default:
                addLog(`'${cmd}' is not recognized as an internal or external command, operable program or batch file.`);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && input.trim()) {
            const command = input.trim();
            // Windows CMD style output for command echo
            // usually it just prints the prompt + command.
            // My existing log logic does this: prompt + command. 
            // setLogs(prev => [...prev, { text: command, type: 'command', path: displayPath }]);
            setLogs(prev => [...prev, { text: command, type: 'command', path: displayPath }]);
            executeCommand(command);
            setInput("");
        } else if (e.key === 'l' && e.ctrlKey) {
            e.preventDefault();
            setLogs([]);
        }
    };

    // Auto-scroll
    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [logs]);

    return (
        <div 
            ref={terminalRef}
            className="h-full bg-[#0c0c0c] text-[#cccccc] font-mono text-sm p-2 overflow-auto select-text"
            onClick={() => document.querySelector('.terminal-input')?.focus()}
        >
             {logs.map((log, index) => (
                <div key={index} className="mb-px break-words">
                    {log.type === 'command' ? (
                        <div className="flex flex-wrap gap-x-2">
                             <span className="text-white">{log.path}</span>
                             <span className="text-white">{log.text}</span>
                        </div>
                    ) : (
                        <div className={`${log.type === 'error' ? 'text-red-400' : 'text-gray-300'} whitespace-pre-wrap font-mono`}>
                            {log.text}
                        </div>
                    )}
                </div>
            ))}
            
            {!isBooting && showInput && (
                <div className="flex flex-wrap gap-x-0">
                    <span className="text-white mr-2">{displayPath}</span>
                    <div className="flex-1 flex">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="terminal-input bg-transparent border-none outline-none text-white flex-1 min-w-[50px] font-mono p-0"
                            autoFocus
                            spellCheck="false"
                            autoComplete="off"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Terminal;
