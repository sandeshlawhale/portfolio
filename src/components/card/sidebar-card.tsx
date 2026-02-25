"use client";

import { useAppContext } from "@/context/AppContext";
import { Project } from "@/types";
import { MotionValue, motion } from "motion/react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const SidebarCard = ({
  project,
  scrollYProgress,
  currentProject,
}: {
  project: Project;
  scrollYProgress?: MotionValue;
  currentProject?: Project[];
}) => {
  const { closeWorkSidebar: closeSidebar } = useAppContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentId = searchParams.get("id");
  const scaleX = scrollYProgress;

  // Mouse tracking state for tooltip
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleClick = () => {
    router.push(`/projects?id=${project?._id}`);
    closeSidebar();
  };

  return (
    <div
      className={`relative ${currentId === project?._id && "bg-secondary-light"
        } p-2 flex items-center gap-3 hover:bg-secondary-light rounded-lg cursor-pointer overflow-hidden group transition-colors duration-200 ease-in`}
      onClick={() => handleClick()}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Floating "Open" Tooltip */}
      {isHovering && (
        <motion.div
          className="absolute z-50 pointer-events-none bg-black/80 backdrop-blur-md text-white text-[10px] font-medium px-2 py-1 rounded border border-white/10 shadow-lg uppercase tracking-wider"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: 1,
            scale: 1,
            x: mousePosition.x,
            y: mousePosition.y,
          }}
          transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
        >
          Open
        </motion.div>
      )}

      {/* Current Project Scroll Indicator - Bottom Line */}
      {currentProject && (
        <motion.div
          style={{ scaleX, transformOrigin: "left" }}
          className="absolute bottom-0 left-0 h-[3px] w-full hidden md:block bg-green-700 z-0 origin-left"
        />
      )}

      {/* Project Image */}
      <div className="relative w-12 h-12 shrink-0 rounded-md overflow-hidden bg-gray-800 border border-white/10 mt-1">
        {project?.image ? (
          <Image
            src={project.image}
            alt={project.name}
            fill
            className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
          />

        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-900 text-xs text-gray-500">
            N/A
          </div>
        )}
      </div>

      <div className="flex flex-col min-w-0 z-10">
        <p className="font-medium text-base text-gray-200 tracking-wide truncate group-hover:text-white transition-colors">
          {project?.name}
        </p>
        {project?.shortDescription && (
          <p className="text-xs text-gray-500 line-clamp-2 mt-0.5 group-hover:text-gray-400 transition-colors">
            {project?.shortDescription}
          </p>
        )}
      </div>
    </div>
  );
};

export default SidebarCard;
