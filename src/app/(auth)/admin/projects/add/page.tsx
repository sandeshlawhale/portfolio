"use client";

import ProjectForm from "@/components/admin/project-form";

export default function AddProjectPage() {
    return (
        <div className="w-full max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Add New Project</h1>
                <p className="text-muted-foreground text-sm">Create a new project for your portfolio</p>
            </div>

            <div className="p-6 bg-card rounded-2xl border border-border shadow-sm">
                <ProjectForm />
            </div>
        </div>
    );
}
