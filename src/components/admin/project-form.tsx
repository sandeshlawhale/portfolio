"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import { Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createProject, updateProject } from "@/utils/api/projects";
import RichTextEditor from "./rich-text-editor";

type Project = {
    _id: string;
    name: string;
    shortDescription: string;
    description: string[];
    role: string;
    outcome: string;
    timeline: string;
    techstack: string[];
    image: string;
    demoLink: string;
    gitlink: string;
    otherLink: string[];
    draft: boolean;
};

interface ProjectFormProps {
    initialData?: Project;
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
    const [description, setDescription] = useState<string>(() => {
        if (!initialData?.description) return "";
        if (Array.isArray(initialData.description)) {
            const first = initialData.description[0] || "";
            if (first.includes("<p>") || first.includes("<h") || first.includes("<ul>") || first.includes("<li>")) {
                return first;
            }
            return initialData.description.map(line => `<p>${line}</p>`).join("");
        }
        return initialData.description;
    });
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

            const techStackArray = techstack.split(",").map((t: string) => t.trim()).filter((t: string) => t);
            formData.append("techstack", JSON.stringify(techStackArray));

            formData.append("description", JSON.stringify([description]));

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
        } catch (error) {
            console.error("An error occurred while saving: ", error);
            toast.error("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="text-[#e5e1e4] font-sans antialiased space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-[32px] font-semibold text-[#e5e1e4] tracking-tight">{isEdit ? "Edit Project" : "Add Project"}</h2>
                    <p className="text-[#c2c6d6] text-[14px]">Update your architectural masterpiece details.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        type="button"
                        onClick={() => router.push("/admin/projects")} 
                        className="px-6 py-2 rounded-lg border border-[#424754] text-[#e5e1e4] hover:bg-[#201f22] transition-all font-bold text-sm"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="px-8 py-2 rounded-lg bg-[#adc6ff] text-[#002e6a] font-bold hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50 text-sm"
                    >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        Save Project
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
                {/* Left Column: Primary Details */}
                <div className="col-span-12 lg:col-span-8 space-y-6">
                    {/* Basic Info Card */}
                    <div className="bg-[#09090b] border border-[#27272a] hover:border-[#3f3f46] transition-all p-6 rounded-xl space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-[12px] font-semibold text-[#c2c6d6] uppercase tracking-wider">Project Name</label>
                                <input 
                                    className="bg-[#030303] border border-[#27272a] rounded-lg px-4 py-2.5 w-full text-[#e5e1e4] focus:outline-none focus:border-[#adc6ff] focus:ring-4 focus:ring-[#adc6ff]/10 transition-all placeholder:text-[#424754]" 
                                    type="text" 
                                    placeholder="Quantum Neural Engine"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[12px] font-semibold text-[#c2c6d6] uppercase tracking-wider">Role</label>
                                <input 
                                    className="bg-[#030303] border border-[#27272a] rounded-lg px-4 py-2.5 w-full text-[#e5e1e4] focus:outline-none focus:border-[#adc6ff] focus:ring-4 focus:ring-[#adc6ff]/10 transition-all placeholder:text-[#424754]" 
                                    type="text" 
                                    placeholder="Lead Architect"
                                    required
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-[12px] font-semibold text-[#c2c6d6] uppercase tracking-wider">Timeline</label>
                                <input 
                                    className="bg-[#030303] border border-[#27272a] rounded-lg px-4 py-2.5 w-full text-[#e5e1e4] focus:outline-none focus:border-[#adc6ff] focus:ring-4 focus:ring-[#adc6ff]/10 transition-all placeholder:text-[#424754]" 
                                    type="text" 
                                    placeholder="2024 - Present"
                                    required
                                    value={timeline}
                                    onChange={(e) => setTimeline(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[12px] font-semibold text-[#c2c6d6] uppercase tracking-wider">Short Description</label>
                                <input 
                                    className="bg-[#030303] border border-[#27272a] rounded-lg px-4 py-2.5 w-full text-[#e5e1e4] focus:outline-none focus:border-[#adc6ff] focus:ring-4 focus:ring-[#adc6ff]/10 transition-all placeholder:text-[#424754]" 
                                    type="text" 
                                    placeholder="Brief overview..."
                                    required
                                    value={shortDescription}
                                    onChange={(e) => setShortDescription(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Rich Text Description Card */}
                    <div className="bg-[#09090b] border border-[#27272a] hover:border-[#3f3f46] transition-all p-6 rounded-xl space-y-4">
                        <label className="block text-[12px] font-semibold text-[#c2c6d6] uppercase tracking-wider">Detailed Description</label>
                        <RichTextEditor 
                            value={description}
                            onChange={setDescription}
                            placeholder="Describe the project, technologies used, outcome, and achievements..."
                        />
                    </div>

                    {/* Outcomes Card */}
                    <div className="bg-[#09090b] border border-[#27272a] hover:border-[#3f3f46] transition-all p-6 rounded-xl space-y-4">
                        <label className="block text-[12px] font-semibold text-[#c2c6d6] uppercase tracking-wider">Outcome & Impact</label>
                        <textarea 
                            className="bg-[#030303] border border-[#27272a] rounded-lg px-4 py-2.5 w-full text-[#e5e1e4] focus:outline-none focus:border-[#adc6ff] focus:ring-4 focus:ring-[#adc6ff]/10 transition-all placeholder:text-[#424754]" 
                            placeholder="What were the results? (e.g., Improved performance by 30%)" 
                            rows={3}
                            value={outcome}
                            onChange={(e) => setOutcome(e.target.value)}
                        />
                    </div>
                </div>

                {/* Right Column: Sidebar Settings */}
                <div className="col-span-12 lg:col-span-4 space-y-6">
                    {/* Cover Image Upload */}
                    <div className="bg-[#09090b] border border-[#27272a] hover:border-[#3f3f46] transition-all p-6 rounded-xl space-y-4">
                        <label className="block text-[12px] font-semibold text-[#c2c6d6] uppercase tracking-wider">Project Image</label>
                        <div 
                            onClick={() => fileInputRef.current?.click()} 
                            className="group relative rounded-lg overflow-hidden aspect-video bg-[#131315] border-2 border-dashed border-[#424754] hover:border-[#adc6ff] transition-all cursor-pointer flex flex-col items-center justify-center text-center p-4"
                        >
                            {imagePreview ? (
                                <>
                                    <Image src={imagePreview} alt="Preview" fill className="object-cover opacity-60 group-hover:opacity-85 transition-opacity" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <p className="text-white font-medium text-sm">Click to change</p>
                                    </div>
                                    <button 
                                        type="button" 
                                        className="absolute top-2 right-2 z-10 bg-[#93000a] text-white p-1 rounded-full hover:scale-105 transition-transform" 
                                        onClick={(e) => { e.stopPropagation(); removeImage(); }}
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </>
                            ) : (
                                <div className="relative z-10 flex flex-col items-center">
                                    <Upload className="w-8 h-8 text-[#adc6ff] mb-2" />
                                    <p className="text-sm font-semibold">Click to upload or drag & drop</p>
                                    <p className="text-[#8c909f] text-[11px] mt-1">SVG, PNG, JPG or WEBP</p>
                                </div>
                            )}
                        </div>
                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    </div>

                    {/* Project Metadata */}
                    <div className="bg-[#09090b] border border-[#27272a] hover:border-[#3f3f46] transition-all p-6 rounded-xl space-y-6">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Draft Mode</span>
                            <input 
                                className="w-9 h-5 bg-[#201f22] rounded-full appearance-none relative checked:bg-[#adc6ff] transition-colors cursor-pointer before:content-[''] before:absolute before:w-4 before:h-4 before:rounded-full before:bg-white before:top-0.5 before:left-0.5 before:transition-transform checked:before:translate-x-4"
                                type="checkbox"
                                checked={draft}
                                onChange={(e) => setDraft(e.target.checked)}
                            />
                        </div>
                    </div>

                    {/* Links & Tags */}
                    <div className="bg-[#09090b] border border-[#27272a] hover:border-[#3f3f46] transition-all p-6 rounded-xl space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="block text-[12px] font-semibold text-[#c2c6d6] uppercase tracking-wider">Tech Stack (comma separated)</label>
                                <input 
                                    className="bg-[#030303] border border-[#27272a] rounded-lg px-4 py-2 w-full text-[#e5e1e4] focus:outline-none focus:border-[#adc6ff] focus:ring-4 focus:ring-[#adc6ff]/10 transition-all placeholder:text-[#424754]" 
                                    type="text" 
                                    placeholder="React, TypeScript, Node.js"
                                    value={techstack}
                                    onChange={(e) => setTechstack(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[12px] font-semibold text-[#c2c6d6] uppercase tracking-wider">GitHub Link</label>
                                <input 
                                    className="bg-[#030303] border border-[#27272a] rounded-lg px-4 py-2 w-full text-[#e5e1e4] focus:outline-none focus:border-[#adc6ff] focus:ring-4 focus:ring-[#adc6ff]/10 transition-all placeholder:text-[#424754]" 
                                    type="text" 
                                    placeholder="https://github.com/..."
                                    value={gitlink}
                                    onChange={(e) => setGitlink(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[12px] font-semibold text-[#c2c6d6] uppercase tracking-wider">Demo Link</label>
                                <input 
                                    className="bg-[#030303] border border-[#27272a] rounded-lg px-4 py-2 w-full text-[#e5e1e4] focus:outline-none focus:border-[#adc6ff] focus:ring-4 focus:ring-[#adc6ff]/10 transition-all placeholder:text-[#424754]" 
                                    type="text" 
                                    placeholder="https://demo.io"
                                    value={demoLink}
                                    onChange={(e) => setDemoLink(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isEdit && initialData && (
                <div className="mt-12 pt-8 border-t border-[#424754]">
                    <div className="bg-[#09090b] border border-[#93000a]/20 p-6 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <h4 className="text-[#ffb4ab] font-bold text-lg mb-1">Delete Project</h4>
                            <p className="text-[#c2c6d6] text-sm">Once deleted, this project cannot be recovered.</p>
                        </div>
                        <DeleteConfirmationPopover 
                            name={initialData.name} 
                            onDelete={async () => {
                                try {
                                    setLoading(true);
                                    await deleteProject(initialData._id);
                                    toast.success("Project deleted successfully");
                                    router.push("/admin/projects");
                                    router.refresh();
                                } catch {
                                    toast.error("Failed to delete project");
                                } finally {
                                    setLoading(false);
                                }
                            }}
                        />
                    </div>
                </div>
            )}
        </form>
    );
}

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { deleteProject } from "@/utils/api/projects";

function DeleteConfirmationPopover({ name, onDelete }: { name: string; onDelete: () => void }) {
    const [confirmText, setConfirmText] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const shortName = name.split(" ")[0] || name;
    const targetString = `sudo delete ${shortName}`;

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <button 
                    type="button"
                    className="px-6 py-2.5 bg-[#93000a] text-[#ffdad6] rounded-lg font-bold text-sm hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                >
                    Delete Project
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-[#131315] border border-[#424754] text-[#e5e1e4] p-4 shadow-xl rounded-xl" align="end" side="top">
                <div className="space-y-4">
                    <div className="space-y-1">
                        <h4 className="text-sm font-semibold text-[#ffb4ab]">Are you absolutely sure?</h4>
                        <p className="text-xs text-[#c2c6d6] leading-relaxed">
                            Type <span className="font-mono bg-[#201f22] px-1 py-0.5 rounded border border-[#424754] text-[#adc6ff] select-all cursor-pointer" onClick={() => navigator.clipboard.writeText(targetString).then(() => toast.success("Copied confirmation message"))}>{targetString}</span> to confirm deletion.
                        </p>
                    </div>
                    <div className="space-y-2">
                        <input
                            type="text"
                            placeholder={targetString}
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                            className="bg-[#030303] border border-[#27272a] rounded-lg px-3 py-1.5 w-full text-xs text-[#e5e1e4] focus:outline-none focus:border-[#adc6ff]"
                        />
                        <button
                            type="button"
                            disabled={confirmText !== targetString}
                            onClick={() => {
                                onDelete();
                                setIsOpen(false);
                            }}
                            className="w-full py-2 bg-[#93000a] text-[#ffdad6] rounded-lg font-bold text-xs hover:brightness-110 disabled:opacity-40 transition-all cursor-pointer"
                        >
                            Confirm Secure Delete
                        </button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}

