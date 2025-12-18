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

Navigation & Help:
  help      - Show this help message
  clear     - Clear the terminal
  exit      - Close the terminal

Portfolio Information:
  about     - Display a brief bio and introduction
  skills    - List technical skills and proficiencies
  projects  - Show a list of featured projects
  experience - Display work history
  education - Show educational background

Interactive:
  open [project] - Open a specific project in a new tab

Fun & Easter Eggs:
  neofetch  - Display system information
  cowsay [msg] - Make a cow say something
  fortune   - Show a random quote

File System:
  ls        - List available projects
  cd [dir]  - Change directory (navigation)
  cat [file] - View file contents

Social & Links:
  github    - Open GitHub profile
  linkedin  - Open LinkedIn profile
  twitter   - Open Twitter profile
  resume    - View or download resume
  blog      - Visit blog
  certifications - List certifications

Utility:
  date      - Show current date and time
  whoami    - Display user information
  echo [text] - Repeat back the input text
`;

// Convert projects data to terminal format
const PROJECTS = projects.map(project => ({
    name: project.name.toLowerCase().replace(/\s+/g, '-'),
    description: project.description
}));

// Convert skills data to flat array for terminal display
const SKILLS = Object.values(skillsData).flat().map(skill => skill.name);

const FORTUNES = [
    "The only way to do great work is to love what you do.",
    "Innovation distinguishes between a leader and a follower.",
    "Stay hungry, stay foolish.",
    "Think different.",
    "The future belongs to those who believe in the beauty of their dreams."
];

const Terminal = ({ onCommand, initialLogs = [], prompt = "$", showInput = true, onExit }) => {
    const [input, setInput] = useState("");
    const [logs, setLogs] = useState(initialLogs);
    const [currentDir, setCurrentDir] = useState("~");
    const terminalRef = useRef(null);

    // Add initial help message if no logs exist
    useEffect(() => {
        if (logs.length === 0) {
            setLogs([
                { text: 'Type "help" to see available commands', type: 'output' }
            ]);
        }
    }, [logs.length]);

    const executeCommand = (command) => {
        const args = command.trim().split(/\s+/);
        const cmd = args[0].toLowerCase();

        // Helper to add output to logs
        const addOutput = (text, type = 'output') => {
            setLogs(prev => [...prev, { text, type }]);
        };

        // Handle commands
        switch (cmd) {
            case 'clear':
                setLogs([]);
                return;

            case 'exit':
                if (onExit) onExit();
                return;

            case 'help':
                addOutput(HELP_TEXT);
                break;

            case 'about':
                addOutput("I'm a passionate developer with expertise in web technologies...");
                break;

            case 'skills':
                addOutput("Technical Skills:\n" + SKILLS.map(skill => `- ${skill}`).join('\n'));
                break;

            case 'projects':
                addOutput("Featured Projects:\n" +
                    PROJECTS.map(p => `${p.name}: ${p.description}`).join('\n'));
                break;

            case 'experience':
                addOutput("Work Experience:\n- Software Engineer at Company (2020-2023)\n- Intern at Startup (2019-2020)");
                break;

            case 'education':
                addOutput("Education:\n- B.Tech in Computer Science, University (2016-2020)");
                break;

            case 'neofetch':
                addOutput(ASCII_ART);
                addOutput(`OS: Portfolio OS\nHost: Personal Website\nTerminal: Web Terminal v1.0`);
                break;

            case 'cowsay':
                { const message = args.slice(1).join(' ') || 'Moo!';
                const cow = ` ${'_'.repeat(message.length + 2)}
< ${message} >
 ${'-'.repeat(message.length + 2)}
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||`;
                addOutput(cow);
                break; }

            case 'fortune':
                { const randomFortune = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
                addOutput(randomFortune);
                break; }

            case 'ls':
                if (currentDir === '~') {
                    // In root directory, show all project names
                    addOutput(PROJECTS.map(p => p.name).join('  '));
                } else {
                    // In a project directory, show project details
                    const projectName = currentDir.replace('~/', '');
                    const project = projects.find(p => p.name.toLowerCase().replace(/\s+/g, '-') === projectName);
                    if (project) {
                        addOutput(`Project Details for ${project.name}:`);
                        addOutput(`Name: ${project.name}`);
                        addOutput(`Description: ${project.description}`);
                        addOutput(`Live Demo: ${project.link || 'Not available'}`);
                        addOutput(`GitHub: ${project.github || 'Not available'}`);
                    } else {
                        addOutput('Project not found', 'error');
                    }
                }
                break;

            case 'cd':
                { const dir = args[1] || '~';
                if (dir === '~' || PROJECTS.some(p => p.name === dir)) {
                    setCurrentDir(dir === '~' ? '~' : `~/${dir}`);
                    addOutput(`Changed directory to ${dir}`);
                } else {
                    addOutput(`cd: no such directory: ${dir}`, 'error');
                }
                break; }

            case 'cat':
                { const file = args[1];
                const project = PROJECTS.find(p => p.name === file);
                if (project) {
                    addOutput(`Project: ${project.name}\n${project.description}`);
                } else {
                    addOutput(`cat: ${file || 'no file specified'}: No such file or directory`, 'error');
                }
                break; }

            case 'open':
                { const projectToOpen = args[1];
                if (PROJECTS.some(p => p.name === projectToOpen)) {
                    addOutput(`Opening ${projectToOpen} in a new tab...`);
                    // In a real app, you would use window.open() here
                } else {
                    addOutput(`No project named '${projectToOpen}' found`, 'error');
                }
                break; }

            case 'github':
            case 'linkedin':
            case 'twitter':
            case 'resume':
            case 'blog':
            case 'certifications':
                addOutput(`Opening ${cmd}...`);
                // In a real app, you would use window.open() with the actual URLs
                break;

            case 'date':
                addOutput(new Date().toString());
                break;

            case 'whoami':
                addOutput('portfolio-user');
                break;

            case 'echo':
                addOutput(args.slice(1).join(' '));
                break;

            default:
                // Pass through to parent component if command not found
                if (onCommand) {
                    const output = onCommand(command);
                    if (output && output.length > 0) {
                        output.forEach(text => addOutput(text));
                    } else {
                        addOutput(`command not found: ${cmd}`, 'error');
                    }
                } else {
                    addOutput(`command not found: ${cmd}`, 'error');
                }
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && input.trim()) {
            const command = input.trim();
            // Add command to logs
            setLogs(prev => [...prev, { text: command, type: 'command' }]);
            // Process command
            executeCommand(command);
            setInput("");
        } else if (e.key === 'l' && e.ctrlKey) {
            // Ctrl+L to clear the screen
            e.preventDefault();
            setLogs([]);
        } else if (e.key === 'c' && e.ctrlKey) {
            // Ctrl+C to cancel current input
            e.preventDefault();
            setLogs(prev => [...prev, { text: '^C', type: 'output' }]);
            setInput("");
        }
    };

    // Auto-scroll to bottom when logs change
    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [logs]);

    return (
        <div
            ref={terminalRef}
            className="h-full bg-black text-green-400 font-mono text-sm p-4 overflow-auto"
            style={{
                background: 'rgba(0, 0, 0, 0.95)',
                backgroundImage: 'linear-gradient(rgba(0, 255, 0, 0.05) 1px, transparent 1px)',
                backgroundSize: '100% 20px',
            }}
            onClick={() => document.querySelector('.terminal-input')?.focus()}
        >
            {logs.map((log, index) => (
                <div
                    key={index}
                    className={`mb-1 whitespace-pre-wrap break-words ${
                        log.type === 'command' ? 'text-green-400' :
                            log.type === 'error' ? 'text-red-400' : 'text-gray-300'
                    }`}
                >
                    {log.type === 'prompt' ? (
                        <div className="flex items-center">
                            <span className="text-green-400">{currentDir} {prompt}</span>
                            <span className="ml-1.5 inline-block w-1.5 h-4 bg-green-400 animate-pulse relative top-0.5"></span>
                        </div>
                    ) : log.text}
                </div>
            ))}
            {showInput && (
                <div className="flex items-center flex-nowrap">
                    <span className="text-green-400 whitespace-nowrap">{currentDir}</span>
                    <span className="text-green-400 whitespace-nowrap">{prompt}</span>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="terminal-input bg-transparent border-none outline-none ml-1.5 text-green-400 w-full relative min-w-0 flex-1"
                        autoFocus
                        spellCheck="false"
                    />
                </div>
            )}
        </div>
    );
};

export default Terminal;
