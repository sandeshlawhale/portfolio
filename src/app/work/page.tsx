import { redirect } from "next/navigation";
import { getAllProject } from "@/utils/api/projets";
import { Project } from "@/types";

const Work = async () => {
  const projects: Project[] = await getAllProject();

  if (projects.length > 0) {
    redirect(`/work/${projects[0]._id}`);
  }

  return (
    <div className="w-full h-full flex items-center justify-center text-secondaryText text-sm">
      No projects found.
    </div>
  );
};

export default Work;
