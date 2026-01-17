import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/footer/footer";
import { getProjectById, getAllProject } from "@/utils/api/projects";
import InfoRow from "@/components/projects/info-row";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const project = await getProjectById({ id });

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${project.name} | Project Details`,
    description: project.description?.[0] || "Project details",
  };
}

export async function generateStaticParams() {
  const projects = await getAllProject();
  return projects.map((project: { _id: string }) => ({
    id: project._id,
  }));
}

const Page = async ({ params }: PageProps) => {
  const { id } = await params;
  const currentProject = await getProjectById({ id });

  if (!currentProject) {
    notFound();
  }

  return (
    <>
      <div className="pt-16 sm:pt-0 flex flex-col gap-10 w-full ">
        <div className="mt-0 w-full aspect-[2/1] rounded-lg overflow-hidden px-4">
          {currentProject.image ? (
            <Image
              src={currentProject.image}
              alt={currentProject.name}
              width={1000}
              height={700}
              className="w-full h-full object-cover rounded-lg"
              priority
            />
          ) : (
            <div className="w-full h-full bg-linear-to-tr to-indigo-500/30 flex items-center justify-center rounded-lg">
              <div className="w-full h-full rounded-lg overflow-hidden bg-[#121212] flex items-center justify-center">
                <p className="text-base text-mutedText">No Preview Available</p>
              </div>
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
              ({ _id, title, link, downloadable }: { _id: string; title: string; link: string; downloadable: boolean }) => (
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
                            alt="Download"
                            width={24}
                            height={24}
                            className="w-6 h-6 brightness-75 group-hover:brightness-200 duration-150"
                          />
                        ) : (
                          <Image
                            src="/assets/svg/link3.svg"
                            alt="Link"
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

          {currentProject.description?.map((detail: string, index: number) => (
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

export default Page;
