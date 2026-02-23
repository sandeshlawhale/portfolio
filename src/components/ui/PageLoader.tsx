"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAppContext } from "@/context/AppContext";

const CHARS = "Sandesh.".split("");

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
            }, remaining + 300);
            return () => clearTimeout(timer);
        }
    }, [progress]);

    return (
        <AnimatePresence mode="wait">
            {isPageLoading && (
                <motion.div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black overflow-hidden"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.22, 0.61, 0.36, 1.00] } }}
                >
                    <div className="relative overflow-hidden leading-none flex items-center justify-center border border-white/0">
                        <svg
                            viewBox="0 0 460 80"
                            className="w-md h-fit overflow-visible"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <defs>
                                <clipPath id="text-clip">
                                    {CHARS.map((char, i) => (
                                        <motion.text
                                            key={`clip-${i}`}
                                            x={`${(100 / CHARS.length) * i + (100 / CHARS.length) / 2}%`}
                                            y="60%"
                                            dominantBaseline="middle"
                                            textAnchor="middle"
                                            fontSize="100"
                                            fontWeight="900"
                                            fontFamily="Inter, sans-serif"
                                            initial={{ y: 0 }}
                                            animate={isExitStarted ? { y: 200 } : { y: 0 }}
                                            transition={{
                                                duration: 0.8,
                                                ease: [0.16, 1, 0.3, 1],
                                                delay: (CHARS.length - 1 - i) * 0.075,
                                            }}
                                        >
                                            {char}
                                        </motion.text>
                                    ))}
                                </clipPath>
                            </defs>

                            {/* Outlined text (Background) */}
                            {CHARS.map((char, i) => (
                                <motion.text
                                    key={`outline-${i}`}
                                    x={`${(100 / CHARS.length) * i + (100 / CHARS.length) / 2}%`}
                                    y="60%"
                                    dominantBaseline="middle"
                                    textAnchor="middle"
                                    fontSize="100"
                                    fontWeight="900"
                                    fontFamily="Inter, sans-serif"
                                    stroke="rgba(255, 255, 255, 0.2)"
                                    strokeWidth="1"
                                    fill="none"
                                    initial={{ y: 0 }}
                                    animate={isExitStarted ? { y: 200 } : { y: 0 }}
                                    transition={{
                                        duration: 0.8,
                                        ease: [0.22, 0.61, 0.36, 1.00],
                                        delay: (CHARS.length - 1 - i) * 0.15,
                                    }}
                                    onAnimationComplete={() => {
                                        // The first character 'S' (index 0) finishes last in this delay sequence
                                        if (i === 0 && isExitStarted) {
                                            finishPageLoading();
                                        }
                                    }}
                                >
                                    {char}
                                </motion.text>
                            ))}

                            {/* Filling Progress */}
                            <g clipPath="url(#text-clip)">
                                <motion.rect
                                    x="0"
                                    y="0"
                                    width="100%"
                                    height="100%"
                                    fill="white"
                                    initial={{ scaleX: 0, originX: 0 }}
                                    animate={{ scaleX: progress / 100 }}
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
