import Image from "next/image";
import React from "react";
import { Github, ExternalLink, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Project } from "@/types";
import { getTechIcon } from "@/utils/tech-icon";
import { trackEvent, getDeviceType } from "@/utils/api/analytics";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ProjectCard = ({ project }: { project: Project }) => {
  const router = useRouter();

  const handleClick = () => {
    trackEvent({
      type: "interaction",
      category: "project",
      subCategory: project._id,
      event: "project_view_clicked",
      metadata: { device: getDeviceType() }
    });
    router.push(`/projects?id=${project._id}`);
  };

  return (
    <article
      className="group flex flex-col rounded-2xl bg-primary border border-primary shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 h-full"
      onClick={handleClick}
    >
      {/* Image Section */}
      <div className="w-full aspect-[3/2] relative overflow-hidden">
        {project.image ? (
          <Image
            src={project.image}
            alt={project.name || "Project image"}
            width={1000}
            height={600}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-tr from-gray-800 to-gray-900" />
        )}
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-1 p-2 gap-1 bg-primary">
        <header className="flex items-center justify-between w-full">
          <h3 className={`text-base font-normal text-primaryText tracking-wider truncate ${!project.name && "blur-sm"}`}>
            {project.name || "Untitled Project"}
          </h3>
          <div className="flex gap-1">
            {project.gitlink && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  trackEvent({
                    type: "interaction",
                    category: "project",
                    subCategory: project._id,
                    event: "git_link_clicked",
                    metadata: { device: getDeviceType() }
                  });
                  window.open(project.gitlink, '_blank');
                }}
                className="p-1 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors text-icon-muted hover:text-primaryText cursor-pointer z-10"
              >
                <Github className="w-4 h-4" />
              </div>
            )}
            {project.demoLink && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  trackEvent({
                    type: "interaction",
                    category: "project",
                    subCategory: project._id,
                    event: "demo_link_clicked",
                    metadata: { device: getDeviceType() }
                  });
                  window.open(project.demoLink, '_blank');
                }}
                className="p-1 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors text-icon-muted hover:text-primaryText cursor-pointer z-10"
              >
                <ExternalLink className="w-4 h-4" />
              </div>
            )}
          </div>
        </header>

        {project.shortDescription && (
          <p className="text-sm tracking-wider text-mutedText line-clamp-3 leading-relaxed">
            {project.shortDescription}
          </p>
        )}

        <div className="flex items-center justify-between mt-auto pt-2">
          {project.techstack && project.techstack.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {project.techstack.slice(0, 5).map((tech) => {
                const icon = getTechIcon(tech);
                return (
                  <Tooltip key={tech}>
                    <TooltipTrigger>
                      <div className="w-6 h-6 rounded-md bg-primary/5 border border-border flex items-center justify-center overflow-hidden p-1 cursor-pointer">
                        {icon ? (
                          <Image src={icon} alt={tech} width={16} height={16} className="w-full h-full object-contain" />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-gray-500" />
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{tech}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
              {project.techstack.length > 5 && (
                <div className="w-6 h-6 rounded-md bg-primary/5 border border-border/40 flex items-center justify-center text-[10px] font-medium text-mutedText">
                  +{project.techstack.length - 5}
                </div>
              )}
            </div>
          )}

        </div>
        <div className="w-full flex items-center justify-end text-xs tracking-wider gap-1 text-mutedText hover:text-primaryText transition-colors duration-300 hover:underline cursor-pointer">
          View details <ArrowRight className="w-3 h-3" />
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;
