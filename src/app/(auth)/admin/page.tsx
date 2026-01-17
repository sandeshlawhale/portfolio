"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
export default function AdminPage() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
        } else {
            setIsAuthenticated(true);
        }
    }, [router]);

    if (!isAuthenticated) {
        return null; // or a loading spinner
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
                <p className="text-muted-foreground">
                    Welcome back to your portfolio admin dashboard.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Dashboard stats placeholders */}
                <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground">Total Projects</h3>
                    <div className="text-2xl font-bold mt-2">12</div>
                </div>
                <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground">Total Skills</h3>
                    <div className="text-2xl font-bold mt-2">24</div>
                </div>
                <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground">Pending Blogs</h3>
                    <div className="text-2xl font-bold mt-2">3</div>
                </div>
            </div>
        </div>
    );
}
