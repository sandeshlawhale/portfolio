import { getAllProjects } from "@/utils/api/projects";
import { Project } from "@/types";
import ProjectsLayoutClient from "@/components/layout/projects-layout-client";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const projects: Project[] = (await getAllProjects({ draft: false, limit: 10 })).result;

  return (
    <div className="flex h-screen w-full">
      <ProjectsLayoutClient projects={projects}>{children}</ProjectsLayoutClient>
    </div>
  );
};

export default Layout;
