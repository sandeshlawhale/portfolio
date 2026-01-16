import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <div className="w-full pb-28 lg:pb-10 pt-10 flex flex-col items-center justify-center text-center">
      <p className="text-sm text-mutedText tracking-wider">
        Inspired by Ultra & ramxcodes
      </p>
      <p className="text-sm text-mutedText tracking-wider">
        Developed by <span className="font-bold text-primaryText">sandeshlawhale</span>
      </p>
      <p className="text-xs text-mutedText/60 tracking-wider">
        &copy; {new Date().getFullYear()}. All rights reserved.
      </p>
    </div>
  );
};

export default Footer;
