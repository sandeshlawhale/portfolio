"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createProject, updateProject } from "@/utils/api/projects";

interface ProjectFormProps {
    initialData?: any; // Using any for flexibility with the mixed description type, but ideally strictly typed
    isEdit?: boolean;
}

export default function ProjectForm({ initialData, isEdit = false }: ProjectFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Form States
    const [name, setName] = useState(initialData?.name || "");
    const [role, setRole] = useState(initialData?.role || "");
    const [timeline, setTimeline] = useState(initialData?.timeline || "");
    const [shortDescription, setShortDescription] = useState(initialData?.shortDescription || "");
    const [gitlink, setGitlink] = useState(initialData?.gitlink || "");
    const [demoLink, setDemoLink] = useState(initialData?.demoLink || "");
    const [outcome, setOutcome] = useState(initialData?.outcome || "");
    const [techstack, setTechstack] = useState(initialData?.techstack?.join(", ") || "");
    const [description, setDescription] = useState(
        Array.isArray(initialData?.description) ? initialData.description.join("\n") : initialData?.description || ""
    );
    const [draft, setDraft] = useState(initialData?.draft || false);

    // Image handling
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("role", role);
            formData.append("timeline", timeline);
            formData.append("shortDescription", shortDescription);
            formData.append("gitlink", gitlink);
            formData.append("demoLink", demoLink);
            formData.append("outcome", outcome);
            formData.append("draft", draft.toString());

            // Parse arrays
            const techStackArray = techstack.split(",").map((t: string) => t.trim()).filter((t: string) => t);
            techStackArray.forEach((tech: string) => formData.append("techstack", tech));

            // Handle description - Split by newlines to form an array
            // Filter out empty lines to avoid empty paragraphs
            const descriptionArray = description.split('\n').map((d: string) => d.trim()).filter((d: string) => d);
            descriptionArray.forEach((desc: string) => formData.append("description", desc));

            if (imageFile) {
                formData.append("image", imageFile);
            }

            if (isEdit && initialData?._id) {
                await updateProject(initialData._id, formData);
                toast.success("Project updated successfully");
            } else {
                await createProject(formData);
                toast.success("Project created successfully");
            }

            router.push("/admin/projects");
            router.refresh();

        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column: Basic Info & Image */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label>Project Image</Label>
                        <div onClick={() => fileInputRef.current?.click()} className="cursor-pointer group relative h-64 w-full rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center bg-accent/5 hover:bg-accent/10 transition-colors overflow-hidden">
                            {imagePreview ? (
                                <>
                                    <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <p className="text-white font-medium">Click to change</p>
                                    </div>
                                    <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 z-10" onClick={(e) => { e.stopPropagation(); removeImage(); }}>
                                        <X className="w-4 h-4" />
                                    </Button>
                                </>
                            ) : (
                                <div className="text-center text-muted-foreground">
                                    <Upload className="w-10 h-10 mx-auto mb-2 opacity-50" />
                                    <p>Click to upload image</p>
                                    <p className="text-xs mt-1">PNG, JPG up to 5MB</p>
                                </div>
                            )}
                            <Input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Project Name</Label>
                        <Input required placeholder="Smart Invoice AI" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Role</Label>
                            <Input required placeholder="Full Stack Developer" value={role} onChange={(e) => setRole(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Timeline</Label>
                            <Input required placeholder="Dec 2024 - Jan 2025" value={timeline} onChange={(e) => setTimeline(e.target.value)} />
                        </div>
                    </div>
                </div>

                {/* Right Column: Details */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label>Short Description</Label>
                        <Textarea required placeholder="A brief sentence about the project..." className="h-20" value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} />
                    </div>

                    <div className="space-y-2">
                        <Label>Tech Stack (Comma separated)</Label>
                        <Input required placeholder="React, Node.js, MongoDB, Tailwind" value={techstack} onChange={(e) => setTechstack(e.target.value)} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Github Link</Label>
                            <Input required placeholder="https://github.com/..." value={gitlink} onChange={(e) => setGitlink(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Demo Link</Label>
                            <Input placeholder="https://..." value={demoLink} onChange={(e) => setDemoLink(e.target.value)} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Outcome</Label>
                        <Input placeholder="Increased efficiency by 50%..." value={outcome} onChange={(e) => setOutcome(e.target.value)} />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-card">
                        <div className="space-y-0.5">
                            <Label className="text-base">Draft Mode</Label>
                            <p className="text-sm text-muted-foreground">Hide this project from the public portfolio</p>
                        </div>
                        <Switch checked={draft} onCheckedChange={setDraft} />
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <Label>Detailed Description <span className="text-xs text-muted-foreground font-normal">(Separate paragraphs with new lines)</span></Label>
                <Textarea required placeholder="Full project details..." className="min-h-[200px]" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                <Button type="submit" disabled={loading} className="min-w-[120px]">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    {isEdit ? "Update Project" : "Create Project"}
                </Button>
            </div>
        </form>
    );
}
