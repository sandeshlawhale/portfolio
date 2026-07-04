import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";
import Footer from "@/components/footer/footer";
import { getProjectById, getAllProjects } from "@/utils/api/projects";
import { Metadata } from "next";
import { Project, OtherLink } from "@/types";
import { ExternalLink, Github, CheckCircle2, ArrowRight, FolderGit2, Download } from "lucide-react";

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

    return (
      <div className="flex flex-col min-h-screen bg-[#030303] text-[#e5e1e4] font-sans antialiased">
        <div className="flex-1 w-full max-w-3xl mx-auto py-6 md:py-10 px-4 md:px-6 space-y-12 animate-in fade-in duration-300">
          
          {/* Header Area */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[#adc6ff] font-mono text-xs font-semibold uppercase tracking-widest">{date}</span>
                {currentProject.featured && (
                  <span className="text-[10px] font-bold bg-[#adc6ff]/20 text-[#adc6ff] border border-[#adc6ff]/35 px-2 py-0.5 rounded-full uppercase tracking-wider">Featured</span>
                )}
                {currentProject.category && (
                  <span className="text-[10px] font-bold bg-[#27272a] text-[#c2c6d6] px-2 py-0.5 rounded-full uppercase tracking-wider">{currentProject.category}</span>
                )}
              </div>
              <h1 className="text-3xl md:text-3xl font-bold text-primaryText">{currentProject.name}</h1>
              <p className="text-[#c2c6d6] text-base md:text-lg leading-relaxed max-w-3xl">{currentProject.shortDescription}</p>
            </div>

            {/* Actions Panel */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              {liveLink && (
                <Link
                  href={liveLink}
                  target="_blank"
                  className="flex items-center gap-2 bg-[#adc6ff] text-[#002e6a] px-5 py-2.5 rounded-lg text-sm font-semibold hover:brightness-110 active:scale-95 transition-all shadow-md shadow-[#adc6ff]/10"
                >
                  <ExternalLink className="w-4 h-4" />
                  Live Demo
                </Link>
              )}
              {githubLink && (
                <Link
                  href={githubLink}
                  target="_blank"
                  className="flex items-center gap-2 bg-[#131315] hover:bg-[#201f22] border border-[#27272a] text-[#e5e1e4] px-5 py-2.5 rounded-lg text-sm font-semibold active:scale-95 transition-all"
                >
                  <Github className="w-4 h-4" />
                  Repository
                </Link>
              )}
            </div>
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

          {/* Core Stats Grid */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 bg-[#0e0e10] border border-[#27272a] rounded-xl space-y-1 hover:border-[#8c909f]/30 transition-all duration-300">
              <p className="text-[#8c909f] text-[10px] uppercase tracking-wider font-bold">Role</p>
              <p className="text-[#e5e1e4] font-semibold text-base truncate">{role || "Developer"}</p>
            </div>
            <div className="p-5 bg-[#0e0e10] border border-[#27272a] rounded-xl space-y-1 hover:border-[#8c909f]/30 transition-all duration-300">
              <p className="text-[#8c909f] text-[10px] uppercase tracking-wider font-bold">Timeline</p>
              <p className="text-[#e5e1e4] font-semibold text-base truncate">{date || "Completed"}</p>
            </div>
            <div className="p-5 bg-[#0e0e10] border border-[#27272a] rounded-xl space-y-1 hover:border-[#8c909f]/30 transition-all duration-300">
              <p className="text-[#8c909f] text-[10px] uppercase tracking-wider font-bold">Status</p>
              <p className="text-[#e5e1e4] font-semibold text-base flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                {status}
              </p>
            </div>
            <div className="p-5 bg-[#0e0e10] border border-[#27272a] rounded-xl space-y-1 hover:border-[#8c909f]/30 transition-all duration-300">
              <p className="text-[#8c909f] text-[10px] uppercase tracking-wider font-bold">Team / Company</p>
              <p className="text-[#e5e1e4] font-semibold text-base truncate">
                {company ? `${team} (${company})` : team}
              </p>
            </div>
          </section>

          {/* Tech Stack Badges */}
          {techStackList.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-[#8c909f]">Technologies Used</h3>
              <div className="flex flex-wrap gap-2">
                {techStackList.map((tech: string) => (
                  <span
                    key={tech}
                    className="px-3.5 py-1.5 bg-[#131315] hover:bg-[#1c1b1d] border border-[#27272a] rounded-lg text-xs font-mono text-[#e5e1e4] flex items-center gap-2 transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#adc6ff]"></span>
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Secondary Resources Links */}
          {otherLinks.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-[#8c909f]">Resources & Links</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {otherLinks.map(
                  (link: OtherLink, idx: number) => (
                    <Link key={link._id || idx} href={link.url} target="_blank" className="group">
                      <div className="flex items-center justify-between gap-4 bg-[#0e0e10] border border-[#27272a] hover:border-[#adc6ff]/40 hover:bg-[#131315] transition duration-200 ease-in px-5 py-4 rounded-xl">
                        <div>
                          <p className="text-sm font-bold tracking-wide text-[#e5e1e4] group-hover:text-[#adc6ff] transition-colors">
                            {link.label}
                          </p>
                          <span className="text-xs text-[#8c909f]">Project Resource Link</span>
                        </div>
                        <div className="p-2 bg-[#131315] group-hover:bg-[#adc6ff]/10 rounded-lg transition-colors border border-[#27272a]">
                          <ArrowRight className="w-4 h-4 text-[#8c909f] group-hover:text-[#adc6ff]" />
                        </div>
                      </div>
                    </Link>
                  )
                )}
              </div>
            </div>
          )}

          {/* Detailed Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 pt-4">
            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-lg font-bold text-[#e5e1e4]">Overview</h3>
              <div className="space-y-5 text-[#c2c6d6] text-base leading-relaxed">
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
            </div>

            {/* Side Outcome / Success metrics Panel */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-[#e5e1e4]">Outcomes & Outcomes</h3>
              <div className="p-6 bg-[#0e0e10]/80 border border-[#27272a] rounded-2xl space-y-4">
                <div className="flex gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest items-center">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  Key Achievements
                </div>
                <p className="text-sm text-[#c2c6d6] leading-relaxed">
                  {(currentProject as any).outcome || "No outcome metrics documented yet for this project."}
                </p>
              </div>

              {currentProject.quote && (
                <div className="p-6 bg-[#131315]/40 border border-[#27272a]/80 rounded-2xl relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#adc6ff]" />
                  <p className="italic text-sm font-medium text-[#adc6ff] mb-2">
                    &quot;{currentProject.quote.title}&quot;
                  </p>
                  <p className="text-xs text-[#c2c6d6] leading-relaxed">{currentProject.quote.description}</p>
                </div>
              )}
            </div>
          </div>

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
