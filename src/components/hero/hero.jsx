"use client";
import Image from "next/image";
import { motion, useAnimation } from "framer-motion";
import { useState } from "react";
import Me from "../../../public/assets/me.jpg";
import MeWithGlasses from "../../../public/assets/me-with-glasses.jpg";
import { MyData } from "@/constants/data";
import Link from "next/link";
import { Button } from "../ui/button";
import { Mail } from "lucide-react";
import { DM_Mono } from "next/font/google";
import LiveClock from "../live-clock/live-clock";
import CopyMail from "../copy-mail/copy-mail";
import Fadeup from "../ui/fadeup";
import TextEffect from "../effect/text-effect";
import FlipEffect from "../effect/flip-text-effect";
import WaveEffect from "../effect/wave-effect";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import LinkIcon from "../../../public/assets/svg/link2.svg";

const dmMono = DM_Mono({ subsets: ["latin"], weight: "400" });

const Hero = () => {
  const { increaseAmongUsCount } = useAppContext();

  const controls = useAnimation();
  const circleLength = 314; // 2 * π * 50 (r = 50)
  const [hovered, setHovered] = useState(false);
  const [imageSrc, setImageSrc] = useState(Me);
  const router = useRouter();
  let timeoutRef;

  const handleMouseEnter = () => {
    if (timeoutRef) return;

    timeoutRef = setTimeout(async () => {
      await controls.start({ strokeDashoffset: hovered ? circleLength : 0 });
      setImageSrc(hovered ? Me : MeWithGlasses);
      setHovered(!hovered);
      timeoutRef = null;
    });
  };

  const handleMouseLeave = () => {
    if (timeoutRef) {
      clearTimeout(timeoutRef);
    }
  };

  return (
    <div
      id="home"
      className="flex flex-col gap-6 items-center w-full justify-center"
    >
      <Fadeup>
        <LiveClock />
      </Fadeup>

      <div className=" flex gap-3 items-center">
        {/* image */}
        <Fadeup>
          <div
            className="relative w-22 h-22 flex items-center justify-center cursor-pointer"
            onClick={increaseAmongUsCount}
          >
            <div className="absolute w-16 h-16 rounded-full overflow-hidden">
              <Image
                src={imageSrc}
                alt="my photo"
                className="scale-125 w-full h-full  object-cover object-center"
              />
            </div>
            <motion.svg
              width="100"
              height="100"
              viewBox="0 0 100 100"
              onClick={handleMouseEnter}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="-rotate-90"
            >
              <motion.circle
                className="stroke-indigo-400"
                cx="50"
                cy="50"
                r="43"
                strokeWidth="4"
                fill="transparent"
                strokeDasharray={circleLength}
                strokeDashoffset={circleLength}
                animate={controls}
                transition={{ duration: 1 }}
              />
            </motion.svg>
          </div>
        </Fadeup>
        <div className="w-full h-full ">
          <Fadeup delay={0.1}>
            <p className="text-mutedText text-sm">Hi, I'm</p>
          </Fadeup>
          <Fadeup delay={0.2}>
            <div className="flex gap-2 items-center justify-center text-primaryText text-2xl tracking-wide font-semibold">
              <FlipEffect sidename={MyData.sidename}>{MyData.name}</FlipEffect>
              <WaveEffect>
                <span className="cursor-pointer">👋</span>
              </WaveEffect>
            </div>
          </Fadeup>
          <Fadeup delay={0.3}>
            <p className="text-mutedText text-lg tracking-wide font-medium">
              {MyData.post}
            </p>
          </Fadeup>
        </div>
      </div>

      <Fadeup delay={0.4}>
        <div className="flex gap-6 items-center">
          {MyData.socials?.map((link) => {
            return (
              <Link
                href={link.href}
                key={link.title}
                target="_blank"
                className="group relative"
              >
                <Image
                  src={link.icon}
                  alt={link.title}
                  width={24}
                  height={24}
                  className="brightness-50 hover:brightness-80 ease-in-out duration-200"
                />
                <p className="absolute -bottom-full left-1/2 -translate-x-1/2 text-primaryText text-sm  group-hover:flex bg-secondary border-border border p-1 py-0 rounded-sm hidden gap-1 items-center z-10">
                  {link.title}
                </p>
              </Link>
            );
          })}
          <Link
            href={MyData.retro}
            target="_blank"
            className="group relative flex items-center justify-center gap-2 bg-primary p-1 px-2 rounded-full brightness-70 hover:brightness-150 ease-in-out duration-200"
          >
            <Image src={LinkIcon} alt="retro link" width={20} height={20} />
            <p className="">Go Retro</p>
            {/* <p className="absolute -bottom-full left-1/2 -translate-x-1/2 text-primaryText text-sm  group-hover:flex bg-secondary border-border border p-1 py-0 rounded-sm hidden gap-1 items-center z-10">
              Go Retro Side
            </p> */}
          </Link>
        </div>
      </Fadeup>

      <Fadeup delay={0.6} duration={0.6}>
        <div className="flex justify-center gap-2 md:gap-4 items-center w-full ">
          <Button
            className="flex-1 flex items-center justify-center text-base border border-border bg-primaryText text-primary hover:bg-primaryText/90 ease-in-out transition-colors duration-300 cursor-pointer w-full sm:w-48"
            onClick={() => router.push("/contact")}
          >
            Contact me <Mail />
          </Button>
          <p className="text-mutedText text-lg">or</p>
          <div className="flex-1 sm:w-48  w-full ">
            <CopyMail />
          </div>
        </div>
      </Fadeup>

      <Fadeup delay={0.6} duration={0.6}>
        <div>
          <div
            className={`text-sm tracking-wide text-mutedText ${dmMono.className} flex`}
          >
            <TextEffect>
              {MyData.state + ", " + MyData.country + " - "}
            </TextEffect>
            &nbsp;
            <TextEffect>{MyData.cords}</TextEffect>
          </div>
        </div>
      </Fadeup>
    </div>
  );
};

export default Hero;
