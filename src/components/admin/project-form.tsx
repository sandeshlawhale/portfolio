"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import { Loader2, Upload, X, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createProject, updateProject } from "@/utils/api/projects";
import RichTextEditor from "./rich-text-editor";
import { Project, OtherLink } from "@/types";

interface ProjectFormProps {
    initialData?: Project;
    isEdit?: boolean;
}

export default function ProjectForm({ initialData, isEdit = false }: ProjectFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Form States - Basic Information
    const [name, setName] = useState(initialData?.name || "");
    const [category, setCategory] = useState(initialData?.category || "");
    const [shortDescription, setShortDescription] = useState(initialData?.shortDescription || "");
    const [description, setDescription] = useState<string>(() => {
        if (!initialData?.description) return "";
        return initialData.description;
    });
    const [draft, setDraft] = useState(initialData?.draft || false);
    const [featured, setFeatured] = useState(initialData?.featured || false);

    // Form States - Quick Information
    const [role, setRole] = useState(initialData?.quickInfo?.role || "");
    const [date, setDate] = useState(initialData?.quickInfo?.date || "");
    const [team, setTeam] = useState(initialData?.quickInfo?.team || "Solo");
    const [company, setCompany] = useState(initialData?.quickInfo?.company || "");
    const [status, setStatus] = useState(initialData?.quickInfo?.status || "Completed");

    // Form States - Links
    const [github, setGithub] = useState(initialData?.links?.github || "");
    const [live, setLive] = useState(initialData?.links?.live || "");
    
    // Dynamic Other Links State
    const [otherLinks, setOtherLinks] = useState<OtherLink[]>(initialData?.links?.other || []);

    // Tech Stack (Dynamic Chips) State
    const [techStack, setTechStack] = useState<string[]>(initialData?.techStack || []);
    const [techInput, setTechInput] = useState("");

    // Image handling
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(
        typeof initialData?.image === "string" ? initialData.image : null
    );
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

    // Tech Stack Tag Helpers
    const addTechTag = () => {
        const trimmed = techInput.trim();
        if (trimmed && !techStack.includes(trimmed)) {
            setTechStack([...techStack, trimmed]);
            setTechInput("");
        }
    };

    const removeTechTag = (tag: string) => {
        setTechStack(techStack.filter((t) => t !== tag));
    };

    const handleTechKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addTechTag();
        }
    };

    // Dynamic Other Links Helpers
    const addOtherLink = () => {
        setOtherLinks([...otherLinks, { label: "", url: "" }]);
    };

    const removeOtherLink = (index: number) => {
        setOtherLinks(otherLinks.filter((_, i) => i !== index));
    };

    const handleOtherLinkChange = (index: number, field: "label" | "url", value: string) => {
        const updated = [...otherLinks];
        updated[index] = { ...updated[index], [field]: value };
        setOtherLinks(updated);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("category", category);
            formData.append("shortDescription", shortDescription);
            formData.append("description", description);
            formData.append("draft", draft.toString());
            formData.append("featured", featured.toString());

            // Append TechStack
            formData.append("techStack", JSON.stringify(techStack));

            // Append Quick Info
            const quickInfo = { role, date, team, company, status };
            formData.append("quickInfo", JSON.stringify(quickInfo));

            // Append Links
            const links = {
                github,
                live,
                other: otherLinks.filter((l) => l.label.trim() && l.url.trim()),
            };
            formData.append("links", JSON.stringify(links));

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
        <form onSubmit={handleSubmit} className="text-[#e5e1e4] font-sans antialiased space-y-4 md:space-y-8 pb-16">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-8 gap-4">
                <div>
                    <h2 className="text-[32px] font-semibold text-[#e5e1e4] tracking-tight">
                        {isEdit ? "Edit Project" : "Add Project"}
                    </h2>
                    <p className="text-[#c2c6d6] text-[14px]">Update your architectural masterpiece details.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => router.push("/admin/projects")}
                        className="px-6 py-2 rounded-lg border border-[#424754] text-[#e5e1e4] hover:bg-[#201f22] transition-all font-bold text-sm cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-2 rounded-lg bg-[#adc6ff] text-[#002e6a] font-bold hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50 text-sm cursor-pointer"
                    >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        Save Project
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-4 md:gap-6">
                {/* Left Column: Primary Forms */}
                <div className="col-span-12 lg:col-span-8 space-y-4 md:space-y-6">
                    {/* SECTION 1: Basic Information */}
                    <div className="bg-[#09090b] border border-[#27272a] hover:border-[#3f3f46] transition-all p-4 md:p-6 rounded-xl space-y-4 md:space-y-6">
                        <div className="flex items-center gap-2 border-b border-[#27272a] pb-3 mb-2">
                            <span className="w-1.5 h-3.5 bg-[#adc6ff] rounded-full"></span>
                            <h3 className="text-sm font-bold uppercase tracking-wider text-[#adc6ff]">Basic Information</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            <div className="space-y-2">
                                <label className="block text-[11px] font-semibold text-[#c2c6d6] uppercase tracking-wider">Project Name</label>
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
                                <label className="block text-[11px] font-semibold text-[#c2c6d6] uppercase tracking-wider">Category</label>
                                <input
                                    className="bg-[#030303] border border-[#27272a] rounded-lg px-4 py-2.5 w-full text-[#e5e1e4] focus:outline-none focus:border-[#adc6ff] focus:ring-4 focus:ring-[#adc6ff]/10 transition-all placeholder:text-[#424754]"
                                    type="text"
                                    placeholder="Artificial Intelligence / Web App"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-[11px] font-semibold text-[#c2c6d6] uppercase tracking-wider">Short Description</label>
                            <input
                                className="bg-[#030303] border border-[#27272a] rounded-lg px-4 py-2.5 w-full text-[#e5e1e4] focus:outline-none focus:border-[#adc6ff] focus:ring-4 focus:ring-[#adc6ff]/10 transition-all placeholder:text-[#424754]"
                                type="text"
                                placeholder="A brief, one-sentence overview of the project..."
                                required
                                value={shortDescription}
                                onChange={(e) => setShortDescription(e.target.value)}
                            />
                        </div>

                        {/* Rich Text Editor */}
                        <div className="space-y-2 pt-2">
                            <label className="block text-[11px] font-semibold text-[#c2c6d6] uppercase tracking-wider">Detailed Description</label>
                            <RichTextEditor
                                value={description}
                                onChange={setDescription}
                                placeholder="Describe the project, architecture, development stages, and outcome details..."
                            />
                        </div>
                    </div>

                    {/* SECTION 2: Quick Information */}
                    <div className="bg-[#09090b] border border-[#27272a] hover:border-[#3f3f46] transition-all p-4 md:p-6 rounded-xl space-y-4 md:space-y-6">
                        <div className="flex items-center gap-2 border-b border-[#27272a] pb-3 mb-2">
                            <span className="w-1.5 h-3.5 bg-[#adc6ff] rounded-full"></span>
                            <h3 className="text-sm font-bold uppercase tracking-wider text-[#adc6ff]">Quick Information</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            <div className="space-y-2">
                                <label className="block text-[11px] font-semibold text-[#c2c6d6] uppercase tracking-wider">Role</label>
                                <input
                                    className="bg-[#030303] border border-[#27272a] rounded-lg px-4 py-2.5 w-full text-[#e5e1e4] focus:outline-none focus:border-[#adc6ff] focus:ring-4 focus:ring-[#adc6ff]/10 transition-all placeholder:text-[#424754]"
                                    type="text"
                                    placeholder="Lead Architect / Full-Stack Engineer"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[11px] font-semibold text-[#c2c6d6] uppercase tracking-wider">Date / Timeline</label>
                                <input
                                    className="bg-[#030303] border border-[#27272a] rounded-lg px-4 py-2.5 w-full text-[#e5e1e4] focus:outline-none focus:border-[#adc6ff] focus:ring-4 focus:ring-[#adc6ff]/10 transition-all placeholder:text-[#424754]"
                                    type="text"
                                    placeholder="Jan 2024 - Mar 2024"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                            <div className="space-y-2">
                                <label className="block text-[11px] font-semibold text-[#c2c6d6] uppercase tracking-wider">Team Structure</label>
                                <select
                                    className="bg-[#030303] border border-[#27272a] rounded-lg px-4 py-2.5 w-full text-[#e5e1e4] focus:outline-none focus:border-[#adc6ff] focus:ring-4 focus:ring-[#adc6ff]/10 transition-all cursor-pointer"
                                    value={team}
                                    onChange={(e) => setTeam(e.target.value)}
                                >
                                    <option value="Solo">Solo Project</option>
                                    <option value="Team">Team Collaboration</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[11px] font-semibold text-[#c2c6d6] uppercase tracking-wider">Company / Client</label>
                                <input
                                    className="bg-[#030303] border border-[#27272a] rounded-lg px-4 py-2.5 w-full text-[#e5e1e4] focus:outline-none focus:border-[#adc6ff] focus:ring-4 focus:ring-[#adc6ff]/10 transition-all placeholder:text-[#424754]"
                                    type="text"
                                    placeholder="Acme Corp"
                                    value={company}
                                    onChange={(e) => setCompany(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[11px] font-semibold text-[#c2c6d6] uppercase tracking-wider">Project Status</label>
                                <select
                                    className="bg-[#030303] border border-[#27272a] rounded-lg px-4 py-2.5 w-full text-[#e5e1e4] focus:outline-none focus:border-[#adc6ff] focus:ring-4 focus:ring-[#adc6ff]/10 transition-all cursor-pointer"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    <option value="Completed">Completed</option>
                                    <option value="Active">Active</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Archived">Archived</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Media, Settings, Links */}
                <div className="col-span-12 lg:col-span-4 space-y-4 md:space-y-6">
                    {/* Cover Image */}
                    <div className="bg-[#09090b] border border-[#27272a] hover:border-[#3f3f46] transition-all p-4 md:p-6 rounded-xl space-y-3">
                        <label className="block text-[11px] font-semibold text-[#c2c6d6] uppercase tracking-wider">Project Image</label>
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="group relative rounded-lg overflow-hidden aspect-video bg-[#131315] border-2 border-dashed border-[#424754] hover:border-[#adc6ff] transition-all cursor-pointer flex flex-col items-center justify-center text-center p-4"
                        >
                            {imagePreview ? (
                                <>
                                    <Image src={imagePreview} alt="Preview" fill className="object-cover opacity-60 group-hover:opacity-85 transition-opacity" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <p className="text-white font-medium text-xs">Click to change</p>
                                    </div>
                                    <button
                                        type="button"
                                        className="absolute top-2 right-2 z-10 bg-[#93000a] text-white p-1 rounded-full hover:scale-105 transition-transform"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeImage();
                                        }}
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </>
                            ) : (
                                <div className="relative z-10 flex flex-col items-center">
                                    <Upload className="w-8 h-8 text-[#adc6ff] mb-2" />
                                    <p className="text-xs font-semibold">Click to upload image</p>
                                    <p className="text-[#8c909f] text-[10px] mt-0.5">PNG, JPG, WEBP or SVG</p>
                                </div>
                            )}
                        </div>
                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    </div>

                    {/* Metadata settings */}
                    <div className="bg-[#09090b] border border-[#27272a] hover:border-[#3f3f46] transition-all p-4 md:p-6 rounded-xl space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-[#c2c6d6]">Draft Mode</span>
                            <input
                                className="w-9 h-5 bg-[#201f22] rounded-full appearance-none relative checked:bg-[#adc6ff] transition-colors cursor-pointer before:content-[''] before:absolute before:w-4 before:h-4 before:rounded-full before:bg-white before:top-0.5 before:left-0.5 before:transition-transform checked:before:translate-x-4"
                                type="checkbox"
                                checked={draft}
                                onChange={(e) => setDraft(e.target.checked)}
                            />
                        </div>
                        <div className="flex items-center justify-between border-t border-[#27272a] pt-4">
                            <span className="text-xs font-semibold uppercase tracking-wider text-[#c2c6d6]">Featured Project</span>
                            <input
                                className="w-9 h-5 bg-[#201f22] rounded-full appearance-none relative checked:bg-[#adc6ff] transition-colors cursor-pointer before:content-[''] before:absolute before:w-4 before:h-4 before:rounded-full before:bg-white before:top-0.5 before:left-0.5 before:transition-transform checked:before:translate-x-4"
                                type="checkbox"
                                checked={featured}
                                onChange={(e) => setFeatured(e.target.checked)}
                            />
                        </div>
                    </div>

                    {/* Dynamic Tech Stack chips */}
                    <div className="bg-[#09090b] border border-[#27272a] hover:border-[#3f3f46] transition-all p-4 md:p-6 rounded-xl space-y-4">
                        <label className="block text-[11px] font-semibold text-[#c2c6d6] uppercase tracking-wider">Tech Stack Technologies</label>
                        <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 bg-[#030303] border border-[#27272a] rounded-lg">
                            {techStack.map((tech) => (
                                <span
                                    key={tech}
                                    className="px-2 py-0.5 bg-[#201f22] border border-[#424754] rounded text-xs text-[#e5e1e4] flex items-center gap-1.5"
                                >
                                    {tech}
                                    <X
                                        className="w-3.5 h-3.5 text-[#8c909f] hover:text-white cursor-pointer"
                                        onClick={() => removeTechTag(tech)}
                                    />
                                </span>
                            ))}
                            {techStack.length === 0 && <span className="text-xs text-[#424754] italic">No technologies added yet...</span>}
                        </div>
                        <div className="flex gap-2">
                            <input
                                className="bg-[#030303] border border-[#27272a] rounded-lg px-3 py-1.5 flex-1 text-xs text-[#e5e1e4] focus:outline-none focus:border-[#adc6ff]"
                                type="text"
                                placeholder="Add technology (e.g. Next.js)"
                                value={techInput}
                                onChange={(e) => setTechInput(e.target.value)}
                                onKeyDown={handleTechKeyDown}
                            />
                            <button
                                type="button"
                                onClick={addTechTag}
                                className="px-3 bg-[#adc6ff] text-[#002e6a] rounded-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* SECTION 3: Links */}
                    <div className="bg-[#09090b] border border-[#27272a] hover:border-[#3f3f46] transition-all p-4 md:p-6 rounded-xl space-y-4">
                        <div className="flex items-center gap-2 border-b border-[#27272a] pb-3 mb-2">
                            <span className="w-1.5 h-3.5 bg-[#adc6ff] rounded-full"></span>
                            <h3 className="text-sm font-bold uppercase tracking-wider text-[#adc6ff]">Links</h3>
                        </div>

                        <div className="space-y-3">
                            <div className="space-y-1">
                                <label className="block text-[10px] font-semibold text-[#c2c6d6] uppercase tracking-wider">GitHub Link</label>
                                <input
                                    className="bg-[#030303] border border-[#27272a] rounded-lg px-4 py-2 w-full text-xs text-[#e5e1e4] focus:outline-none focus:border-[#adc6ff] placeholder:text-[#424754]"
                                    type="text"
                                    placeholder="https://github.com/..."
                                    value={github}
                                    onChange={(e) => setGithub(e.target.value)}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="block text-[10px] font-semibold text-[#c2c6d6] uppercase tracking-wider">Live Link</label>
                                <input
                                    className="bg-[#030303] border border-[#27272a] rounded-lg px-4 py-2 w-full text-xs text-[#e5e1e4] focus:outline-none focus:border-[#adc6ff] placeholder:text-[#424754]"
                                    type="text"
                                    placeholder="https://demo.io"
                                    value={live}
                                    onChange={(e) => setLive(e.target.value)}
                                />
                            </div>

                            {/* Dynamic Other Links */}
                            <div className="space-y-3 border-t border-[#27272a] pt-4 mt-2">
                                <div className="flex justify-between items-center">
                                    <label className="block text-[10px] font-semibold text-[#c2c6d6] uppercase tracking-wider">Other Resources</label>
                                    <button
                                        type="button"
                                        onClick={addOtherLink}
                                        className="text-xs text-[#adc6ff] hover:underline flex items-center gap-1 cursor-pointer font-semibold"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        Add Link
                                    </button>
                                </div>

                                <div className="space-y-3 max-h-[220px] overflow-y-auto no-scrollbar pr-1">
                                    {otherLinks.map((link, idx) => (
                                        <div key={idx} className="flex gap-2 items-center bg-[#030303] p-2 border border-[#27272a] rounded-lg relative group/link">
                                            <div className="flex-1 space-y-1.5">
                                                <input
                                                    className="bg-transparent border-b border-[#27272a] pb-1 w-full text-xs text-[#e5e1e4] focus:outline-none focus:border-[#adc6ff] placeholder:text-[#424754] font-bold"
                                                    type="text"
                                                    placeholder="Label (e.g. Figma)"
                                                    value={link.label}
                                                    onChange={(e) => handleOtherLinkChange(idx, "label", e.target.value)}
                                                />
                                                <input
                                                    className="bg-transparent w-full text-[10px] text-[#c2c6d6] focus:outline-none focus:border-[#adc6ff] placeholder:text-[#424754] font-mono"
                                                    type="text"
                                                    placeholder="URL (e.g. https://...)"
                                                    value={link.url}
                                                    onChange={(e) => handleOtherLinkChange(idx, "url", e.target.value)}
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeOtherLink(idx)}
                                                className="p-1.5 text-[#ffb4ab] hover:bg-[#93000a]/20 rounded transition-colors cursor-pointer"
                                                title="Remove Link"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                    {otherLinks.length === 0 && <span className="text-[10px] text-[#424754] italic">No extra resources links...</span>}
                                </div>
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
