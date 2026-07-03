"use client";

import { useState, useEffect } from "react";
import NextImage from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getAllProjects, deleteProject } from "@/utils/api/projects";
import { Trash2, Edit, Plus, Loader2, ExternalLink, Github } from "lucide-react";

export type Project = {
    _id: string;
    name: string;
    shortDescription: string;
    description: string[]; // array of paragraphs / points
    role: string;
    outcome: string;
    timeline: string;
    techstack: string[];
    image: string;    // URL
    demoLink: string; // URL
    gitlink: string;  // URL
    otherLink: string[]; // array of URLs
    draft: boolean;
    featured?: boolean;
};

export default function AdminProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

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

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete "${name}"?`)) {
            return;
        }

        try {
            await deleteProject(id);
            toast.success("Project deleted successfully");
            fetchProjects();
        } catch (error) {
            toast.error("Failed to delete project");
            console.log("Failed to delete project: ", error);
        }
    };

    return (
        <div className="w-full max-w-[1440px] mx-auto pt-6 px-4 md:px-10 pb-12 text-[#e5e1e4] font-sans antialiased">
            {/* Toolbar Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h2 className="text-[48px] font-semibold tracking-tight leading-none mb-2">Projects</h2>
                    <p className="text-[#c2c6d6] text-[14px]">Manage and showcase your architectural code masterpieces.</p>
                </div>
                <div className="flex items-center gap-3 self-start md:self-end">
                    <button 
                        onClick={() => router.push("/admin/projects/add")} 
                        className="flex items-center gap-2 px-4 py-2.5 bg-[#adc6ff] text-[#002e6a] rounded-lg text-[14px] font-medium hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-[#adc6ff]/10"
                    >
                        <Plus className="w-[18px] h-[18px]" />
                        Add Project
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-[#adc6ff]" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {projects.map((project: Project) => (
                        <div key={project._id} className="group relative bg-[#0e0e10] border border-[#424754] rounded-xl overflow-hidden hover:border-[#3f3f46] hover:shadow-[0_0_40px_0_rgba(59,130,246,0.1)] transition-all duration-300 flex flex-col">
                            <div className="relative h-56 overflow-hidden bg-[#131315]">
                                {project.image ? (
                                    <NextImage
                                        src={project.image}
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
                                {/* Hover Actions Overlay */}
                                <div className="absolute inset-0 bg-[#030303]/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                                    {project.demoLink && (
                                        <a 
                                            href={project.demoLink} 
                                            target="_blank" 
                                            rel="noreferrer" 
                                            className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform" 
                                            title="View Demo"
                                        >
                                            <ExternalLink className="w-5 h-5" />
                                        </a>
                                    )}
                                    {project.gitlink && (
                                        <a 
                                            href={project.gitlink} 
                                            target="_blank" 
                                            rel="noreferrer" 
                                            className="w-10 h-10 rounded-full bg-[#353437] text-white flex items-center justify-center hover:scale-110 transition-transform" 
                                            title="Github"
                                        >
                                            <Github className="w-5 h-5" />
                                        </a>
                                    )}
                                    <button 
                                        onClick={() => router.push(`/admin/projects/${project._id}`)} 
                                        className="w-10 h-10 rounded-full bg-[#353437] text-white flex items-center justify-center hover:scale-110 transition-transform" 
                                        title="Edit"
                                    >
                                        <Edit className="w-5 h-5" />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(project._id, project.name)} 
                                        className="w-10 h-10 rounded-full bg-[#93000a] text-[#ffdad6] flex items-center justify-center hover:scale-110 transition-transform" 
                                        title="Delete"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-6 flex-1 flex flex-col bg-[#0e0e10]">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-[20px] font-bold group-hover:text-[#adc6ff] transition-colors">{project.name}</h3>
                                    <span className="text-[#c2c6d6] font-mono text-[13px]">{project.timeline}</span>
                                </div>
                                <p className="text-[#c2c6d6] text-[14px] line-clamp-2 mb-4">
                                    {project.shortDescription || (Array.isArray(project.description) ? project.description[0] : project.description)}
                                </p>
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {project.techstack.slice(0, 3).map((tech) => (
                                        <span key={tech} className="px-2 py-0.5 bg-[#201f22] text-[#c2c6d6] rounded font-mono text-[11px] border border-[#424754]">
                                            {tech}
                                        </span>
                                    ))}
                                    {project.techstack.length > 3 && (
                                        <span className="px-2 py-0.5 bg-[#201f22] text-[#8c909f] rounded font-mono text-[11px] border border-[#424754]">
                                            +{project.techstack.length - 3} more
                                        </span>
                                    )}
                                </div>
                                <div className="mt-auto pt-4 border-t border-[#424754] flex items-center justify-between text-[#c2c6d6]">
                                    <span className="text-[12px] font-medium uppercase tracking-wider">{project.role || "Developer"}</span>
                                    <span className="text-[12px] font-medium uppercase tracking-widest opacity-60">
                                        {project.draft ? "WIP" : "Live"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}

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
