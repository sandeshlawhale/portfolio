import { useAppContext } from "@/context/AppContext";
import { Project } from "@/types";
import { MotionValue, motion, useMotionValueEvent } from "framer-motion";
import { useRouter } from "next/navigation";

const SidebarCard = ({
  project,
  scrollYProgress,
  currentProject,
}: {
  project: Project;
  scrollYProgress?: MotionValue;
  currentProject?: Project[];
}) => {
  const { setSearchSlug, searchSlug } = useAppContext();
  const router = useRouter();
  const scaleX = scrollYProgress;

  const handleClick = () => {
    setSearchSlug(project?.slug);
    router.push(`/work/${project?.slug}`);
  };

  return (
    <div
      className={`relative ${
        searchSlug === project?.slug && "bg-secondary-light"
      } p-3 flex flex-col gap-1 hover:bg-secondary-light rounded-lg cursor-pointer overflow-hidden`}
      onClick={() => handleClick()}
    >
      {currentProject && (
        <motion.div
          style={{ scaleX }}
          className="absolute inset-0 h-full w-full bg-primary z-0 origin-left"
        />
      )}
      <p className="font-semibold tracking-wide z-10">{project?.name}</p>
      <p className="font-semibold tracking-wide text-sm text-mutedText z-10">
        {project?.shortDescription.slice(0, 70)}...
      </p>
    </div>
  );
};

export default SidebarCard;
