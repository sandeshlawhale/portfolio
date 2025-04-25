"use client";
import Footer from "@/components/footer/footer";
import Fadeup from "@/components/ui/fadeup";
import { useAppContext } from "@/context/AppContext";
import { Project } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page = () => {
  const param = useParams();
  const { searchSlug, setSearchSlug, projects, projectGames } = useAppContext();

  const [currentProject, setCurrentProject] = useState<Project | null>(
    projects.length > 0 ? projects[0] : null
  );

  useEffect(() => {
    if (param.slug && searchSlug !== param.slug) {
      setSearchSlug(param?.slug.toString());
    }

    if (searchSlug) {
      const project = projects.find((project) => project.slug === searchSlug);
      const game = projectGames.find((project) => project.slug === searchSlug);
      if (game) {
        setCurrentProject(game);
      } else if (project) {
        setCurrentProject(project);
      } else {
        setCurrentProject(null);
      }
    }
  }, [param.slug, projects, searchSlug, setSearchSlug]);

  return (
    <>
      <div className="flex flex-col gap-10 w-full">
        {currentProject && (
          <>
            <Fadeup>
              <div className="w-full h-72 rounded-lg overflow-hidden">
                {currentProject?.img ? (
                  <Image
                    src={currentProject.img}
                    alt="img"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-linear-to-tr to-indigo-500/30" />
                )}
              </div>
            </Fadeup>

            <div className="flex flex-col gap-4">
              <Fadeup delay={0.1}>
                <div className="w-full flex items-center justify-between">
                  <h1 className="text-xl font-semibold text-primaryText">
                    {currentProject.name}
                  </h1>
                  <div className="flex gap-4">
                    {currentProject?.git && (
                      <Link
                        href={currentProject.git}
                        className="group"
                        target="_blank"
                      >
                        <Image
                          src="/assets/svg/github.svg"
                          alt="github"
                          width={25}
                          height={25}
                          className="w-6 h-6 cursor-pointer brightness-75 group-hover:brightness-200 duration-150 ease-in-out"
                        />
                      </Link>
                    )}
                    {currentProject?.demo && (
                      <Link
                        href={currentProject.demo}
                        className="group"
                        target="_blank"
                      >
                        <Image
                          src="/assets/svg/link.svg"
                          alt="Demo"
                          width={25}
                          height={25}
                          className="w-6 h-6 cursor-pointer brightness-75 group-hover:brightness-200 duration-150 ease-in-out"
                        />
                      </Link>
                    )}
                  </div>
                </div>
              </Fadeup>
              <Fadeup delay={0.2}>
                <div className="flex flex-col gap-1.5">
                  <div className="grid grid-cols-[1fr_4fr]">
                    <p className="text-sm text-gray-600 font-medium tracking-wide">
                      Role
                    </p>
                    <p className="text-base font-normal tracking-wide text-gray-200">
                      {currentProject.role}
                    </p>
                  </div>
                  <div className="grid grid-cols-[1fr_4fr]">
                    <p className="text-sm text-gray-600 font-medium tracking-wide">
                      Outcome
                    </p>
                    <p className="text-base font-normal tracking-wide text-gray-200">
                      {currentProject.outcome}
                    </p>
                  </div>
                  <div className="grid grid-cols-[1fr_4fr]">
                    <p className="text-sm text-gray-600 font-medium tracking-wide">
                      Timeline
                    </p>
                    <p className="text-base font-normal tracking-wide text-gray-200">
                      {currentProject.timeline}
                    </p>
                  </div>
                  {/* {currentProject?.git && (
                    <div className="grid grid-cols-[1fr_4fr]">
                      <p className="text-sm text-gray-600 font-medium tracking-wide">
                        Git LInk
                      </p>
                      <p className="text-sm font-normal tracking-wide text-gray-200">
                        {currentProject.git}
                      </p>
                    </div>
                  )}
                  {currentProject?.demo && (
                    <div className="grid grid-cols-[1fr_4fr]">
                      <p className="text-sm text-gray-600 font-medium tracking-wide">
                        Live Demo Link
                      </p>
                      <p className="text-sm font-normal tracking-wide text-gray-200">
                        {currentProject.demo}
                      </p>
                    </div>
                  )} */}
                </div>
              </Fadeup>

              {currentProject.detail.map((detail, index) => (
                <Fadeup delay={0.3} duration={0.6} key={`detail_${index}`}>
                  <p className="text-base font-normal tracking-wide text-gray-200">
                    {detail.desc}
                  </p>
                </Fadeup>
              ))}
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Page;
