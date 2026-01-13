import { SKILLS } from "@/constants/skills";

export const getTechIcon = (name: string): string | undefined => {
    const normalizedName = name.toLowerCase().trim();
    return SKILLS[normalizedName] || undefined;
};
