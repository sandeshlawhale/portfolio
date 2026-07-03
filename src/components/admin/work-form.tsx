"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import { Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createWork, updateWork } from "@/utils/api/work";

type Company = {
    name: string;
    logo: string;
    website: string;
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

type Experience = {
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

interface WorkFormProps {
    initialData?: Experience;
    isEdit?: boolean;
}

export default function WorkForm({ initialData, isEdit = false }: WorkFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Form States
    const [companyName, setCompanyName] = useState(initialData?.company?.name || "");
    const [companyWebsite, setCompanyWebsite] = useState(initialData?.company?.website || "");
    const [role, setRole] = useState(initialData?.role || "");
    const [status, setStatus] = useState(initialData?.status || "Completed");
    const [locationType, setLocationType] = useState(initialData?.location?.type || "On-site");
    const [city, setCity] = useState(initialData?.location?.city || "");
    const [startDate, setStartDate] = useState(initialData?.duration?.start || "");
    const [endDate, setEndDate] = useState(initialData?.duration?.end || "");

    // Arrays
    const [technologies, setTechnologies] = useState(initialData?.technologies?.join(", ") || "");
    const [responsibilities, setResponsibilities] = useState(
        Array.isArray(initialData?.responsibilities) ? initialData.responsibilities.join("\n") : ""
    );

    // Company Logo handling
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(initialData?.company?.logo || null);
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
            formData.append("companyName", companyName);
            formData.append("companyWebsite", companyWebsite);
            formData.append("role", role);
            formData.append("status", status);
            formData.append("locationType", locationType);
            formData.append("city", city);
            formData.append("startDate", startDate);
            formData.append("endDate", endDate);

            const techArray = technologies.split(",").map((t: string) => t.trim()).filter((t: string) => t);
            techArray.forEach((tech: string) => formData.append("technologies", tech));

            const respArray = responsibilities.split('\n').map((r: string) => r.trim()).filter((r: string) => r);
            respArray.forEach((resp: string) => formData.append("responsibilities", resp));

            if (imageFile) {
                formData.append("logo", imageFile);
            }

            if (isEdit && initialData?._id) {
                await updateWork(initialData._id, formData);
                toast.success("Work experience updated successfully");
            } else {
                await createWork(formData);
                toast.success("Work experience added successfully");
            }

            router.push("/admin/work");
            router.refresh();
        } catch (error) {
            console.error("Error saving work experience: ", error);
            toast.error("Failed to save work experience");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="text-[#e5e1e4] font-sans antialiased space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-[32px] font-semibold text-[#e5e1e4] tracking-tight">{isEdit ? "Edit Work Experience" : "Add Work Experience"}</h2>
                    <p className="text-[#c2c6d6] text-[14px]">Document your professional journey and technical milestones.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        type="button"
                        onClick={() => router.push("/admin/work")} 
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
                        Save Changes
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
                {/* Company & Role Details */}
                <div className="col-span-12 lg:col-span-8 bg-[#09090b] border border-[#27272a] hover:border-[#3f3f46] transition-all p-6 rounded-xl flex flex-col md:flex-row items-start gap-6 relative group overflow-hidden">
                    <div 
                        onClick={() => fileInputRef.current?.click()} 
                        className="w-24 h-24 bg-[#131315] rounded-lg border border-[#424754] flex flex-col items-center justify-center cursor-pointer hover:border-[#adc6ff] transition-all overflow-hidden shrink-0 relative"
                    >
                        {imagePreview ? (
                            <>
                                <Image src={imagePreview} alt="Logo" fill className="object-contain p-1" />
                                <button 
                                    type="button" 
                                    className="absolute top-1 right-1 z-10 bg-[#93000a] text-white p-0.5 rounded-full hover:scale-105 transition-transform" 
                                    onClick={(e) => { e.stopPropagation(); removeImage(); }}
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </>
                        ) : (
                            <div className="flex flex-col items-center text-[#8c909f]">
                                <Upload className="w-6 h-6 mb-1 text-[#adc6ff]" />
                                <span className="text-[10px] uppercase font-bold">Logo</span>
                            </div>
                        )}
                    </div>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />

                    <div className="flex-1 space-y-4 w-full">
                        <div className="space-y-1">
                            <label className="text-[12px] font-semibold text-[#c2c6d6] uppercase tracking-wider block">Company Name</label>
                            <input 
                                className="w-full bg-transparent border-b border-[#424754] focus:border-[#adc6ff] py-2 text-[20px] font-bold text-[#e5e1e4] focus:outline-none focus:ring-0 transition-all placeholder:text-[#424754]" 
                                type="text" 
                                placeholder="Quantum Systems"
                                required
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[12px] font-semibold text-[#c2c6d6] uppercase tracking-wider block">Job Title</label>
                            <input 
                                className="w-full bg-transparent border-b border-[#424754] focus:border-[#adc6ff] py-2 text-[16px] text-[#e5e1e4] focus:outline-none focus:ring-0 transition-all placeholder:text-[#424754]" 
                                type="text" 
                                placeholder="Senior Cloud Architect"
                                required
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Work Type & Status */}
                <div className="col-span-12 lg:col-span-4 bg-[#09090b] border border-[#27272a] hover:border-[#3f3f46] transition-all p-6 rounded-xl space-y-6">
                    <div className="space-y-2">
                        <label className="text-[12px] font-semibold text-[#c2c6d6] uppercase tracking-wider block">Work Mode / Type</label>
                        <select 
                            className="w-full bg-[#131315] border border-[#27272a] rounded-lg p-2.5 text-sm text-[#e5e1e4] focus:border-[#adc6ff] focus:ring-1 focus:ring-[#adc6ff] outline-none appearance-none"
                            value={locationType}
                            onChange={(e) => setLocationType(e.target.value)}
                        >
                            <option value="Remote">Remote</option>
                            <option value="Hybrid">Hybrid</option>
                            <option value="On-site">On-site</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[12px] font-semibold text-[#c2c6d6] uppercase tracking-wider block">Experience Status</label>
                        <select 
                            className="w-full bg-[#131315] border border-[#27272a] rounded-lg p-2.5 text-sm text-[#e5e1e4] focus:border-[#adc6ff] focus:ring-1 focus:ring-[#adc6ff] outline-none appearance-none"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="Ongoing">Ongoing</option>
                            <option value="Completed">Completed</option>
                            <option value="Working">Working</option>
                        </select>
                    </div>
                </div>

                {/* Timeline & Location */}
                <div className="col-span-12 bg-[#09090b] border border-[#27272a] hover:border-[#3f3f46] transition-all p-6 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-[12px] font-semibold text-[#c2c6d6] uppercase tracking-wider block">Start Date</label>
                        <input 
                            className="w-full bg-[#131315] border border-[#27272a] rounded-lg p-2.5 text-sm text-[#e5e1e4] focus:border-[#adc6ff] focus:ring-1 focus:ring-[#adc6ff] outline-none" 
                            type="text" 
                            placeholder="Feb 22"
                            required
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[12px] font-semibold text-[#c2c6d6] uppercase tracking-wider block">End Date (or Present)</label>
                        <input 
                            className="w-full bg-[#131315] border border-[#27272a] rounded-lg p-2.5 text-sm text-[#e5e1e4] focus:border-[#adc6ff] focus:ring-1 focus:ring-[#adc6ff] outline-none" 
                            type="text" 
                            placeholder="Present"
                            required
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[12px] font-semibold text-[#c2c6d6] uppercase tracking-wider block">Location / City</label>
                        <input 
                            className="w-full bg-[#131315] border border-[#27272a] rounded-lg p-2.5 text-sm text-[#e5e1e4] focus:border-[#adc6ff] focus:ring-1 focus:ring-[#adc6ff] outline-none" 
                            type="text" 
                            placeholder="San Francisco, CA"
                            required
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                        />
                    </div>
                </div>

                {/* Company Website */}
                <div className="col-span-12 bg-[#09090b] border border-[#27272a] hover:border-[#3f3f46] transition-all p-6 rounded-xl space-y-2">
                    <label className="text-[12px] font-semibold text-[#c2c6d6] uppercase tracking-wider block">Company Website</label>
                    <input 
                        className="w-full bg-[#131315] border border-[#27272a] rounded-lg p-2.5 text-sm text-[#e5e1e4] focus:border-[#adc6ff] focus:ring-1 focus:ring-[#adc6ff] outline-none" 
                        type="text" 
                        placeholder="https://company.com"
                        value={companyWebsite}
                        onChange={(e) => setCompanyWebsite(e.target.value)}
                    />
                </div>

                {/* Responsibilities */}
                <div className="col-span-12 lg:col-span-8 bg-[#09090b] border border-[#27272a] hover:border-[#3f3f46] transition-all p-8 rounded-xl space-y-6">
                    <h3 className="text-[20px] font-bold text-[#e5e1e4]">Description & Key Contributions (one per line)</h3>
                    <textarea 
                        className="w-full bg-[#131315] border border-[#27272a] rounded-xl p-4 text-sm text-[#e5e1e4] focus:border-[#adc6ff] focus:ring-1 focus:ring-[#adc6ff] outline-none resize-none font-mono text-[13px]" 
                        placeholder="Enter key achievements..." 
                        rows={8}
                        required
                        value={responsibilities}
                        onChange={(e) => setResponsibilities(e.target.value)}
                    />
                </div>

                {/* Tech Stack Sidebar */}
                <div className="col-span-12 lg:col-span-4 bg-[#09090b] border border-[#27272a] hover:border-[#3f3f46] transition-all p-6 rounded-xl flex flex-col space-y-6">
                    <label className="text-[12px] font-semibold text-[#c2c6d6] uppercase tracking-wider block">Technologies Used (comma separated)</label>
                    <textarea 
                        className="w-full bg-[#131315] border border-[#27272a] rounded-xl p-4 text-sm text-[#e5e1e4] focus:border-[#adc6ff] focus:ring-1 focus:ring-[#adc6ff] outline-none resize-none font-mono text-[13px]" 
                        placeholder="React, TypeScript, Node.js" 
                        rows={6}
                        required
                        value={technologies}
                        onChange={(e) => setTechnologies(e.target.value)}
                    />
                </div>
            </div>
            {isEdit && initialData && (
                <div className="mt-12 pt-8 border-t border-[#424754]">
                    <div className="bg-[#09090b] border border-[#93000a]/20 p-6 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <h4 className="text-[#ffb4ab] font-bold text-lg mb-1">Delete Experience</h4>
                            <p className="text-[#c2c6d6] text-sm">Once deleted, this work experience entry cannot be recovered.</p>
                        </div>
                        <DeleteConfirmationPopover 
                            name={initialData.company.name} 
                            onDelete={async () => {
                                try {
                                    setLoading(true);
                                    await deleteWork(initialData._id);
                                    toast.success("Work experience deleted successfully");
                                    router.push("/admin/work");
                                    router.refresh();
                                } catch {
                                    toast.error("Failed to delete work experience");
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
import { deleteWork } from "@/utils/api/work";

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
                    Delete Experience
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

