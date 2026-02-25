"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { NavLinks } from "@/constants/data";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";

const BottomNavbar = () => {
  const pathname = usePathname();
  const { openPalette } = useAppContext();

  return (
    <div className="w-full lg:hidden fixed bottom-0 border-t border-border flex items-center justify-center p-5 px-7 bg-background z-40">
      <div className="w-full sm:w-sm flex items-center justify-between">
        {NavLinks.slice(0, 4).map(({ href, logo, id }) => {
          return (
            <Link
              href={href}
              key={href}
              className={`group relative w-5.5 h-5.5 cursor-pointer flex items-center justify-center ${pathname === href ? "text-secondary-foreground" : "text-secondary-foreground"
                } ${id >= 5 && "hidden sm:block"}`}
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
          );
        })}
        <Popover>
          <PopoverTrigger>
            <div className="group relative w-6 h-6 cursor-pointer flex items-center justify-center lg:hidden text-muted-foreground">
              <Menu />
            </div>
          </PopoverTrigger>
          <PopoverContent className="bg-background border-border flex items-center justify-between gap-10 rounded-lg px-7 mb-8 mr-4 lg:hidden">
            {NavLinks.slice(4).map(({ href, title, logo }) => {
              return (
                <Link
                  href={title === "Search" ? "" : href}
                  key={href}
                  className={`group relative w-5.5 h-5.5 cursor-pointer flex items-center justify-center ${pathname === href ? "text-icon" : "text-icon-muted"
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
              );
            })}
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default BottomNavbar;
