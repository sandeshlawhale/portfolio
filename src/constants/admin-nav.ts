import { Briefcase, FolderGit2, Code2 } from "lucide-react";

export const adminNavItems = [
    {
        id: "work",
        title: "Work",
        icon: Briefcase,
        subItems: [
            { title: "All Works", href: "/admin/work" },
            { title: "Add New", href: "/admin/work/add" },
        ],
    },
    {
        id: "projects",
        title: "Projects",
        icon: FolderGit2,
        subItems: [
            { title: "All Projects", href: "/admin/projects" },
            { title: "Add New", href: "/admin/projects/add" },
        ],
    },
    {
        id: "skills",
        title: "Skills",
        icon: Code2,
        subItems: [
            { title: "All Skills", href: "/admin/skills" },
            { title: "Add New", href: "/admin/skills/add" },
        ],
    },
];
