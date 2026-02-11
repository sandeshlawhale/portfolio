"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createWork, updateWork } from "@/utils/api/work";

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
    start: string; // e.g. "Feb 25"
    end: string;   // e.g. "Nov 25" or "Present"
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

    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string

    __v: number;
};
interface WorkFormProps {
    initialData?: Experience;
    isEdit?: boolean;
}

export default function WorkForm({ initialData, isEdit = false }: WorkFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);


    // Form States - Flat for inputs, constructed to object on submit
    const [companyName, setCompanyName] = useState(initialData?.company?.name || "");
    const [companyWebsite, setCompanyWebsite] = useState(initialData?.company?.website || "");
    const [role, setRole] = useState(initialData?.role || "");
    const [status, setStatus] = useState(initialData?.status || "Completed"); // Default status
    const [locationType, setLocationType] = useState(initialData?.location?.type || "On-site");
    const [city, setCity] = useState(initialData?.location?.city || "");
    const [startDate, setStartDate] = useState(initialData?.duration?.start || "");
    const [endDate, setEndDate] = useState(initialData?.duration?.end || "");

    // Arrays
    const [technologies, setTechnologies] = useState(initialData?.technologies?.join(", ") || "");
    const [responsibilities, setResponsibilities] = useState(
        Array.isArray(initialData?.responsibilities) ? initialData.responsibilities.join("\n") : ""
    );

    // Image handling for Company Logo
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

            // Parse Arrays
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
            console.error("Something went wrong while adding/updating the work experience: ", error);
            toast.error("Something went wrong while adding/updating the work experience");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column: Company & Role */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label>Company Logo</Label>
                        <div onClick={() => fileInputRef.current?.click()} className="cursor-pointer group relative h-32 w-32 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center bg-accent/5 hover:bg-accent/10 transition-colors overflow-hidden mx-auto md:mx-0">
                            {imagePreview ? (
                                <>
                                    <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <p className="text-white text-xs font-medium">Change</p>
                                    </div>
                                    <Button type="button" variant="destructive" size="icon" className="absolute top-1 right-1 z-10 w-6 h-6" onClick={(e) => { e.stopPropagation(); removeImage(); }}>
                                        <X className="w-3 h-3" />
                                    </Button>
                                </>
                            ) : (
                                <div className="text-center text-muted-foreground">
                                    <Upload className="w-6 h-6 mx-auto mb-1 opacity-50" />
                                    <p className="text-xs">Upload Logo</p>
                                </div>
                            )}
                            <Input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Company Name</Label>
                        <Input required placeholder="Google" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                    </div>

                    <div className="space-y-2">
                        <Label>Company Website</Label>
                        <Input placeholder="https://google.com" value={companyWebsite} onChange={(e) => setCompanyWebsite(e.target.value)} />
                    </div>

                    <div className="space-y-2">
                        <Label>Role</Label>
                        <Input required placeholder="Senior Software Engineer" value={role} onChange={(e) => setRole(e.target.value)} />
                    </div>
                </div>

                {/* Right Column: Details */}
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Status</Label>
                            <Input required placeholder="Completed, Ongoing..." value={status} onChange={(e) => setStatus(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Location Type</Label>
                            <Input required placeholder="On-site, Remote..." value={locationType} onChange={(e) => setLocationType(e.target.value)} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>City</Label>
                        <Input required placeholder="Mountain View, CA" value={city} onChange={(e) => setCity(e.target.value)} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Start Date</Label>
                            <Input required placeholder="Jan 2024" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>End Date</Label>
                            <Input placeholder="Present" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Technologies (Comma separated)</Label>
                        <Input required placeholder="React, Go, Kubernetes" value={technologies} onChange={(e) => setTechnologies(e.target.value)} />
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <Label>Responsibilities <span className="text-xs text-muted-foreground font-normal">(Separate points with new lines)</span></Label>
                <Textarea required placeholder="Led the development of..." className="min-h-[200px]" value={responsibilities} onChange={(e) => setResponsibilities(e.target.value)} />
            </div>

            <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                <Button type="submit" disabled={loading} className="min-w-[120px]">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    {isEdit ? "Update Work" : "Add Work"}
                </Button>
            </div>
        </form>
    );
}
