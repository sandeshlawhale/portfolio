import { getAllProject } from "@/utils/api/projets";
import { Project } from "@/types";
import WorkLayoutClient from "@/components/layout/work-layout-client";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const projects: Project[] = await getAllProject();

  return (
    <div className="flex h-screen w-full">
      <WorkLayoutClient projects={projects}>{children}</WorkLayoutClient>
    </div>
  );
};

export default Layout;
