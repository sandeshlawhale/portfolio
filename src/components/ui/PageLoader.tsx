"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAppContext } from "@/context/AppContext";

const CHAR_MAP = [
    { char: "S", x: "20" },
    { char: "a", x: "55" },
    { char: "n", x: "93" },
    { char: "d", x: "132" },
    { char: "e", x: "169" },
    { char: "s", x: "204" },
    { char: "h", x: "240" },
    { char: ".", x: "278" },
];

export default function PageLoader() {
    const { isPageLoading, finishPageLoading, dataLoaded } = useAppContext();
    const [progress, setProgress] = useState(0);
    const [isExitStarted, setIsExitStarted] = useState(false);

    const startTimeRef = useRef(Date.now());

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (dataLoaded) return 100;
                if (prev < 80) return prev + Math.random() * 2;
                return prev;
            });
        }, 100);

        return () => clearInterval(interval);
    }, [dataLoaded]);

    useEffect(() => {
        if (progress === 100) {
            const elapsed = Date.now() - startTimeRef.current;
            const remaining = Math.max(1000 - elapsed, 0);

            // Wait at least 1s total + a small delay for the 100% to be visible
            const timer = setTimeout(() => {
                setIsExitStarted(true);
            }, remaining + 600);
            return () => clearTimeout(timer);
        }
    }, [progress]);

    return (
        <AnimatePresence mode="wait">
            {isPageLoading && (
                <motion.div
                    className="fixed inset-0 z-[9999] flex items-center justify-center md:items-end md:justify-end bg-black overflow-hidden p-16"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.22, 0.61, 0.36, 1.00] } }}
                >
                    <div className="relative overflow-hidden leading-none flex items-center justify-center border border-white/0 ">
                        <svg
                            viewBox="0 0 300 110"
                            className="w-md h-fit overflow-visible"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <defs>
                                <clipPath id="text-clip">
                                    {CHAR_MAP.map((item, i) => (
                                        <motion.text
                                            key={`clip-${i}`}
                                            x={item.x}
                                            y="65%"
                                            dominantBaseline="middle"
                                            textAnchor="start"
                                            fontSize="100"
                                            fontWeight="400"
                                            fontFamily="'Bebas Neue', sans-serif"
                                            initial={{ y: 0 }}
                                            animate={isExitStarted ? { y: 200 } : { y: 0 }}
                                            transition={{
                                                duration: 0.8,
                                                ease: [0.16, 1, 0.3, 1],
                                                delay: (CHAR_MAP.length - 1 - i) * 0.075,
                                            }}
                                        >
                                            {item.char}
                                        </motion.text>
                                    ))}
                                </clipPath>
                            </defs>

                            {/* Outlined text (Background) */}
                            {CHAR_MAP.map((item, i) => (
                                <motion.text
                                    key={`outline-${i}`}
                                    x={item.x}
                                    y="65%"
                                    dominantBaseline="middle"
                                    textAnchor="start"
                                    fontSize="100"
                                    fontWeight="400"
                                    fontFamily="'Bebas Neue', sans-serif"
                                    stroke="rgba(255, 255, 255, 0.2)"
                                    strokeWidth="1"
                                    fill="none"
                                    initial={{ y: 0 }}
                                    animate={isExitStarted ? { y: 200 } : { y: 0 }}
                                    transition={{
                                        duration: 0.8,
                                        ease: [0.22, 0.61, 0.36, 1.00],
                                        delay: (CHAR_MAP.length - 1 - i) * 0.15,
                                    }}
                                    onAnimationComplete={() => {
                                        // The first character 'S' (index 0) finishes last in this delay sequence
                                        if (i === 0 && isExitStarted) {
                                            finishPageLoading();
                                        }
                                    }}
                                >
                                    {item.char}
                                </motion.text>
                            ))}

                            {/* Filling Progress */}
                            <g clipPath="url(#text-clip)">
                                <motion.rect
                                    x="0"
                                    y="0"
                                    width="0%"
                                    height="100%"
                                    fill="white"
                                    initial={{ scaleX: 0, originX: 0 }}
                                    animate={{ scaleX: progress / 100, width: "100%" }}
                                    transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1.00] }}
                                />
                            </g>
                        </svg>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
