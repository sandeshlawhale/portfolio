import { ArrowRight } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import Fadeup from "../ui/fadeup";

const HeroContact = () => {
  return (
    <Fadeup delay={0.2} duration={0.6}>
      <div className="mx-4 py-12 border-2 border-border rounded-xl" id="home-contact">
        <div className="flex flex-col text-center items-center justify-center">
          <h2 className="text-xl font-semibold text-primaryText tracking-wider">
            Let&apos;s build something thoughtful.
          </h2>
          <p className="text-mutedText text-base tracking-wider">
            Open to projects, collaborations, and interesting ideas.
          </p>

          <Link href="/contact">
            <Button
              variant="ghost"
              className="mt-2 gap-1 px-6 group"
            >
              Get in Touch <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-all duration-300" />
            </Button>
          </Link>
        </div>
      </div>
    </Fadeup>
  );
};

export default HeroContact;
