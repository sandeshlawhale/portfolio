import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";
import Footer from "@/components/footer/footer";
import { getProjectById, getAllProjects } from "@/utils/api/projects";
import InfoRow from "@/components/projects/info-row";
import { Metadata } from "next";
import { Project } from "@/types";

interface PageProps {
  searchParams: Promise<{ id?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { id } = await searchParams;
  if (!id) return { title: "Projects" };

  const project = await getProjectById(id).catch(() => null);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${project.name} | Project Details`,
    description: project.description?.[0] || "Project details",
  };
}

const ProjectsPage = async ({ searchParams }: PageProps) => {
  try {
    const { id } = await searchParams;
    const projectsData = await getAllProjects({ draft: false });
    const projects: Project[] = projectsData.result;

    if (projects.length === 0) {
      return (
        <div className="w-full h-full flex items-center justify-center text-secondaryText text-sm">
          No projects found.
        </div>
      );
    }

    // If no ID is provided, redirect to the first project
    if (!id) {
      redirect(`/projects?id=${projects[0]._id}`);
    }

    const currentProject = projects.find(p => p._id === id) || await getProjectById(id).catch(() => null);

    if (!currentProject) {
      redirect(`/projects?id=${projects[0]._id}`);
    }

    return (
      <>
        <div className="flex flex-col gap-10 w-full ">
          <div className="mt-0 w-full aspect-[2/1] rounded-lg overflow-hidden px-4">
            {currentProject.image ? (
              <Image
                src={typeof currentProject.image === "string" ? currentProject.image : ""}
                alt={currentProject.name}
                width={1000}
                height={700}
                className="w-full h-full object-cover rounded-lg"
                priority
              />
            ) : (
              <div className="w-full h-full bg-linear-to-tr to-indigo-500/30 flex items-center justify-center rounded-lg">
                <div className="w-full h-full rounded-lg overflow-hidden bg-[#121212] flex items-center justify-center">
                  <p className="text-base text-mutedText">No Preview Available</p>
                </div>
              </div>
            )}
          </div>

          <section className="flex flex-col gap-4">
            <div className="w-full flex items-start justify-between px-4">
              <h1 className="text-xl font-semibold text-primaryText">
                {currentProject.name}
              </h1>
              <div className="flex gap-4">
                {currentProject.gitlink && (
                  <Link
                    href={currentProject.gitlink}
                    target="_blank"
                    className="group"
                  >
                    <Image
                      src="/assets/svg/github.svg"
                      alt="github"
                      width={25}
                      height={25}
                      className="w-6 h-6 brightness-75 group-hover:brightness-200 duration-150"
                    />
                  </Link>
                )}
                {currentProject.demoLink && (
                  <Link
                    href={currentProject.demoLink}
                    target="_blank"
                    className="group"
                  >
                    <Image
                      src="/assets/svg/link.svg"
                      alt="Demo"
                      width={25}
                      height={25}
                      className="w-6 h-6 brightness-75 group-hover:brightness-200 duration-150"
                    />
                  </Link>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1.5 px-4">
              {currentProject.role && (
                <InfoRow label="Role" value={currentProject.role} />
              )}
              {currentProject.techstack?.length > 0 && (
                <InfoRow
                  label="Tech Stack"
                  value={currentProject.techstack.join(", ")}
                />
              )}
              {currentProject.timeline && (
                <InfoRow label="Timeline" value={currentProject.timeline} />
              )}
              {currentProject.outcome && (
                <InfoRow label="Outcome" value={currentProject.outcome} />
              )}
            </div>

            <div className="w-full space-y-2">
              {currentProject.otherLink?.map(
                ({ _id, title, link, downloadable }: { _id: string; title: string; link: string; downloadable: boolean }) => (
                  <div key={_id}>
                    <Link href={link} target="_blank">
                      <div className="flex items-center justify-between gap-4 hover:bg-primary transition duration-200 ease-in px-4 py-2 rounded-lg">
                        <div>
                          <p className="text-lg font-bold tracking-wide text-secondaryText">
                            {title === "app_download"
                              ? "WallList_Pre_Alpha_03"
                              : "WallList Feedback Form"}
                          </p>
                          <p className="text-sm text-gray-400">{title}</p>
                        </div>
                        <div>
                          {downloadable ? (
                            <Image
                              src="/assets/svg/download.svg"
                              alt="Download"
                              width={24}
                              height={24}
                              className="w-6 h-6 brightness-75 group-hover:brightness-200 duration-150"
                            />
                          ) : (
                            <Image
                              src="/assets/svg/link3.svg"
                              alt="Link"
                              width={20}
                              height={20}
                              className="w-5 h-5 brightness-75 group-hover:brightness-200 duration-150"
                            />
                          )}
                        </div>
                      </div>
                    </Link>
                  </div>
                )
              )}
            </div>

            {currentProject.description?.map((detail: string, index: number) => (
              <p
                key={`detail_${index}`}
                className="text-base font-normal tracking-wide text-gray-200 px-4"
              >
                {detail}
              </p>
            ))}

            {currentProject.quote && (
              <div className="px-4">
                <blockquote
                  className="relative text-indigo-300 pl-3"
                  id="about-vision"
                >
                  <div className="absolute left-0 top-0 h-full w-6 bg-indigo-400/30" />
                  <p className="italic text-lg font-medium">
                    &quot;{currentProject.quote?.title}&quot;
                  </p>
                  <p>{currentProject.quote.description}</p>
                </blockquote>
              </div>
            )}
          </section>
        </div>
        <Footer />
      </>
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
    console.error("ProjectsPage error:", errorMessage);
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center p-8 text-center gap-4">
        <h1 className="text-2xl font-bold text-red-500">Something went wrong</h1>
        <p className="text-primaryText max-w-md">
          Failed to load projects. This is likely due to a database connection issue or missing configuration.
        </p>
        <div className="bg-[#1a1a1a] p-4 rounded-lg border border-red-500/20 text-xs font-mono text-red-400 max-w-xl overflow-auto">
          Error: {errorMessage}
        </div>
        <Link href="/" className="text-indigo-400 hover:underline mt-4">
          Back to Home
        </Link>
      </div>
    );
  }
};

export default ProjectsPage;
