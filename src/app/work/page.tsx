"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { getAllProject } from "@/utils/api/projets";
import { Project } from "@/types";

const Work = () => {
  const router = useRouter();
  const hasRedirected = useRef(false);

  useEffect(() => {
    const fetchAndRedirect = async () => {
      try {
        const projects: Project[] = await getAllProject();

        if (projects.length && !hasRedirected.current) {
          hasRedirected.current = true;
          router.push(`/work/${projects[0]._id}`);
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    };

    fetchAndRedirect();
  }, [router]);

  return (
    <div className="w-full h-full flex items-center justify-center text-secondaryText text-sm">
      Redirecting to your first project...
    </div>
  );
};

export default Work;
