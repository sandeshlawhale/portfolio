"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
    getAllTestimonialsAdmin,
    updateTestimonialStatus,
    deleteTestimonial,
} from "@/utils/api/testimonials";
import { Trash2, Loader2, MessageSquare, Star, Mail, Building, User } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

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
            // Optimistic update
            setTestimonials((prev) =>
                prev.map((t) => (t._id === id ? { ...t, isActive: !currentVal } : t))
            );

            const res = await updateTestimonialStatus(id, { isActive: !currentVal });
            if (res.success) {
                toast.success(`Testimonial status updated successfully`);
            }
        } catch (error) {
            // Revert on error
            setTestimonials((prev) =>
                prev.map((t) => (t._id === id ? { ...t, isActive: currentVal } : t))
            );
            toast.error("Failed to update status");
            console.error(error);
        }
    };

    const handleToggleFeatured = async (id: string, currentVal: boolean) => {
        try {
            // Optimistic update
            setTestimonials((prev) =>
                prev.map((t) => (t._id === id ? { ...t, isFeatured: !currentVal } : t))
            );

            const res = await updateTestimonialStatus(id, { isFeatured: !currentVal });
            if (res.success) {
                toast.success(`Testimonial featured status updated successfully`);
            }
        } catch (error) {
            // Revert on error
            setTestimonials((prev) =>
                prev.map((t) => (t._id === id ? { ...t, isFeatured: currentVal } : t))
            );
            toast.error("Failed to update featured status");
            console.error(error);
        }
    };

    const handleDelete = async (id: string, name: string, confirmation: string) => {
        if (confirmation !== `sudo delete ${name}`) {
            toast.error("Incorrect confirmation command");
            return;
        }

        try {
            await deleteTestimonial(id);
            toast.success("Testimonial deleted successfully");
            fetchTestimonials();
        } catch (error) {
            toast.error("Failed to delete testimonial");
            console.error("Failed to delete testimonial: ", error);
        }
    };

    return (
        <div className="w-full max-w-6xl mx-auto space-y-6">
            <div className="flex justify-between items-center bg-card p-6 rounded-2xl border border-border shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <MessageSquare className="w-6 h-6 text-primary" />
                        Testimonials
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        Approve, feature, and delete testimonials submitted by users
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center p-12 bg-card rounded-2xl border border-border">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                    {testimonials.length === 0 ? (
                        <div className="p-12 text-center text-muted-foreground">
                            No testimonials found.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="w-[200px]">User</TableHead>
                                        <TableHead className="w-[180px]">Email</TableHead>
                                        <TableHead className="min-w-[250px]">Message</TableHead>
                                        <TableHead className="w-[120px] text-center">Active</TableHead>
                                        <TableHead className="w-[120px] text-center">Featured</TableHead>
                                        <TableHead className="w-[100px] text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {testimonials.map((t) => (
                                        <TableRow key={t._id} className="hover:bg-muted/30">
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-3">
                                                    <div className="relative w-10 h-10 rounded-full overflow-hidden border border-border flex-shrink-0 bg-secondary flex items-center justify-center">
                                                        {t.image ? (
                                                            <Image
                                                                src={t.image}
                                                                alt={t.name}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        ) : (
                                                            <User className="w-5 h-5 text-muted-foreground" />
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col truncate max-w-[150px]">
                                                        <span className="font-semibold text-sm truncate">{t.name}</span>
                                                        {(t.role || t.company) && (
                                                            <span className="text-xs text-muted-foreground truncate flex items-center gap-1">
                                                                <Building className="w-3 h-3 flex-shrink-0" />
                                                                {t.role || ""} {t.company ? `@ ${t.company}` : ""}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1.5 text-muted-foreground text-sm truncate max-w-[180px]">
                                                    <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                                                    <span>{t.email}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="max-w-[300px]">
                                                <p className="text-sm break-words whitespace-normal line-clamp-3">
                                                    {t.message}
                                                </p>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex justify-center">
                                                    <Switch
                                                        checked={t.isActive}
                                                        onCheckedChange={() => handleToggleActive(t._id, t.isActive)}
                                                    />
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex justify-center">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className={t.isFeatured ? "text-amber-500 hover:text-amber-600" : "text-muted-foreground hover:text-amber-500"}
                                                        onClick={() => handleToggleFeatured(t._id, t.isFeatured)}
                                                    >
                                                        <Star className="w-5 h-5" fill={t.isFeatured ? "currentColor" : "none"} />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end">
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button size="icon" variant="ghost" className="hover:bg-destructive/10">
                                                                <Trash2 className="w-4 h-4 text-destructive" />
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-80 bg-primary border-border border-2" align="end">
                                                            <div className="space-y-4">
                                                                <div className="space-y-2">
                                                                    <h4 className="font-medium leading-none text-destructive">Delete Testimonial?</h4>
                                                                    <p className="text-sm text-muted-foreground">
                                                                        Type <span className="font-mono bg-muted px-1 rounded">
                                                                            <Badge variant="secondary" className="text-sm py-0">sudo delete {t.name}</Badge></span> to confirm.
                                                                    </p>
                                                                </div>
                                                                <DeleteConfirmation name={t.name} onDelete={(confirm) => handleDelete(t._id, t.name, confirm)} />
                                                            </div>
                                                        </PopoverContent>
                                                    </Popover>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>
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
                onChange={(e) => setConfirmText(e.target.value)}
                className="text-sm bg-secondary/30 border-border"
            />
            <Button
                variant="destructive"
                size="sm"
                className="w-full"
                disabled={confirmText !== `sudo delete ${name}`}
                onClick={() => onDelete(confirmText)}
            >
                Confirm Delete
            </Button>
        </div>
    );
}
