"use client";

import { useRef } from "react";
import { AnimatePresence, useScroll } from "motion/react";
import { Menu } from "lucide-react";
import ProjectsSidebar from "@/components/sidebar/projects-sidebar";
import { useAppContext } from "@/context/AppContext";
import { Project } from "@/types";

interface ProjectsLayoutClientProps {
    children: React.ReactNode;
    projects: Project[];
}

const ProjectsLayoutClient = ({ children, projects }: ProjectsLayoutClientProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ container: ref });
    const { isWorkSidebarOpen, openWorkSidebar, closeWorkSidebar } = useAppContext();
    const loading = false;

    // Swipe gesture detection
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.targetTouches[0].clientX;
        touchEndX.current = e.targetTouches[0].clientX;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.targetTouches[0].clientX;
    };

    const handleTouchEnd = () => {
        const swipeDistance = touchEndX.current - touchStartX.current;
        // Swipe right (from left edge) opens the sidebar
        if (swipeDistance > 80 && touchStartX.current < 80) {
            openWorkSidebar();
        }
        // Swipe left anywhere closes the sidebar
        if (swipeDistance < -80 && isWorkSidebarOpen) {
            closeWorkSidebar();
        }
    };

    return (
        <div 
            className="flex h-screen w-full bg-background overflow-hidden relative"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <ProjectsSidebar
                scrollYProgress={scrollYProgress}
                projects={projects}
                loading={loading}
                isMobile={false}
            />

            <AnimatePresence>
                {isWorkSidebarOpen && (
                    <ProjectsSidebar
                        scrollYProgress={scrollYProgress}
                        projects={projects}
                        loading={loading}
                        isMobile={true}
                    />
                )}
            </AnimatePresence>

            <div ref={ref} className="hide-scrollbar flex-1 w-full h-full overflow-y-auto relative">
                <main className="w-full h-full relative">
                    <header className="sticky top-0 z-20 w-full px-4 py-4 bg-black/90 backdrop-blur-xl flex items-center gap-2 md:hidden">
                        <Menu
                            onClick={openWorkSidebar}
                            className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
                        />
                        <h1 className="text-xl font-semibold text-indigo-300">Projects</h1>
                    </header>
                    <div className="px-4 py-4 lg:py-10 w-full max-w-5xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ProjectsLayoutClient;
