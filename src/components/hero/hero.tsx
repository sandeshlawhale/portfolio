"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { ScanText, Send } from "lucide-react";

import Me from "../../../public/assets/me.jpg";

import LiveClock from "../live-clock/live-clock";
import Fadeup from "../ui/fadeup";

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
import { getActiveResume } from "@/utils/api/resume";
import { trackEvent, getDeviceType } from "@/utils/api/analytics";


const Hero = () => {
  return (
    <div id="home" className="px-4 w-full">
      <div className="flex items-center justify-between">
        <Fadeup delay={0.05}>
          <LiveClock />
        </Fadeup>
        <Fadeup delay={0.1}>
          <SocialLinks />
        </Fadeup>
      </div>

      <Fadeup delay={0.15}>
        <div className="flex gap-3 items-center pt-8">
          <ProfileAvatar />
          <HeroIntroduction />
        </div>
      </Fadeup>

      <Fadeup delay={0.25}>
        <p className="text-mutedText text-lg tracking-wider leading-loose pt-4">
          I design and build full-stack applications with a growing focus on AI, LLMs, and intelligent automation.
          I enjoy combining modern web technologies with tools like{" "}
          <StackBadge
            icon="/assets/stack/langchain.webp"
            name="LangChain"
          />{" "}
          ,{" "}
          <StackBadge
            icon="/assets/stack/openai.webp"
            name="Gemini"
          />{" "}
          and{" "}
          <StackBadge
            name="n8n"
          />{" "}
          to build practical, user-first products.
        </p>
      </Fadeup>


      <Fadeup delay={0.35}>
        <HeroActions />
      </Fadeup>

      <Fadeup delay={0.4}>
        <HeroLeetCode />
      </Fadeup>
    </div>
  );
};

const SocialLinks = () => {
  const handleSocialClick = (title: string) => {
    trackEvent({
      type: "interaction",
      category: "social",
      event: `${title.toLowerCase()}_clicked`,
      metadata: { device: getDeviceType() }
    });
  };

  return (
    <div className="flex gap-3 items-center">
      {MyData.socials?.map((link) => (
        <Link
          href={link.href}
          key={link.title}
          target="_blank"
          className="group relative"
          onClick={() => handleSocialClick(link.title)}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <Image
                src={link.icon}
                alt={link.title}
                width={20}
                height={20}
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
  // const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  // const controls = useAnimation();

  // const handleMouseEnter = () => {
  //   controls.start({
  //     pathLength: 1,
  //     transition: { duration: 1, ease: "easeInOut" },
  //   });
  // };

  // const handleMouseLeave = () => {
  //   controls.start({
  //     pathLength: 0,
  //     transition: { duration: 0.5, ease: "easeInOut" },
  //   });
  //   setIsAnimationComplete(false);
  // };

  return (
    <div
      className="relative w-28 h-28 rounded-full flex items-center justify-center cursor-pointer"
      onClick={increaseAmongUsCount}
    // onMouseEnter={handleMouseEnter}
    // onMouseLeave={handleMouseLeave}
    >
      <div className="absolute w-24 h-24 rounded-full overflow-hidden">
        <Image
          src={Me}
          alt="Sandesh Lawhale"
          className="w-full h-full object-cover object-center scale-110"
        />
      </div>

      {/* Circle Outline SVG */}
      {/* <motion.svg
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
      </motion.svg> */}
    </div>
  );
};

const HeroIntroduction = () => {
  return (
    <div className="w-full h-full flex flex-col gap-1.5 justify-center">
      <p className="text-mutedText text-base font-medium">Hi, I&apos;m</p>
      <div className="flex gap-2 items-center text-primaryText text-3xl md:text-4xl tracking-wide font-bold">
        {/* <FlipEffect sidename={MyData.sidename}>{MyData.name}</FlipEffect> */}
        {MyData.name}
        <WaveEffect>
          <span className="cursor-pointer">👋</span>
        </WaveEffect>
      </div>
      <p className="text-mutedText text-lg md:text-xl tracking-wide font-medium">
        {MyData.post}
      </p>
    </div>
  );
};

const HeroActions = () => {
  const router = useRouter();
  const [resumeUrl, setResumeUrl] = useState("");

  useEffect(() => {
    const fetchActiveResume = async () => {
      try {
        const data = await getActiveResume();
        if (data.success && data.result?.url) {
          setResumeUrl(data.result.url);
        }
      } catch (error) {
        console.error("Failed to fetch active resume", error);
      }
    };
    fetchActiveResume();
  }, []);

  return (
    <div className="flex gap-2 items-center pt-4">
      <Button
        variant="default"
        className="font-normal tracking-wider flex align-middle"
        onClick={() => {
          trackEvent({
            type: "interaction",
            category: "hero",
            event: "resume_clicked",
            metadata: { device: getDeviceType() }
          });
          if (resumeUrl) {
            window.open(resumeUrl, "_blank");
          }
        }}
      >
        <ScanText /> Resume / CV
      </Button>

      <Button
        variant="secondary"
        className="font-normal tracking-wider flex align-middle"
        onClick={() => {
          trackEvent({
            type: "interaction",
            category: "hero",
            event: "lets_talk_clicked",
            metadata: { device: getDeviceType() }
          });
          router.push("/contact");
        }}
      >
        <Send /> Let&apos;s Talk
      </Button>
    </div>
  );
};

export default Hero;
