"use client";

import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/admin/admin-sidebar";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider defaultOpen={true} className="w-full h-full">
            <div className="flex w-full h-full bg-[#070708]">
                <AdminSidebar />

                <SidebarInset className="bg-transparent overflow-hidden flex flex-col flex-1 min-w-0">
                    {/* Common Minimal Top Bar */}
                    <header className="flex md:hidden h-14 items-center justify-between border-b border-[#424754]/30 bg-[#0e0e10] px-4 shrink-0 z-10">
                        <div className="flex items-center gap-3">
                            <SidebarTrigger className="h-8 w-8 text-[#e5e1e4] hover:bg-[#2a2a2c]/50 hover:text-[#e5e1e4] cursor-pointer" />
                            <span className="font-semibold text-sm text-[#e5e1e4] opacity-80">Studio Personal CMS</span>
                        </div>
                    </header>

                    <div className="flex-1 overflow-y-auto p-4 md:p-6 no-scrollbar">
                        {children}
                    </div>
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
}
