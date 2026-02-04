"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2, Upload, X, Link as LinkIcon, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { createResume, updateResume } from "@/utils/api/resume";

interface ResumeFormProps {
    initialData?: any;
    isEdit?: boolean;
}

export default function ResumeForm({ initialData, isEdit = false }: ResumeFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [name, setName] = useState(initialData?.name || "");
    const [type, setType] = useState<"file" | "link">(initialData?.type || "link");
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

        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
            <div className="space-y-6 bg-card p-6 rounded-2xl border border-border shadow-sm">
                <div className="space-y-2">
                    <Label htmlFor="name">Resume Name</Label>
                    <Input
                        id="name"
                        required
                        placeholder="My Main Resume 2024"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className="space-y-3">
                    <Label>Resume Type</Label>
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => setType("link")}
                            className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${type === "link"
                                    ? "border-primary bg-primary/5 text-primary"
                                    : "border-border bg-accent/5 text-muted-foreground hover:bg-accent/10"
                                }`}
                        >
                            <LinkIcon className="w-4 h-4" />
                            <span>Link</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setType("file")}
                            className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${type === "file"
                                    ? "border-primary bg-primary/5 text-primary"
                                    : "border-border bg-accent/5 text-muted-foreground hover:bg-accent/10"
                                }`}
                        >
                            <FileText className="w-4 h-4" />
                            <span>File Upload</span>
                        </button>
                    </div>
                </div>

                {type === "link" ? (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                        <Label htmlFor="url">Resume URL</Label>
                        <Input
                            id="url"
                            required
                            placeholder="https://drive.google.com/..."
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                        />
                    </div>
                ) : (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                        <Label>Resume File (PDF/DOCX)</Label>
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="cursor-pointer group relative h-32 w-full rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center bg-accent/5 hover:bg-accent/10 transition-colors overflow-hidden"
                        >
                            {file ? (
                                <div className="flex items-center gap-2 p-4">
                                    <FileText className="w-8 h-8 text-primary" />
                                    <div className="flex flex-col">
                                        <p className="text-sm font-medium truncate max-w-[200px]">{file.name}</p>
                                        <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="ml-4 w-8 h-8"
                                        onClick={(e) => { e.stopPropagation(); removeFile(); }}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            ) : isEdit && initialData?.url ? (
                                <div className="text-center text-muted-foreground">
                                    <p className="text-sm font-medium text-primary">Current file exists</p>
                                    <p className="text-xs mt-1">Click to replace with a new file</p>
                                </div>
                            ) : (
                                <div className="text-center text-muted-foreground">
                                    <Upload className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">Click to upload resume</p>
                                    <p className="text-xs mt-1 opacity-70">PDF or DOCX preferred</p>
                                </div>
                            )}
                            <Input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf,.doc,.docx"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-between p-4 bg-accent/5 rounded-xl border border-border">
                    <div className="space-y-0.5">
                        <Label className="text-base">Active Resume</Label>
                        <p className="text-xs text-muted-foreground">
                            Set this as your primary resume shown on the portfolio.
                        </p>
                    </div>
                    <Switch
                        checked={isActive}
                        onCheckedChange={setIsActive}
                    />
                </div>
            </div>

            <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                <Button type="submit" disabled={loading} className="min-w-[120px]">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    {isEdit ? "Update Resume" : "Create Resume"}
                </Button>
            </div>
        </form>
    );
}
