"use client";

import { useMemo } from "react";
import SidebarCard from "../card/sidebar-card";
import { Project } from "@/types";
import { useAppContext } from "@/context/AppContext";
import { MotionValue, easeInOut, motion } from "motion/react";
import { X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Skeleton } from "../ui/skeleton";

const ProjectsSidebar = ({
  scrollYProgress,
  projects = [],
  loading,
  isMobile = true,
}: {
  scrollYProgress: MotionValue;
  projects?: Project[];
  loading: boolean;
  isMobile?: boolean;
}) => {
  const { closeWorkSidebar: closeSidebar } = useAppContext();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const { currentProject, restProjects } = useMemo(() => {
    const current = projects.find((project) => project._id === id) || null;
    const rest = projects.filter((project) => project._id !== id);
    return { currentProject: current, restProjects: rest };
  }, [id, projects]);

  const SidebarContent = (
    <div className={`w-full md:w-96 h-full border-r border-border flex flex-col bg-background/50 backdrop-blur-sm ${isMobile ? "fixed top-0 left-0 index-30 mb-20 h-screen bg-black/50" : "sticky top-0 h-screen hidden md:flex"}`}>
      {isMobile && (
        <div className="w-full px-4 mt-4 flex items-center justify-start gap-2">
          <X className="cursor-pointer" onClick={closeSidebar} />
          <p className="text-xl font-semibold text-primary-foreground">Projects</p>
        </div>
      )}

      {!isMobile && (
        <div className="w-full px-4 mt-4 flex items-center justify-start gap-2 py-2">
          <p className="text-xl font-semibold text-primary-foreground">Projects</p>
        </div>
      )}

      <div className="flex flex-col h-full overflow-hidden">
        <div className="flex flex-col gap-1 shrink-0 p-3">
          <p className="px-0 font-semibold text-sm text-muted-foreground tracking-wide">
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

        <p className="px-3 pt-3 font-semibold text-sm text-muted-foreground tracking-wide">
          Up Next
        </p>
        <div className="scrollbar flex-1 overflow-y-auto p-3 mb-10 md:mb-0 pb-20">
          {loading ? (
            <div className="flex flex-col gap-3">
              <Skeleton className="w-full h-20 bg-[#121212]" />
              <Skeleton className="w-full h-20 bg-[#121212]" />
              <Skeleton className="w-full h-20 bg-[#121212]" />
            </div>
          ) : (
            <div className="flex flex-col">
              {restProjects.map((project, index) => (
                <SidebarCard project={project} key={`project_${index}`} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: "0" }}
        exit={{ x: "-100%" }}
        transition={{ duration: 0.4, ease: easeInOut }}
        className="fixed inset-0 z-30 md:hidden"
      >
        {SidebarContent}
      </motion.div>
    );
  }

  return SidebarContent;
};

export default ProjectsSidebar;
