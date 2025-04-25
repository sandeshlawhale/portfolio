"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { useAppContext } from "@/context/AppContext";

// Mock context for testing
// const mockAppContext = {
//   amongUsCount: 1,
//   resetAmongUsCount: () => console.log("Reset count"),
// };

const amongUsImages = ["/assets/amoungus/AmoungUs1.png"]; // Single image for testing
const staticRotation = 360; // Static rotation
const staticDuration = 5; // Static duration in seconds

interface AnimationProps {
  initial: { x: string; y: string };
  animate: { x: string; y: string };
}

export default function AmongUsEasterEgg() {
  const { amongUsCount } = useAppContext();
  const [showCharacter, setShowCharacter] = useState(true); // Always show for debugging
  const [image, setImage] = useState(amongUsImages[0]);
  const [animationProps, setAnimationProps] = useState<AnimationProps | null>(
    null
  );
  const [isDragging, setIsDragging] = useState(false);
  const controls = useAnimation();
  const dragStartPosition = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    console.log("useEffect triggered, amongUsCount:", amongUsCount);
    if (amongUsCount !== 1) {
      console.log("Count not 1, exiting");
      return;
    }

    // Static animation properties (left to right)
    const initial = { x: "-100vw", y: "50vh" };
    const animate = { x: "100vw", y: "50vh" };

    setAnimationProps({ initial, animate });
    setImage(amongUsImages[0]);
    setShowCharacter(true);

    console.log("Starting animation with props:", { initial, animate });
    controls.start({ ...animate, rotate: staticRotation }).then(() => {
      console.log("Animation started");
    });
  }, [amongUsCount, controls]);

  const handleDragStart = () => {
    console.log("Drag started");
    setIsDragging(true);
    controls.stop();
    dragStartPosition.current = { x: 0, y: 0 };
  };

  const handleDragEnd = async () => {
    console.log("Drag ended");
    setIsDragging(false);
    if (animationProps) {
      console.log("Resuming animation from current position");
      await controls.start({
        ...animationProps.animate,
        rotate: staticRotation,
        transition: {
          duration: staticDuration * (isDragging ? 0.5 : 1),
          ease: [0.67, 0.17, 0.44, 0.87],
        },
      });
    }
  };

  const handleAnimationComplete = () => {
    console.log("Animation completed, isDragging:", isDragging);
    if (!isDragging) {
      console.log("Keeping character visible for debugging");
    }
  };

  return (
    <AnimatePresence>
      {showCharacter && animationProps && (
        <motion.img
          src={image}
          alt="Among Us Character"
          initial={{ ...animationProps.initial, rotate: 0 }}
          animate={controls}
          drag
          dragConstraints={false}
          dragElastic={0.2}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onAnimationComplete={handleAnimationComplete}
          onError={() => {
            console.log("Image load error");
            setShowCharacter(false);
          }}
          className="fixed w-20 h-auto z-50 cursor-grab"
          style={{ willChange: "transform" }}
        />
      )}
    </AnimatePresence>
  );
}
