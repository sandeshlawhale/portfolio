import { LayoutDashboard, Briefcase, FileText, Settings, FolderGit2 } from "lucide-react";

export const adminNavItems = [
    {
        id: "dashboard",
        title: "Overview",
        icon: LayoutDashboard,
        href: "/admin"
    },
    {
        id: "work",
        title: "Work Experience",
        icon: Briefcase,
        href: "/admin/work"
    },
    {
        id: "projects",
        title: "Projects",
        icon: FolderGit2,
        href: "/admin/projects"
    },
    {
        id: "resume",
        title: "Resume",
        icon: FileText,
        href: "/admin/resume"
    },
    {
        id: "system",
        title: "System Control",
        icon: Settings,
        href: "/admin/system"
    },
];
