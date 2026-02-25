import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <div className="w-full pb-28 lg:pb-8 pt-10 flex flex-col items-center justify-center text-center gap-1">
      <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground tracking-wider">
        <span>© 2026 Sandesh Lawhale</span>
        <span className="opacity-50">·</span>
        <Link href="https://github.com/sandeshlawhale" target="_blank" className="hover:text-primary-foreground transition-colors">GitHub</Link>
        <span className="opacity-50">·</span>
        <Link href="https://linkedin.com/in/lawhalesandesh" target="_blank" className="hover:text-primaryText transition-colors">LinkedIn</Link>
        <span className="opacity-50">·</span>
        <Link href="mailto:sandeshlawhale@gmail.com" className="hover:text-primaryText transition-colors">Email</Link>
      </div>
      <p className="text-sm text-mutedText tracking-wider">
        Inspired by Ultra & ramxcodes
      </p>
    </div>
  );
};

export default Footer;
