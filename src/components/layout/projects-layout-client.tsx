"use client";

import { useRef } from "react";
import { AnimatePresence, useScroll } from "framer-motion";
import { Menu } from "lucide-react";
import ProjectsSidebar from "@/components/sidebar/projects-sidebar";
import { useAppContext } from "@/context/AppContext";
import { Project } from "@/types";

interface ProjectsLayoutClientProps {
    children: React.ReactNode;
    projects: Project[];
}

const ProjectsLayoutClient = ({ children, projects }: ProjectsLayoutClientProps) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ container: ref });
    const { isWorkSidebarOpen, openWorkSidebar } = useAppContext();
    const loading = false;

    return (
        <>
            <div className="hidden xl:block">
                <ProjectsSidebar
                    scrollYProgress={scrollYProgress}
                    projects={projects}
                    loading={loading}
                />
            </div>

            <AnimatePresence>
                {isWorkSidebarOpen && (
                    <ProjectsSidebar
                        scrollYProgress={scrollYProgress}
                        projects={projects}
                        loading={loading}
                    />
                )}
            </AnimatePresence>

            <div ref={ref} className="hide-scrollbar w-full h-full overflow-y-auto">
                <div className="w-full h-full sm:w-md lg:w-xl mx-auto relative">
                    <div className="w-full px-4 py-4 fixed top-0 z-20 bg-black/90 backdrop-blur-xl flex items-center gap-2 xl:hidden">
                        <Menu onClick={openWorkSidebar} className="cursor-pointer" />
                        <p className="text-xl font-semibold text-indigo-300">Projects</p>
                    </div>
                    <div className="px-4">{children}</div>
                </div>
            </div>
        </>
    );
};

export default ProjectsLayoutClient;
