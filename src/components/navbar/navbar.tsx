"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import { NavLinks } from "@/constants/data";
import { useAppContext } from "@/context/AppContext";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Navbar = () => {
  const { openPalette } = useAppContext();

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Ignore if user is typing in an input field
      const target = event.target as HTMLElement;
      if (
        ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) ||
        target.isContentEditable
      ) {
        return;
      }

      // Ignore if on login or admin pages
      if (pathname.startsWith("/login") || pathname.startsWith("/admin")) {
        return;
      }

      if (event.ctrlKey && event.key.toLowerCase() === "k") {
        event.preventDefault();
        return;
      }

      const key = event.key;
      const link = NavLinks.find((nav) => nav.key === key);

      if (link) {
        router.push(link.href);
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [router, pathname]);

  return (
    <nav className="w-fit bg-background border-r border-border h-screen hidden lg:block z-40">
      <div className="h-full flex gap-5 p-6 flex-col items-center justify-center">
        {NavLinks?.map(({ href, title, logo, key }) => (
          <Tooltip key={href}>
            <TooltipTrigger asChild>
              <Link
                href={title === "Search" ? "" : href}
                className={`group relative w-5.5 h-5.5 cursor-pointer flex items-center justify-center 
                }`}
                onClick={(e) => {
                  if (title === "Search") {
                    e.preventDefault();
                    openPalette();
                  }
                }}
              >
                <Image
                  src={logo}
                  className={`group-hover:brightness-200 duration-150 ease-in-out transition-colors ${href === "/"
                    ? pathname === href
                      ? "brightness-200"
                      : "brightness-60 "
                    : pathname.startsWith(href)
                      ? "brightness-200"
                      : "brightness-60 "
                    }`}
                  alt="icon"
                  width={24}
                  height={24}
                />
              </Link>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              className="flex items-center gap-2 bg-secondary border-border text-primaryText"
            >
              <p>{title}</p>
              <span className="border border-icon-muted rounded-lg min-w-4 h-4 flex items-center justify-center text-xs px-1">
                {key}
              </span>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
