"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

import SideTitle from "../title/side-title";
import ProjectCard from "../card/project-card";
import Fadeup from "../ui/fadeup";
import { Button } from "../ui/button";
import { getAllProject } from "@/utils/api/projets";
import { Project } from "@/types";
import { Skeleton } from "../ui/skeleton";

const HeroProject = () => {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      const data = await getAllProject({ limit: 3 });
      if (Array.isArray(data)) {
        setProjects(data);
      }
      setLoading(false);
    };

    fetchProjects();
  }, []);

  return (
    <Fadeup delay={0.7} duration={0.6}>
      <section className="relative px-4" id="home-project">
        <SideTitle title="work" />
        {loading ? (
          <div className="flex flex-col gap-5">
            <Skeleton className="w-full h-72 bg-[#121212]" />
            <Skeleton className="w-full h-72 bg-[#121212]" />
            <Skeleton className="w-full h-72 bg-[#121212]" />
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}

            <Button
              onClick={() => router.push("/work")}
              className="flex gap-3 items-center justify-center text-base border border-border bg-secondary hover:bg-secondary-light transition-colors duration-300 w-full"
            >
              View all <ArrowRight className="w-5 h-5 text-icon-muted" />
            </Button>
          </div>
        )}
      </section>
    </Fadeup>
  );
};

export default HeroProject;
