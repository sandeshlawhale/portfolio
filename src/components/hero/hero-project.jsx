"use client";
import SideTitle from "../title/side-title";
import ProjectCard from "../card/project-card";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import { MyProjects } from "@/constants/data";
import { useRouter } from "next/navigation";
import Fadeup from "../ui/fadeup";

const HeroProject = () => {
  const router = useRouter();
  return (
    <Fadeup delay={0.6} duration={0.6}>
      <div className="relative" id="home-project">
        <SideTitle title="work" />
        <div className="flex flex-col gap-5">
          {MyProjects.slice(0, 3).map((project, index) => (
            <ProjectCard key={`p_${index}`} project={project} />
          ))}
          <Button
            className="flex gap-3 items-center justify-center text-base border border-border bg-secondary hover:bg-secondary-light ease-in-out duration-300 cursor-pointer transition-colors w-full"
            onClick={() => router.replace("/work")}
          >
            View all <ArrowRight className="w-6 h-6 text-icon-muted " />
          </Button>
        </div>
      </div>
    </Fadeup>
  );
};

export default HeroProject;
