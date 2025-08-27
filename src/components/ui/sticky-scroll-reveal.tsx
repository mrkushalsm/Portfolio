"use client";
import React, { useEffect, useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { getProjectGradient, getProjectColors } from "@/lib/colorExtractor";

export const StickyScroll = ({
  content,
  contentClassName,
}: {
  content: {
    title: string;
    description: string;
    content?: React.ReactNode | any;
  }[];
  contentClassName?: string;
}) => {
  const [activeCard, setActiveCard] = React.useState(0);
  const ref = useRef<any>(null);
  const { scrollYProgress } = useScroll({
    // uncomment line 22 and comment line 23 if you DONT want the overflow container and want to have it change on the entire page scroll
    target: ref,
    // container: ref,
    offset: ["start end", "end start"],
  });
  const cardLength = content.length;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // Calculate which card should be active based on scroll progress
    const progress = Math.max(0, Math.min(1, latest));
    const cardIndex = Math.floor(progress * cardLength);
    const clampedIndex = Math.min(cardIndex, cardLength - 1);
    
    setActiveCard(clampedIndex);
  });

  // Dynamic background colors based on project colors
  const getCurrentColors = () => {
    return getProjectColors(activeCard);
  };

  const [backgroundGradient, setBackgroundGradient] = useState(
    getProjectGradient(0),
  );

  useEffect(() => {
    setBackgroundGradient(getProjectGradient(activeCard));
  }, [activeCard]);

  return (
    <motion.div
      animate={{
        backgroundColor: getCurrentColors().primary,
      }}
      className="min-h-screen flex items-center justify-center transition-colors duration-500"
      style={{ background: backgroundGradient }}
    >
      <div
        className="relative flex h-auto justify-center items-start space-x-10 rounded-md p-10 w-full max-w-none"
        ref={ref}
      >
      <div className="div relative flex items-start justify-center px-4 w-1/2">
        <div className="max-w-2xl w-full text-center">
          {content.map((item, index) => (
            <div key={item.title + index} className="min-h-screen flex flex-col justify-center items-center py-20">
              <motion.h2
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: activeCard === index ? 1 : 0.3,
                }}
                className="text-4xl md:text-5xl font-bold text-slate-100"
              >
                {item.title}
              </motion.h2>
              <motion.p
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: activeCard === index ? 1 : 0.3,
                }}
                className="text-lg md:text-xl mt-10 max-w-lg text-slate-300 leading-relaxed"
              >
                {item.description}
              </motion.p>
            </div>
          ))}
        </div>
      </div>
      <div className="w-1/2 flex justify-center items-center sticky top-0 h-screen">
        <div
          className={cn(
            "overflow-hidden rounded-md bg-black/20 backdrop-blur-sm border border-white/10",
            contentClassName,
          )}
        >
          {content[activeCard]?.content ?? null}
        </div>
      </div>
    </div>
    </motion.div>
  );
};
