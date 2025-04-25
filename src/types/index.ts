import { StaticImageData } from "next/image";

interface ProjectDetail {
  desc: string;
}

export interface Project {
  name: string;
  slug: string;
  git?: string;
  demo?: string;
  img?: string | StaticImageData;
  shortDescription: string;
  timeline: string;
  role: string;
  outcome: string;
  detail: ProjectDetail[];
}

export interface SidebarProps {
  sidebarTitle: string;
  projects: Project[];
  searchSlug: string | null;
  setSearchSlug: (slug: string | null) => void;
}

export interface SidebarCardProps {
  project: Project;
  setSearchSlug: (project: string | null) => void;
  searchSlug?: string | null;
}

export type SearchItem = {
  title: string;
  content: string;
  href: string;
};
