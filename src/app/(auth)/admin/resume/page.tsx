"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { getAllResumes, deleteResume, updateResume } from "@/utils/api/resume";
import { Trash2, Edit, Plus, Loader2, FileText, Link as LinkIcon, ExternalLink, CheckCircle2 } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";

interface Resume {
    _id: string;
    name: string;
    url: string;
    type: "file" | "link";
    isActive: boolean;
    createdAt: string;
}

export default function AdminResumePage() {
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [loading, setLoading] = useState(true);
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
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResumes();
    }, []);

    const handleDelete = async (id: string, name: string, confirmation: string) => {
        if (confirmation !== `sudo delete ${name}`) {
            toast.error("Incorrect confirmation command");
            return;
        }

        try {
            await deleteResume(id);
            toast.success("Resume deleted successfully");
            fetchResumes();
        } catch (error: any) {
            toast.error(error.message || "Failed to delete resume");
        }
    };

    const handleSetActive = async (id: string) => {
        try {
            const formData = new FormData();
            formData.append("isActive", "true");
            await updateResume(id, formData);
            toast.success("Active resume updated");
            fetchResumes();
        } catch (error: any) {
            toast.error(error.message || "Failed to set active resume");
        }
    };

    return (
        <div className="w-full max-w-6xl mx-auto space-y-6">
            <div className="flex justify-between items-center bg-card p-6 rounded-2xl border border-border shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold">Resumes</h1>
                    <p className="text-muted-foreground text-sm">Manage your professional resumes</p>
                </div>
                <Button onClick={() => router.push("/admin/resume/add")} className="gap-2">
                    <Plus className="w-4 h-4" /> Add New
                </Button>
            </div>

            {loading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                    {resumes.length === 0 ? (
                        <div className="p-12 text-center text-muted-foreground">
                            No resumes found. Add your first one!
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent text-primaryText">
                                    <TableHead className="w-[50px]">Status</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Created At</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {resumes.map((resume: Resume) => (
                                    <TableRow key={resume._id} className="group transition-colors hover:bg-muted/50">
                                        <TableCell>
                                            {resume.isActive ? (
                                                <div className="flex justify-center">
                                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                                </div>
                                            ) : (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="w-8 h-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={() => handleSetActive(resume._id)}
                                                >
                                                    <CheckCircle2 className="w-4 h-4 text-muted-foreground/30 hover:text-emerald-500/50" />
                                                </Button>
                                            )}
                                        </TableCell>
                                        <TableCell className="font-semibold text-primaryText">
                                            <div className="flex items-center gap-2">
                                                {resume.name}
                                                {resume.isActive && (
                                                    <Badge variant="default" className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20 text-[10px] h-4 px-1.5 uppercase font-bold tracking-wider">
                                                        Active
                                                    </Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                {resume.type === "file" ? <FileText className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
                                                <span className="capitalize">{resume.type}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {new Date(resume.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button size="icon" variant="ghost" onClick={() => window.open(resume.url, "_blank")}>
                                                    <ExternalLink className="w-4 h-4 text-muted-foreground hover:text-primary" />
                                                </Button>
                                                <Button size="icon" variant="ghost" onClick={() => router.push(`/admin/resume/${resume._id}/edit`)}>
                                                    <Edit className="w-4 h-4 text-muted-foreground hover:text-primary" />
                                                </Button>

                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button size="icon" variant="ghost" className="hover:bg-destructive/10">
                                                            <Trash2 className="w-4 h-4 text-destructive" />
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="min-w-80 bg-primary" align="end">
                                                        <div className="space-y-4">
                                                            <div className="space-y-2">
                                                                <h4 className="font-medium leading-none text-destructive">Delete Resume?</h4>
                                                                <p className="text-sm text-muted-foreground">
                                                                    Type <span className="font-mono bg-muted px-1 rounded">
                                                                        <Badge variant="secondary" className="text-sm py-0">sudo delete {resume.name}</Badge>
                                                                    </span> to confirm.
                                                                </p>
                                                            </div>
                                                            <DeleteConfirmation name={resume.name} onDelete={(confirm) => handleDelete(resume._id, resume.name, confirm)} />
                                                        </div>
                                                    </PopoverContent>
                                                </Popover>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </div>
            )}
        </div>
    );
}

function DeleteConfirmation({ name, onDelete }: { name: string, onDelete: (confirm: string) => void }) {
    const [confirmText, setConfirmText] = useState("");

    return (
        <div className="space-y-4">
            <Input
                placeholder={`sudo delete ${name}`}
                value={confirmText}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmText(e.target.value)}
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
    );
}
