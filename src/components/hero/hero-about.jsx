"use client";
import { MyData } from "@/constants/data";
import SideTitle from "../title/side-title";
import Fadeup from "../ui/fadeup";

const HeroAbout = () => {
  return (
    <Fadeup delay={0.6} duration={0.6}>
      <div className="relative " id="home-about">
        <SideTitle title="about" />

        <div className="flex flex-col gap-4">
          {MyData.about.map((data, i) => (
            <p
              key={`desc_${i}`}
              className="text-sm text-secondaryText font-medium tracking-wide"
            >
              {data.desc}
            </p>
          ))}
        </div>
      </div>
    </Fadeup>
  );
};

export default HeroAbout;
