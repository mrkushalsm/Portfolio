"use client";
import { motion } from "motion/react";
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";
import {Navigation} from "@/pages/portfolio/navigation";
import {useEffect, useState} from "react";

function useWindowSize() {
    const [windowSize, setWindowSize] = useState({
        width: undefined,
    });

    useEffect(() => {
        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
            });
        }

        // Add event listener
        window.addEventListener("resize", handleResize);

        // Call handler right away so state gets updated with initial window size
        handleResize();

        // Remove event listener on cleanup
        return () => window.removeEventListener("resize", handleResize);
    }, []); // Empty array ensures that effect is only run on mount
    return windowSize;
}

export default function Home() {
    const size = useWindowSize()
  return (
      <div>
          <HeroHighlight extendIntoNext={true}>
              <motion.h1
                  initial={{
                      opacity: 0,
                      y: 20,
                  }}
                  animate={{
                      opacity: 1,
                      y: [20, -5, 0],
                  }}
                  transition={{
                      duration: 0.5,
                      ease: [0.4, 0.0, 0.2, 1],
                  }}
                  className="text-2xl px-4 md:text-4xl lg:text-5xl font-bold text-neutral-700 dark:text-white max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto "
              >
                  Welcome to my {" "}
                  <Highlight className="text-black dark:text-white">
                      portfolio
                  </Highlight>
              </motion.h1>
          </HeroHighlight>
          <Navigation windowWidth={size.width} />
      </div>
  );
}
