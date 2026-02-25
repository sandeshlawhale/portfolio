"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";


import ProjectCard from "../card/project-card";
import Fadeup from "../ui/fadeup";
import { Button } from "../ui/button";
import { getAllProjects } from "@/utils/api/projects";
import { Project } from "@/types";
import { Skeleton } from "../ui/skeleton";
import { useAppContext } from "@/context/AppContext";

const HeroProject = () => {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const { setDataLoaded } = useAppContext();

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const data = await getAllProjects({ limit: 4, draft: false });
        if (Array.isArray(data.result)) {
          setProjects(data.result);
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
        setDataLoaded(true);
      }
    };

    fetchProjects();
  }, [setDataLoaded]);

  return (
    <section className="relative px-4 w-full flex flex-col" id="home-project">
      <Fadeup>
        <h2 className="text-2xl pb-4 font-semibold tracking-wider leading-relaxed text-primary-foreground">
          Projects
        </h2>
      </Fadeup>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Skeleton className="w-full h-64 rounded-xl bg-[#121212]" />
          <Skeleton className="w-full h-64 rounded-xl bg-[#121212]" />
          <Skeleton className="w-full h-64 rounded-xl bg-[#121212]" />
          <Skeleton className="w-full h-64 rounded-xl bg-[#121212]" />
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {projects.map((project, index) => (
              <Fadeup key={project._id} delay={index * 0.1}>
                <ProjectCard project={project} />
              </Fadeup>
            ))}
          </div>

          <Button
            onClick={() => router.push("/projects")}
            className="w-xs mx-auto"
            variant="secondary"
          >
            View all <ArrowRight className="w-5 h-5 text-icon-muted" />
          </Button>
        </div>
      )}
    </section>
  );
};

export default HeroProject;
