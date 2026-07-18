import React, { useState, useEffect } from "react";
import { projects } from "../../data/projectsData.js";

const Projects = ({ setBackHandler }) => {
    const [selectedProject, setSelectedProject] = useState(null);

    useEffect(() => {
        if (setBackHandler) {
            setBackHandler(() => {
                if (selectedProject) {
                    setSelectedProject(null);
                    return true;
                }
                return false;
            });
        }
        return () => { if (setBackHandler) setBackHandler(null); };
    }, [selectedProject, setBackHandler]);

    if (selectedProject) {
        return (
            <div className="w-full h-full bg-black text-white flex flex-col font-sans select-none px-4 pt-2 pb-6 overflow-y-auto overflow-x-hidden">
                <h2 className="text-[32px] font-light leading-none tracking-tight mb-4 text-[#008272] lowercase">{selectedProject.name}</h2>
                <img src={selectedProject.image} alt={selectedProject.name} className="w-full object-contain mb-4 opacity-90" />
                
                <p className="text-white/80 text-lg font-normal mb-8 leading-snug">{selectedProject.description}</p>
                
                <div className="flex flex-col gap-3 mt-auto">
                    {selectedProject.github && (
                        <a 
                            href={selectedProject.github} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-full py-3 text-center border-2 border-white text-white font-semibold uppercase tracking-widest active:bg-white active:text-black transition-colors"
                        >
                            github repo
                        </a>
                    )}
                    {selectedProject.link && (
                        <a 
                            href={selectedProject.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-full py-3 text-center border-2 border-[#008272] text-[#008272] font-semibold uppercase tracking-widest active:bg-[#008272] active:text-white transition-colors"
                        >
                            live demo
                        </a>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full bg-black text-white p-4 font-sans select-none overflow-x-hidden">
            <h1 className="text-[54px] font-light leading-none tracking-tight mb-8 lowercase text-[#008272] break-words" style={{ marginLeft: "-4px" }}>
                projects
            </h1>
            
            <div className="flex flex-col gap-6 pb-6">
                {projects.map((project, index) => (
                    <div
                        key={index}
                        className="cursor-pointer active:opacity-50 transition-opacity"
                        onClick={() => setSelectedProject(project)}
                    >
                        <img src={project.image} alt={project.name} className="w-full h-40 object-cover opacity-90 mb-2" />
                        <h3 className="text-2xl font-normal leading-tight tracking-wide">{project.name}</h3>
                        <p className="text-white/60 text-sm mt-1 truncate">{project.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Projects;
