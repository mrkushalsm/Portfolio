import React, { useState } from 'react';
import { skillsData } from '../../data/skillsData';

const Obsidian = () => {
    const [activeCategory, setActiveCategory] = useState("All");

    const categories = ["All", ...Object.keys(skillsData)];

    return (
        <div className="flex h-full bg-[#1e1e1e] text-[#dcddde] font-sans selection:bg-[#4d4d68] selection:text-white">
            {/* Sidebar (File Explorer style) */}
            <div className="w-48 bg-[#202020] flex flex-col border-r border-[#111]">
                <div className="p-4 flex items-center gap-2 border-b border-[#111] opacity-70">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-2">
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 px-2 mt-2">Vault</div>
                    {categories.map(cat => (
                        <div 
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-3 py-1.5 rounded cursor-pointer text-sm mb-1 flex items-center gap-2 transition-colors
                            ${activeCategory === cat ? 'bg-[#373c47] text-white' : 'hover:bg-[#2a2d33] text-gray-400'}`}
                        >
                            <span className="opacity-60 text-xs">#</span> {cat}
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Editor Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Tab Bar simulation */}
                <div className="h-9 bg-[#1e1e1e] border-b border-[#111] flex items-end px-2">
                    <div className="px-4 py-1.5 bg-[#2d2d2d] rounded-t text-sm border-t border-x border-[#111] text-gray-300 flex items-center gap-2">
                        <span className="text-purple-400">#</span> Skills.md <span className="text-xs opacity-50 ml-2">x</span>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 max-w-4xl mx-auto w-full">
                    <h1 className="text-4xl font-bold mb-8 pb-4 border-b border-[#333] text-purple-400">
                        {activeCategory === "All" ? "Skills Overview" : activeCategory}
                    </h1>

                    <div className="space-y-8">
                        {Object.entries(skillsData).map(([category, skills]) => {
                            if (activeCategory !== "All" && activeCategory !== category) return null;

                            return (
                                <div key={category} className="animate-fade-in-up">
                                    {activeCategory === "All" && (
                                        <h2 className="text-2xl font-semibold mb-4 text-purple-300 flex items-center gap-2">
                                            <span className="opacity-50">##</span> {category}
                                        </h2>
                                    )}
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {skills.map((skill, idx) => (
                                            <div 
                                                key={idx} 
                                                className="bg-[#262626] p-4 rounded-lg border border-[#303030] hover:border-purple-500/50 transition-all group hover:bg-[#2a2a2a] flex items-center gap-4"
                                            >
                                                {/* Icon */}
                                                <div className="w-12 h-12 flex-shrink-0 bg-[#1a1a1a] rounded p-2 flex items-center justify-center border border-[#333]">
                                                    <img src={skill.icon} alt={skill.name} className="w-full h-full object-contain opacity-90 group-hover:opacity-100 transition-opacity" />
                                                </div>
                                                
                                                {/* Info */}
                                                <div>
                                                    <h3 className="font-bold text-gray-200 group-hover:text-purple-400 transition-colors">{skill.name}</h3>
                                                    <div className="text-xs text-gray-500 mt-1 flex flex-wrap gap-2">
                                                        <span className="bg-[#111] px-1.5 py-0.5 rounded text-gray-400 border border-[#333]">{skill.proficiency}</span>
                                                        <span className="bg-[#111] px-1.5 py-0.5 rounded text-gray-400 border border-[#333]">{skill.experience}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Obsidian;
