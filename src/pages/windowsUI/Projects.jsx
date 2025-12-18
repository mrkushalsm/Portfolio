import React, { useState } from "react";
import { projects } from "../../data/projectsData.js";

const Projects = () => {
    const [selectedProject, setSelectedProject] = useState(null);

    return (
        <div className="p-4 text-white">
            <div className="space-y-3">
                {projects.map((project, index) => (
                    <div
                        key={index}
                        className="p-3 bg-gray-800 rounded-lg shadow-md cursor-pointer hover:bg-gray-700"
                        onClick={() => setSelectedProject(project)}
                    >
                        <img src={project.image} alt={project.name} className="w-full h-40 object-cover rounded-lg mb-2" />
                        <h3 className="text-lg font-semibold">{project.name}</h3>
                        <p className="text-gray-300">{project.description}</p>
                    </div>
                ))}
            </div>

            {/* Project Details Popup */}
            {selectedProject && (
                <div className="fixed inset-0 flex items-center justify-center bg-zinc-700/70 z-50">
                    <div className="bg-gray-900 p-6 m-6 rounded-lg shadow-lg max-w-lg">
                        <h2 className="text-xl font-bold mb-2">{selectedProject.name}</h2>
                        <img src={selectedProject.image} alt={selectedProject.name} className="w-full h-48 object-cover rounded-lg my-3" />
                        <p className="text-gray-300 mb-4">{selectedProject.description}</p>
                        
                        <div className="flex gap-3 justify-end">
                            {selectedProject.github && (
                                <a 
                                    href={selectedProject.github} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
                                >
                                    GitHub
                                </a>
                            )}
                            {selectedProject.link && (
                                <a 
                                    href={selectedProject.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md transition-colors"
                                >
                                    Live Demo
                                </a>
                            )}
                            <button
                                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-md transition-colors"
                                onClick={() => setSelectedProject(null)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Projects;
