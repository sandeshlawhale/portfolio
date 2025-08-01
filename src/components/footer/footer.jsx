import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <div>
      <p className="text-base text-mutedText font-semibold tracking-wide pb-20 pt-10 w-full flex justify-center items-center">
        Inspired by Ultra | &copy; 2025 by &nbsp;
        <Link
          href="/"
          className="hover:text-indigo-300 duration-200 ease-in transition-colors"
        >
          @sandeshlawhale
        </Link>
      </p>
    </div>
  );
};

export default Footer;
