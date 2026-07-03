"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
    getAllTestimonialsAdmin,
    updateTestimonialStatus,
    deleteTestimonial,
} from "@/utils/api/testimonials";
import { Trash2, Loader2, Star, User, Check } from "lucide-react";

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

    return (
        <div className="w-full max-w-[1440px] mx-auto pt-6 px-4 md:px-10 pb-20 text-[#e5e1e4] font-sans antialiased">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
                <div>
                    <h2 className="text-[48px] font-semibold tracking-tight leading-none mb-1">Testimonials</h2>
                    <p className="text-[#c2c6d6] text-[16px]">Manage and curate social proof from clients and colleagues.</p>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-[#adc6ff]" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {testimonials.map((test) => (
                        <div key={test._id} className="group relative bg-[#0e0e10] border border-[#424754] rounded-xl p-6 flex flex-col hover:border-[#3f3f46] hover:shadow-[0_0_40px_rgba(59,130,246,0.05)] transition-all duration-300">
                            {/* Top Row: Avatar & Metadata */}
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex gap-4">
                                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#424754]">
                                        {test.image ? (
                                            <Image 
                                                src={test.image} 
                                                alt={test.name} 
                                                fill 
                                                className="object-cover"
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
                            </div>

                            {/* message */}
                            <blockquote className="text-[#c2c6d6] text-[14px] leading-relaxed italic mb-6">
                                &ldquo;{test.message}&rdquo;
                            </blockquote>

                            {/* Badges & Footer */}
                            <div className="mt-auto flex items-center justify-between border-t border-[#424754]/30 pt-4 text-xs">
                                <div className="flex gap-2">
                                    <span className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] tracking-wider ${
                                        test.isActive 
                                            ? "bg-[#adc6ff]/10 text-[#adc6ff]" 
                                            : "bg-[#45464e]/30 text-[#c6c6cf]"
                                    }`}>
                                        {test.isActive ? "Approved" : "Pending"}
                                    </span>
                                    {test.isFeatured && (
                                        <span className="flex items-center gap-1 px-2.5 py-0.5 bg-[#df7412]/15 text-[#ffb786] rounded-full font-bold uppercase text-[10px] tracking-wider">
                                            Featured
                                        </span>
                                    )}
                                </div>
                                <span className="text-[#8c909f]">{new Date(test.createdAt).toLocaleDateString()}</span>
                            </div>

                            {/* Hover Actions Overlay */}
                            <div className="absolute inset-0 bg-[#131315]/95 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 rounded-xl">
                                <button 
                                    onClick={() => handleToggleActive(test._id, test.isActive)}
                                    className={`p-3 rounded-full transition-transform hover:scale-105 ${
                                        test.isActive ? "bg-[#353437] text-[#e5e1e4]" : "bg-[#adc6ff] text-[#002e6a]"
                                    }`} 
                                    title={test.isActive ? "Reject/Hide" : "Approve/Show"}
                                >
                                    <Check className="w-5 h-5" />
                                </button>
                                <button 
                                    onClick={() => handleToggleFeatured(test._id, test.isFeatured)}
                                    className={`p-3 rounded-full transition-transform hover:scale-105 ${
                                        test.isFeatured ? "bg-[#353437] text-amber-500" : "bg-amber-500 text-black"
                                    }`}
                                    title={test.isFeatured ? "Unfeature" : "Feature"}
                                >
                                    <Star className="w-5 h-5" />
                                </button>
                                <button 
                                    onClick={() => handleDelete(test._id)}
                                    className="bg-[#93000a] text-[#ffdad6] p-3 rounded-full transition-transform hover:scale-105" 
                                    title="Delete"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
