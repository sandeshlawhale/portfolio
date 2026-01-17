import { redirect } from "next/navigation";
import { getAllProjects } from "@/utils/api/projects";
import { Project } from "@/types";

const Work = async () => {
  const projects: Project[] = (await getAllProjects()).result;

  if (projects.length > 0) {
    redirect(`/projects/${projects[0]._id}`);
  }

  return (
    <div className="w-full h-full flex items-center justify-center text-secondaryText text-sm">
      No projects found.
    </div>
  );
};

export default Work;
