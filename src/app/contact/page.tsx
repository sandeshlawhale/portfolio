"use client";
import React, { useState } from "react";
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
import { trackEvent, getDeviceType } from "@/utils/api/analytics";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ContactPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    trackEvent({
      type: "interaction",
      category: "contact",
      event: "contact_form_submitted",
      metadata: { device: getDeviceType() }
    });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Message sent successfully!");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        toast.error(data.message || "Failed to send message");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialClick = (title: string) => {
    trackEvent({
      type: "interaction",
      category: "social",
      event: `${title.toLowerCase()}_clicked`,
      metadata: { device: getDeviceType() }
    });
  };

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
              <Tooltip key={link.title}>
                <TooltipTrigger asChild>
                  <Link
                    href={link.href}
                    target="_blank"
                    className="group relative"
                    onClick={() => handleSocialClick(link.title)}
                  >
                    <Image
                      src={link.icon}
                      alt={link.title}
                      width={24}
                      height={24}
                      className="brightness-50 hover:brightness-80 ease-in-out duration-200"
                    />
                  </Link>
                </TooltipTrigger>
                <TooltipContent className="bg-secondary border-border text-primary-foreground">
                  <p>{link.title}</p>
                </TooltipContent>
              </Tooltip>
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Fadeup delay={0.3}>
            <div className="flex gap-4">
              <input
                type="text"
                className="w-full p-3 bg-secondary text-secondaryText rounded-lg focus-visible:outline-2 outline-indigo-400"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
              />
              <input
                type="email"
                className="w-full p-3 bg-secondary text-secondaryText rounded-lg focus-visible:outline-2 outline-indigo-400"
                placeholder="email@gmail.com "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </Fadeup>
          <Fadeup delay={0.4}>
            <textarea
              className="w-full p-3 bg-secondary text-secondaryText rounded-lg h-36 focus-visible:outline-2 outline-indigo-400"
              placeholder="Enter Your Message Here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              disabled={loading}
            />
          </Fadeup>
          <Fadeup delay={0.5}>
            <Button
              type="submit"
              className="w-full p-6 bg-secondaryText text-primary hover:bg-secondaryText/90 cursor-pointer text-lg font-semibold"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send"}
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

export default ContactPage;
