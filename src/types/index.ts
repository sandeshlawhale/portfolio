import { StaticImageData } from "next/image";

export interface OtherLink {
  label: string;
  url: string;
  _id?: string;
}

export interface QuickInfo {
  role?: string;
  date?: string;
  team?: string;
  company?: string;
  status?: string;
}

export interface Links {
  github?: string;
  live?: string;
  other?: OtherLink[];
}

export interface Project {
  _id: string;
  name: string;
  slug?: string;
  image?: string | StaticImageData;
  shortDescription: string;
  description: string; // Rich Text HTML string
  techStack: string[];
  featured?: boolean;
  draft?: boolean;
  category?: string;
  quickInfo: QuickInfo;
  links: Links;
  createdAt?: string;
  updatedAt?: string;
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
