import WorkForm from "@/components/admin/work-form";
import { getWorkById } from "@/utils/api/work";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditWorkPage({ params }: PageProps) {
    const { id } = await params;
    const work = await getWorkById(id);

    if (!work) {
        notFound();
    }

    return (
        <div className="w-full max-w-4xl mx-auto space-y-6">
            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                <h1 className="text-2xl font-bold">Edit Work Experience</h1>
                <p className="text-muted-foreground text-sm">Update your experience details</p>
            </div>
            <div className="bg-card p-8 rounded-2xl border border-border shadow-sm">
                <WorkForm initialData={work} isEdit={true} />
            </div>
        </div>
    );
}
