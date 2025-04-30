"use client";
import { useRef } from "react";
import { AnimatePresence, useScroll } from "framer-motion";
import { Menu } from "lucide-react";
import WorkSidebar from "@/components/sidebar/work-sidebar";
import { useAppContext } from "@/context/AppContext";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    container: ref,
  });
  const { isWorkSidebarOpen: open, openWorkSidebar: openSidebar } =
    useAppContext();

  return (
    <div className="w-full flex h-screen">
      <AnimatePresence>
        {open && <WorkSidebar scrollYProgress={scrollYProgress} />}
      </AnimatePresence>
      <div className="hidden xl:block">
        <WorkSidebar scrollYProgress={scrollYProgress} />
      </div>
      <div ref={ref} className="hide-scrollbar w-full h-full overflow-y-auto ">
        <div className="w-full h-full sm:w-md lg:w-xl mx-auto ">
          <div className=" w-full px-4 py-4 fixed bg-black/90 backdrop-blur-xl flex items-center justify-start gap-2 xl:hidden z-30">
            <Menu onClick={openSidebar} className="cursor-pointer" />
            <p className="text-xl font-semibold text-indigo-300">Works</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
