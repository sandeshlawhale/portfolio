"use client";

import { useState, useEffect } from "react";
import ProjectForm from "@/components/admin/project-form";
import { getProjectById } from "@/utils/api/projects";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { Project } from "../../page";

export default function EditProjectPage() {
    const params = useParams();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                if (typeof params.id === 'string') {
                    const data = await getProjectById(params.id);
                    if (data) {
                        setProject(data);
                    } else {
                        toast.error("Project not found");
                    }
                }
            } catch (error) {
                toast.error("Failed to fetch project details");
                console.log("Failed to fetch project details: ", error)
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [params.id]);

    if (loading) {
        return (
            <div className="flex justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!project) {
        return (
            <div className="p-12 text-center text-muted-foreground">
                Project not found.
            </div>
        )
    }

    return (
        <div className="w-full max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Edit Project</h1>
                <p className="text-muted-foreground text-sm">Update details for <span className="font-semibold text-primary">{project.name}</span></p>
            </div>

            <div className="p-6 bg-card rounded-2xl border border-border shadow-sm">
                <ProjectForm initialData={project} isEdit={true} />
            </div>
        </div>
    );
}
