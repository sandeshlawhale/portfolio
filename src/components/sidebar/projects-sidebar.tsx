"use client";

import { useMemo } from "react";
import SidebarCard from "../card/sidebar-card";
import { Project } from "@/types";
import { useAppContext } from "@/context/AppContext";
import { MotionValue, easeInOut, motion } from "framer-motion";
import { X } from "lucide-react";
import { useParams } from "next/navigation";
import { Skeleton } from "../ui/skeleton";

const ProjectsSidebar = ({
  scrollYProgress,
  projects = [],
  loading,
}: {
  scrollYProgress: MotionValue;
  projects?: Project[];
  loading: boolean;
}) => {
  const { closeWorkSidebar: closeSidebar } = useAppContext();
  const { id } = useParams();

  const { currentProject, restProjects } = useMemo(() => {
    const current = projects.find((project) => project._id === id) || null;
    const rest = projects.filter((project) => project._id !== id);
    return { currentProject: current, restProjects: rest };
  }, [id, projects]);

  return (
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: "0" }}
      exit={{ x: "-100%" }}
      transition={{ duration: 0.4, ease: easeInOut }}
      className="w-full md:w-96 mb-20 h-screen border-r border-border fixed bg-black/50 z-30 backdrop-blur-sm flex flex-col"
    >
      <div className="w-full px-4 mt-4 flex items-center justify-start gap-2">
        <X className="cursor-pointer" onClick={closeSidebar} />
        <p className="text-xl font-semibold text-indigo-300">Projects</p>
      </div>

      <div className="flex flex-col h-[calc(100vh-64px)]">
        <div className="flex flex-col gap-1 shrink-0 p-3">
          <p className="px-3 font-semibold text-sm text-gray-600 tracking-wide">
            Now Viewing
          </p>
          {loading ? (
            <Skeleton className="w-full h-20 bg-[#121212]" />
          ) : (
            currentProject && (
              <SidebarCard
                project={currentProject}
                scrollYProgress={scrollYProgress}
                currentProject={[currentProject]}
              />
            )
          )}
        </div>

        <div className="scrollbar flex-1 overflow-y-auto p-3 mb-10 md:mb-0">
          <p className="px-3 pt-3 font-semibold text-sm text-gray-600 tracking-wide">
            Up Next
          </p>
          {loading ? (
            <div className="flex flex-col gap-3">
              <Skeleton className="w-full h-20 bg-[#121212]" />
              <Skeleton className="w-full h-20 bg-[#121212]" />
              <Skeleton className="w-full h-20 bg-[#121212]" />
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {restProjects.map((project, index) => (
                <SidebarCard project={project} key={`project_${index}`} />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectsSidebar;
