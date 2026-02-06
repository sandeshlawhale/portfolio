"use client";

import Image from "next/image";
import StackBadge from "../ui/stack-badge";
import Fadeup from "../ui/fadeup";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getTechIcon } from "@/utils/tech-icon";
import { getAllWorks } from "@/utils/api/work";

interface Work {
    _id: string;
    company: {
        name: string;
        logo: string;
        website: string;
    };
    role: string;
    status: string;
    location: {
        type: string;
        city: string;
    };
    duration: {
        start: string;
        end: string;
    };
    technologies: string[];
    responsibilities: string[];
}

const HeroExperience = () => {
    const [works, setWorks] = useState<Work[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedValues, setSelectedValues] = useState<string[]>([]);

    useEffect(() => {
        const fetchWorks = async () => {
            try {
                const data = await getAllWorks();
                if (data.success) {
                    setWorks(data.result);
                    if (data.result.length > 0) {
                        setSelectedValues([data.result[0]._id]);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch works", error);
            } finally {
                setLoading(false);
            }
        };

        fetchWorks();
    }, []);

    return (
        <section id="experience" className="px-4 w-full flex flex-col">
            <Fadeup>
                <h2 className="text-2xl pb-4 font-semibold tracking-wider leading-relaxed text-primaryText">
                    Experience
                </h2>
            </Fadeup>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2].map((i) => (
                        <div key={i} className="w-full h-24 rounded-xl bg-card border border-border/50 animate-pulse" />
                    ))}
                </div>
            ) : (
                <Accordion
                    type="multiple"
                    value={selectedValues}
                    onValueChange={setSelectedValues}
                    className="w-full flex flex-col gap-6"
                >
                    {works.map((exp, index) => {
                        const isOpen = selectedValues.includes(exp._id);

                        return (
                            <Fadeup key={exp._id} delay={index * 0.1}>
                                <AccordionItem
                                    value={exp._id}
                                    className=""
                                >
                                    <AccordionTrigger className="hover:no-underline group">
                                        <div className="flex flex-col md:flex-row gap-6 justify-between items-start text-left w-full mr-4">
                                            {/* Left Side: Logo, Role, Company */}
                                            <div className="flex gap-4 items-start">
                                                <div className="w-14 h-14 rounded-xl overflow-hidden bg-white/5 shrink-0 border border-border/30">
                                                    {exp.company.logo && (
                                                        <Image
                                                            src={exp.company.logo}
                                                            alt={exp.company.name}
                                                            width={56}
                                                            height={56}
                                                            className="w-full h-full object-contain p-1"
                                                        />
                                                    )}
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="text-lg font-semibold text-primaryText w-fit tracking-wider">
                                                            {exp.role}
                                                        </h3>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <ChevronDown className="h-6 w-6 shrink-0 transition-transform duration-200 text-mutedText group-data-[state=open]:rotate-180 cursor-pointer" />
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>Expand details</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-gray-400 font-medium">
                                                        <span>{exp.company.name}</span>
                                                        {exp.status && (
                                                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs border ${exp.status === "Working" || exp.status === "Ongoing"
                                                                ? "bg-green-500/10 text-green-400 border-green-500/20"
                                                                : "bg-muted text-mutedText border-border/50"
                                                                }`}>
                                                                <span className={`w-1.5 h-1.5 rounded-full ${exp.status === "Working" || exp.status === "Ongoing"
                                                                    ? "bg-green-400 animate-pulse"
                                                                    : "bg-mutedText"
                                                                    }`} />
                                                                {exp.status}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right Side: Date, Location */}
                                            <div className="flex flex-col md:items-end gap-1 text-sm text-gray-500 font-medium">
                                                <p className="text-gray-300">
                                                    {exp.duration.start} – {exp.duration.end}
                                                </p>
                                                <p className="text-nowrap">
                                                    {exp.location.city} ({exp.location.type})
                                                </p>
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent forceMount className="p-0">
                                        <AnimatePresence initial={false}>
                                            {isOpen && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="pb-0 px-1">
                                                        {/* Technologies */}
                                                        <div className="my-4">
                                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
                                                                Technologies & Tools
                                                            </p>
                                                            <div className="flex flex-wrap gap-2">
                                                                {exp.technologies.map((tech: string) => (
                                                                    <StackBadge
                                                                        key={tech}
                                                                        name={tech}
                                                                        icon={getTechIcon(tech)}
                                                                        width={14}
                                                                        height={14}
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>

                                                        {/* Responsibilities */}
                                                        <div>
                                                            <ul className="list-disc list-outside pl-4 flex flex-col gap-2 text-sm text-gray-400/90 leading-relaxed tracking-wider">
                                                                {exp.responsibilities.map((resp: string, idx: number) => (
                                                                    <li key={idx} className="pl-1">
                                                                        {resp}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </AccordionContent>
                                </AccordionItem>
                            </Fadeup>
                        );
                    })}
                </Accordion>
            )}
        </section>
    );
};

export default HeroExperience;
