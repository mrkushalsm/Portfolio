"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const TerminalLine = ({ text, type, delay = 0, showCursor = false, onTypingComplete }) => {
    const [displayText, setDisplayText] = useState("");
    const [isTyping, setIsTyping] = useState(true);
    const isCommand = type === 'command';

    useEffect(() => {
        if (!text) return;
        
        let currentIndex = 0;
        const typingSpeed = 30; // ms per character
        
        const typeChar = () => {
            if (currentIndex < text.length) {
                setDisplayText(text.substring(0, currentIndex + 1));
                currentIndex++;
                setTimeout(typeChar, typingSpeed);
            } else {
                setIsTyping(false);
                if (onTypingComplete) onTypingComplete();
            }
        };

        const timer = setTimeout(() => {
            typeChar();
        }, delay);

        return () => clearTimeout(timer);
    }, [text, delay, onTypingComplete]);

    return (
        <div className={`mb-1 ${isCommand ? 'text-green-400' : 'text-gray-300'}`}>
            {isCommand && <span className="text-green-400">$ </span>}
            {displayText}
            {showCursor && isTyping && (
                <span className="inline-block w-2 h-5 bg-green-400 ml-1 animate-pulse"></span>
            )}
        </div>
    );
};

const PortfolioLoader = () => {
    const router = useRouter();
    const [progress, setProgress] = useState(0);
    const [lines, setLines] = useState([]);
    const containerRef = useRef(null);

    const loadingMessages = [
        { text: "Initializing portfolio...", command: "init" },
        { text: "Loading core assets...", command: "load_core" },
        { text: "Preparing environment...", command: "prepare_env" },
        { text: "Loading components...", command: "load_components" },
        { text: "Initializing UI...", command: "init_ui" },
        { text: "Ready", command: "ready" },
    ];

    // Simulate command execution
    const executeCommand = async (message, index) => {
        // Add command with cursor
        const commandId = `cmd-${Date.now()}-${index}`;
        
        // Add the command line first
        setLines(prev => [
            ...prev, 
            { 
                text: message.command, 
                type: 'command', 
                id: commandId,
                showCursor: true
            }
        ]);
        
        // Wait for command to finish typing
        await new Promise(resolve => {
            setTimeout(() => {
                // Update command to remove cursor
                setLines(prev => prev.map(line => 
                    line.id === commandId 
                        ? { ...line, showCursor: false } 
                        : line
                ));
                resolve();
            }, message.command.length * 30 + 200);
        });
        
        // Add output after a short delay
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Add the output line
        const outputId = `out-${Date.now()}-${index}`;
        setLines(prev => [
            ...prev,
            { 
                text: message.text, 
                type: 'output', 
                id: outputId,
                showCursor: false
            }
        ]);
        
        // Update progress
        const newProgress = Math.min(100, ((index + 1) / loadingMessages.length) * 100);
        setProgress(parseFloat(newProgress.toFixed(2)));
        
        // Add a small delay before next command
        await new Promise(resolve => setTimeout(resolve, 300));
    };

    useEffect(() => {
        let mounted = true;
        let timeoutId;

        const loadSequence = async () => {
            // Initial delay
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Execute commands in sequence
            for (let i = 0; i < loadingMessages.length; i++) {
                if (!mounted) return;
                await executeCommand(loadingMessages[i], i);
                
                // Add delay between commands
                await new Promise(resolve => setTimeout(resolve, 200));
            }
            
            // Navigate when done
            if (mounted) {
                timeoutId = setTimeout(() => {
                    if (mounted) router.push("/portfolio");
                }, 1000);
            }
        };

        loadSequence();

        // Auto-navigate after 8 seconds regardless of progress
        const safetyTimeout = setTimeout(() => {
            if (mounted) router.push("/portfolio");
        }, 8000);

        return () => {
            mounted = false;
            clearTimeout(timeoutId);
            clearTimeout(safetyTimeout);
        };
    }, [router]);

    return (
        <div 
            className="h-screen w-full bg-black text-green-400 font-mono relative"
            style={{
                background: 'rgba(0, 0, 0, 0.95)',
                backgroundImage: 'linear-gradient(rgba(0, 255, 0, 0.03) 1px, transparent 1px)',
                backgroundSize: '100% 24px',
            }}
        >
            <div className="h-full p-4 sm:p-8 pb-20 overflow-y-auto" ref={containerRef}>
                <div className="min-h-full flex flex-col">
                    <div className="mb-4">
                        {lines.map((line, index) => (
                            <TerminalLine 
                                key={line.id || index}
                                text={line.text}
                                type={line.type}
                                delay={0}
                                showCursor={line.showCursor}
                                onTypingComplete={line.onTypingComplete}
                            />
                        ))}
                    </div>
                    <div className="flex-1" />
                </div>
            </div>

            {/* Fixed progress bar at bottom */}
            <div className="fixed bottom-0 left-0 right-0 p-4 sm:p-8 bg-black bg-opacity-95">
                <div className="h-1 w-full bg-gray-800 rounded overflow-hidden">
                    <div 
                        className="h-full bg-green-500 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <div className="text-right text-xs text-gray-500 mt-1">
                    {progress}% loaded
                </div>
            </div>
        </div>
    );
};

export default PortfolioLoader;
