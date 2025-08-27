import React, { useState } from "react";
import Image from "next/image"
import projectsData from "@/data/projectsData";
import { IconBrandGithub, IconExternalLink } from "@tabler/icons-react";

type Project = {
    name: string;
    description: string;
    image: any;
    link: string;
    github: string;
};

const Projects = () => {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    const projects = projectsData;

    return (
        <div className="p-4 text-white">
            <div className="space-y-3">
                {projects.map((project, index) => (
                    <div
                        key={index}
                        className="p-3 bg-gray-800 rounded-lg shadow-md cursor-pointer hover:bg-gray-700"
                        onClick={() => setSelectedProject(project)}
                    >
                        <div className="relative w-full h-40 object-cover rounded-lg mb-2">
                            <Image src={project.image} alt={project.name} fill={true} />
                        </div>
                        <h3 className="text-lg font-semibold">{project.name}</h3>
                        <p className="text-gray-300">{project.description}</p>
                    </div>
                ))}
            </div>

            {/* Project Details Popup */}
            {selectedProject && (
                <div className="fixed inset-0 flex items-center justify-center bg-zinc-700/70">
                    <div className="bg-gray-900 p-6 m-6 rounded-lg shadow-lg max-w-lg">
                        <h2 className="text-xl font-bold">{selectedProject.name}</h2>
                        <div className="relative w-full h-40 object-cover rounded-lg mb-2">
                            <Image src={selectedProject.image} alt={selectedProject.name} fill={true} className="w-full h-48 object-cover rounded-lg my-3" />
                        </div>
                        <p className="mt-4 text-gray-300">{selectedProject.description}</p>
                        <div className="flex gap-2 mt-4">
                            {selectedProject.link && (
                                <button
                                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-md cursor-pointer flex items-center gap-1.5"
                                    onClick={() => window.open(selectedProject.link, '_blank')}
                                >
                                    <IconExternalLink size={16} />
                                    Live Demo
                                </button>
                            )}
                            {selectedProject.github && (
                                <button
                                    className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-md cursor-pointer flex items-center gap-1.5"
                                    onClick={() => window.open(selectedProject.github, '_blank')}
                                >
                                    <IconBrandGithub size={16} />
                                    GitHub
                                </button>
                            )}
                            <button
                                className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-sm rounded-md cursor-pointer"
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
