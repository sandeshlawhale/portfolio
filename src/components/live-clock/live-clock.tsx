"use client";
import React, { useEffect, useState } from "react";
import { DM_Mono } from "next/font/google";
import TextEffect from "../effect/text-effect";

const dmMono = DM_Mono({ subsets: ["latin"], weight: "400" });

const LiveClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const delay = 60000 - (time.getSeconds() * 1000 + time.getMilliseconds());

    const interval = setInterval(() => {
      setTime(new Date());
    }, delay);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`${dmMono.className} tracking-wider text-gray-600 `}>
      <TextEffect>
        {time.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </TextEffect>
    </div>
  );
};

export default LiveClock;
