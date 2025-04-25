"use client";
import React from "react";
import SideTitle from "../title/side-title";
import { TechStack } from "@/constants/data";
import Image from "next/image";
import Fadeup from "../ui/fadeup";

const HeroStack = () => {
  return (
    <Fadeup delay={0.6} duration={0.6}>
      <div className="relative" id="home-stack">
        <SideTitle title="stack" />
        <div className="hidden md:block">
          <div className="flex gap-5">
            {TechStack.frontend.slice(0, 5).map((skill, i) => (
              <div
                key={`frontend_${i}`}
                className="flex gap-2 items-center w-fit "
              >
                <Image
                  src={skill.logo}
                  alt={skill.title}
                  width={24}
                  height={24}
                />
                <p>{skill.title}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-5">
            {TechStack.backend.slice(0, 4).map((skill, i) => (
              <div
                key={`frontend_${i}`}
                className="flex gap-2 items-center w-fit px-3"
              >
                <Image
                  src={skill.logo}
                  alt={skill.title}
                  width={24}
                  height={24}
                />
                <p>{skill.title}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="md:hidden block">
          <div className="flex gap-5 justify-center">
            {TechStack.frontend.slice(0, 4).map((skill, i) => (
              <div
                key={`frontend_${i}`}
                className="flex gap-2 items-center w-fit "
              >
                <Image
                  src={skill.logo}
                  alt={skill.title}
                  width={24}
                  height={24}
                />
                <p>{skill.title}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-5 justify-center">
            {TechStack.backend.slice(0, 3).map((skill, i) => (
              <div
                key={`frontend_${i}`}
                className="flex gap-2 items-center w-fit px-3"
              >
                <Image
                  src={skill.logo}
                  alt={skill.title}
                  width={24}
                  height={24}
                />
                <p>{skill.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Fadeup>
  );
};

export default HeroStack;
