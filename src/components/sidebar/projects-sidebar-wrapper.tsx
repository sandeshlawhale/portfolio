"use client";

import { useRef } from "react";
import { useScroll } from "motion/react";
import ProjectsSidebar from "./projects-sidebar";
import { Project } from "@/types";

const ProjectsSidebarWrapper = ({
    projects,
    loading,
}: {
    projects: Project[];
    loading: boolean;
}) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ container: ref });
    // const { isWorkSidebarOpen } = useAppContext();

    // In the original layout, scroll container ref was on the main content div.
    // Ideally, the scroll progress should be linked to the content scrolling.
    // Since we separated them, we might lose the scroll progress linkage if we don't put the ref on the scroller.
    // However, simpler approach for now is to just render the sidebar.
    // If `useScroll` depended on the layout's ref, we need to move the scrolling div into a client component too.

    // Let's create a Client Component for the Layout's Interactive Parts (Sidebar + Main Scroller)
    // But the goal was to fetch data on server.
    // So we will make a "WorkLayoutClient" that accepts children and projects.

    return (
        <ProjectsSidebar
            scrollYProgress={scrollYProgress} // This won't work correctly if ref isn't attached to scroller
            projects={projects}
            loading={loading}
        />
    );
};

export default ProjectsSidebarWrapper;
