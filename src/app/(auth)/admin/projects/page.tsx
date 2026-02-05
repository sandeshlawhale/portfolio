"use client";

import { useState, useEffect } from "react";
import NextImage from "next/image";
import { useRouter } from "next/navigation";
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

export interface Project {
    _id: string;
    name: string;
    image: string;
    role: string;
    timeline: string;
    techstack: string[];
    description: string[];
    draft: boolean;
}

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
            console.log("Failed to fetch projects: ", error)
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleDelete = async (id: string, name: string, confirmation: string) => {
        const truncatedName = name.split("(")[0].trim();
        if (confirmation !== `sudo delete ${truncatedName}`) {
            toast.error("Incorrect confirmation command");
            return;
        }

        try {
            await deleteProject(id);
            toast.success("Project deleted successfully");
            fetchProjects();
        } catch (error) {
            toast.error("Failed to delete project");
            console.log("Failed to delete project: ", error)
        }
    };

    return (
        <div className="w-full max-w-6xl mx-auto space-y-6">
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
                        <TooltipProvider>
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="w-[80px]">Image</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Timeline</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Tech Stack</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {projects.map((project: Project) => (
                                        <TableRow key={project._id} className="group transition-colors hover:bg-muted/50">
                                            <TableCell>
                                                <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-border bg-muted">
                                                    {project.image && (
                                                        <NextImage
                                                            src={project.image}
                                                            alt={project.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-semibold">{project.name}</TableCell>
                                            <TableCell className="text-sm text-muted-foreground">{project.role}</TableCell>
                                            <TableCell className="text-sm text-muted-foreground whitespace-nowrap">{project.timeline}</TableCell>
                                            <TableCell>
                                                <Badge variant={project.draft ? "outline" : "default"}>
                                                    {project.draft ? "Draft" : "Published"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <div className="max-w-[150px] truncate text-xs text-muted-foreground cursor-help">
                                                            {project.techstack.join(", ")}
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent side="top" className="max-w-xs">
                                                        <div className="flex flex-wrap gap-1 p-1">
                                                            {project.techstack.map((tech: string) => (
                                                                <Badge key={tech} variant="secondary" className="text-[10px] py-0">{tech}</Badge>
                                                            ))}
                                                        </div>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <div className="max-w-[150px] truncate text-xs text-muted-foreground cursor-help">
                                                            {Array.isArray(project.description) ? project.description[0] : project.description}
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent side="top" className="max-w-[300px] p-3 text-xs leading-relaxed">
                                                        {Array.isArray(project.description) ? project.description.join(" ") : project.description}
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button size="icon" variant="ghost" onClick={() => router.push(`/admin/projects/${project._id}/edit`)}>
                                                        <Edit className="w-4 h-4 text-muted-foreground hover:text-primary" />
                                                    </Button>

                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button size="icon" variant="ghost" className="hover:bg-destructive/10">
                                                                <Trash2 className="w-4 h-4 text-destructive" />
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-80 bg-primary" align="end">
                                                            <div className="space-y-4">
                                                                <div className="space-y-2">
                                                                    <h4 className="font-medium leading-none text-destructive">Delete Project?</h4>
                                                                    <p className="text-sm text-muted-foreground">
                                                                        Type <span className="font-mono bg-muted px-1 rounded">
                                                                            <Badge variant="secondary" className="text-sm py-0">sudo delete {project.name.split("(")[0].trim()}</Badge>
                                                                        </span> to confirm.
                                                                    </p>
                                                                </div>
                                                                <DeleteConfirmation project={project} onDelete={handleDelete} />
                                                            </div>
                                                        </PopoverContent>
                                                    </Popover>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TooltipProvider>
                    )}
                </div>
            )}
        </div>
    );
}

function DeleteConfirmation({ project, onDelete }: { project: Project, onDelete: (id: string, name: string, confirm: string) => void }) {
    const [confirmText, setConfirmText] = useState("");
    const truncatedName = project.name.split("(")[0].trim();

    return (
        <div className="space-y-4">
            <Input
                placeholder={`sudo delete ${truncatedName}`}
                value={confirmText}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmText(e.target.value)}
                className="text-sm"
            />
            <Button
                variant="destructive"
                size="sm"
                className="w-full"
                disabled={confirmText !== `sudo delete ${truncatedName}`}
                onClick={() => onDelete(project._id, truncatedName, confirmText)}
            >
                Confirm Delete
            </Button>
        </div>
    )
}
