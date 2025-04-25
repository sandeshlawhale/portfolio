"use client";
import React, { useEffect, useState } from "react";

const TextEffect = ({ children }: { children: React.ReactNode }) => {
  const originalWord = String(children);
  const [word, setWord] = useState("");
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  useEffect(() => {
    let iterations = 0;
    const interval = setInterval(() => {
      setWord(
        originalWord
          .split("")
          .map((letter: string, index: number) => {
            if (index < iterations) {
              return letter;
            }
            return letters[Math.floor(Math.random() * letters.length)];
          })
          .join("")
      );
      iterations += 1 / 3;

      if (iterations > originalWord.length) {
        clearInterval(interval);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [originalWord]);

  return <p>{word}</p>;
};

export default TextEffect;
