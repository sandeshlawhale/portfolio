"use client";
import { useEffect, useState } from "react";
import SidebarCard from "../card/sidebar-card";
import { Project } from "@/types";
import { useAppContext } from "@/context/AppContext";
import { AnimatePresence, MotionValue, easeInOut, motion } from "framer-motion";

const WorkSidebar = ({ scrollYProgress }: { scrollYProgress: MotionValue }) => {
  const { projects, projectGames, searchSlug } = useAppContext();

  const [currentProject, setCurrentProject] = useState<Project[] | null>(null);
  const [restProject, setRestProject] = useState<Project[] | null>([]);
  const [restProjectGames, setRestProjectGames] = useState<Project[] | null>(
    []
  );

  useEffect(() => {
    const fromProjects = projects?.find(
      (project) => project.slug === searchSlug
    );
    const fromGames = projectGames?.find(
      (project) => project.slug === searchSlug
    );

    const foundProject = fromProjects || fromGames;

    setCurrentProject(foundProject ? [foundProject] : null);
    setRestProject(
      projects?.filter((project) => project.slug !== searchSlug) || []
    );
    setRestProjectGames(
      projectGames?.filter((project) => project.slug !== searchSlug) || []
    );
  }, [searchSlug, projects, projectGames]);

  return (
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: "0" }}
      exit={{ x: "-100%" }}
      transition={{
        duration: 0.4,
        ease: easeInOut,
      }}
      className="w-96 h-screen border-r border-border fixed xl:block bg-black/50 z-30 backdrop-blur-sm flex flex-col"
    >
      <p className="p-3 text-indigo-300 font-medium capitalize shrink-0">
        Work
      </p>
      <div className="flex flex-col h-[calc(100vh-64px)]">
        {/* Now Viewing - Fixed */}
        <div className="flex flex-col gap-1 shrink-0 p-3 ">
          <p className="px-3 font-semibold text-sm text-gray-600 tracking-wide">
            Now Viewing
          </p>
          {currentProject && (
            <SidebarCard
              project={currentProject[0]}
              scrollYProgress={scrollYProgress}
              currentProject={currentProject}
            />
          )}
        </div>
        {/* Up Next - Scrollable */}
        <div className="scrollbar flex-1 overflow-y-auto p-3">
          <p className="px-3 pt-3 font-semibold text-sm text-gray-600 tracking-wide">
            Up Next
          </p>
          <div className="flex flex-col gap-3">
            {restProject &&
              restProject.map((project, index) => (
                <SidebarCard project={project} key={`project_${index}`} />
              ))}
          </div>
          <p className="px-3 pt-3 font-semibold text-sm text-gray-600 tracking-wide">
            Want Fun
          </p>
          <div className="flex flex-col gap-3">
            {restProjectGames &&
              restProjectGames?.map((project, index) => (
                <SidebarCard project={project} key={`project_game_${index}`} />
              ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WorkSidebar;
