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
    router.push(`/work/${project?._id}`);
    closeSidebar();
  };

  return (
    <div
      className={`relative ${
        params.id === project?._id && "bg-secondary-light"
      } p-3 flex flex-col gap-1 hover:bg-secondary-light rounded-lg cursor-pointer overflow-hidden`}
      onClick={() => handleClick()}
    >
      {currentProject && (
        <motion.div
          style={{ scaleX }}
          className="absolute inset-0 h-full w-full hidden md:block bg-primary z-0 origin-left"
        />
      )}
      <p className="font-semibold tracking-wide z-10">{project?.name}</p>
      {project?.shortDescription && (
        <p className="font-semibold tracking-wide text-sm text-mutedText z-10 truncate">
          {project?.shortDescription}
        </p>
      )}
    </div>
  );
};

export default SidebarCard;
