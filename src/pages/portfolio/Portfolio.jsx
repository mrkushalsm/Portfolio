"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "animate.css";
import HeroAnimation from "../../components/portfolio/HeroAnimation.jsx";
import AboutMe from "../portfolio/AboutMe.jsx";
import AboutMeMobile from "../portfolio/AboutMeMobile.jsx";
import Skills from "../portfolio/Skills.jsx";
import SkillsCarousel from "../portfolio/SkillsCarousel.jsx";
import Projects from "../portfolio/Projects.jsx";
import Certificates from "../portfolio/Certificates.jsx";
import Resume from "../portfolio/Resume.jsx";
import Blogs from "../portfolio/Blogs.jsx";
import Sidebar from "../../components/portfolio/Sidebar.jsx";
import Background from "../../components/portfolio/Background.jsx";
import Footer from "../portfolio/Footer.jsx";

// Skills wrapper component to handle toggling
const SkillsSection = () => {
    // Initialize based on mobile view (<640px)
    const [showSkillsCarousel, setShowSkillsCarousel] = useState(() => {
        return window.matchMedia("(max-width: 639px)").matches;
    });

    // Update state on window resize
    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 639px)");
        const handleResize = () => {
            setShowSkillsCarousel(mediaQuery.matches);
        };

        mediaQuery.addEventListener("change", handleResize);
        return () => mediaQuery.removeEventListener("change", handleResize);
    }, []);

    const handleToggleView = () => {
        setShowSkillsCarousel(!showSkillsCarousel);
    };

    return (
        <AnimatePresence mode="wait">
            {showSkillsCarousel ? (
                <motion.div
                    key="carousel"
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.5 }}
                >
                    <SkillsCarousel onToggleView={handleToggleView} />
                </motion.div>
            ) : (
                <motion.div
                    key="circle"
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    transition={{ duration: 0.5 }}
                >
                    <Skills onToggleView={handleToggleView} />
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// AboutMe wrapper component to handle responsive rendering
const AboutMeSection = () => {
    // Initialize based on mobile view (<640px)
    const [isMobile, setIsMobile] = useState(() => {
        return window.matchMedia("(max-width: 639px)").matches;
    });

    // Update state on window resize
    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 639px)");
        const handleResize = () => {
            setIsMobile(mediaQuery.matches);
        };

        mediaQuery.addEventListener("change", handleResize);
        return () => mediaQuery.removeEventListener("change", handleResize);
    }, []);

    return (
        <AnimatePresence mode="wait">
            {isMobile ? (
                <motion.div
                    key="mobile"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <AboutMeMobile />
                </motion.div>
            ) : (
                <motion.div
                    key="desktop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <AboutMe />
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const Portfolio = () => {
    const sectionsRef = useRef([]);
    const [isSidebarVisible, setSidebarVisible] = useState(false);

    const sectionsData = [
        { id: "AboutMe", title: "About Me", content: <AboutMeSection />, direction: null },
        {
            id: "Skills",
            title: "Skills",
            content: <SkillsSection />,
            direction: "right"
        },
        { id: "Projects", title: "Projects", content: <Projects />, direction: "left" },
        { id: "Certificates", title: "Certificates", content: <Certificates />, direction: "right" },
        { id: "Resume", title: "Resume", content: <Resume />, direction: "left" },
        { id: "Blogs", title: "Blogs", content: <Blogs />, direction: "right" },
    ];

    useEffect(() => {
        setTimeout(() => {
            window.scrollTo({
                top: 0,
                behavior: "instant",
            });
        }, 100);
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => setSidebarVisible(true), 1500);
        return () => clearTimeout(timeout);
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const { direction } = entry.target.dataset;
                        entry.target.classList.add(
                            "animate__animated",
                            direction === "right" ? "animate__fadeInRight" : "animate__fadeInLeft"
                        );
                        entry.target.classList.remove("opacity-0");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.3 }
        );

        sectionsRef.current.forEach((section) => {
            if (section) observer.observe(section);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <div className="relative min-h-screen overflow-x-hidden bg-base-200/50" data-theme="dark">
            {/* Background */}
            <div className="fixed inset-0 w-full h-full">
                <Background />
            </div>

            {/* Hero Section */}
            <HeroAnimation />

            {/* Sidebar */}
            {isSidebarVisible && <Sidebar sections={sectionsData} />}

            {/* Sections */}
            {sectionsData.map(({ id, content, direction }, index) => (
                <section
                    key={id}
                    id={id}
                    ref={(el) => (sectionsRef.current[index] = el)}
                    data-direction={direction}
                    className={`relative min-h-screen flex flex-col justify-center px-6 md:px-20 py-20 transition-all duration-700 ${
                        direction ? "opacity-100" : ""
                    }`}
                >
                    <div className="mt-4">{content}</div>
                </section>
            ))}

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default Portfolio;