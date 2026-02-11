"use client";
import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const Curtain = () => {
  const pathname = usePathname();
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    setIsAnimating(true);
    const timeout = setTimeout(() => setIsAnimating(false), 1200); // Duration should match animation time
    return () => clearTimeout(timeout);
  }, [pathname]);

  const curtainAnimation = {
    initial: { scaleY: 0 },
    animate: { scaleY: 1 },
    exit: { opacity: [1, 0] },
  };

  return (
    <AnimatePresence mode="wait">
      {isAnimating && (
        <motion.div
          key={pathname}
          variants={curtainAnimation}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ delay: 0.4, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="h-screen w-screen fixed top-0 left-0 bg-primary z-50 origin-top"
        />
      )}
    </AnimatePresence>
  );
};

export default Curtain;
