import { Mail } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import TextEffect from "../effect/text-effect";
import Fadeup from "../ui/fadeup";

const HeroContact = () => {
  return (
    <Fadeup delay={0.2} duration={0.6}>
      <div className="px-4 flex flex-col gap-4 items-center" id="home-contact">
        <Mail className="w-6 h-6 text-icon-muted" />
        <div className="flex flex-col gap-2 items-center">
          <p className="text-mutedText text-[15px] tracking-wide font-medium">
            Open for projects, collaborations & fun ideas!
          </p>
          <p className="text-center text-base text-primaryText font-medium tracking-wide">
            I&apos;m always open to new projects, collaborations, or just a
            friendly chat. Let&apos;s connect and create something amazing!
          </p>
        </div>
        <Link href="/contact" className="w-full">
          <Button className="py-1.5 flex w-full gap-3 items-center justify-center text-base border border-border bg-secondary hover:bg-secondary-light ease-in-out duration-300 cursor-pointer transition-colors">
            Let&apos;s talk <Mail className="w-6 h-6 text-icon-muted " />
          </Button>
        </Link>
        <div className="text-mutedText text-[15px] tracking-wide font-medium">
          <TextEffect>Available 24/7</TextEffect>
        </div>
      </div>
    </Fadeup>
  );
};

export default HeroContact;
