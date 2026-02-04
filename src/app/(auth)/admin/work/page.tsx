"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { getAllWorks, deleteWork } from "@/utils/api/work";
import { Trash2, Edit, Plus, Loader2, Globe, MapPin, Calendar } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

export default function AdminWorkPage() {
    const [works, setWorks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchWorks = async () => {
        setLoading(true);
        try {
            const data = await getAllWorks();
            if (data.success) {
                setWorks(data.result);
            }
        } catch (error) {
            toast.error("Failed to fetch works");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWorks();
    }, []);

    const handleDelete = async (id: string, name: string, confirmation: string) => {
        if (confirmation !== `sudo delete ${name}`) {
            toast.error("Incorrect confirmation command");
            return;
        }

        try {
            await deleteWork(id);
            toast.success("Work deleted successfully");
            fetchWorks();
        } catch (error: any) {
            toast.error(error.message || "Failed to delete work");
        }
    };

    return (
        <TooltipProvider>
            <div className="w-full max-w-5xl mx-auto space-y-6">
                <div className="flex justify-between items-center bg-card p-6 rounded-2xl border border-border shadow-sm">
                    <div>
                        <h1 className="text-2xl font-bold">Work Experience</h1>
                        <p className="text-muted-foreground text-sm">Manage your professional experience</p>
                    </div>
                    <Button onClick={() => router.push("/admin/work/add")} className="gap-2">
                        <Plus className="w-4 h-4" /> Add New
                    </Button>
                </div>

                {loading ? (
                    <div className="flex justify-center p-12">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {works.length === 0 ? (
                            <div className="p-12 text-center text-muted-foreground bg-card rounded-2xl border border-border">
                                No work experience found. Add your first one!
                            </div>
                        ) : (
                            works.map((work) => (
                                <div key={work._id} className="bg-card rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex flex-col md:flex-row gap-6">
                                        <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-border flex-shrink-0 bg-white">
                                            {work.company?.logo && (
                                                <Image
                                                    src={work.company.logo}
                                                    alt={work.company.name}
                                                    fill
                                                    className="object-contain p-1"
                                                />
                                            )}
                                        </div>

                                        <div className="flex-1 space-y-2">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-lg font-bold">{work.company?.name}</h3>
                                                    <div className="flex items-center gap-2 text-mutedText font-medium">
                                                        {work.role}
                                                        <span className="text-xs bg-accent/50 px-2 py-0.5 rounded-full text-muted-foreground font-normal border border-border">{work.status}</span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button size="icon" variant="ghost" onClick={() => router.push(`/admin/work/${work._id}/edit`)}>
                                                        <Edit className="w-4 h-4 text-muted-foreground hover:text-primary" />
                                                    </Button>

                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button size="icon" variant="ghost" className="hover:bg-destructive/10">
                                                                <Trash2 className="w-4 h-4 text-destructive" />
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-80 bg-primary" align="end">
                                                            <div className="space-y-4">
                                                                <div className="space-y-2">
                                                                    <h4 className="font-medium leading-none text-destructive">Delete Work?</h4>
                                                                    <p className="text-sm text-muted-foreground">
                                                                        Type <span className="font-mono bg-muted px-1 rounded">
                                                                            <Badge variant="secondary" className="text-sm py-0">sudo delete {work.company?.name}</Badge></span> to confirm.
                                                                    </p>
                                                                </div>
                                                                <DeleteConfirmation name={work.company?.name} onDelete={(confirm) => handleDelete(work._id, work.company?.name, confirm)} />
                                                            </div>
                                                        </PopoverContent>
                                                    </Popover>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <Globe className="w-3.5 h-3.5" />
                                                    <a href={work.company?.website} target="_blank" rel="noreferrer" className="hover:underline hover:text-primary transition-colors">Website</a>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="w-3.5 h-3.5" />
                                                    {work.location?.city} ({work.location?.type})
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    {work.duration?.start} - {work.duration?.end}
                                                </div>
                                            </div>

                                            <div className="pt-2">
                                                <div className="flex flex-wrap gap-2">
                                                    {work.technologies?.slice(0, 5).map((tech: string) => (
                                                        <span key={tech} className="text-xs bg-muted/50 border px-2 py-1 rounded-md">{tech}</span>
                                                    ))}
                                                    {work.technologies?.length > 5 && (
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <span className="text-xs text-muted-foreground self-center cursor-pointer transition-colors hover:text-mutedText">
                                                                    +{work.technologies.length - 5} more
                                                                </span>
                                                            </TooltipTrigger>
                                                            <TooltipContent side="top" className="max-w-xs">
                                                                <div className="flex flex-wrap gap-1 p-1">
                                                                    {work.technologies.map((tech: string) => (
                                                                        <Badge key={tech} variant="secondary" className="text-[10px] py-0">{tech}</Badge>
                                                                    ))}
                                                                </div>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </TooltipProvider>
    );
}

function DeleteConfirmation({ name, onDelete }: { name: string, onDelete: (confirm: string) => void }) {
    const [confirmText, setConfirmText] = useState("");

    return (
        <div className="space-y-4">
            <Input
                placeholder={`sudo delete ${name}`}
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className="text-sm"
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
    )
}
