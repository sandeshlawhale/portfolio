"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { getAllResumes, deleteResume, updateResume } from "@/utils/api/resume";
import {
    Trash2,
    Edit,
    Plus,
    Loader2,
    FileText,
    Link as LinkIcon,
    ExternalLink,
    Search,
    SlidersHorizontal,
    FileCode
} from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

export interface Resume {
    _id: string;
    name: string;
    url: string;
    type: "file" | "link";
    isActive: boolean;
    createdAt: string;
}

export default function AdminResumePage() {
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [filteredResumes, setFilteredResumes] = useState<Resume[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("all");
    const [sortBy, setSortBy] = useState("newest");
    const router = useRouter();

    const fetchResumes = async () => {
        setLoading(true);
        try {
            const data = await getAllResumes();
            if (data.success) {
                setResumes(data.result);
            }
        } catch (error) {
            toast.error("Failed to fetch resumes");
            console.log("Failed to fetch resumes: ", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResumes();
    }, []);

    // Filter and Sort Effect
    useEffect(() => {
        let result = [...resumes];

        // Search Filter
        if (searchTerm.trim() !== "") {
            result = result.filter(r =>
                r.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Type Filter
        if (filterType !== "all") {
            result = result.filter(r => r.type === filterType);
        }

        // Sorting
        if (sortBy === "newest") {
            result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        } else if (sortBy === "oldest") {
            result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        } else if (sortBy === "alphabetical") {
            result.sort((a, b) => a.name.localeCompare(b.name));
        }

        setFilteredResumes(result);
    }, [resumes, searchTerm, filterType, sortBy]);

    const handleDelete = async (id: string, name: string, confirmation: string) => {
        if (confirmation !== `sudo delete ${name}`) {
            toast.error("Incorrect confirmation command");
            return;
        }

        try {
            await deleteResume(id);
            toast.success("Resume deleted successfully");
            fetchResumes();
        } catch (error) {
            toast.error("Failed to delete resume");
            console.log("Failed to delete resume: ", error);
        }
    };

    const handleSetActive = async (id: string) => {
        try {
            const formData = new FormData();
            formData.append("isActive", "true");
            await updateResume(id, formData);
            toast.success("Active resume updated");
            fetchResumes();
        } catch (error) {
            toast.error("Failed to set active resume");
            console.log("Failed to set active resume: ", error);
        }
    };

    // Card Glow Effect
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
    };



    return (
        <div className="w-full max-w-[1200px] mx-auto space-y-5 md:space-y-10 p-2">
            {/* Page Heading Section */}
            <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Resume Management</h1>
                    <p className="text-zinc-400 text-lg">Organize and deploy your professional credentials across platforms.</p>
                </div>
                <Button
                    onClick={() => router.push("/admin/resume/add")}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 shadow-lg shadow-blue-500/10 hover:brightness-110 active:scale-95 transition-all h-auto"
                >
                    <Plus className="w-4 h-4" /> Add New Resume
                </Button>
            </section>

            {/* Filters & Search Area */}
            <section className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 md:p-6 bg-[#09090b] border border-[#27272a] rounded-xl">
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                    {/* Search */}
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
                        <Input
                            placeholder="Search resumes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-[#131315] border border-[#27272a] rounded-lg pl-9 pr-4 py-2 focus:ring-1 focus:ring-blue-500 text-white outline-none w-full placeholder:text-zinc-600"
                        />
                    </div>
                    {/* Filter Type */}
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <SlidersHorizontal className="text-zinc-400 w-4 h-4 hidden sm:block" />
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="bg-[#131315] border border-[#27272a] rounded-lg text-sm text-zinc-300 py-2 px-3 focus:ring-1 focus:ring-blue-500 outline-none w-full sm:w-auto"
                        >
                            <option value="all">All Types</option>
                            <option value="file">Files Only</option>
                            <option value="link">Links Only</option>
                        </select>
                    </div>
                    {/* Sort */}
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-[#131315] border border-[#27272a] rounded-lg text-sm text-zinc-300 py-2 px-3 focus:ring-1 focus:ring-blue-500 outline-none w-full sm:w-auto"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="alphabetical">Alphabetical</option>
                        </select>
                    </div>
                </div>
                <div className="text-zinc-400 text-sm italic w-full md:w-auto text-right">
                    Showing {filteredResumes.length} Resumes
                </div>
            </section>

            {/* Resume List - Premium Card Grid */}
            {loading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                </div>
            ) : (
                <section className="grid grid-cols-1 gap-6">
                    {filteredResumes.length === 0 ? (
                        <div className="p-16 text-center text-zinc-500 border border-dashed border-[#27272a] rounded-xl bg-[#09090b]">
                            No resumes found. Create a new one to get started!
                        </div>
                    ) : (
                        filteredResumes.map((resume) => {
                            const isPDF = resume.url.toLowerCase().endsWith(".pdf");
                            const isLink = resume.type === "link";

                            return (
                                <div
                                    key={resume._id}
                                    onMouseMove={handleMouseMove}
                                    className={`relative overflow-hidden group p-4 md:p-8 rounded-xl border transition-all duration-300 flex flex-col lg:flex-row items-center justify-between gap-4 md:gap-6 bg-[#09090b] ${
                                        resume.isActive
                                            ? "border-blue-500/30 shadow-[0_0_20px_-5px_rgba(59,130,246,0.15)]"
                                            : "border-[#27272a] hover:border-[#3f3f46] hover:-translate-y-0.5"
                                    }`}
                                >
                                    {/* Radial mouse glow element */}
                                    <div
                                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                                        style={{
                                            background: `radial-gradient(400px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(59, 130, 246, 0.08), transparent 40%)`
                                        }}
                                    />

                                    {/* Resume Info */}
                                    <div className="flex items-start gap-6 flex-1 w-full relative z-10">
                                        <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                                            resume.isActive ? "bg-blue-500/10 text-blue-400" : "bg-[#131315] text-zinc-400"
                                        }`}>
                                            {isLink ? (
                                                <LinkIcon className="w-7 h-7" />
                                            ) : isPDF ? (
                                                <FileText className="w-7 h-7" />
                                            ) : (
                                                <FileCode className="w-7 h-7" />
                                            )}
                                        </div>
                                        <div className="space-y-1.5 flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-3">
                                                <h3 className="font-semibold text-xl text-white truncate max-w-md">{resume.name}</h3>
                                                {resume.isActive && (
                                                    <span className="bg-emerald-500/10 text-emerald-400 text-xs px-3 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1.5 font-medium shadow-[0_0_8px_rgba(16,185,129,0.2)]">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                        Active
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-zinc-400 text-sm">
                                                <span className="capitalize">{resume.type === "file" ? (isPDF ? "PDF Document" : "Word Document") : "External Link"}</span>
                                                <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                                                <span>Created {new Date(resume.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center justify-end gap-3 w-full lg:w-auto relative z-10 border-t border-zinc-800/50 pt-4 lg:pt-0 lg:border-none">
                                        {!resume.isActive && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleSetActive(resume._id)}
                                                className="border-[#27272a] hover:border-blue-500 hover:text-blue-400 text-zinc-300 font-medium rounded-lg transition-all active:scale-95 bg-transparent"
                                            >
                                                Set Active
                                            </Button>
                                        )}
                                        <div className="flex items-center gap-1">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={() => window.open(resume.url, "_blank")}
                                                className="text-zinc-400 hover:text-white hover:bg-zinc-800/50 h-10 w-10"
                                            >
                                                {isLink ? <ExternalLink className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={() => router.push(`/admin/resume/${resume._id}/edit`)}
                                                className="text-zinc-400 hover:text-blue-400 hover:bg-zinc-800/50 h-10 w-10"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="text-zinc-400 hover:text-red-400 hover:bg-red-500/10 h-10 w-10"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="min-w-80 bg-zinc-950 border border-zinc-800 shadow-2xl p-6" align="end">
                                                    <div className="space-y-4">
                                                        <div className="space-y-2">
                                                            <h4 className="font-semibold text-red-500 text-lg">Delete Resume?</h4>
                                                            <p className="text-sm text-zinc-400 leading-relaxed">
                                                                Type <span className="font-mono bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded text-white text-xs">sudo delete {resume.name}</span> to confirm.
                                                            </p>
                                                        </div>
                                                        <DeleteConfirmation
                                                            name={resume.name}
                                                            onDelete={(confirm) => handleDelete(resume._id, resume.name, confirm)}
                                                        />
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </section>
            )}


        </div>
    );
}

function DeleteConfirmation({ name, onDelete }: { name: string; onDelete: (confirm: string) => void }) {
    const [confirmText, setConfirmText] = useState("");

    return (
        <div className="space-y-4">
            <Input
                placeholder={`sudo delete ${name}`}
                value={confirmText}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmText(e.target.value)}
                className="bg-[#131315] border border-[#27272a] text-white focus:border-red-500 text-sm h-10 w-full placeholder:text-zinc-700"
            />
            <Button
                variant="destructive"
                size="sm"
                className="w-full bg-red-600 hover:bg-red-500 text-white font-medium h-10 rounded-lg active:scale-95 transition-all"
                disabled={confirmText !== `sudo delete ${name}`}
                onClick={() => onDelete(confirmText)}
            >
                Confirm Delete
            </Button>
        </div>
    );
}
