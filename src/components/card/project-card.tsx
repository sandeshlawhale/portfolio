import Image from "next/image";
import React from "react";
import { Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { Project } from "@/types";

const ProjectCard = ({ project }: { project: Project }) => {
  const router = useRouter();
  const handleClick = () => {
    router.push(`/work/${project.slug}`);
  };
  return (
    <div
      className="group flex flex-col gap-3 p-2 pt-3 bg-secondary hover:bg-secondary-light ease-in-out duration-150 border border-border cursor-pointer rounded-lg"
      onClick={handleClick}
    >
      <div className="flex gap-3 h-6 w-full font-semibold capitalize tracking-wide">
        <Mail className="w-6 h-6 text-icon-muted" />
        {project.name.length > 30
          ? project.name.slice(0, 30) + "..."
          : project.name}
      </div>
      <div className="w-full h-60 rounded-md overflow-hidden">
        {project.img && (
          <Image
            src={project.img}
            alt="product image"
            className="group-hover:scale-103 ease-in-out duration-300 w-full h-full object-cover"
          />
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
