"use client";
import React from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import Desktop from "@/pages/windowsUI/Desktop";

export default function About() {
    return (
        <div className="flex flex-col overflow-hidden">
            <ContainerScroll
                titleComponent={
                    <>
                        <h1 className="text-4xl font-semibold text-black dark:text-white">
                            Unleash the power of <br />
                            <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                Scroll Animations
              </span>
                        </h1>
                    </>
                }
            >
                <Desktop />
            </ContainerScroll>
        </div>
    );
}
