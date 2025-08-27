"use client";
import React from "react";
import { TracingBeam } from "@/components/ui/tracing-beam";
import gns from "@/../public/assets/education/gns.png";
import srgs from "@/../public/assets/education/srgs.png";
import scem from "@/../public/assets/education/scem.png";

export function Education() {
  return (
    <TracingBeam className="px-6">
      <div className="max-w-2xl mx-auto antialiased pt-4 relative">
        {dummyContent.map((item, index) => (
          <div key={`content-${index}`} className="mb-15">
            <h2 className="bg-black text-white rounded-full text-sm w-fit px-4 py-1 mb-4">
              {item.badge}
            </h2>

            <p className="text-xl mb-4">
              {item.title}
            </p>

            <div className="text-sm  prose prose-sm dark:prose-invert">
              {item?.image && (
                <img
                  src={item.image}
                  alt="blog thumbnail"
                  height="1000"
                  width="1000"
                  className="rounded-lg mb-5 object-cover"
                />
              )}
              {item.description}
            </div>
          </div>
        ))}
      </div>
    </TracingBeam>
  );
}

const dummyContent = [
  {
    title: "Gopalan National School",
    description: (
      <>
        <p className="text-lg">
          2018-2020
        </p>
        <p>
          Completed my secondary education with focus on Science and Mathematics.
        </p>
      </>
    ),
    badge: "High School",
    image: "/assets/education/gns.png"
  },
  {
    title: "Shree Ram Global OMR",
    description: (
      <>
        <p className="text-lg">
          2020-2022
        </p>
        <p>
          Studied Computer Science stream with Mathematics, Physics, and Chemistry.
        </p>
      </>
    ),
    badge: "Pre-University",
    image: "/assets/education/srgs.png",
  },
  {
    title: "Sahyadri College of Engineering & Management",
    description: (
      <>
        <p className="text-lg">
          2022-2027
        </p>
        <p>
          Pursuing Bachelor's in Computer Science & Engineering.
        </p>
      </>
    ),
    badge: "Engineering",
    image: "/assets/education/scem.png",
  },
];
