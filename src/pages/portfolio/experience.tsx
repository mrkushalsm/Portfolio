import React from "react";
import { Timeline } from "@/components/ui/timeline";
import Image from "next/image";

export function ExperienceTimeline() {
  const data = [
    {
      title: "Mar 2025",
      content: (
        <div>
            <h2 className="mb-8 text-xl font-normal text-neutral-800 dark:text-neutral-200">Apprentice</h2>
          <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
            SOSC - Sahyadri Open Source Community • Trainee
          </p>
          <Image
              src="/assets/experience/sosc-apprentice.svg"
              alt="sosc-apprentice"
              width={280}
              height={280}
              className="rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
        </div>
      ),
    },
    {
      title: "Sept 2025",
      content: (
        <div>
            <h2 className="mb-8 text-xl font-normal text-neutral-800 dark:text-neutral-200">Team Lead</h2>
          <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
            GDG - Google Developer Student Clubs • GDG On Campus Lead
          </p>
          <Image
              src="/assets/experience/gdg-scem.svg"
              alt="sosc-apprentice"
              width={280}
              height={128}
              className="rounded-lg object-cover"
            />
        </div>
      ),
    },
    {
      title: "Oct 2025",
      content: (
        <div>
            <h2 className="mb-8 text-xl font-normal text-neutral-800 dark:text-neutral-200">Lead</h2>
          <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
            SOSC - Sahyadri Open Source Community • Lead
          </p>
          <Image
              src="/assets/experience/sosc-lead.svg"
              alt="sosc-lead"
              width={280}
              height={280}
              className="rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
        </div>
      ),
    },
  ];
  return (
    <div className="relative w-full overflow-clip">
      <Timeline data={data} />
    </div>
  );
}
