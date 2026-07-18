import React, { useState, useEffect } from "react";
import { skillsData } from "../../data/skillsData.js";

// Authentic WP Metro Colors for tiles
const TILE_COLORS = ["#008272", "#00a400", "#0078d7", "#744da9", "#d24726", "#00b4d8"];

const Skills = ({ setBackHandler }) => {
    const [selectedSkill, setSelectedSkill] = useState(null);

    useEffect(() => {
        if (setBackHandler) {
            setBackHandler(() => {
                if (selectedSkill) {
                    setSelectedSkill(null);
                    return true;
                }
                return false;
            });
        }
        return () => { if (setBackHandler) setBackHandler(null); };
    }, [selectedSkill, setBackHandler]);

    if (selectedSkill) {
        return (
            <div className="w-full h-full bg-black text-white flex flex-col font-sans select-none px-4 pt-2 pb-6 overflow-y-auto overflow-x-hidden">
                <h2 className="text-[32px] font-light leading-none tracking-tight mb-6 text-[#00b4d8] lowercase">{selectedSkill.name}</h2>
                <div className="flex justify-center items-center py-6 mb-4">
                    <img src={selectedSkill.icon} alt={selectedSkill.name} className="w-24 h-24 object-contain drop-shadow-md" />
                </div>
                
                <div className="flex flex-col gap-4">
                    <div>
                        <h4 className="text-[#00b4d8] text-sm uppercase tracking-wider mb-1">Proficiency</h4>
                        <p className="text-white/90 text-lg font-light leading-snug">{selectedSkill.proficiency}</p>
                    </div>
                    <div>
                        <h4 className="text-[#00b4d8] text-sm uppercase tracking-wider mb-1">Experience</h4>
                        <p className="text-white/90 text-lg font-light leading-snug">{selectedSkill.experience}</p>
                    </div>
                    <div>
                        <h4 className="text-[#00b4d8] text-sm uppercase tracking-wider mb-1">Overview</h4>
                        <p className="text-white/80 text-md font-light leading-snug">{selectedSkill.description}</p>
                    </div>
                    <div>
                        <h4 className="text-[#00b4d8] text-sm uppercase tracking-wider mb-1">Projects</h4>
                        <p className="text-white/80 text-md font-light leading-snug">{selectedSkill.projects.join(", ")}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full bg-black text-white p-4 font-sans select-none overflow-x-hidden overflow-y-auto pb-8">
            <h1 className="text-[54px] font-light leading-none tracking-tight mb-8 lowercase text-[#00b4d8] break-words" style={{ marginLeft: "-4px" }}>
                skills
            </h1>
            
            <div className="flex flex-col gap-8">
                {Object.entries(skillsData).map(([category, skills], catIndex) => (
                    <div key={category}>
                        <h3 className="text-2xl font-light text-white/90 mb-3 lowercase tracking-wide">{category}</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {skills.map((skill, index) => {
                                const bgColor = TILE_COLORS[(catIndex * skills.length + index) % TILE_COLORS.length];
                                return (
                                    <div
                                        key={skill.name}
                                        className="flex flex-col items-start justify-end p-3 cursor-pointer active:opacity-50 transition-opacity"
                                        style={{ backgroundColor: bgColor, height: "110px" }}
                                        onClick={() => setSelectedSkill(skill)}
                                    >
                                        <div className="mb-auto self-end">
                                            <img src={skill.icon} alt={skill.name} className="w-10 h-10 object-contain opacity-90" />
                                        </div>
                                        <span className="text-sm font-semibold tracking-wide text-white drop-shadow-sm">{skill.name}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Skills;
