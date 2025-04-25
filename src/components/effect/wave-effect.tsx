"use client";
import { motion } from "framer-motion";
import { useState } from "react";

const WaveEffect = ({ children }: { children: React.ReactNode }) => {
  const [startAnimation, setStartAnimation] = useState(false);
  return (
    <motion.div
      onHoverStart={() => setStartAnimation(true)}
      animate={startAnimation ? { rotate: [0, 25, 0, 25, 0] } : {}}
      transition={{
        duration: 1.3,
      }}
      onAnimationComplete={() => setStartAnimation(false)}
      className="origin-bottom-right"
    >
      {children}
    </motion.div>
  );
};

export default WaveEffect;
