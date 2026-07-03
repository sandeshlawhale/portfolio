"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2, Upload, X, Link as LinkIcon, FileText, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { createResume, updateResume } from "@/utils/api/resume";

type Resume = {
    isActive: boolean;
    name: string;
    type: "link" | "file";
    url: string;
    _id: string;
}
interface ResumeFormProps {
    initialData?: Resume;
    isEdit?: boolean;
}

export default function ResumeForm({ initialData, isEdit = false }: ResumeFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [name, setName] = useState(initialData?.name || "");
    const [type, setType] = useState<"file" | "link">(initialData?.type || "file");
    const [url, setUrl] = useState(initialData?.url || "");
    const [isActive, setIsActive] = useState(initialData?.isActive || false);

    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const removeFile = () => {
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("type", type);
            formData.append("isActive", String(isActive));

            if (type === "link") {
                formData.append("url", url);
            } else if (type === "file") {
                if (file) {
                    formData.append("resume", file);
                } else if (!isEdit) {
                    throw new Error("Please upload a resume file");
                }
            }

            if (isEdit && initialData?._id) {
                await updateResume(initialData._id, formData);
                toast.success("Resume updated successfully");
            } else {
                await createResume(formData);
                toast.success("Resume added successfully");
            }

            router.push("/admin/resume");
            router.refresh();

        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Something went wrong";
            console.error("Something went wrong while adding/updating the resume: ", error);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-[#09090b] border border-[#27272a] rounded-xl p-8 shadow-2xl space-y-8 hover:shadow-[0_0_40px_rgba(59,130,246,0.05)] hover:border-[#3f3f46] transition-all duration-300">
                {/* Resume Name */}
                <div className="space-y-2">
                    <Label htmlFor="resume_name" className="text-sm font-medium text-zinc-300">Resume Name</Label>
                    <Input
                        id="resume_name"
                        required
                        placeholder="e.g., Senior Fullstack Engineer - 2024"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-[#131315] border border-[#27272a] rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none transition-all placeholder:text-zinc-600 h-auto"
                    />
                </div>

                {/* Resume Type & Active Switch */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="resume_type" className="text-sm font-medium text-zinc-300">Resume Type</Label>
                        <select
                            id="resume_type"
                            value={type}
                            onChange={(e) => setType(e.target.value as "file" | "link")}
                            className="w-full bg-[#131315] border border-[#27272a] rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none transition-all cursor-pointer"
                        >
                            <option value="file">File Upload (PDF/DOCX)</option>
                            <option value="link">External Link</option>
                        </select>
                    </div>

                    <div className="flex items-end pb-3">
                        <div className="flex items-center gap-3">
                            <Switch
                                id="is_active"
                                checked={isActive}
                                onCheckedChange={setIsActive}
                                className="data-[state=checked]:bg-blue-600"
                            />
                            <Label htmlFor="is_active" className="text-sm font-medium text-zinc-300 cursor-pointer">
                                Set as Active Resume
                            </Label>
                        </div>
                    </div>
                </div>

                {/* File Upload Area */}
                {type === "file" && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                        <Label className="text-sm font-medium text-zinc-300">File Upload</Label>
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-[#27272a] rounded-xl p-10 flex flex-col items-center justify-center bg-[#131315]/50 hover:bg-[#131315] hover:border-blue-500/50 transition-all cursor-pointer group relative"
                        >
                            {file ? (
                                <div className="flex items-center gap-4 text-left w-full">
                                    <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-white truncate">{file.name}</p>
                                        <p className="text-xs text-zinc-400">{(file.size / 1024 / 1024).toFixed(2)} MB • Ready to upload</p>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 rounded-full text-zinc-400 hover:text-red-400 hover:bg-red-500/10"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeFile();
                                        }}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            ) : isEdit && initialData?.url ? (
                                <div className="flex items-center gap-4 text-left w-full">
                                    <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-white truncate">Current File Exists</p>
                                        <p className="text-xs text-zinc-400">Click or drag here to upload a replacement file</p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="w-12 h-12 rounded-full bg-[#201f22] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-blue-400">
                                        <Upload className="w-5 h-5" />
                                    </div>
                                    <p className="text-sm text-white font-medium">Click to upload or drag and drop</p>
                                    <p className="text-xs text-zinc-400 mt-1">PDF or DOCX (Max. 10MB)</p>
                                </>
                            )}
                            <input
                                ref={fileInputRef}
                                id="file_input"
                                type="file"
                                accept=".pdf,.doc,.docx"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>
                )}

                {/* External URL */}
                {type === "link" && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                        <Label htmlFor="resume_url" className="text-sm font-medium text-zinc-300">External URL</Label>
                        <div className="relative">
                            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
                            <Input
                                id="resume_url"
                                type="url"
                                required
                                placeholder="https://linkedin.com/in/profile/..."
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                className="w-full bg-[#131315] border border-[#27272a] rounded-lg pl-10 pr-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none transition-all placeholder:text-zinc-600 h-auto"
                            />
                        </div>
                        <p className="text-xs text-zinc-400">Links to Google Drive, Dropbox, or personal portfolio sites.</p>
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
                <Button
                    type="button"
                    variant="ghost"
                    className="px-6 py-2.5 text-zinc-400 font-medium hover:text-white transition-colors"
                    onClick={() => router.back()}
                >
                    Cancel
                </Button>
                <div className="flex items-center gap-4">
                    {url || (isEdit && initialData?.url) ? (
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => window.open(url || initialData?.url, "_blank")}
                            className="flex items-center gap-2 px-6 py-2.5 bg-[#201f22] border border-[#27272a] text-white font-medium rounded-lg hover:bg-zinc-800 transition-all active:scale-95"
                        >
                            <Eye className="w-4 h-4" />
                            <span>Preview</span>
                        </Button>
                    ) : null}
                    <Button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-8 py-2.5 bg-[#3b82f6] hover:bg-blue-600 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/10 transition-all active:scale-95 border-t border-white/10"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                        <span>{isEdit ? "Update Resume" : "Save Resume"}</span>
                    </Button>
                </div>
            </div>
        </form>
    );
}
