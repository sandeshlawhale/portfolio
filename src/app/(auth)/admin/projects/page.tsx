"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { getAllProjects, deleteProject } from "@/utils/api/projects";
import { Trash2, Edit, Plus, Loader2 } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface Project {
    _id: string;
    name: string;
    image: string;
    role: string;
    timeline: string;
    techstack: string[];
    description: any[];
}

export default function AdminProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const data = await getAllProjects();
            if (data.success) {
                setProjects(data.result);
            }
        } catch (error) {
            toast.error("Failed to fetch projects");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleDelete = async (id: string, name: string, confirmation: string) => {
        if (confirmation !== `sudo delete ${name}`) {
            toast.error("Incorrect confirmation command");
            return;
        }

        try {
            await deleteProject(id);
            toast.success("Project deleted successfully");
            fetchProjects();
        } catch (error: any) {
            toast.error(error.message || "Failed to delete project");
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto space-y-6">
            <div className="flex justify-between items-center bg-card p-6 rounded-2xl border border-border shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold">Projects</h1>
                    <p className="text-muted-foreground text-sm">Manage your portfolio projects</p>
                </div>
                <Button onClick={() => router.push("/admin/projects/add")} className="gap-2">
                    <Plus className="w-4 h-4" /> Add New
                </Button>
            </div>

            {loading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                    {projects.length === 0 ? (
                        <div className="p-12 text-center text-muted-foreground">
                            No projects found. Add your first project!
                        </div>
                    ) : (
                        <Accordion type="single" collapsible className="w-full">
                            {projects.map((project) => (
                                <AccordionItem key={project._id} value={project._id} className="border-b last:border-0">
                                    <div className="flex items-center px-4 py-2 hover:bg-accent/20 transition-colors">
                                        <AccordionTrigger className="hover:no-underline flex-1 py-3 px-4">
                                            <div className="grid grid-cols-[60px_2fr_1.5fr_1.5fr] gap-6 items-center w-full text-left">
                                                {/* Image Column */}
                                                <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-border bg-muted">
                                                    {project.image && (
                                                        <Image
                                                            src={project.image}
                                                            alt={project.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    )}
                                                </div>

                                                {/* Name Column */}
                                                <div className="font-semibold truncate text-base">{project.name}</div>

                                                {/* Role Column */}
                                                <div className="text-sm text-muted-foreground truncate hidden md:block">{project.role}</div>

                                                {/* Timeline Column */}
                                                <div className="text-sm text-muted-foreground truncate hidden md:block">{project.timeline}</div>
                                            </div>
                                        </AccordionTrigger>
                                        <div className="flex items-center gap-2 ml-4">
                                            <Button size="icon" variant="ghost" onClick={(e) => { e.stopPropagation(); router.push(`/admin/projects/${project._id}/edit`) }}>
                                                <Edit className="w-4 h-4 text-muted-foreground hover:text-primary" />
                                            </Button>

                                            <Popover>
                                                <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                    <Button size="icon" variant="ghost" className="hover:bg-destructive/10">
                                                        <Trash2 className="w-4 h-4 text-destructive" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-80" align="end">
                                                    <div className="space-y-4">
                                                        <div className="space-y-2">
                                                            <h4 className="font-medium leading-none text-destructive">Delete Project?</h4>
                                                            <p className="text-sm text-muted-foreground">
                                                                Type <span className="font-mono bg-muted px-1 rounded">sudo delete {project.name}</span> to confirm.
                                                            </p>
                                                        </div>
                                                        <DeleteConfirmation project={project} onDelete={handleDelete} />
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    </div>
                                    <AccordionContent className="px-6 pb-4 pt-0 bg-accent/5">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                                            <div className="space-y-4">
                                                <div>
                                                    <h4 className="text-sm font-semibold mb-2">Tech Stack</h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {project.techstack.map((tech) => (
                                                            <span key={tech} className="text-xs bg-background border px-2 py-1 rounded-md">{tech}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <h4 className="text-sm font-semibold">Description Preview</h4>
                                                <p className="text-sm text-muted-foreground line-clamp-3">
                                                    {/* Initial simple rendering of description, assuming simplified for now */}
                                                    {Array.isArray(project.description) ? "Rich text content..." : project.description}
                                                </p>
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    )}
                </div>
            )}
        </div>
    );
}

function DeleteConfirmation({ project, onDelete }: { project: Project, onDelete: (id: string, name: string, confirm: string) => void }) {
    const [confirmText, setConfirmText] = useState("");

    return (
        <div className="space-y-4">
            <Input
                placeholder={`sudo delete ${project.name}`}
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className="text-sm"
            />
            <Button
                variant="destructive"
                size="sm"
                className="w-full"
                disabled={confirmText !== `sudo delete ${project.name}`}
                onClick={() => onDelete(project._id, project.name, confirmText)}
            >
                Confirm Delete
            </Button>
        </div>
    )
}
