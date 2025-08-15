"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/footer/footer";
import { Project } from "@/types";
import { getProjectById } from "@/utils/api/projets";
import { Skeleton } from "@/components/ui/skeleton";
import { FiDownload, FiExternalLink } from "react-icons/fi";

const Page = () => {
  const params = useParams();
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      const projectId = (params as { id?: string })?.id;
      if (!projectId) return;
      const data = await getProjectById({ id: projectId });
      if (data) setCurrentProject(data);
      setLoading(false);
    };
    fetchProject();
  }, [params]);

  if (loading) {
    return (
      <div className="pt-16 sm:pt-0 flex flex-col gap-10 w-full h-full px-4">
        <Skeleton className="mt-16 w-full h-72 rounded-lg overflow-hidden bg-[#121212]" />
        <section className="flex flex-col gap-4">
          <Skeleton className="w-2/3 h-8 rounded-lg overflow-hidden bg-[#121212]" />
          <div className="flex flex-col gap-4 mt-2">
            <div className="grid grid-cols-[1fr_4fr]">
              <Skeleton className="w-2/3 h-4 rounded-lg overflow-hidden bg-[#121212]" />
              <div className="flex flex-col gap-2">
                <Skeleton className="w-full h-4 rounded-lg overflow-hidden bg-[#121212]" />
                <Skeleton className="w-2/3 h-4 rounded-lg overflow-hidden bg-[#121212]" />
              </div>
            </div>
            <div className="grid grid-cols-[1fr_4fr]">
              <Skeleton className="w-3/4 h-4 rounded-lg overflow-hidden bg-[#121212]" />
              <div className="flex flex-col gap-2">
                <Skeleton className="w-full h-4 rounded-lg overflow-hidden bg-[#121212]" />
                <Skeleton className="w-1/3 h-4 rounded-lg overflow-hidden bg-[#121212]" />
              </div>
            </div>
            <div className="grid grid-cols-[1fr_4fr]">
              <Skeleton className="w-3/5 h-4 rounded-lg overflow-hidden bg-[#121212]" />
              <div className="flex flex-col gap-2">
                <Skeleton className="w-full h-4 rounded-lg overflow-hidden bg-[#121212]" />
                <Skeleton className="w-2/3 h-4 rounded-lg overflow-hidden bg-[#121212]" />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 mt-2">
            <Skeleton className="w-full h-5 rounded-lg overflow-hidden bg-[#121212]" />
            <Skeleton className="w-full h-5 rounded-lg overflow-hidden bg-[#121212]" />
            <Skeleton className="w-full h-5 rounded-lg overflow-hidden bg-[#121212]" />
            <Skeleton className="w-full h-5 rounded-lg overflow-hidden bg-[#121212]" />
            <Skeleton className="w-2/3 h-5 rounded-lg overflow-hidden bg-[#121212]" />
          </div>
          <div className="flex flex-col gap-3 mt-2">
            <Skeleton className="w-full h-5 rounded-lg overflow-hidden bg-[#121212]" />
            <Skeleton className="w-full h-5 rounded-lg overflow-hidden bg-[#121212]" />
            <Skeleton className="w-full h-5 rounded-lg overflow-hidden bg-[#121212]" />
            <Skeleton className="w-full h-5 rounded-lg overflow-hidden bg-[#121212]" />
            <Skeleton className="w-2/3 h-5 rounded-lg overflow-hidden bg-[#121212]" />
          </div>
        </section>
      </div>
    );
  }

  if (!currentProject) return;

  return (
    <>
      <div className="pt-16 sm:pt-0 flex flex-col gap-10 w-full ">
        <div className="mt-16 w-full h-72 rounded-lg overflow-hidden px-4">
          {currentProject.image ? (
            <Image
              src={currentProject.image}
              alt="img"
              width={1000}
              height={700}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-linear-to-tr to-indigo-500/30 flex items-center justify-center">
              <Skeleton className="w-full h-72 rounded-lg overflow-hidden bg-[#121212] flex items-center justify-center">
                <p className="text-base text-mutedText">No Preview Available</p>
              </Skeleton>
            </div>
          )}
        </div>

        <section className="flex flex-col gap-4">
          <div className="w-full flex items-start justify-between px-4">
            <h1 className="text-xl font-semibold text-primaryText">
              {currentProject.name}
            </h1>
            <div className="flex gap-4">
              {currentProject.gitlink && (
                <Link
                  href={currentProject.gitlink}
                  target="_blank"
                  className="group"
                >
                  <Image
                    src="/assets/svg/github.svg"
                    alt="github"
                    width={25}
                    height={25}
                    className="w-6 h-6 brightness-75 group-hover:brightness-200 duration-150"
                  />
                </Link>
              )}
              {currentProject.demoLink && (
                <Link
                  href={currentProject.demoLink}
                  target="_blank"
                  className="group"
                >
                  <Image
                    src="/assets/svg/link.svg"
                    alt="Demo"
                    width={25}
                    height={25}
                    className="w-6 h-6 brightness-75 group-hover:brightness-200 duration-150"
                  />
                </Link>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5 px-4">
            {currentProject.role && (
              <InfoRow label="Role" value={currentProject.role} />
            )}
            {currentProject.techstack?.length > 0 && (
              <InfoRow
                label="Tech Stack"
                value={currentProject.techstack.join(", ")}
              />
            )}
            {currentProject.timeline && (
              <InfoRow label="Timeline" value={currentProject.timeline} />
            )}
            {currentProject.outcome && (
              <InfoRow label="Outcome" value={currentProject.outcome} />
            )}
          </div>

          <div className="w-full space-y-2">
            {currentProject.otherLink.map(
              ({ _id, title, link, downloadable }) => (
                <div key={_id}>
                  <Link href={link} target="_blank">
                    <div className="flex items-center justify-between gap-4 hover:bg-primary transition duration-200 ease-in px-4 py-2 rounded-lg">
                      <div>
                        <p className="text-lg font-bold tracking-wide text-secondaryText">
                          {title === "app_download"
                            ? "WallList_Pre_Alpha_03"
                            : "WallList Feedback Form"}
                        </p>
                        <p className="text-sm text-gray-400">{title}</p>
                      </div>
                      <div>
                        {downloadable ? (
                          <Image
                            src="/assets/svg/download.svg"
                            alt="Demo"
                            width={24}
                            height={24}
                            className="w-6 h-6 brightness-75 group-hover:brightness-200 duration-150"
                          />
                        ) : (
                          <Image
                            src="/assets/svg/link3.svg"
                            alt="Demo"
                            width={20}
                            height={20}
                            className="w-5 h-5 brightness-75 group-hover:brightness-200 duration-150"
                          />
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              )
            )}
          </div>

          {currentProject.description?.map((detail, index) => (
            <p
              key={`detail_${index}`}
              className="text-base font-normal tracking-wide text-gray-200 px-4"
            >
              {detail}
            </p>
          ))}

          {currentProject.quote && (
            <div className="px-4">
              <blockquote
                className="relative text-indigo-300 pl-3"
                id="about-vision"
              >
                <div className="absolute left-0 top-0 h-full w-6 bg-indigo-400/30" />
                <p className="italic text-lg font-medium">
                  &quot;{currentProject.quote?.title}&quot;
                </p>
                <p>{currentProject.quote.description}</p>
              </blockquote>
            </div>
          )}
        </section>
      </div>
      <Footer />
    </>
  );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="grid grid-cols-[1fr_4fr]">
    <p className="text-sm text-gray-600 font-medium tracking-wide">{label}</p>
    <p className="text-base font-normal tracking-wide text-gray-200 capitalize">
      {value}
    </p>
  </div>
);

export default Page;
