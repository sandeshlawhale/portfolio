"use client";

import { useMemo, useState } from "react";
import SidebarCard from "../card/sidebar-card";
import { Project } from "@/types";
import { useAppContext } from "@/context/AppContext";
import { motion } from "motion/react";
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

  // Dynamic Category Filters
  const categories = useMemo(() => {
    const cats = new Set<string>();
    projects.forEach((p) => {
      if (p.category) cats.add(p.category);
    });
    return ["All", ...Array.from(cats)];
  }, [projects]);

  const [selectedCategory, setSelectedCategory] = useState("All");

  const currentProject = useMemo(() => {
    return projects.find((project) => project._id === id) || null;
  }, [id, projects]);

  const restProjects = useMemo(() => {
    const rest = projects.filter((project) => project._id !== id);
    if (selectedCategory === "All") return rest;
    return rest.filter((project) => project.category === selectedCategory);
  }, [id, projects, selectedCategory]);

  const SidebarContent = (
    <div className={`w-full h-full border-r border-border flex flex-col bg-background/95 backdrop-blur-md ${isMobile ? "h-screen bg-black/90" : "sticky top-0 h-screen hidden md:flex"}`}>
      {/* Mobile Title with Close trigger */}
      {isMobile && (
        <div className="w-full px-4 mt-4 flex items-center justify-between py-2 border-b border-border/40 shrink-0">
          <div className="flex items-center gap-2">
            <p className="text-lg font-semibold text-indigo-300">Projects</p>
          </div>
          <X className="cursor-pointer text-gray-400 hover:text-white" onClick={closeSidebar} />
        </div>
      )}

      <div className="flex flex-col h-full overflow-hidden">
        {/* Currently Viewing Section */}
        <div className="flex flex-col gap-1 shrink-0 p-3">
          <p className="px-0 font-semibold text-xs text-gray-500 tracking-wide uppercase">
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

        {/* Up Next Section Title */}
        <div className="px-3 pt-3 shrink-0">
          <p className="font-semibold text-xs text-gray-500 tracking-wide uppercase">
            Up Next
          </p>

          {/* Dynamic Category Filters inside Up Next */}
          {categories.length > 1 && (
            <div className="flex flex-wrap gap-1 mt-2 pb-2 border-b border-border/20">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all border ${
                    selectedCategory === cat
                      ? "bg-indigo-500/20 text-indigo-300 border-indigo-400/30"
                      : "bg-transparent text-gray-400 border-border/40 hover:text-white hover:border-gray-500"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Scrollable list */}
        <div className="scrollbar flex-1 overflow-y-auto p-3 mb-10 md:mb-0 pb-20">
          {loading ? (
            <div className="flex flex-col gap-3">
              <Skeleton className="w-full h-20 bg-[#121212]" />
              <Skeleton className="w-full h-20 bg-[#121212]" />
              <Skeleton className="w-full h-20 bg-[#121212]" />
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {restProjects.map((project, index) => (
                <SidebarCard project={project} key={`project_${index}`} />
              ))}
              {restProjects.length === 0 && (
                <p className="text-xs text-gray-500 italic text-center py-6">No other projects found...</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Mobile Slide-over Overlay Drawer
  if (isMobile) {
    return (
      <div 
        className="fixed inset-0 z-50 md:hidden bg-black/60 backdrop-blur-xs flex justify-start"
        onClick={closeSidebar}
      >
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "0" }}
          exit={{ x: "-100%" }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="w-[80%] max-w-[300px] h-full"
          onClick={(e) => e.stopPropagation()} // prevent closing when interacting inside sidebar
        >
          {SidebarContent}
        </motion.div>
      </div>
    );
  }

  // Desktop Static Sidebar
  return (
    <aside className="w-72 flex-shrink-0 sticky top-0 h-screen hidden md:flex">
      {SidebarContent}
    </aside>
  );
};

import { MotionValue } from "motion/react";
export default ProjectsSidebar;
