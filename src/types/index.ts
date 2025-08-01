import { StaticImageData } from "next/image";

export interface Project {
  _id: string;
  name: string;
  slug: string;
  gitlink?: string;
  demoLink?: string;
  image?: string | StaticImageData;
  shortDescription: string;
  timeline: string;
  role: string;
  outcome: string;
  description: string[];
  techstack: string[];
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
