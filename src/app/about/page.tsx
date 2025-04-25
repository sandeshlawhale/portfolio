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
    <div className="w-full sm:w-xl lg:w-xl mx-auto px-4 py-10 flex flex-col gap-10 text-[15px]">
      <MainTitle title="About" subTitle="let's learn about me" />

      <Fadeup delay={0.2} duration={0.5}>
        <div className="relative w-full  h-96 flex items-center  justify-center">
          <div className="absolute w-full lg:w-4xl h-full bg-linear-to-tr to-indigo-300/60">
            <Image
              fill
              src="/assets/me/me.jpg"
              alt="my photo"
              className="object-cover shadow-indigo-500/30 shadow-2xl "
            />
          </div>
        </div>
      </Fadeup>

      <div className="flex flex-col gap-4">
        <div className="">
          <Fadeup delay={0.25} duration={0.5}>
            <h1 className="text-2xl font-bold text-gray-700">
              Hey, I'm <span className="text-indigo-400">Sandesh Lawhale</span>
            </h1>
          </Fadeup>
          <Fadeup delay={0.3} duration={0.5}>
            <h2 className="text-lg font-semibold text-gray-600">
              A Developer Who Loves Turning Ideas Into Interactive Realities
            </h2>
          </Fadeup>
        </div>
        <div
          className="relative text-gray-200 text-md tracking-wide leading-6"
          id="about-started"
        >
          <SideTitle title="How It All Started" />
          <Fadeup delay={0.4} duration={0.5}>
            <p>
              It all started back in 2019, when I got my first taste of web
              development. What began as curiosity quickly turned into
              late-night coding sessions and an obsession with building things
              that people could actually use. I still remember the joy of seeing
              my first basic webpage live—it wasn&apos;t much, but it was mine.
            </p>
          </Fadeup>
        </div>
        <Fadeup delay={0.4} duration={0.5}>
          <p className="relative text-gray-200 text-md tracking-wide leading-6">
            As I dug deeper, I started exploring the world of JavaScript, React,
            Node.js, and Firebase. I wasn&apos;t just learning how to code—I was
            learning how to think, how to break problems into pieces and rebuild
            them better. From creating voting applications with real-time
            updates to chat apps that brought conversations to life, each
            project added a new layer to my skills and my passion.
          </p>
        </Fadeup>
        <Fadeup delay={0.45} duration={0.5}>
          {/* <blockquote
            className="text-indigo-300 border-l-4 border-indigo-300 pl-4"
            id="about-journey"
          > */}
          <blockquote
            className="relative text-indigo-300 pl-3"
            id="about-journey"
          >
            <div className="absolute left-0 top-0 h-full w-6 bg-indigo-400/30" />
            <p className="italic text-lg font-medium">
              &quot;A journey of a thousand miles begins with a single
              step.&quot;
            </p>
            <p>
              That first step into code changed the way I saw technology—and
              what I could do with it.
            </p>
          </blockquote>
        </Fadeup>

        <div
          className="relative text-gray-200 text-md tracking-wide leading-6"
          id="about-inspiration"
        >
          <SideTitle title="My Inspiration" />
          <Fadeup delay={0.2}>
            <p>
              One of the biggest influences in my journey has been my love for
              anime and gaming. These aren&apos;t just hobbies for
              me—they&apos;re creative fuel. Anime taught me storytelling,
              emotion, and design. The vibrant worlds, intricate characters, and
              unique aesthetics often inspire my UI/UX choices. Meanwhile,
              gaming nurtured my problem-solving mindset and introduced me to
              interactive design—where every element, every click, every
              animation tells a story.
            </p>
          </Fadeup>
        </div>
        <Fadeup delay={0.2}>
          <p className="relative text-gray-200 text-md tracking-wide leading-6">
            Whether it&apos;s the intensity of Attack on Titan, the philosophy
            of Steins;Gate, or the style of Initial D, I often find myself
            sketching out ideas for web interfaces or micro-interactions
            influenced by those themes. I believe a good website, like a good
            game or anime, should pull you in and leave an impact.
          </p>
        </Fadeup>
        <div
          className="relative text-gray-200 text-md tracking-wide leading-6"
          id="about-project"
        >
          <SideTitle title="Projects That Matter" />
          <Fadeup delay={0.2}>
            <p>
              That mindset led me to build Trueno Wheels—an e-commerce platform
              for Hot Wheels lovers, inspired by the legendary Initial D. What
              started as a passion project quickly turned into a stepping stone;
              it helped me land a web development internship, where I&apos;m
              currently honing my skills and working on real-world projects that
              push me further.
            </p>
          </Fadeup>
        </div>
        <div
          className="relative text-gray-200 text-md tracking-wide leading-6"
          id="about-events"
        >
          <SideTitle title="Events, Leadership & Learning" />
          <Fadeup delay={0.2}>
            <p>
              Over time, I&apos;ve built more than just applications—I&apos;ve
              built experiences. One of my most memorable achievements was
              organizing a college-level hackathon with 150+ participants. As
              the boys' representative and one of the lead coordinators, I
              didn&apos;t just write code—I brought people together, managed
              challenges on the fly, and helped create something truly
              impactful.
            </p>
          </Fadeup>
        </div>
        <div className="relative text-gray-200 text-md tracking-wide leading-6">
          <SideTitle title="today" />
          <Fadeup delay={0.2}>
            <p>
              Right now, I&apos;m exploring Next.js, improving performance, and
              adding advanced features to my stack. I enjoy building full-stack
              applications using the MERN stack and making them feel alive
              through thoughtful UI design and real-time interactions.
            </p>
          </Fadeup>
        </div>
        <Fadeup delay={0.2}>
          {/* border-l-4 border-indigo-300 */}
          <blockquote
            className="relative text-indigo-300 pl-3"
            id="about-vision"
          >
            <div className="absolute left-0 top-0 h-full w-6 bg-indigo-400/30" />
            <p className="italic text-lg font-medium">
              &quot;Vision without action is merely a dream. Action without
              vision just passes the time. But vision with action can change the
              world.&quot;
            </p>
            <p>
              That&apos;s the kind of developer I aim to be—creative, grounded,
              and always moving forward.
            </p>
          </blockquote>
        </Fadeup>
        <div
          className="relative text-gray-200 text-md tracking-wide leading-6"
          id="about-next"
        >
          <SideTitle title="tomorrow?" />
          <Fadeup delay={0.2}>
            <p>
              I&apos;m always up for working on meaningful projects,
              collaborating with passionate teams, and pushing the boundaries of
              what the web can do. If you're into building exciting things—or
              just want to chat about code, anime, or cars—
              <span
                className="hover:text-indigo-300 transition-colors ease-in duration-200 cursor-pointer"
                onClick={() => router.push("/contact")}
              >
                let&apos;s connect!
              </span>
            </p>
          </Fadeup>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;
