import WorkForm from "@/components/admin/work-form";

export default function AddWorkPage() {
    return (
        <div className="w-full max-w-4xl mx-auto space-y-6">
            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                <h1 className="text-2xl font-bold">Add Work Experience</h1>
                <p className="text-muted-foreground text-sm">Add a new role to your professional timeline</p>
            </div>
            <div className="bg-card p-8 rounded-2xl border border-border shadow-sm">
                <WorkForm />
            </div>
        </div>
    );
}
