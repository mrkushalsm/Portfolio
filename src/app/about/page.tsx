"use client";
import { CometCardMain } from "@/components/ui/comet-card-main";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";
import { MaskContainer } from "@/components/ui/svg-mask-effect";
import { TextEffect } from "@/components/ui/text-effect";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { Education } from "@/pages/portfolio/education";
import { useInView } from "@/hooks/useInView";
import React from "react";
import { ExperienceTimeline } from "@/pages/portfolio/experience";

const quote = "Talk is cheap. Show me the code!\n\nwow";
const author = "Linus Torvalds,";
const aboutAuthor = "creator of Linux."

export default function About() {
    const { ref: textEffectRef, isInView: textEffectInView } = useInView({
        threshold: 0.5,
        triggerOnce: true,
    });

    return (
        <div className="h-full rounded-md bg-neutral-900 flex flex-col items-center justify-center relative w-full pb-200">
            <StarsBackground className="absolute inset-0 z-0" />
            <ShootingStars className="absolute inset-0 z-10" />
            <div className="h-screen flex flex-col items-center justify-center relative z-20">
                <CometCardMain src="/assets/profile.jpeg" name="Kushal SM" text="#DEV"/>
                <p className="text-3xl md:text-7xl text-white font-bold inter-var text-center">
                    About Me
                </p>
            </div>
            <div className="h-screen flex flex-col items-center justify-center w-full relative z-20" ref={textEffectRef}>
                {/* <TextGenerateEffect words={quote} />
                <TextGenerateEffect words={author} />
                <TextGenerateEffect words={aboutAuthor} /> */}
                <MaskContainer
                    revealText={
                            <span className="mx-auto max-w-4xl text-center text-4xl md:text-5xl font-bold text-slate-800 dark:text-white">
                                <TextEffect trigger={textEffectInView}>
                                    Talk is cheap. Show me the code!
                                </TextEffect>
                            </span>
                    }
                    className="text-white dark:text-black z-15"
                >
                    -{" "}
                    <span className="text-blue-500">Linus Trovalds</span>
                    <br />
                    <span>creator of </span>
                    <span className="text-blue-500">Linux and Git</span>.
                </MaskContainer>
            </div>
            <div>
                <p className="text-3xl md:text-7xl text-white font-bold inter-var text-center">
                    Education
                </p>
                <Education />
            </div>
            <div className="mt-20">
                <p className="text-3xl md:text-7xl text-white font-bold inter-var text-center">
                    Experience
                </p>
                <ExperienceTimeline />
            </div>
        </div>
    );
}
