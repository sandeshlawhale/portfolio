"use client";

import { useEffect, useState } from "react";
import ResumeForm from "@/components/admin/resume-form";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { getResumeById } from "@/utils/api/resume";
import { Resume } from "../../page";

export default function EditResumePage() {
    const router = useRouter();
    const { id } = useParams();
    const [resume, setResume] = useState<Resume | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResume = async () => {
            try {
                const data = await getResumeById(id as string);
                setResume(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchResume();
    }, [id]);

    return (
        <div className="w-full max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ChevronLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">Edit Resume</h1>
                    <p className="text-muted-foreground text-sm">Update your existing resume details</p>
                </div>
            </div>

            <div className="bg-card p-8 rounded-2xl border border-border shadow-sm">
                {loading ? (
                    <div className="flex justify-center p-12">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : resume ? (
                    <ResumeForm initialData={resume} isEdit />
                ) : (
                    <div className="text-center p-12 text-muted-foreground">
                        Resume not found.
                    </div>
                )}
            </div>
        </div>
    );
}
