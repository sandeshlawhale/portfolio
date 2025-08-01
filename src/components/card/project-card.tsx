import Image from "next/image";
import React from "react";
import { Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { Project } from "@/types";

const ProjectCard = ({ project }: { project: Project }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/work/${project._id}`);
  };

  return (
    <article
      className="group flex flex-col gap-3 p-3 bg-secondary hover:bg-secondary-light transition duration-150 border border-border cursor-pointer rounded-lg"
      onClick={handleClick}
    >
      <header className="flex items-center gap-3 h-6 font-semibold capitalize tracking-wide w-full">
        <Mail className="w-5 h-5 text-icon-muted" />
        <h3 className="flex-1 truncate text-sm">
          {project.name || "Untitled Project"}
        </h3>
      </header>

      <div className="w-full h-60 rounded-md overflow-hidden">
        {project.image ? (
          <Image
            src={project.image}
            alt={project.name || "Project image"}
            width={1000}
            height={700}
            className="group-hover:scale-105 transition-transform duration-300 w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-tr from-gray-300 to-indigo-300/60" />
        )}
      </div>
    </article>
  );
};

export default ProjectCard;
