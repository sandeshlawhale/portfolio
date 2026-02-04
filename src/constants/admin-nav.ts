import { Briefcase, FolderGit2, Code2, FileText } from "lucide-react";

export const adminNavItems = [
    {
        id: "work",
        title: "Work",
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
        id: "skills",
        title: "Skills",
        icon: Code2,
        href: "/admin/skills"
    },
    {
        id: "resume",
        title: "Resume",
        icon: FileText,
        href: "/admin/resume"
    },
];
