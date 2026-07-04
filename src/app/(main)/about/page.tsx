"use client";
import Footer from "@/components/footer/footer";
import MainTitle from "@/components/title/main-title";
import SideTitle from "@/components/title/side-title";
import Fadeup from "@/components/ui/fadeup";
import Image from "next/image";
import { useRouter } from "next/navigation";

const About = () => {
  const router = useRouter();
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-12 flex flex-col gap-4 text-[16px]">
      <div className="w-full max-w-3xl mx-auto">
        <MainTitle title="About" subTitle="let's learn about me" />
      </div>

      <Fadeup delay={0.2} duration={0.5}>
        <div className="relative w-full h-64 sm:h-[450px] flex items-center justify-center rounded-xl overflow-hidden border border-border/30">
          <div className="absolute w-full h-full">
            <Image
              fill
              src="/assets/me/me.jpg"
              alt="Sandesh Lawhale"
              className="object-cover shadow-2xl"
              priority
            />
          </div>
        </div>
      </Fadeup>

      <div className="w-full max-w-3xl mx-auto flex flex-col gap-4 text-mutedText tracking-wider leading-relaxed">
        {/* Intro */}
        <div className="flex flex-col gap-2">
          <Fadeup delay={0.25} duration={0.5}>
            <h1 className="text-3xl font-extrabold text-primaryText">
              Hey, I&apos;m&nbsp;
              <span className="text-indigo-400">Sandesh Lawhale</span>
            </h1>
          </Fadeup>
          <Fadeup delay={0.3} duration={0.5}>
            <p className="text-base mt-2">
              I&apos;m a full-stack developer with a growing passion for AI and intelligent software. I enjoy building products that don&apos;t just work—they solve real problems, feel intuitive to use, and leave users with a great experience. Whether it&apos;s a client dashboard, an AI-powered tool, or an automation workflow, I&apos;m always looking for ways to combine thoughtful engineering with practical design.
            </p>
          </Fadeup>
        </div>

        {/* Where It Started */}
        <div className="relative flex flex-col gap-3" id="about-started">
          <SideTitle title="Where It Started" />
          <Fadeup delay={0.35}>
            <p>
              My journey into development began in 2019 with a simple curiosity about how websites worked. What started as experimenting with HTML, CSS, and JavaScript quickly turned into late-night coding sessions and an obsession with building things from scratch. Every project taught me something new—not just about programming, but about problem-solving, design, and how technology can make everyday tasks easier.
            </p>
          </Fadeup>
          <Fadeup delay={0.4}>
            <p>
              Over the years, I explored React, Node.js, MongoDB, and modern full-stack development. I built everything from small experiments to complete applications, gradually learning how frontend, backend, databases, and APIs fit together into products people could actually use.
            </p>
          </Fadeup>
        </div>

        {/* Building Real Products */}
        <div className="relative flex flex-col gap-3" id="about-products">
          <SideTitle title="Building Real Products" />
          <Fadeup delay={0.2}>
            <p>
              As my skills grew, so did the scale of my projects.
            </p>
          </Fadeup>
          <Fadeup delay={0.25}>
            <p>
              One of the most meaningful milestones was <strong>Trueno Wheels</strong>, a full-stack e-commerce application inspired by my love for Initial D and Japanese car culture. It wasn&apos;t built for a client or as a college assignment—it was built because I genuinely wanted to create something I&apos;d enjoy using. That project eventually became the centerpiece of my first internship interview and marked the moment I started feeling confident as a developer.
            </p>
          </Fadeup>
          <Fadeup delay={0.3}>
            <p>
              Since then, I&apos;ve worked on production software during my internship, contributed to real business applications, and completed freelance work by developing a complete gym management system for a local fitness center. Building software for actual users taught me lessons that tutorials never could—understanding client requirements, balancing technical decisions with usability, and shipping reliable software.
            </p>
          </Fadeup>
        </div>

        {/* Why AI Changed My Direction */}
        <div className="relative flex flex-col gap-3" id="about-ai">
          <SideTitle title="Why AI Changed My Direction" />
          <Fadeup delay={0.2}>
            <p>
              While I still love building full-stack applications, I&apos;ve become increasingly interested in AI and intelligent automation.
            </p>
          </Fadeup>
          <Fadeup delay={0.25}>
            <p>
              What excites me isn&apos;t AI for the sake of AI—it&apos;s using it to build software that genuinely helps people. That&apos;s why I&apos;ve been exploring LLMs, LangChain, AI agents, workflow automation, and modern AI application development. Projects like SmartInvoiceAI helped me understand how AI, OCR, and traditional web technologies can work together to automate real business processes.
            </p>
          </Fadeup>
          <Fadeup delay={0.3}>
            <p>
              Today, I&apos;m actively learning how to build AI-powered applications that combine modern web development with intelligent systems, and I see this as the next step in my journey as an engineer.
            </p>
          </Fadeup>
        </div>

        {/* Beyond Code */}
        <div className="relative flex flex-col gap-3" id="about-beyond-code">
          <SideTitle title="Beyond Code" />
          <Fadeup delay={0.2}>
            <p>
              Outside development, I&apos;m the kind of person who enjoys understanding how things work.
            </p>
          </Fadeup>
          <Fadeup delay={0.25}>
            <p>
              Anime has inspired many of my ideas around storytelling, interaction, and visual design. Games have shaped the way I think about user experience and feedback. Sketching helps me organize ideas before they become interfaces, while the gym reminds me that consistent progress always beats overnight success.
            </p>
          </Fadeup>
          <Fadeup delay={0.3}>
            <p>
              These interests constantly influence the way I approach software—building products that are not only functional, but enjoyable to use.
            </p>
          </Fadeup>
        </div>

        {/* Looking Ahead */}
        <div className="relative flex flex-col gap-3" id="about-looking-ahead">
          <SideTitle title="Looking Ahead" />
          <Fadeup delay={0.2}>
            <p>
              I&apos;m excited about building the next generation of AI-powered software.
            </p>
          </Fadeup>
          <Fadeup delay={0.25}>
            <p>
              Whether it&apos;s full-stack web applications, AI agents, workflow automation, or developer tools, I want to keep creating products that solve meaningful problems and continue growing as an engineer.
            </p>
          </Fadeup>
          <Fadeup delay={0.3}>
            <p>
              I&apos;m always open to collaborating on interesting ideas, learning from talented people, and taking on projects that challenge me to become better. If you want to chat or collaborate,{" "}
              <span
                className="text-indigo-400 hover:text-indigo-300 transition-colors ease-in duration-200 cursor-pointer font-semibold underline decoration-dashed decoration-1"
                onClick={() => router.push("/contact")}
              >
                let&apos;s connect!
              </span>
            </p>
          </Fadeup>
        </div>
      </div>

      <div className="w-full max-w-3xl mx-auto">
        <Footer />
      </div>
    </div>
  );
};

export default About;
