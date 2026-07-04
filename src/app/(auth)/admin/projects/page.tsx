"use client";

import { useState, useEffect } from "react";
import NextImage from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getAllProjects } from "@/utils/api/projects";
import { Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Project } from "@/types";

export default function AdminProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const [statusFilter, setStatusFilter] = useState<"All" | "Draft" | "Published">("All");
    const [featuredOnly, setFeaturedOnly] = useState(false);

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const data = await getAllProjects({});
            if (data.success) {
                setProjects(data.result);
            }
        } catch (error) {
            toast.error("Failed to fetch projects");
            console.log("Failed to fetch projects: ", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const filteredProjects = projects.filter((project) => {
        if (statusFilter === "Draft" && !project.draft) return false;
        if (statusFilter === "Published" && project.draft) return false;
        if (featuredOnly && !project.featured) return false;
        return true;
    });

    return (
        <div className="w-full max-w-[1440px] mx-auto pt-2 md:pt-6 px-2 md:px-10 pb-12 text-[#e5e1e4] font-sans antialiased">
            {/* Toolbar Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 md:mb-8">
                <div>
                    <h2 className="text-3xl md:text-[48px] font-semibold tracking-tight leading-none mb-2">Projects</h2>
                    <p className="text-[#c2c6d6] text-sm md:text-[14px]">Manage and showcase your architectural code masterpieces.</p>
                </div>
                <div className="flex items-center gap-3 self-start md:self-end">
                    <button 
                        onClick={() => router.push("/admin/projects/add")} 
                        className="flex items-center gap-2 px-4 py-2.5 bg-[#adc6ff] text-[#002e6a] rounded-lg text-[14px] font-medium hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-[#adc6ff]/10 cursor-pointer"
                    >
                        <Plus className="w-[18px] h-[18px]" />
                        Add Project
                    </button>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6 p-3 md:p-4 bg-[#0e0e10] border border-[#424754] rounded-xl">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center p-1 bg-[#131315] rounded-lg border border-[#424754]">
                        {(["All", "Draft", "Published"] as const).map((status) => (
                            <button
                                key={status}
                                type="button"
                                onClick={() => setStatusFilter(status)}
                                className={`px-4 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                                    statusFilter === status 
                                        ? "bg-[#45464e] text-[#e5e1e4]" 
                                        : "text-[#c2c6d6] hover:text-[#e5e1e4]"
                                }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>

                    <div className="h-6 w-px bg-[#424754] mx-1"></div>

                    {/* Featured Switch */}
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <span className="text-xs text-[#c2c6d6] group-hover:text-[#e5e1e4] transition-colors">Featured Only</span>
                        <input
                            type="checkbox"
                            checked={featuredOnly}
                            onChange={(e) => setFeaturedOnly(e.target.checked)}
                            className="w-9 h-5 bg-[#201f22] rounded-full appearance-none relative checked:bg-[#adc6ff] transition-colors cursor-pointer before:content-[''] before:absolute before:w-4 before:h-4 before:rounded-full before:bg-white before:top-0.5 before:left-0.5 before:transition-transform checked:before:translate-x-4"
                        />
                    </label>
                </div>
                <div className="text-xs text-[#c2c6d6]">
                    Showing <span className="text-[#e5e1e4] font-semibold">{filteredProjects.length}</span> projects
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="border border-[#424754]/50 rounded-xl overflow-hidden bg-[#0e0e10]/60 flex flex-col h-[380px]">
                            <Skeleton className="h-56 w-full bg-[#131315]" />
                            <div className="p-4 md:p-6 flex-1 flex flex-col gap-3">
                                <Skeleton className="h-4 bg-[#201f22] rounded w-1/4" />
                                <Skeleton className="h-6 bg-[#201f22] rounded w-2/3" />
                                <Skeleton className="h-4 bg-[#201f22] rounded w-full" />
                                <Skeleton className="h-4 bg-[#201f22] rounded w-5/6" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                    {filteredProjects.map((project: Project) => {
                        const oldProj = project as unknown as { timeline?: string; role?: string; gitlink?: string; demoLink?: string; techstack?: string[] };
                        const date = project.quickInfo?.date || oldProj.timeline || "";
                        const role = project.quickInfo?.role || oldProj.role || "Developer";
                        const github = project.links?.github || oldProj.gitlink || "";
                        const live = project.links?.live || oldProj.demoLink || "";
                        const techStackList = project.techStack || oldProj.techstack || [];

                        return (
                            <div 
                                key={project._id} 
                                onClick={() => router.push(`/admin/projects/${project._id}/edit`)}
                                className="group relative bg-[#0e0e10] border border-[#424754] rounded-xl overflow-hidden hover:border-[#3f3f46] hover:shadow-[0_0_40px_0_rgba(59,130,246,0.1)] transition-all duration-300 flex flex-col cursor-pointer"
                            >
                                <div className="relative h-56 overflow-hidden bg-[#131315]">
                                    {project.image ? (
                                        <NextImage
                                            src={typeof project.image === "string" ? project.image : ""}
                                            alt={project.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[#8c909f]">No Image</div>
                                    )}
                                    <div className="absolute top-4 left-4">
                                        <span className={`px-3 py-1 rounded-full text-[12px] font-medium backdrop-blur-md border ${
                                            project.draft 
                                                ? "bg-[#45464e]/80 text-[#c6c6cf] border-[#424754]" 
                                                : "bg-[#adc6ff]/20 text-[#adc6ff] border-[#adc6ff]/30"
                                        }`}>
                                            {project.draft ? "Draft" : "Published"}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-4 md:p-6 flex-1 flex flex-col bg-[#0e0e10]">
                                    <div className="flex flex-col mb-3 md:mb-4">
                                        <span className="text-[#c2c6d6] font-mono text-[13px] mb-1">{date}</span>
                                        <h3 className="text-[20px] font-bold group-hover:text-[#adc6ff] transition-colors leading-tight">{project.name}</h3>
                                    </div>
                                    <p className="text-[#c2c6d6] text-[14px] line-clamp-2 mb-3 md:mb-4">
                                        {project.shortDescription || (() => {
                                            const desc = Array.isArray(project.description) ? (project.description[0] || "") : (project.description || "");
                                            return desc.replace(/<[^>]*>/g, "");
                                        })()}
                                    </p>
                                    
                                    {/* Links embedded in description */}
                                    <div className="flex flex-wrap gap-4 mb-3 md:mb-4 text-xs text-[#c2c6d6] font-medium" onClick={(e) => e.stopPropagation()}>
                                        {live && (
                                            <a 
                                                href={live} 
                                                target="_blank" 
                                                rel="noreferrer" 
                                                className="hover:text-[#adc6ff] hover:underline flex items-center gap-1 cursor-pointer"
                                            >
                                                Demo Link &rarr;
                                            </a>
                                        )}
                                        {github && (
                                            <a 
                                                href={github} 
                                                target="_blank" 
                                                rel="noreferrer" 
                                                className="hover:text-[#adc6ff] hover:underline flex items-center gap-1 cursor-pointer"
                                            >
                                                GitHub &rarr;
                                            </a>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap gap-2 mb-4 md:mb-6">
                                        {techStackList.slice(0, 3).map((tech: string) => (
                                            <span key={tech} className="px-2 py-0.5 bg-[#201f22] text-[#c2c6d6] rounded font-mono text-[11px] border border-[#424754]">
                                                {tech}
                                            </span>
                                        ))}
                                        {techStackList.length > 3 && (
                                            <span className="px-2 py-0.5 bg-[#201f22] text-[#8c909f] rounded font-mono text-[11px] border border-[#424754]">
                                                +{techStackList.length - 3} more
                                            </span>
                                        )}
                                    </div>
                                    <div className="mt-auto pt-4 border-t border-[#424754] flex items-center justify-between text-[#c2c6d6]">
                                        <span className="text-[12px] font-medium uppercase tracking-wider">{role}</span>
                                        <span className="text-[12px] font-medium uppercase tracking-widest opacity-60">
                                            {project.draft ? "WIP" : "Live"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {/* Empty State/Add Project Card */}
                    <div 
                        onClick={() => router.push("/admin/projects/add")} 
                        className="group relative border-2 border-dashed border-[#424754] rounded-xl overflow-hidden hover:border-[#adc6ff]/50 transition-all duration-300 flex flex-col items-center justify-center min-h-[380px] cursor-pointer bg-[#0e0e10]/50 hover:bg-[#0e0e10]"
                    >
                        <div className="w-16 h-16 rounded-full bg-[#201f22] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Plus className="w-8 h-8 text-[#c2c6d6] group-hover:text-[#adc6ff] transition-colors" />
                        </div>
                        <span className="text-[20px] font-bold text-[#e5e1e4]">New Project</span>
                        <p className="text-[#c2c6d6] text-[14px] mt-2">Start your next big architectural design.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
