import CopyMail from "@/components/copy-mail/copy-mail";
import TextEffect from "@/components/effect/text-effect";
import Footer from "@/components/footer/footer";
import MainTitle from "@/components/title/main-title";
import { Button } from "@/components/ui/button";
import Fadeup from "@/components/ui/fadeup";
import { MyData } from "@/constants/data";
import { Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 flex flex-col w-full sm:w-md lg:w-xl  mx-auto px-4 py-10 gap-8 text-[15px]">
        <div>
          <MainTitle
            title="Contact"
            subTitle="Let's talk about working together"
          />
        </div>
        <Fadeup delay={0.2}>
          <CopyMail />
        </Fadeup>
        <div className="flex gap-6 items-center justify-center">
          {MyData.socials?.map((link) => {
            return (
              <Link
                href={link.href}
                key={link.title}
                target="_blank"
                className="group relative"
              >
                <Image
                  src={link.icon}
                  alt={link.title}
                  width={24}
                  height={24}
                  className="brightness-50 hover:brightness-80 ease-in-out duration-200"
                  placeholder="blur"
                />
                <p className="absolute -bottom-full left-1/2 -translate-x-1/2 text-primaryText text-sm  group-hover:flex bg-secondary border-border border p-1 py-0 rounded-sm hidden gap-1 items-center z-10">
                  {link.title}
                </p>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center justify-center gap-6">
          <hr className="h-1 w-full text-border" />
          <p className="flex items-center justify-center h-full text-mutedText ">
            or
          </p>
          <hr className="h-1 w-full text-border" />
        </div>

        <form className="flex flex-col gap-4">
          <Fadeup delay={0.3}>
            <div className="flex gap-4">
              <input
                type="text"
                className="w-full p-3 bg-secondary text-secondaryText rounded-lg focus-visible:outline-2 outline-indigo-400"
                placeholder="Your name"
              />
              <input
                type="email"
                className="w-full p-3 bg-secondary text-secondaryText rounded-lg focus-visible:outline-2 outline-indigo-400"
                placeholder="email@gmail.com "
              />
            </div>
          </Fadeup>
          <Fadeup delay={0.4}>
            <textarea
              className="w-full p-3 bg-secondary text-secondaryText rounded-lg h-36 focus-visible:outline-2 outline-indigo-400"
              placeholder="Enter Your Message Here..."
            />
          </Fadeup>
          <Fadeup delay={0.5}>
            <Button className="w-full p-6 bg-secondaryText text-primary hover:bg-secondaryText/90 cursor-pointer text-lg font-semibold">
              Send
            </Button>
            <div className="text-sm text-mutedText w-full flex gap-1 mt-2 items-center justify-center">
              <Clock className="w-3 h-3" />
              <TextEffect>Around 3-5 hours to respond</TextEffect>
            </div>
          </Fadeup>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default page;
