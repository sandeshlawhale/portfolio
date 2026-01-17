"use client";

import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/admin/admin-sidebar";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider defaultOpen={true} className="w-full h-full">
            <div className="flex w-full h-full">
                <AdminSidebar />

                <SidebarInset className="bg-transparent overflow-hidden flex flex-col flex-1 min-w-0">
                    <div className="flex-1 overflow-y-auto p-4 pt-4">
                        <SidebarTrigger className="-ml-3 mb-4 md:hidden" />
                        {children}
                    </div>
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
}
