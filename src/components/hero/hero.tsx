"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { motion, useAnimation } from "framer-motion";
import { ScanText, Send } from "lucide-react";

import Me from "../../../public/assets/me.jpg";
import MeWithGlasses from "../../../public/assets/me-with-glasses.jpg";

import LiveClock from "../live-clock/live-clock";
import Fadeup from "../ui/fadeup";
import FlipEffect from "../effect/flip-text-effect";
import WaveEffect from "../effect/wave-effect";
import { Button } from "../ui/button";

import { MyData } from "@/constants/data";
import { useAppContext } from "@/context/AppContext";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import StackBadge from "../ui/stack-badge";
import HeroLeetCode from "./hero-leetcode";


const Hero = () => {
  return (
    <div id="home" className="px-4 w-full">
      <div className="flex items-center justify-between">
        <Fadeup>
          <LiveClock />
        </Fadeup>
        <Fadeup>
          <SocialLinks />
        </Fadeup>
      </div>

      <Fadeup delay={0.05}>
        <div className="flex gap-3 items-center pt-8">
          <ProfileAvatar />
          <HeroIntroduction />
        </div>
      </Fadeup>

      <Fadeup delay={0.1}>
        <p className="text-mutedText text-lg tracking-wider leading-loose pt-4">
          I build interactive web apps using{" "}
          <StackBadge
            icon="/assets/stack/ts-logo-colored.webp"
            name="TypeScript"
          />{" "}
          ,{" "}
          <StackBadge
            icon="/assets/stack/react-logo-colored.webp"
            name="React"
          />{" "}
          ,{" "}
          <StackBadge
            icon="/assets/stack/nextjs-logo-colored.webp"
            name="Next.js"
          />{" "}
          , and{" "}
          <StackBadge
            icon="/assets/stack/mongodb-logo-colored.webp"
            name="MongoDb"
            width={9}
            height={9}
          />{" "}
          . With a focus on clean <span className="text-primaryText">UI</span>.
          Exploring <span className="text-primaryText">n8n</span> automation
          and <span className="text-primaryText">LangChain</span>, driven by
          curiosity.
        </p>
      </Fadeup>


      <Fadeup delay={0.15}>
        <HeroActions />
      </Fadeup>

      <HeroLeetCode />
    </div>
  );
};

const SocialLinks = () => {

  return (
    <div className="flex gap-2 items-center">
      {MyData.socials?.map((link) => (
        <Link
          href={link.href}
          key={link.title}
          target="_blank"
          className="group relative"
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <Image
                src={link.icon}
                alt={link.title}
                width={16}
                height={16}
                className="brightness-50 hover:brightness-80 ease-in-out duration-200"
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>{link.title}</p>
            </TooltipContent>
          </Tooltip>
        </Link>
      ))}
    </div>
  );
};

const ProfileAvatar = () => {
  const { increaseAmongUsCount } = useAppContext();
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const controls = useAnimation();

  const handleMouseEnter = () => {
    controls.start({
      pathLength: 1,
      transition: { duration: 1, ease: "easeInOut" },
    });
  };

  const handleMouseLeave = () => {
    controls.start({
      pathLength: 0,
      transition: { duration: 0.5, ease: "easeInOut" },
    });
    setIsAnimationComplete(false);
  };

  return (
    <div
      className="relative w-20 h-20 rounded-full flex items-center justify-center cursor-pointer"
      onClick={increaseAmongUsCount}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="absolute w-16 h-16 rounded-full overflow-hidden">
        <Image
          src={isAnimationComplete ? MeWithGlasses : Me}
          alt="Sandesh Lawhale"
          className="w-full h-full object-cover object-center scale-110"
        />
      </div>

      {/* Circle Outline SVG */}
      <motion.svg
        width="100"
        height="100"
        viewBox="0 0 100 100"
        className="absolute pointer-events-none -rotate-135"
      >
        <motion.circle
          cx="50"
          cy="50"
          r="36.5"
          fill="transparent"
          stroke="#818cf8" // indigo-400
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={controls}
          onAnimationComplete={(definition) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if ((definition as any).pathLength === 1) {
              setIsAnimationComplete(true);
            }
          }}
        />
      </motion.svg>
    </div>
  );
};

const HeroIntroduction = () => {
  return (
    <div className="w-full h-full">
      <p className="text-mutedText text-sm">Hi, I&apos;m</p>
      <div className="flex gap-2 items-center text-primaryText text-2xl tracking-wide font-semibold">
        {/* <FlipEffect sidename={MyData.sidename}>{MyData.name}</FlipEffect> */}
        {MyData.name}
        <WaveEffect>
          <span className="cursor-pointer">👋</span>
        </WaveEffect>
      </div>
      <p className="text-mutedText text-lg tracking-wide font-medium">
        {MyData.post}
      </p>
    </div>
  );
};

const HeroActions = () => {
  const router = useRouter();
  return (
    <div className="flex gap-2 items-center pt-4">
      <Button
        variant="default"
        className="font-normal tracking-wider flex align-middle"
        onClick={() => router.push("/contact")}
      >
        <ScanText /> Resume / CV
      </Button>

      <Button
        variant="secondary"
        className="font-normal tracking-wider flex align-middle"
        onClick={() => router.push("/contact")}
      >
        <Send /> Let&apos;s Talk
      </Button>
    </div>
  );
};

export default Hero;
