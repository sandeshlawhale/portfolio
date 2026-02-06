"use client";

import ResumeForm from "@/components/admin/resume-form";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AddResumePage() {
    const router = useRouter();

    return (
        <div className="w-full max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ChevronLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">Add New Resume</h1>
                    <p className="text-muted-foreground text-sm">Upload a new resume file or add a link</p>
                </div>
            </div>

            <div className="bg-card p-8 rounded-2xl border border-border shadow-sm">
                <ResumeForm />
            </div>
        </div>
    );
}
