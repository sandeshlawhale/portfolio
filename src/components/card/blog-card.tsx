import React from "react";

const BlogCard = () => {
  return (
    <div className="group relative cursor-pointer">
      <div className="absolute -inset-3 group-hover:bg-secondary-light  duration-300 ease-in-out transition-colors -z-10 rounded-lg" />
      <div className="flex gap-2">
        <div className="flex-2/3 font-medium tracking-wide flex flex-col gap-2">
          <p>The Tale of Naruto usumaki</p>
          <p className="text-mutedText text-sm border border-border group-hover:border-[#bebebe] w-fit px-2 rounded-sm py-0.5 uppercase duration-300 ease-in-out transition-colors">
            Jiraiya
          </p>
        </div>
        <p className="text-mutedText font-semibold tracking-wide group-hover:text-primaryText duration-300 ease-in-out transition-colors">
          01/01/2025
        </p>
      </div>
    </div>
  );
};

export default BlogCard;
