import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";
import Footer from "@/components/footer/footer";
import { getProjectById, getAllProjects } from "@/utils/api/projects";
import { Metadata } from "next";
import { Project, OtherLink } from "@/types";
import { ExternalLink, Github, CheckCircle2, ArrowRight, FolderGit2, Link2 } from "lucide-react";

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
    description: project.shortDescription || "Project details",
  };
}

const ProjectsPage = async ({ searchParams }: PageProps) => {
  try {
    const { id } = await searchParams;
    const projectsData = await getAllProjects({ draft: false });
    const projects: Project[] = projectsData.result;

    if (projects.length === 0) {
      return (
        <div className="w-full h-full flex items-center justify-center text-[#c2c6d6] text-sm">
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

    // Backward compatibility safe values
    const role = currentProject.quickInfo?.role || (currentProject as any).role || "";
    const date = currentProject.quickInfo?.date || (currentProject as any).timeline || "";
    const team = currentProject.quickInfo?.team || "Solo";
    const company = currentProject.quickInfo?.company || "";
    const status = currentProject.quickInfo?.status || "Completed";

    const githubLink = currentProject.links?.github || (currentProject as any).gitlink || "";
    const liveLink = currentProject.links?.live || (currentProject as any).demoLink || "";

    // Normalizing dynamic other links
    const otherLinks = currentProject.links?.other || (currentProject as any).otherLink?.map((l: any) => ({
      label: l.title || l.label || "",
      url: l.link || l.url || ""
    })) || [];

    const techStackList = currentProject.techStack || (currentProject as any).techstack || [];
    const descriptionContent = currentProject.description;

    // Filter similar projects in the same category
    const similarProjects = projects
      .filter(p => p._id !== currentProject._id && p.category === currentProject.category)
      .slice(0, 2);

    return (
      <div className="flex flex-col min-h-screen bg-[#030303] text-[#e5e1e4] font-sans antialiased">
        <div className="flex-1 w-full max-w-3xl mx-auto py-6 md:py-10 px-2 md:px-6 space-y-4 md:space-y-8 animate-in fade-in duration-300">

          {/* Header Area */}
          <div className="space-y-2">
            <h1 className="text-xl md:text-3xl font-bold text-primaryText">{currentProject.name}</h1>
            <p className="text-[#c2c6d6] text-sm md:text-base line-clamp-2 leading-relaxed max-w-3xl">
              {currentProject.shortDescription}
            </p>
          </div>

          {/* Hero Banner Image */}
          <div className="relative w-full aspect-[16/9] bg-[#131315] rounded-2xl overflow-hidden border border-[#27272a] group">
            {currentProject.image ? (
              <Image
                src={typeof currentProject.image === "string" ? currentProject.image : ""}
                alt={currentProject.name}
                fill
                priority
                className="object-cover transition-transform duration-500 group-hover:scale-[1.01]"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-[#8c909f] gap-2 bg-[#121212]">
                <FolderGit2 className="w-12 h-12 opacity-35" />
                <span className="text-sm">No Preview Image Available</span>
              </div>
            )}
          </div>

          {/* Date, Category & Minimal Links Row */}
          <div className="flex items-center justify-between text-xs md:text-sm text-[#8c909f]">
            <div className="flex items-center gap-2">
              <span>{date}</span>
              {currentProject.category && (
                <>
                  <span className="w-1 h-1 rounded-full bg-[#8c909f]/50"></span>
                  <span className="text-[#adc6ff]">{currentProject.category}</span>
                </>
              )}
            </div>

            {/* Icons-only Actions Panel */}
            <div className="flex items-center gap-4">
              {githubLink && (
                <Link
                  href={githubLink}
                  target="_blank"
                  className="text-[#c2c6d6] hover:text-[#adc6ff] transition-colors"
                  title="Repository"
                >
                  <Github className="w-5 h-5" />
                </Link>
              )}
              {liveLink && (
                <Link
                  href={liveLink}
                  target="_blank"
                  className="text-[#c2c6d6] hover:text-[#adc6ff] transition-colors"
                  title="Live Demo"
                >
                  <ExternalLink className="w-5 h-5" />
                </Link>
              )}
              {otherLinks.map((link: OtherLink, idx: number) => (
                <Link
                  key={link._id || idx}
                  href={link.url}
                  target="_blank"
                  className="text-[#c2c6d6] hover:text-[#adc6ff] transition-colors"
                  title={link.label}
                >
                  <Link2 className="w-5 h-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Info Table */}
          <div className="overflow-hidden bg-[#0e0e10]/20">
            <table className="w-full text-left border-collapse text-xs md:text-sm">
              <tbody>
                <tr>
                  <td className="p-3 text-[#8c909f] font-medium w-1/3">Role</td>
                  <td className="p-3 text-[#e5e1e4]">{role || "Developer"}</td>
                </tr>
                <tr>
                  <td className="p-3 text-[#8c909f] font-medium">Timeline</td>
                  <td className="p-3 text-[#e5e1e4]">{date || "Completed"}</td>
                </tr>
                <tr>
                  <td className="p-3 text-[#8c909f] font-medium">Status</td>
                  <td className="p-3 text-[#e5e1e4] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    {status}
                  </td>
                </tr>
                <tr>
                  <td className="p-3 text-[#8c909f] font-medium">Team / Company</td>
                  <td className="p-3 text-[#e5e1e4]">{company ? `${team} (${company})` : team}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Tech Stack Badges */}
          {techStackList.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-[#8c909f]">Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {techStackList.map((tech: string) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-[#131315] hover:bg-[#1c1b1d] border border-[#27272a] rounded-lg text-xs font-mono text-[#e5e1e4] transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Detailed Content (Full Width) */}
          <div className="w-full space-y-4 text-[#c2c6d6] text-sm md:text-base leading-relaxed">
            {descriptionContent ? (
              Array.isArray(descriptionContent) ? (
                descriptionContent.map((detail: string, index: number) => {
                  const isHtml = detail.includes("<p>") || detail.includes("<h") || detail.includes("<ul>") || detail.includes("<li>");
                  if (isHtml) {
                    return (
                      <div
                        key={`detail_${index}`}
                        className="tiptap-rendered-content space-y-4"
                        dangerouslySetInnerHTML={{ __html: detail }}
                      />
                    );
                  }
                  return <p key={`detail_${index}`}>{detail}</p>;
                })
              ) : (
                descriptionContent.includes("<p>") || descriptionContent.includes("<h") || descriptionContent.includes("<ul>") || descriptionContent.includes("<li>") ? (
                  <div
                    className="tiptap-rendered-content space-y-4"
                    dangerouslySetInnerHTML={{ __html: descriptionContent }}
                  />
                ) : (
                  <p>{descriptionContent}</p>
                )
              )
            ) : (
              <p>No description provided.</p>
            )}
          </div>

          {/* Similar Projects */}
          {similarProjects.length > 0 && (
            <div className="border-t border-[#27272a]/60 space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-[#8c909f]">Similar Projects</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {similarProjects.map((proj: Project) => (
                  <Link
                    key={proj._id}
                    href={`/projects?id=${proj._id}`}
                    className="p-3 bg-[#0e0e10]/20 border border-[#27272a] hover:border-[#adc6ff]/35 hover:bg-[#131315]/50 rounded-xl transition-all flex items-center gap-3 group"
                  >
                    <div className="relative w-12 h-12 shrink-0 rounded-md overflow-hidden bg-gray-800 border border-white/10">
                      {proj.image ? (
                        <Image
                          src={typeof proj.image === "string" ? proj.image : ""}
                          alt={proj.name}
                          fill
                          className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-900 text-xs text-gray-500">
                          N/A
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-xs md:text-sm text-gray-200 group-hover:text-[#adc6ff] transition-colors truncate">
                        {proj.name}
                      </span>
                      <span className="text-[10px] md:text-xs text-gray-500 line-clamp-1 mt-0.5">
                        {proj.shortDescription}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
        <Footer />
      </div>
    );
  } catch (error: unknown) {
    if (error && typeof error === "object" && "digest" in error &&
      typeof (error as { digest: unknown }).digest === "string" &&
      (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
    console.error("ProjectsPage error:", errorMessage);
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center p-8 text-center gap-4 bg-[#030303] text-[#e5e1e4]">
        <h1 className="text-2xl font-bold text-red-500">Something went wrong</h1>
        <p className="text-[#c2c6d6] max-w-md">
          Failed to load projects. This is likely due to a database connection issue or missing configuration.
        </p>
        <div className="bg-[#1a1a1a] p-4 rounded-lg border border-red-500/20 text-xs font-mono text-red-400 max-w-xl overflow-auto">
          Error: {errorMessage}
        </div>
        <Link href="/" className="text-[#adc6ff] hover:underline mt-4">
          Back to Home
        </Link>
      </div>
    );
  }
};

export default ProjectsPage;
