"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getAllWorks, deleteWork } from "@/utils/api/work";
import { Trash2, Edit, Plus, Loader2, Globe, ChevronDown, ChevronUp } from "lucide-react";

type Company = {
    name: string;
    logo: string;     // URL
    website: string;  // URL
};

type Location = {
    type: "On-site" | "Remote" | "Hybrid" | string;
    city: string;
};

type Duration = {
    start: string;
    end: string;
};

type ExperienceStatus = "Completed" | "Ongoing" | "Working" | string;

export type Experience = {
    _id: string;
    company: Company;
    location: Location;
    duration: Duration;
    role: string;
    status: ExperienceStatus;
    technologies: string[];
    responsibilities: string[];
    createdAt: string;
    updatedAt: string;
    __v: number;
};

export default function AdminWorkPage() {
    const [works, setWorks] = useState<Experience[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedIds, setExpandedIds] = useState<string[]>([]);
    const router = useRouter();

    const fetchWorks = async () => {
        setLoading(true);
        try {
            const data = await getAllWorks();
            if (data.success) {
                setWorks(data.result);
                if (data.result.length > 0) {
                    setExpandedIds([data.result[0]._id]); // Expand first item by default
                }
            }
        } catch (error) {
            toast.error("Failed to fetch works");
            console.log("Failed to fetch works: ", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWorks();
    }, []);

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete work at "${name}"?`)) {
            return;
        }

        try {
            await deleteWork(id);
            toast.success("Work deleted successfully");
            fetchWorks();
        } catch (error) {
            toast.error("Failed to delete work");
            console.log("Failed to delete work: ", error);
        }
    };

    const toggleExpand = (id: string) => {
        setExpandedIds((prev) => 
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    return (
        <div className="w-full max-w-[1440px] mx-auto pt-6 px-4 md:px-10 pb-20 text-[#e5e1e4] font-sans antialiased">
            {/* Header & Action Toolbar */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <h2 className="text-[48px] font-semibold tracking-tight leading-none mb-2">Work Experience</h2>
                    <p className="text-[#c2c6d6] text-[16px] mt-2 max-w-2xl">
                        A curated timeline of professional contributions, technical leadership, and architectural impact.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => router.push("/admin/work/add")}
                        className="flex items-center gap-2 bg-[#adc6ff] text-[#002e6a] px-5 py-2.5 rounded-lg text-sm font-semibold hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-[#adc6ff]/10"
                    >
                        <Plus className="w-4 h-4" />
                        Add Entry
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-[#adc6ff]" />
                </div>
            ) : (
                <div className="space-y-6">
                    {works.map((work) => {
                        const isExpanded = expandedIds.includes(work._id);
                        return (
                            <div key={work._id} className="bg-[#0e0e10] border border-[#424754] rounded-xl overflow-hidden hover:border-[#3f3f46] hover:shadow-[0_0_40px_rgba(59,130,246,0.05)] transition-all duration-300">
                                <div 
                                    className="p-8 flex items-start gap-6 cursor-pointer group" 
                                    onClick={() => toggleExpand(work._id)}
                                >
                                    <div className="w-16 h-16 rounded-xl bg-[#201f22] border border-[#424754] flex items-center justify-center overflow-hidden shrink-0 relative">
                                        {work.company.logo ? (
                                            <Image 
                                                src={work.company.logo} 
                                                alt={work.company.name} 
                                                fill 
                                                className="object-contain p-2"
                                            />
                                        ) : (
                                            <Globe className="w-8 h-8 text-[#8c909f]" />
                                        )}
                                    </div>
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div className="col-span-1 md:col-span-2">
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-[20px] font-bold text-[#e5e1e4] group-hover:text-[#adc6ff] transition-colors">{work.role}</h3>
                                                <span className={`px-2.5 py-0.5 rounded-full text-[12px] font-medium border ${
                                                    work.status === "Ongoing" || work.status === "Working"
                                                        ? "bg-[#adc6ff]/10 text-[#adc6ff] border-[#adc6ff]/20"
                                                        : "bg-[#201f22] text-[#c2c6d6] border-[#424754]"
                                                }`}>
                                                    {work.status}
                                                </span>
                                            </div>
                                            <p className="text-[#c2c6d6] text-sm mt-1">{work.company.name} • {work.location.city} ({work.location.type})</p>
                                        </div>
                                        <div className="col-span-1 flex flex-col md:items-end justify-center">
                                            <span className="text-[#e5e1e4] text-sm font-medium">{work.duration.start} — {work.duration.end}</span>
                                        </div>
                                        <div className="col-span-1 flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                                            <button 
                                                onClick={() => router.push(`/admin/work/${work._id}/edit`)}
                                                className="p-2 text-[#c2c6d6] hover:text-[#adc6ff] hover:bg-[#adc6ff]/5 rounded-full transition-all"
                                                title="Edit"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(work._id, work.company.name)}
                                                className="p-2 text-[#c2c6d6] hover:text-[#93000a] hover:bg-[#93000a]/5 rounded-full transition-all"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => toggleExpand(work._id)}
                                                className="p-2 text-[#c2c6d6] hover:text-[#e5e1e4] transition-all"
                                            >
                                                {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                                {isExpanded && (
                                    <div className="px-8 pb-8 pt-2 grid grid-cols-1 lg:grid-cols-3 gap-12 border-t border-[#424754]/30 bg-[#0c0c0d]">
                                        <div className="lg:col-span-2 space-y-6">
                                            <div>
                                                <h4 className="text-[12px] font-semibold uppercase tracking-widest text-[#c2c6d6] mb-4">Core Responsibilities</h4>
                                                <ul className="space-y-3">
                                                    {work.responsibilities.map((resp, i) => (
                                                        <li key={i} className="flex gap-3 text-[#e5e1e4] text-sm">
                                                            <span className="text-[#adc6ff] mt-0.5">•</span>
                                                            {resp}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="space-y-8">
                                            <div>
                                                <h4 className="text-[12px] font-semibold uppercase tracking-widest text-[#c2c6d6] mb-4">Tech Stack</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {work.technologies.map((tech) => (
                                                        <span key={tech} className="px-3 py-1 bg-[#201f22] border border-[#424754] rounded text-[#e5e1e4] font-mono text-[13px]">
                                                            {tech}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
