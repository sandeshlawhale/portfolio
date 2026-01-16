"use client";

import Image from "next/image";
import SideTitle from "../title/side-title";
import Fadeup from "../ui/fadeup";
import { MyData } from "@/constants/data";
import Me from "../../../public/assets/me.jpg";
import { SKILLS } from "@/constants/skills";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const HeroAbout = () => {
  // Select specific skills to display
  const selectedSkills = [
    "react.js", "next.js", "typescript", "node.js",
    "mongodb", "tailwind", "framer motion", "figma", "langchain"
  ];

  return (
    <section id="home-about" className="relative px-4 w-full">
      <Fadeup>
        <h2 className="text-2xl pb-4 font-semibold tracking-wider leading-relaxed text-primaryText">
          About
        </h2>
      </Fadeup>

      <div className="flex flex-col gap-4">
        {/* Image - Sized to match Project Card (using grid to align exact width) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Fadeup delay={0.2} duration={0.6}>
            <div className="w-full aspect-square relative rounded-xl overflow-hidden border border-border/50 group">
              <Image
                src={Me}
                alt={MyData.name}
                width={1000}
                height={1000}
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
              />
            </div>
          </Fadeup>
        </div>

        {/* Content - Full Width */}
        <Fadeup delay={0.4} duration={0.6}>
          <div className="flex flex-col gap-2">
            <h3 className="text-3xl font-bold text-primaryText tracking-wider">
              {MyData.name}
            </h3>

            <div className="tracking-wider text-mutedText text-base flex flex-col leading-relaxed max-w-2xl">
              <p>
                I&apos;m a full-stack developer who enjoys building clean, thoughtful products.
                I care deeply about UX, performance, and small details.
              </p>
              <p>
                Currently exploring web animations, DSA and system design.
              </p>
            </div>

            {/* Skills - Icons Only */}
            <div className="mt-2">
              <p className="text-xs font-semibold text-mutedText uppercase tracking-wider mb-3">
                Skills
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedSkills.map((skillKey) => {
                  const iconPath = SKILLS[skillKey];
                  if (!iconPath) return null;

                  return (
                    <Tooltip key={skillKey}>
                      <TooltipTrigger>
                        <div className="w-8 h-8 rounded-md bg-primary/5 border border-border flex items-center justify-center overflow-hidden p-1.5 cursor-pointer hover:bg-primary/10 transition-colors">
                          <Image
                            src={iconPath}
                            alt={skillKey}
                            width={20}
                            height={20}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="capitalize">{skillKey}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            </div>
          </div>
        </Fadeup>
      </div>
    </section>
  );
};

export default HeroAbout;
