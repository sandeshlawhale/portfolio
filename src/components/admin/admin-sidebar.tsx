"use client";

import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarProvider, // Keep it internal if needed, but here we just need the sidebar itself
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard } from "lucide-react";
import { adminNavItems } from "@/constants/admin-nav";

export default function AdminSidebar() {
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/login");
    };

    return (
        <Sidebar
            collapsible="icon"
            className="border-none bg-transparent h-full [&>[data-sidebar=sidebar]]:!bg-transparent [&>[data-sidebar=sidebar]]:!border-none text-primaryText"
            style={{ position: 'relative' }}
        >
            <SidebarHeader className="p-0">
                <div className="mx-2 mt-2 p-4 bg-card rounded-xl border-border border-2 shadow-sm hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-2 font-bold text-lg text-primaryText">
                        <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
                        <span className="truncate group-data-[collapsible=icon]:hidden">Admin Dashboard</span>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent className="p-0">
                <div className="mx-2 my-2 flex-1 bg-card rounded-xl border-2 border-border shadow-sm overflow-hidden flex flex-col gap-1 p-2">
                    {adminNavItems.map((item) => (
                        <div key={item.id} className="w-full">
                            <Button
                                variant="ghost"
                                className={`w-full justify-start h-10 px-3 hover:bg-accent/50 ${pathname.startsWith(item.href)
                                    ? "bg-accent/50 text-primaryText"
                                    : "text-mutedText"
                                    }`}
                                onClick={() => router.push(item.href)}
                            >
                                <item.icon className="w-4 h-4 mr-2" />
                                <span>{item.title}</span>
                            </Button>
                        </div>
                    ))}
                </div>
            </SidebarContent>

            <SidebarFooter className="p-0">
                <div className="mx-2 mb-2 bg-card rounded-xl border-2 border-border shadow-sm">
                    <Popover>
                        <PopoverTrigger asChild>
                            <div className="p-3 flex items-center gap-3 cursor-pointer hover:bg-accent/50 transition-colors rounded-xl">
                                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-border">
                                    <Image
                                        src="/assets/me/me.jpg"
                                        alt="Profile"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex flex-col group-data-[collapsible=icon]:hidden text-left">
                                    <span className="text-sm font-medium">Hi Sandesh</span>
                                    <span className="text-xs text-muted-foreground">Admin</span>
                                </div>
                            </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-48 p-2 mb-2" side="top" align="start">
                            <Button
                                variant="ghost"
                                className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={handleLogout}
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                            </Button>
                        </PopoverContent>
                    </Popover>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
