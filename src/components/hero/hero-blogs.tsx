import React from "react";
import SideTitle from "../title/side-title";
import BlogCard from "../card/blog-card";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

const HeroBlogs = () => {
  return (
    <div className="relative" id="hero-blogs">
      <SideTitle title="Blogs" />
      <div className="flex flex-col gap-6">
        <BlogCard />
        <BlogCard />
        <BlogCard />
        <Button className="flex gap-3 items-center justify-center text-base border border-border bg-secondary hover:bg-secondary-light ease-in-out duration-300 cursor-pointer transition-colors">
          View all <ArrowRight className="w-6 h-6 text-icon-muted " />
        </Button>
      </div>
    </div>
  );
};

export default HeroBlogs;
