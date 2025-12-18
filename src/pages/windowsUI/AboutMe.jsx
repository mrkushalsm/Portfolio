import React from "react";
const profilePic = "/assets/profile.jpeg";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import {FaXTwitter} from "react-icons/fa6";

const AboutMe = () => {
    return (
        <div className="flex flex-col items-center text-center p-4">
            {/* Profile Image */}
            <img src={profilePic} alt="Profile" className="w-46 h-58 rounded-full mb-2 border-4 border-gray-300 shadow-lg" />

            {/* Name & Profession */}
            <h2 className="text-lg font-semibold">Kushal S. M.</h2>
            <p className="text-sm text-gray-600">Frontend Developer | UI Enthusiast</p>

            {/* Short Bio */}
            <p className="mt-2 text-xs text-gray-500">
                Passionate about creating beautiful, user-friendly interfaces.
                Skilled in React, Tailwind CSS, and modern web technologies.
            </p>

            {/* Social Links */}
            <div className="flex gap-4 mt-3">
                <a href="https://github.com/mrkushalsm" target="_blank" rel="noopener noreferrer">
                    <FaGithub className="text-xl hover:text-gray-900" />
                </a>
                <a href="https://www.linkedin.com/in/mrkushalsm/" target="_blank" rel="noopener noreferrer">
                    <FaLinkedin className="text-xl hover:text-blue-600" />
                </a>
                <a href="https://x.com/kspiderman69" target="_blank" rel="noopener noreferrer">
                    <FaXTwitter className="text-xl hover:text-blue-400" />
                </a>
            </div>
        </div>
    );
};

export default AboutMe;
