"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/footer/footer";
import { Project } from "@/types";
import { getProjectById } from "@/utils/api/projets";
import { Skeleton } from "@/components/ui/skeleton";

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
      <div className="pt-16 sm:pt-0 flex flex-col gap-10 w-full px-4">
        <div className="mt-16 w-full h-72 rounded-lg overflow-hidden">
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
          <div className="w-full flex items-start justify-between">
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

          <div className="flex flex-col gap-1.5">
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

          {currentProject.description?.map((detail, index) => (
            <p
              key={`detail_${index}`}
              className="text-base font-normal tracking-wide text-gray-200"
            >
              {detail}
            </p>
          ))}
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
