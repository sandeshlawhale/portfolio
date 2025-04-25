"use client";
import React from "react";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { usePathname } from "next/navigation";

const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  const anim = (variants: Variants) => {
    return {
      initial: "initial",
      animate: "enter",
      exit: "exit",
      variants,
    };
  };

  const opacity: Variants = {
    initial: { opacity: 0, scale: 1 },
    enter: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.83, 0, 0.17, 1],
      },
    },
    exit: {
      opacity: 0.5,
      scale: 0.94,
      transition: {
        ease: [0.83, 0, 0.17, 1],
        duration: 1,
      },
    },
  };

  const slide: Variants = {
    initial: {
      top: "100vh",
    },
    enter: {
      top: "100vh",
    },
    exit: {
      top: "0",
      transition: {
        duration: 1,
        ease: [0.83, 0, 0.17, 1],
      },
    },
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        {...anim(slide)}
        className="fixed w-full h-full bg-primary inset-0 z-50"
        key={`slide_${pathname}`}
      />
      <motion.div {...anim(opacity)} key={pathname} className="flex-1">
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;
