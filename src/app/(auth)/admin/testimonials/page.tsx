"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
    getAllTestimonialsAdmin,
    updateTestimonialStatus,
    deleteTestimonial,
} from "@/utils/api/testimonials";
import { Trash2, User } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";

type TestimonialItem = {
    _id: string;
    name: string;
    email: string;
    message: string;
    company?: string;
    role?: string;
    linkedinUrl?: string;
    image?: string;
    isActive: boolean;
    isFeatured: boolean;
    createdAt: string;
};

export default function AdminTestimonialsPage() {
    const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchTestimonials = async () => {
        setLoading(true);
        try {
            const data = await getAllTestimonialsAdmin();
            if (data.success) {
                setTestimonials(data.result);
            }
        } catch (error) {
            toast.error("Failed to fetch testimonials");
            console.error("Failed to fetch testimonials: ", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const handleToggleActive = async (id: string, currentVal: boolean) => {
        try {
            setTestimonials((prev) =>
                prev.map((t) => (t._id === id ? { ...t, isActive: !currentVal } : t))
            );

            const res = await updateTestimonialStatus(id, { isActive: !currentVal });
            if (res.success) {
                toast.success(`Testimonial status updated successfully`);
            }
        } catch (error) {
            setTestimonials((prev) =>
                prev.map((t) => (t._id === id ? { ...t, isActive: currentVal } : t))
            );
            toast.error("Failed to update status");
            console.error(error);
        }
    };

    const handleToggleFeatured = async (id: string, currentVal: boolean) => {
        try {
            setTestimonials((prev) =>
                prev.map((t) => (t._id === id ? { ...t, isFeatured: !currentVal } : t))
            );

            const res = await updateTestimonialStatus(id, { isFeatured: !currentVal });
            if (res.success) {
                toast.success(`Testimonial featured status updated successfully`);
            }
        } catch (error) {
            setTestimonials((prev) =>
                prev.map((t) => (t._id === id ? { ...t, isFeatured: currentVal } : t))
            );
            toast.error("Failed to update featured status");
            console.error(error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this testimonial?")) {
            return;
        }

        try {
            await deleteTestimonial(id);
            toast.success("Testimonial deleted successfully");
            fetchTestimonials();
        } catch (error) {
            toast.error("Failed to delete testimonial");
            console.error(error);
        }
    };

    // Filter States
    const [statusFilter, setStatusFilter] = useState<"All" | "Pending" | "Approved">("All");
    const [featuredOnly, setFeaturedOnly] = useState(false);

    // Filter Logic
    const filteredTestimonials = testimonials.filter((t) => {
        // Status check
        if (statusFilter === "Pending" && t.isActive) return false;
        if (statusFilter === "Approved" && !t.isActive) return false;
        
        // Featured check
        if (featuredOnly && !t.isFeatured) return false;
        
        return true;
    });

    return (
        <div className="w-full max-w-[1440px] mx-auto pt-2 md:pt-6 px-2 md:px-10 pb-10 md:pb-20 text-[#e5e1e4] font-sans antialiased">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
                <div>
                    <h2 className="text-[48px] font-semibold tracking-tight leading-none mb-1">Testimonials</h2>
                    <p className="text-[#c2c6d6] text-[16px]">Manage and curate social proof from clients and colleagues.</p>
                </div>
            </div>

            {/* Toolbar & Filters (Stitch Style) */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 md:mb-8 p-3 md:p-4 bg-[#0e0e10] border border-[#424754] rounded-xl">
                <div className="flex flex-wrap items-center gap-3">

                    {/* Approval Status Tab Group */}
                    <div className="flex items-center p-1 bg-[#131315] rounded-lg border border-[#424754]">
                        {(["All", "Pending", "Approved"] as const).map((status) => (
                            <button
                                key={status}
                                type="button"
                                onClick={() => setStatusFilter(status)}
                                className={`px-4 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                                    statusFilter === status 
                                        ? "bg-[#45464e] text-[#e5e1e4]" 
                                        : "text-[#c2c6d6] hover:text-[#e5e1e4]"
                                }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>

                    <div className="h-6 w-px bg-[#424754] mx-1"></div>

                    {/* Featured Switch */}
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <span className="text-xs text-[#c2c6d6] group-hover:text-[#e5e1e4] transition-colors">Featured Only</span>
                        <input
                            type="checkbox"
                            checked={featuredOnly}
                            onChange={(e) => setFeaturedOnly(e.target.checked)}
                            className="w-9 h-5 bg-[#201f22] rounded-full appearance-none relative checked:bg-[#adc6ff] transition-colors cursor-pointer before:content-[''] before:absolute before:w-4 before:h-4 before:rounded-full before:bg-white before:top-0.5 before:left-0.5 before:transition-transform checked:before:translate-x-4"
                        />
                    </label>
                </div>
                <div className="text-xs text-[#c2c6d6]">
                    Showing <span className="text-[#e5e1e4] font-semibold">{filteredTestimonials.length}</span> testimonials
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="border border-[#424754]/50 rounded-xl p-4 md:p-6 bg-[#0e0e10]/60 flex flex-col gap-4">
                            <div className="flex gap-4">
                                <Skeleton className="w-12 h-12 rounded-full bg-[#201f22]" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 bg-[#201f22] rounded w-1/2" />
                                    <Skeleton className="h-3 bg-[#201f22] rounded w-2/3" />
                                </div>
                            </div>
                            <div className="space-y-2 mt-2">
                                <Skeleton className="h-3 bg-[#201f22] rounded w-full" />
                                <Skeleton className="h-3 bg-[#201f22] rounded w-5/6" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                    {filteredTestimonials.map((test) => (
                        <div key={test._id} className="relative bg-[#0e0e10] border border-[#424754] rounded-xl p-4 md:p-6 flex flex-col hover:border-[#3f3f46] hover:shadow-[0_0_40px_rgba(59,130,246,0.05)] transition-all duration-300">
                            {/* Top Row: Avatar & Metadata */}
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex gap-4">
                                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#424754]">
                                        {test.image ? (
                                            <img 
                                                src={test.image} 
                                                alt={test.name} 
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-[#201f22] flex items-center justify-center text-[#8c909f]">
                                                <User className="w-6 h-6" />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="text-[16px] font-bold text-[#e5e1e4]">{test.name}</h4>
                                        <p className="text-[12px] text-[#c2c6d6] opacity-75">{test.role ? `${test.role} at ${test.company}` : test.email}</p>
                                    </div>
                                </div>
                                <div className="text-[11px] text-[#8c909f] pt-1">
                                    {new Date(test.createdAt).toLocaleDateString()}
                                </div>
                            </div>

                            {/* message */}
                            <blockquote className="text-[#c2c6d6] text-[14px] leading-relaxed italic mb-6">
                                &ldquo;{test.message}&rdquo;
                            </blockquote>

                            {/* Bottom Controls Area (Approval, Feature, Deletion Popover) */}
                            <div className="mt-auto pt-4 border-t border-[#424754]/30 flex flex-col gap-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        {/* Status Toggle Switch */}
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input 
                                                type="checkbox"
                                                checked={test.isActive}
                                                onChange={() => handleToggleActive(test._id, test.isActive)}
                                                className="w-9 h-5 bg-[#201f22] rounded-full appearance-none relative checked:bg-[#adc6ff] transition-colors cursor-pointer before:content-[''] before:absolute before:w-4 before:h-4 before:rounded-full before:bg-white before:top-0.5 before:left-0.5 before:transition-transform checked:before:translate-x-4"
                                            />
                                            <span className="text-xs text-[#c2c6d6]">{test.isActive ? "Approved" : "Pending"}</span>
                                        </label>

                                        {/* Feature Toggle Switch */}
                                        <label className="flex items-center gap-2 cursor-pointer ml-3">
                                            <input 
                                                type="checkbox"
                                                checked={test.isFeatured}
                                                onChange={() => handleToggleFeatured(test._id, test.isFeatured)}
                                                className="w-9 h-5 bg-[#201f22] rounded-full appearance-none relative checked:bg-amber-500 transition-colors cursor-pointer before:content-[''] before:absolute before:w-4 before:h-4 before:rounded-full before:bg-white before:top-0.5 before:left-0.5 before:transition-transform checked:before:translate-x-4"
                                            />
                                            <span className="text-xs text-amber-500">Featured</span>
                                        </label>
                                    </div>
                                    
                                    <DeleteConfirmationPopover 
                                        name={test.name} 
                                        onDelete={() => handleDelete(test._id)} 
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

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
                    className="p-2 text-[#ffb4ab] hover:bg-[#93000a]/20 hover:text-white rounded-lg transition-all cursor-pointer"
                    title="Delete"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-[#131315] border border-[#424754] text-[#e5e1e4] p-4 shadow-xl rounded-xl z-[9999]" align="end" side="top">
                <div className="space-y-4">
                    <div className="space-y-1 text-left">
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
