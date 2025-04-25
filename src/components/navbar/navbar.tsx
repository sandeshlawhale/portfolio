"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import { NavLinks } from "@/constants/data";
import { useAppContext } from "@/context/AppContext";

const Navbar = () => {
  const { openPalette } = useAppContext();

  const router = useRouter();
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
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
  }, [router]);

  const pathname = usePathname();
  return (
    <nav className="w-fit bg-black border-r border-border h-screen hidden lg:block z-40">
      <div className="h-full flex gap-5 p-6 flex-col items-center justify-center">
        {NavLinks?.map(({ href, title, logo, key }) => (
          <Link
            href={title === "Search" ? "" : href}
            key={href}
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
              className={`group-hover:brightness-200 duration-150 ease-in-out transition-colors ${
                href === "/"
                  ? pathname === href
                    ? "brightness-200"
                    : "brightness-40 "
                  : pathname.startsWith(href)
                  ? "brightness-200"
                  : "brightness-40 "
              }`}
              alt="icon"
              width={24}
              height={24}
            />
            {pathname !== href && (
              <p className="absolute top-1/2 left-8 -translate-y-1/2 text-primaryText text-sm  group-hover:flex bg-secondary border-border border p-1 py-0 rounded-sm hidden gap-1 items-center">
                {title}
                <span className="border border-icon-muted rounded-sm min-w-4 h-4 flex items-center justify-center text-nowrap px-1">
                  {key}
                </span>
              </p>
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
