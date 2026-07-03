"use client";

import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
} from "@/components/ui/sidebar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { LogOut, Terminal } from "lucide-react";
import { adminNavItems } from "@/constants/admin-nav";

export default function AdminSidebar() {
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/");
    };

    return (
        <Sidebar
            collapsible="icon"
            className="border-r border-[#424754] bg-[#0e0e10] h-screen w-64 fixed left-0 top-0 [&>[data-sidebar=sidebar]]:!bg-[#0e0e10] [&>[data-sidebar=sidebar]]:!border-none text-[#e5e1e4]"
        >
            <SidebarHeader className="p-6">
                <div
                    onClick={() => router.push("/admin")}
                    className="cursor-pointer group flex items-center gap-3"
                >
                    <div className="w-9 h-9 rounded-lg bg-[#adc6ff]/10 border border-[#adc6ff]/20 flex items-center justify-center text-[#adc6ff] shrink-0 group-hover:border-[#adc6ff]/40 transition-colors">
                        <Terminal className="w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="font-black text-[22px] text-[#e5e1e4] leading-none tracking-[0.05em] group-hover:text-[#adc6ff] transition-colors">STUDIO</h1>
                        <p className="text-[#adc6ff] text-[9px] tracking-[0.06em] uppercase font-bold mt-1 opacity-80">personal CMS</p>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent className="px-4 py-2">
                <nav className="flex flex-col gap-2">
                    {adminNavItems.map((item) => {
                        const isActive = item.href === "/admin"
                            ? pathname === "/admin"
                            : pathname.startsWith(item.href);
                        return (
                            <button
                                key={item.id}
                                onClick={() => router.push(item.href)}
                                className={`flex items-center gap-3 px-4 py-2 text-sm rounded-lg transition-all duration-200 text-left cursor-pointer ${isActive
                                        ? "bg-[#45464e] text-[#e5e1e4] border-l-2 border-[#adc6ff] font-medium"
                                        : "text-[#c2c6d6] hover:text-[#e5e1e4] hover:bg-[#2a2a2c]/50"
                                    }`}
                            >
                                <item.icon className="w-5 h-5 flex-shrink-0" />
                                <span>{item.title}</span>
                            </button>
                        );
                    })}
                </nav>
            </SidebarContent>

            <SidebarFooter className="p-4 mt-auto">
                <div className="border-t border-[#424754] pt-4">
                    <Popover>
                        <PopoverTrigger asChild>
                            <div className="p-2 flex items-center gap-3 cursor-pointer hover:bg-[#2a2a2c]/50 transition-all rounded-lg">
                                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#424754]">
                                    <Image
                                        src="/assets/me/me.jpg"
                                        alt="Profile"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex flex-col text-left group-data-[collapsible=icon]:hidden">
                                    <span className="text-sm font-medium text-[#e5e1e4]">Hi Sandesh</span>
                                    <span className="text-xs text-[#c2c6d6] opacity-60">Admin</span>
                                </div>
                            </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-48 p-2 mb-2 bg-[#131315] border border-[#424754] text-[#e5e1e4]" side="top" align="start">
                            <Button
                                variant="ghost"
                                className="w-full justify-start text-[#ffb4ab] hover:text-[#ffdad6] hover:bg-[#93000a]/20"
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
