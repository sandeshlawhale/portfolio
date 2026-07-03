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
        <div className="w-full max-w-[1440px] mx-auto pt-3 md:pt-6 px-2 md:px-10 pb-6 md:pb-12">
            <WorkForm initialData={work} isEdit={true} />
        </div>
    );
}
