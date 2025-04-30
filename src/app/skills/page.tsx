"use client";
import SideTitle from "@/components/title/side-title";
import MainTitle from "../../components/title/main-title";
import { Stack } from "@/constants/data";
import StackCard from "@/components/card/stack-card";
import Footer from "@/components/footer/footer";
import { useEasterEggSequence } from "@/components/easter-egg/developer";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Skills = () => {
  const router = useRouter();
  const { registerClick, statusMap } = useEasterEggSequence({
    sequence: ["d", "r", "a", "f", "t"],
    onUnlock: () => {
      localStorage.setItem("easterEggTriggered", "true");
      router.push("/draft");
    },
  });

  useEffect(() => {
    console.log("Hint: Try, what comes before the final version?");
  }, []);

  return (
    <div className="w-full sm:w-xl lg:w-xl mx-auto px-4 py-10 flex flex-col gap-10 text-[15px] ">
      <MainTitle title="my stack" subTitle="My go-to tech for developement" />

      <div className="relative w-full">
        <SideTitle title="Software" />
        <div className="w-full grid grid-cols-3 gap-4 ">
          {Stack?.software?.map((item, index) => {
            const isMatched = statusMap.some(
              (status) => status.correct && status.index === index
            );

            return (
              <div
                key={index}
                onClick={() => registerClick(item?.key, index)}
                className="cursor-pointer min-h-full "
              >
                <StackCard item={item} index={index} isMatched={isMatched} />
              </div>
            );
          })}
        </div>
      </div>

      <blockquote className="relative text-indigo-300 pl-3" id="about-vision">
        <div className="absolute left-0 top-0 h-full w-6 bg-indigo-400/30" />
        <p className="italic text-lg font-medium">
          &quot;Not everything here is final...
          <br />
          sometimes, what&apos;s left in draft says the most. &quot;
        </p>
        {/* <p>
          That&apos;s the kind of developer I aim to be—creative, grounded, and
          always moving forward.
        </p> */}
      </blockquote>

      <div className="relative w-full" id="setup">
        <SideTitle title="Work Setup" />
        <div className=" w-full bg-linear-to-tr  to-indigo-300/60  h-80 rounded-md"></div>
        <p className="block lg:hidden font-medium text-lg mt-2 text-mutedText tracking-wide">
          This is my current Work Setup
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default Skills;
