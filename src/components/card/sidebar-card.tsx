"use client";

import { useAppContext } from "@/context/AppContext";
import { Project } from "@/types";
import { MotionValue, motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";

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
  const params = useParams();
  const scaleX = scrollYProgress;

  const handleClick = () => {
    router.push(`/projects/${project?._id}`);
    closeSidebar();
  };

  return (
    <div
      className={`relative ${params.id === project?._id && "bg-secondary-light"
        } p-2 flex items-center gap-3 hover:bg-secondary-light rounded-lg cursor-pointer overflow-hidden group transition-colors duration-200 ease-in`}
      onClick={() => handleClick()}
    >
      {/* Current Project Scroll Indicator - Bottom Line */}
      {currentProject && (
        <motion.div
          style={{ scaleX }}
          className="absolute bottom-0 left-0 h-[3px] w-full hidden md:block bg-green-700 z-0 origin-left"
        />
      )}

      {/* Project Image */}
      <div className="relative w-12 h-12 shrink-0 rounded-md overflow-hidden bg-gray-800 border border-white/10 mt-1">
        {project?.image ? (
          <img
            src={project.image as string}
            alt={project.name}
            className="w-full h-full object-cover"
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
