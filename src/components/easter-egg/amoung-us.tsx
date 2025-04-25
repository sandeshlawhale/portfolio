"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "@/context/AppContext";

const amongUsImages = Array.from(
  { length: 12 },
  (_, i) => `/assets/amoungus/AmoungUs${i + 1}.png`
);
const directions = ["left", "right", "top", "bottom"] as const;
type Direction = (typeof directions)[number];
const randomRotation = Math.floor(Math.random() * (720 - 240 + 1)) + 240;
const randomDuration = (Math.random() * 6 + 6).toFixed(2);

interface AnimationProps {
  initial: { x: string | number; y: string | number };
  animate: { x: string | number; y: string | number };
}

export default function AmongUsEasterEgg() {
  const { amongUsCount, resetAmongUsCount } = useAppContext();
  const [showCharacter, setShowCharacter] = useState(false);
  const [image, setImage] = useState("");
  const [animationProps, setAnimationProps] = useState<AnimationProps>();

  useEffect(() => {
    if (amongUsCount === 6) {
      console.log("comming...");
      const randomImage =
        amongUsImages[Math.floor(Math.random() * amongUsImages.length)];
      const randomDirection: Direction =
        directions[Math.floor(Math.random() * directions.length)];
      let initial: AnimationProps["initial"] = { x: 0, y: 0 };
      let animate: AnimationProps["animate"] = { x: 0, y: 0 };

      const randomStartX = Math.floor(Math.random() * 80) + 10;
      const randomStartY = Math.floor(Math.random() * 50) + 10;

      switch (randomDirection) {
        case "left":
          initial = { x: "-100vw", y: `${randomStartX}vh` };
          animate = { x: "100vw", y: `${randomStartY}vh` };
          break;
        case "right":
          initial = { x: "100vw", y: `${randomStartX}vh` };
          animate = { x: "-100vw", y: `${randomStartY}vh` };
          break;
        case "top":
          initial = { x: `${randomStartX}vw`, y: "-100vh" };
          animate = { x: `${randomStartY}vw`, y: `100vh` };
          break;
        case "bottom":
          initial = { x: `${randomStartX}vw`, y: "100vh" };
          animate = { x: `${randomStartY}vw`, y: "-100vh" };
          break;
      }

      setImage(randomImage);
      setAnimationProps({ initial, animate });
      setShowCharacter(true);
    }
  }, [amongUsCount]);

  const handleAnimationComplete = () => {
    console.log("ended");
    setShowCharacter(false);
    resetAmongUsCount();
  };

  return (
    <AnimatePresence>
      {showCharacter && (
        <motion.img
          src={image}
          alt="Among Us Impostor"
          initial={{ ...animationProps?.initial, rotate: 0 }}
          animate={{ ...animationProps?.animate, rotate: randomRotation }}
          transition={{
            delay: 0,
            duration: parseFloat(randomDuration),
            ease: [1, 0.17, 0.44, 0.87],
          }}
          onAnimationComplete={handleAnimationComplete}
          className="fixed top-1/2 left-0 w-16 h-auto pointer-events-none z-50"
        />
      )}
    </AnimatePresence>
  );
}
