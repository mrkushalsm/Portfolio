import {CanvasRevealEffect} from "@/components/ui/canvas-reveal-effect";
import React from "react";
import {AnimatePresence, motion} from "motion/react";
import Image from "next/image";
import Link from "next/link";

export const Navigation = ( {windowWidth}: {windowWidth: number} ) => {
    return (
            <div className="h-screen py-20 grid grid-cols-1 lg:grid-row-2 lg:grid-cols-6 w-full mx-auto px-8">
                <Card title="About Me" icon="/icons/about-me.svg" route="/about">
                    <CanvasRevealEffect
                        animationSpeed={5.1}
                        containerClassName="bg-darkgreen-500"
                        colors={[[31, 166, 131]]}
                    />
                </Card>
                { windowWidth > 431 && <Arrow arrow="/icons/arrow-sub-up-right.svg" /> }
                <Card title="Skills" icon="/icons/skills.svg" route="/skills">
                    <CanvasRevealEffect
                        animationSpeed={3}
                        containerClassName="bg-goldensilk-500"
                        colors={[[246, 223, 169]]}
                    />
                </Card>
                { windowWidth > 431 && <Arrow arrow="/icons/arrow-sub-up-right.svg" /> }
                <Card title="Projects" icon="/icons/projects.svg" route="/projects">
                    <CanvasRevealEffect
                        animationSpeed={3}
                        containerClassName="bg-sky-600"
                        colors={[[125, 211, 252]]}
                    />
                </Card>
                { windowWidth > 431 && <Arrow arrow=""/> }
                { windowWidth > 431 && <Arrow arrow="/icons/arrow-sub-down-right.svg" /> }
                <Card title="Certificates" icon="/icons/certificates.svg" route="/certificates">
                    <CanvasRevealEffect
                        animationSpeed={5.1}
                        containerClassName="bg-darkpurple-500"
                        colors={[[191, 120, 208]]}
                    />
                </Card>
                { windowWidth > 431 && <Arrow arrow="/icons/arrow-sub-down-right.svg" /> }
                <Card title="Resume" icon="/icons/resume.svg" route="/resume">
                    <CanvasRevealEffect
                        animationSpeed={5.1}
                        containerClassName="bg-bloodred-500"
                        colors={[[255, 0, 0]]}
                    />
                </Card>
                { windowWidth > 431 && <Arrow arrow="/icons/arrow-sub-down-right.svg" /> }
                <Card title="Blogs" icon="/icons/blogs.svg" route="/blogs">
                    <CanvasRevealEffect
                        animationSpeed={5.1}
                        containerClassName="bg-yellowlight-500"
                        colors={[[239, 156, 7]]}
                    />
                </Card>
            </div>
    )
}

const Arrow = ({
                  arrow
              }: {
    arrow: string;
}) => {
    return (
        <div
            className={"flex items-center justify-center w-[80%] lg:w-full mx-auto p-4 relative h-[25rem] lg:h-[30rem]"}
        >
            <div className="relative z-20">
                <div className="dark:text-white text-xl relative z-10 text-black mt-4  font-bold">
                    { arrow ? <Image priority={true} src={arrow} alt={arrow} width="64" height="64" /> : <div /> }
                </div>
            </div>
        </div>
    );
};

const Card = ({
                  title,
                  icon,
                  children,
                  showBorder = true,
                  route
              }: {
    title?: string;
    icon: string;
    children?: React.ReactNode;
    showBorder?: boolean;
    showIcon?: boolean;
    route?: string;
}) => {
    const [hovered, setHovered] = React.useState(false);
    return (
        <Link href={route || "/"}>
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className={`${showBorder ? "border border-black/[0.2]" : ""} group/canvas-card flex items-center justify-center ${showBorder ? "dark:border-white/[0.2]" : ""} w-[80%] lg:w-full mx-auto p-4 relative h-[25rem] lg:h-[30rem]`}
        >
            { showBorder && <Icon className="absolute h-6 w-6 -top-3 -left-3 dark:text-white text-black" /> }
            { showBorder && <Icon className="absolute h-6 w-6 -bottom-3 -left-3 dark:text-white text-black" /> }
            { showBorder && <Icon className="absolute h-6 w-6 -top-3 -right-3 dark:text-white text-black" /> }
            { showBorder && <Icon className="absolute h-6 w-6 -bottom-3 -right-3 dark:text-white text-black" /> }

            <AnimatePresence>
                {hovered && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="h-full w-full absolute inset-0"
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="relative z-20">
                <div className="text-center group-hover/canvas-card:-translate-y-4 group-hover/canvas-card:opacity-0 transition duration-200 w-full  mx-auto flex items-center justify-center">
                    <Image priority={true} src={icon} alt={icon} width="64" height="64" />
                </div>
                <h2 className="dark:text-white text-xl opacity-0 group-hover/canvas-card:opacity-100 relative z-10 text-black mt-4  font-bold group-hover/canvas-card:text-white group-hover/canvas-card:-translate-y-2 transition duration-200">
                    {title}
                </h2>
            </div>
        </div>
        </Link>
    );
};


export const Icon = ({ className, ...rest }: any) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className={className}
            {...rest}
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
        </svg>
    );
};