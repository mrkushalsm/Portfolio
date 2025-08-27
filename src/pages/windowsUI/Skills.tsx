import React, { useState } from "react";
import { skillsData } from "@/data/skillsData.js";
import Image from "next/image";

const Skills = () => {
    const [selectedSkill, setSelectedSkill] = useState(null);

    return (
        <div>
            <div className="grid grid-cols-2 gap-4 p-4">
                {Object.entries(skillsData).map(([category, skills]) => (
                    <div key={category}>
                        <h3 className="font-bold text-gray-800 mb-2">{category}</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {skills.map((skill) => (
                                <button
                                    key={skill.name}
                                    className="flex flex-col items-center p-2 bg-gray-100 rounded-md hover:bg-gray-200"
                                    onClick={() => setSelectedSkill(skill)}
                                >
                                    <Image src={skill.icon} alt={skill.name} width={24} height={24} className="mb-1" />
                                    <span className="text-sm">{skill.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Skill Modal */}
            {selectedSkill && (
                <div className="fixed inset-0 bg-zinc-700/70 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg w-80">
                        <h2 className="text-lg font-bold">{selectedSkill.name}</h2>
                        <Image src={selectedSkill.icon} alt={selectedSkill.name} width={64} height={64} className="mx-auto m-5" />
                        <p><strong>Proficiency:</strong> {selectedSkill.proficiency}</p>
                        <p><strong>Experience:</strong> {selectedSkill.experience}</p>
                        <p className="mt-2">{selectedSkill.description}</p>
                        {selectedSkill?.projects && selectedSkill?.projects.length > 0 && (
                            <p><strong>Projects Used In:</strong> {selectedSkill?.projects.join(", ")}</p>
                        )}
                        <button onClick={() => setSelectedSkill(null)} className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md cursor-pointer">Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Skills;
