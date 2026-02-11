"use client";
import { motion } from "motion/react";
const Fadeup = ({
  children,
  delay = 0,
  duration = 0.6,
}: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{
        delay,
        duration,
        ease: [0.16, 1, 0.3, 1], // Faster but still smooth cubic-bezier (outQuart approximation)
      }}
    >
      {children}
    </motion.div>
  );
};

export default Fadeup;
