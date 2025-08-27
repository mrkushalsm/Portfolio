"use client";
import React, { useState } from "react";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";
import { projects } from "@/data/projectsData";
import Image from "next/image";
import { FaGithub, FaExternalLinkAlt, FaArrowLeft } from "react-icons/fa";
import { Lens } from "@/components/ui/lens";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { useRouter } from "next/navigation";

export default function Projects() {
  const [hovering, setHovering] = useState(false);
  const router = useRouter();

  const handleBackClick = () => {
    router.back();
  };

  const content = projects.map((project, index) => ({
    title: project.name,
    description: project.description,
    content: (
      <div className="flex h-full w-full flex-col items-center justify-center text-white p-6">
        <div className="flex-1 flex items-center justify-center mb-4">
          {project.image ? (
            <Lens hovering={hovering} setHovering={setHovering}>
              <Image
                src={project.image}
                width={600}
                height={300}
                className="h-full w-full object-cover rounded-md"
                alt={project.name}
              />
            </Lens>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-700 to-slate-900 rounded-md">
              <div className="text-center p-4">
                <h3 className="text-xl font-bold mb-2">{project.name}</h3>
                <p className="text-slate-300 text-sm">Coming Soon</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Buttons */}
        <div className="flex gap-4 mt-4">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200"
            >
              <FaGithub className="text-lg" />
              <span>GitHub</span>
            </a>
          )}
          
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors duration-200"
            >
              <FaExternalLinkAlt className="text-sm" />
              <span>Live Demo</span>
            </a>
          )}
        </div>
      </div>
    ),
  }));

  return (
    <div className="flex flex-col justify-center w-full">
      {/* Back Button */}
      <div className="fixed top-6 left-6 z-50">
        <HoverBorderGradient
          containerClassName="rounded-full"
          as="button"
          onClick={handleBackClick}
          className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2 px-6 py-3"
        >
          <FaArrowLeft className="text-sm" />
          <span>Back</span>
        </HoverBorderGradient>
      </div>
      
      <StickyScroll content={content} />
    </div>
  );
}
