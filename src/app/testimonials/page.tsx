"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Upload, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAppContext } from "@/context/AppContext";
import { getBaseUrl } from "@/utils/api/baseUrl";
import { cn } from "@/lib/utils";

export default function TestimonialsPage() {
    const { setDataLoaded } = useAppContext();
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
        company: "",
        role: "",
        linkedinUrl: "",
    });

    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [agreed, setAgreed] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setDataLoaded(true);
    }, [setDataLoaded]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const isFormValid =
        formData.name.trim() !== "" &&
        formData.email.trim() !== "" &&
        formData.message.trim() !== "" &&
        agreed;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid) return;

        setLoading(true);
        try {
            const baseUrl = getBaseUrl() || "http://localhost:5051";
            const submitData = new FormData();
            submitData.append("name", formData.name);
            submitData.append("email", formData.email);
            submitData.append("message", formData.message);
            submitData.append("company", formData.company);
            submitData.append("role", formData.role);
            submitData.append("linkedinUrl", formData.linkedinUrl);
            if (image) {
                submitData.append("image", image);
            }

            const res = await fetch(`${baseUrl}/api/testimonials`, {
                method: "POST",
                body: submitData,
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Testimonial submitted successfully! Thank you.");
                router.push("/");
            } else {
                toast.error(data.message || "Failed to submit testimonial");
            }
        } catch (error) {
            console.error("Error submitting testimonial:", error);
            toast.error("An error occurred. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row h-screen w-full bg-black text-primaryText overflow-hidden">
            {/* Left Side: Form */}
            <div className="w-full lg:w-1/2 h-full flex flex-col p-4 pb-32 gap-12 overflow-y-auto no-scrollbar">
                <div className="mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/50 border border-border text-sm hover:bg-secondary transition-colors"
                    >
                        <ChevronLeft size={16} />
                        Home
                    </Link>
                </div>

                <div className="max-w-sm w-full mx-auto space-y-8">
                    <div className="space-y-2">
                        {/* Logo Placeholder */}
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden border border-border">
                            <Image
                                src="/assets/me.jpg"
                                alt="Sandesh Lawhale"
                                width={48}
                                height={48}
                                className="object-cover w-full h-full"
                            />
                        </div>
                        <div>
                            <h1 className="text-3xl font-semibold tracking-tight capitalize">testimonial form</h1>
                            <p className="text-mutedText">Help me build a better portfolio.</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                className="bg-secondary/30 border-border rounded-md"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="flex items-end justify-between">Email Address <span className="text-[10px] text-mutedText">This email will be kept private</span></Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                className="bg-secondary/30 border-border rounded-md"
                            />

                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="company">Company <span className="text-mutedText">(optional)</span></Label>
                                <Input
                                    id="company"
                                    placeholder="Company Name"
                                    value={formData.company}
                                    onChange={handleInputChange}
                                    className="bg-secondary/30 border-border rounded-md"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="role">Role <span className="text-mutedText">(optional)</span></Label>
                                <Input
                                    id="role"
                                    placeholder="Software Engineer"
                                    value={formData.role}
                                    onChange={handleInputChange}
                                    className="bg-secondary/30 border-border rounded-md"
                                />
                            </div>
                        </div>

                        {/* <div className="space-y-2">
                            <Label htmlFor="linkedinUrl">LinkedIn URL <span className="text-mutedText">(optional)</span></Label>
                            <Input
                                id="linkedinUrl"
                                placeholder="https://linkedin.com/in/..."
                                value={formData.linkedinUrl}
                                onChange={handleInputChange}
                                className="bg-secondary/30 border-border rounded-md"
                            />
                        </div> */}

                        <div className="space-y-2">
                            <Label htmlFor="message">Message</Label>
                            <Textarea
                                id="message"
                                placeholder="Your kind words..."
                                value={formData.message}
                                onChange={handleInputChange}
                                required
                                className="bg-secondary/30 border-border rounded-md min-h-[100px]"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="flex items-end justify-between"><span>Profile Image <span className="text-mutedText">(optional)</span></span> <span className="text-[10px] text-mutedText">Preferred, company logo</span></Label>
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="group relative flex items-center justify-center w-full h-11 border border-border border-dashed rounded-md bg-secondary/10 hover:bg-secondary/20 cursor-pointer transition-all overflow-hidden"
                            >
                                {imagePreview ? (
                                    <div className="flex items-center gap-2 text-sm text-primaryText">
                                        <Image src={imagePreview} alt="Preview" width={24} height={24} className="rounded-full object-cover w-6 h-6" />
                                        <span className="truncate max-w-[200px]">{image?.name}</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-mutedText group-hover:text-primaryText transition-colors">
                                        <Upload size={16} />
                                        <span className="text-sm">Upload Profile Image</span>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    accept="image/*"
                                    className="hidden"
                                />
                            </div>
                        </div>

                        <div className="flex items-start gap-3 pt-2">
                            <div
                                onClick={() => setAgreed(!agreed)}
                                className={cn(
                                    "mt-1 w-5 h-5 rounded border flex items-center justify-center cursor-pointer transition-all",
                                    agreed ? "bg-primaryText border-primaryText" : "border-border bg-transparent"
                                )}
                            >
                                {agreed && <Check size={14} className="text-black" />}
                            </div>
                            <Label
                                onClick={() => setAgreed(!agreed)}
                                className="text-sm text-mutedText leading-tight cursor-pointer font-normal"
                            >
                                by clicking this checkbox, I allow Sandesh to display this testimonial publicly on his portfolio.
                            </Label>
                        </div>

                        <Button
                            type="submit"
                            disabled={!isFormValid || loading}
                            className={cn(
                                "w-full h-11 rounded-md text-base font-semibold uppercase tracking-wide transition-all mt-4",
                                isFormValid
                                    ? "bg-primaryText text-black hover:bg-primaryText/90"
                                    : "bg-secondary text-mutedText cursor-not-allowed"
                            )}
                        >
                            {loading ? "Submitting..." : "Submit Testimonial"}
                        </Button>
                    </form>
                </div>
            </div>

            {/* Right Side: Empty White Box */}
            <div className="hidden lg:block w-1/2 p-4">
                <div className="w-full h-full bg-white/10 rounded-md shadow-xl flex items-center justify-center">
                    {/* Empty for now as requested */}
                </div>
            </div>
        </div>
    );
}
