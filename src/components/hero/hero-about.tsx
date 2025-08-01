"use client";

import { MyData } from "@/constants/data";
import SideTitle from "../title/side-title";
import Fadeup from "../ui/fadeup";

const HeroAbout = () => {
  const aboutList = MyData?.about ?? [];

  return (
    <Fadeup delay={0.5} duration={0.6}>
      <section id="home-about" className="relative px-4">
        <SideTitle title="about" />

        <div className="flex flex-col gap-4">
          {aboutList.map(({ desc }, i) => (
            <p
              key={`about-desc-${i}`}
              className="text-sm text-secondaryText font-medium tracking-wide"
            >
              {desc}
            </p>
          ))}
        </div>
      </section>
    </Fadeup>
  );
};

export default HeroAbout;
