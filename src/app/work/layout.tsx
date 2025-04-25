"use client";
import WorkSidebar from "@/components/sidebar/work-sidebar";
import { AnimatePresence, useMotionValueEvent, useScroll } from "framer-motion";
import { Menu } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    container: ref,
  });

  const [open, setOpen] = useState(false);

  return (
    <div className="w-full flex h-screen">
      <AnimatePresence>
        {open && <WorkSidebar scrollYProgress={scrollYProgress} />}
      </AnimatePresence>
      <div className="hidden xl:block">
        <WorkSidebar scrollYProgress={scrollYProgress} />
      </div>
      <div ref={ref} className="hide-scrollbar w-full h-full overflow-y-auto ">
        <div className="w-full sm:w-md lg:w-xl mx-auto py-10 flex flex-col gap-8">
          <div className=" w-full flex items-center justify-between xl:hidden">
            <p className="text-xl font-semibold text-indigo-300">Work</p>
            <Menu onClick={() => setOpen(!open)} className="cursor-pointer" />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
