import React, { useState, useEffect } from "react";
const profilePic = "/assets/profile.jpeg";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

import { educationData } from "../../data/educationData";
import { experienceData } from "../../data/experienceData";

const AboutMe = ({ setBackHandler }) => {
    const isMobile = Boolean(setBackHandler);
    const [activeTab, setActiveTab] = useState("profile"); // 'profile', 'education', 'experience'

    useEffect(() => {
        if (isMobile && setBackHandler) {
            setBackHandler(() => false);
        }
        return () => { if (isMobile && setBackHandler) setBackHandler(null); };
    }, [isMobile, setBackHandler]);

    if (isMobile) {
        return (
            <div className="w-full h-full bg-black text-white p-4 font-sans select-none overflow-x-hidden overflow-y-auto pb-8">
                <h1 className="text-[54px] font-light leading-none tracking-tight mb-8 lowercase text-[#0078d7] break-words" style={{ marginLeft: "-4px" }}>
                    about me
                </h1>

                {/* Profile section */}
                <div className="flex flex-col gap-6 mb-12">
                    <img src={profilePic} alt="Profile" className="w-full h-64 object-cover opacity-90" />
                    <div>
                        <h2 className="text-4xl font-normal tracking-wide">Kushal S. M.</h2>
                        <p className="text-[#0078d7] text-xl mt-1 lowercase">Frontend Developer</p>
                    </div>
                    <p className="text-white/80 text-lg font-light leading-snug">
                        Passionate about creating beautiful, user-friendly interfaces.
                        Skilled in React, Tailwind CSS, and modern web technologies.
                        Always eager to learn and build something new!
                    </p>
                    <div className="flex gap-4 mt-2">
                        <a href="https://github.com/mrkushalsm" target="_blank" rel="noopener noreferrer" className="p-3 bg-[#252525] text-white active:bg-white active:text-black transition-colors">
                            <FaGithub className="text-2xl" />
                        </a>
                        <a href="https://www.linkedin.com/in/mrkushalsm/" target="_blank" rel="noopener noreferrer" className="p-3 bg-[#0078d7] text-white active:bg-white active:text-[#0078d7] transition-colors">
                            <FaLinkedin className="text-2xl" />
                        </a>
                        <a href="https://x.com/mrkushalsm" target="_blank" rel="noopener noreferrer" className="p-3 bg-white text-black active:bg-black active:text-white transition-colors border border-white">
                            <FaXTwitter className="text-2xl" />
                        </a>
                    </div>
                </div>

                {/* Education section */}
                <h2 className="text-[32px] font-light tracking-tight mb-6 lowercase text-[#0078d7]">education</h2>
                <div className="flex flex-col mb-12 relative pl-6 border-l-2 border-[#0078d7]/30">
                    {educationData.map((item, index) => (
                        <div key={index} className="relative pb-8 last:pb-0">
                            {/* Timeline Node */}
                            <div className="absolute -left-[31px] top-1.5 w-3 h-3 bg-black border-2 border-[#0078d7]"></div>
                            
                            <div className="flex flex-col gap-1">
                                <p className="text-[#0078d7] text-sm font-semibold tracking-wider uppercase">{item.period}</p>
                                <h3 className="text-2xl font-normal tracking-wide">{item.title}</h3>
                                <p className="text-white/60 text-md">{item.badge}</p>
                                <p className="text-white/80 text-md font-light leading-snug mt-2">{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Experience section */}
                <h2 className="text-[32px] font-light tracking-tight mb-6 lowercase text-[#0078d7]">experience</h2>
                <div className="flex flex-col relative pl-6 border-l-2 border-[#0078d7]/30">
                    {experienceData.map((item, index) => (
                        <div key={index} className="relative pb-8 last:pb-0">
                            {/* Timeline Node */}
                            <div className="absolute -left-[31px] top-1.5 w-3 h-3 bg-black border-2 border-[#0078d7]"></div>
                            
                            <div className="flex flex-col gap-1">
                                <p className="text-[#0078d7] text-sm font-semibold tracking-wider uppercase">{item.period}</p>
                                <h3 className="text-2xl font-normal tracking-wide">{item.title}</h3>
                                <p className="text-white/60 text-md">{item.organization} - {item.type}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-gray-50">
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200 bg-white sticky top-0 z-10">
                {["profile", "education", "experience"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-3 text-sm font-medium capitalize transition-colors cursor-pointer
                            ${activeTab === tab 
                                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50" 
                                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                
                {/* Profile Tab */}
                {activeTab === "profile" && (
                    <div className="flex flex-col items-center text-center animate-fadeIn">
                        <img src={profilePic} alt="Profile" className="w-40 h-40 object-cover rounded-full mb-4 border-4 border-white shadow-lg" />
                        
                        <h2 className="text-xl font-bold text-gray-800">Kushal S. M.</h2>
                        <p className="text-sm font-medium text-blue-600 mb-4">Frontend Developer | UI Enthusiast</p>
                        
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 w-full max-w-sm">
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Passionate about creating beautiful, user-friendly interfaces.
                                Skilled in React, Tailwind CSS, and modern web technologies.
                                Always eager to learn and build something new!
                            </p>
                        </div>

                        <div className="flex gap-4 mt-6">
                            <a href="https://github.com/mrkushalsm" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 hover:-translate-y-1 transition-all shadow-md">
                                <FaGithub className="text-xl" />
                            </a>
                            <a href="https://www.linkedin.com/in/mrkushalsm/" target="_blank" rel="noopener noreferrer" className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-500 hover:-translate-y-1 transition-all shadow-md">
                                <FaLinkedin className="text-xl" />
                            </a>
                            <a href="https://x.com/mrkushalsm" target="_blank" rel="noopener noreferrer" className="p-2 bg-black text-white rounded-full hover:bg-gray-900 hover:-translate-y-1 transition-all shadow-md">
                                <FaXTwitter className="text-xl" />
                            </a>
                        </div>
                    </div>
                )}

                {/* Education Tab */}
                {activeTab === "education" && (
                    <div className="space-y-6 px-2 animate-fadeIn">
                        {educationData.map((item, index) => (
                            <div key={index} className="relative pl-8 border-l-2 border-blue-200 last:border-l-0 pb-6 last:pb-0">
                                {/* Timeline Dot */}
                                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-500 border-4 border-white shadow-sm ring-1 ring-blue-100"></div>
                                
                                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start gap-4">
                                        <div>
                                            <span className="inline-block px-2 py-1 mb-2 text-xs font-semibold text-blue-600 bg-blue-50 rounded-full">
                                                {item.period}
                                            </span>
                                            <h3 className="text-lg font-bold text-gray-800">{item.title}</h3>
                                            <p className="text-sm font-medium text-gray-500 mb-2">{item.badge}</p>
                                            <p className="text-sm text-gray-600">{item.description}</p>
                                        </div>
                                        {item.image && (
                                            <img src={item.image} alt={item.title} className="w-32 h-20 object-contain rounded-md bg-gray-50 p-1 shrink-0" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Experience Tab */}
                {activeTab === "experience" && (
                    <div className="space-y-6 px-2 animate-fadeIn">
                        {experienceData.map((item, index) => (
                            <div key={index} className="relative pl-8 border-l-2 border-purple-200 last:border-l-0 pb-6 last:pb-0">
                                {/* Timeline Dot */}
                                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-purple-500 border-4 border-white shadow-sm ring-1 ring-purple-100"></div>
                                
                                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <span className="inline-block px-2 py-1 mb-2 text-xs font-semibold text-purple-600 bg-purple-50 rounded-full">
                                                {item.period}
                                            </span>
                                            <h3 className="text-lg font-bold text-gray-800">{item.title}</h3>
                                            <p className="text-sm font-medium text-gray-500">{item.organization}</p>
                                            <p className="text-xs text-gray-400 mt-1">{item.type}</p>
                                        </div>
                                        {item.image && (
                                            <img src={item.image} alt={item.title} className="w-20 h-20 object-contain rounded-full bg-white shadow-sm border border-gray-100 p-1" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AboutMe;
