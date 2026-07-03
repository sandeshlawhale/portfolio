"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getAllWorks } from "@/utils/api/work";
import { Edit, Plus, Loader2, Globe } from "lucide-react";

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

    const [statusFilter, setStatusFilter] = useState<"All" | "Ongoing" | "Completed" | "Working">("All");
    const [locationFilter, setLocationFilter] = useState<"All" | "Remote" | "Hybrid" | "On-site">("All");

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

    const toggleExpand = (id: string) => {
        setExpandedIds((prev) => 
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const filteredWorks = works.filter((work) => {
        if (statusFilter !== "All" && work.status !== statusFilter) return false;
        if (locationFilter !== "All" && work.location.type !== locationFilter) return false;
        return true;
    });

    return (
        <div className="w-full max-w-[1440px] mx-auto pt-2 md:pt-6 px-1 md:px-10 pb-12 md:pb-20 text-[#e5e1e4] font-sans antialiased">
            {/* Header & Action Toolbar */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4 md:mb-8 px-2 md:px-0">
                <div>
                    <h2 className="text-3xl md:text-[48px] font-semibold tracking-tight leading-none mb-2">Work Experience</h2>
                    <p className="text-[#c2c6d6] text-sm md:text-[16px] mt-2 max-w-2xl">
                        A curated timeline of professional contributions, technical leadership, and architectural impact.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => router.push("/admin/work/add")}
                        className="flex items-center gap-2 bg-[#adc6ff] text-[#002e6a] px-4 md:px-5 py-2 md:py-2.5 rounded-lg text-sm font-semibold hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-[#adc6ff]/10 cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        Add Entry
                    </button>
                </div>
            </div>

            {/* Filters bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6 p-3 md:p-4 bg-[#0e0e10] border border-[#424754] rounded-xl mx-2 md:mx-0">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center p-1 bg-[#131315] rounded-lg border border-[#424754]">
                        {(["All", "Ongoing", "Completed", "Working"] as const).map((status) => (
                            <button
                                key={status}
                                type="button"
                                onClick={() => setStatusFilter(status)}
                                className={`px-2.5 md:px-4 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                                    statusFilter === status 
                                        ? "bg-[#45464e] text-[#e5e1e4]" 
                                        : "text-[#c2c6d6] hover:text-[#e5e1e4]"
                                }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>

                    <div className="relative">
                        <select 
                            className="bg-[#1c1b1d] border border-[#424754] rounded-lg px-3 py-1.5 text-sm text-[#e5e1e4] focus:ring-1 focus:ring-[#adc6ff] outline-none cursor-pointer appearance-none pr-8"
                            onChange={(e) => setLocationFilter(e.target.value as "All" | "Remote" | "Hybrid" | "On-site")}
                            value={locationFilter}
                        >
                            <option value="All">All Locations</option>
                            <option value="Remote">Remote</option>
                            <option value="Hybrid">Hybrid</option>
                            <option value="On-site">On-site</option>
                        </select>
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-xs text-[#c2c6d6]">&#9662;</span>
                    </div>
                </div>
                <div className="text-xs text-[#c2c6d6]">
                    Showing <span className="text-[#e5e1e4] font-semibold">{filteredWorks.length}</span> entries
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-[#adc6ff]" />
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredWorks.map((work) => {
                        const isExpanded = expandedIds.includes(work._id);
                        return (
                            <div key={work._id} className="relative bg-[#0e0e10] border border-[#424754] rounded-xl overflow-hidden hover:border-[#3f3f46] hover:shadow-[0_0_40px_rgba(59,130,246,0.05)] transition-all duration-300">
                                {/* Edit option in top right */}
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        router.push(`/admin/work/${work._id}/edit`);
                                    }}
                                    className="absolute top-3 right-3 md:top-4 md:right-4 p-2 text-[#c2c6d6] hover:text-[#adc6ff] hover:bg-[#adc6ff]/5 rounded-full transition-all cursor-pointer z-10"
                                    title="Edit"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>

                                <div 
                                    className="p-3 md:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6 cursor-pointer group" 
                                    onClick={() => toggleExpand(work._id)}
                                >
                                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl bg-[#201f22] border border-[#424754] flex items-center justify-center overflow-hidden shrink-0 relative">
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
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4 w-full pr-8">
                                        <div className="col-span-1 md:col-span-2">
                                            <div className="flex flex-wrap items-center gap-2 md:gap-3">
                                                <h3 className="text-lg md:text-[20px] font-bold text-[#e5e1e4] group-hover:text-[#adc6ff] transition-colors">{work.role}</h3>
                                                <span className={`px-2 py-0.5 rounded-full text-[11px] md:text-[12px] font-medium border ${
                                                    work.status === "Ongoing" || work.status === "Working"
                                                        ? "bg-[#adc6ff]/10 text-[#adc6ff] border-[#adc6ff]/20"
                                                        : "bg-[#201f22] text-[#c2c6d6] border-[#424754]"
                                                }`}>
                                                    {work.status}
                                                </span>
                                            </div>
                                            <p className="text-[#c2c6d6] text-xs md:text-sm mt-1">{work.company.name} • {work.location.city} ({work.location.type})</p>
                                        </div>
                                        <div className="col-span-1 flex flex-col md:items-end justify-center">
                                            <span className="text-[#e5e1e4] text-xs md:text-sm font-medium">{work.duration.start} — {work.duration.end}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                {isExpanded && (
                                    <div className="px-4 md:px-8 pb-6 md:pb-8 pt-4 grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-12 border-t border-[#424754]/30 bg-[#0c0c0d]">
                                        <div className="lg:col-span-2 space-y-4 md:space-y-6">
                                            <div>
                                                <h4 className="text-[11px] md:text-[12px] font-semibold uppercase tracking-widest text-[#c2c6d6] mb-3 md:mb-4">Core Responsibilities</h4>
                                                 <div className="space-y-3">
                                                     {work.responsibilities.map((resp, i) => {
                                                         const isHtml = resp.includes("<p>") || resp.includes("<h") || resp.includes("<ul>") || resp.includes("<li>");
                                                         if (isHtml) {
                                                             return (
                                                                 <div 
                                                                     key={i}
                                                                     className="tiptap-rendered-content text-[#e5e1e4] text-xs md:text-sm"
                                                                     dangerouslySetInnerHTML={{ __html: resp }}
                                                                 />
                                                             );
                                                         }
                                                         return (
                                                             <div key={i} className="flex gap-2 md:gap-3 text-[#e5e1e4] text-xs md:text-sm">
                                                                 <span className="text-[#adc6ff] mt-0.5">•</span>
                                                                 {resp}
                                                             </div>
                                                         );
                                                     })}
                                                 </div>
                                            </div>
                                        </div>
                                        <div className="space-y-6 md:space-y-8">
                                            <div>
                                                <h4 className="text-[11px] md:text-[12px] font-semibold uppercase tracking-widest text-[#c2c6d6] mb-3 md:mb-4">Tech Stack</h4>
                                                <div className="flex flex-wrap gap-1.5 md:gap-2">
                                                    {work.technologies.map((tech) => (
                                                        <span key={tech} className="px-2.5 py-1 bg-[#201f22] border border-[#424754] rounded text-[#e5e1e4] font-mono text-[11px] md:text-[13px]">
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
