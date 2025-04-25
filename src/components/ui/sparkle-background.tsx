import React from "react";
import { SparklesCore } from "./sparkles";

const SparkelBackground = () => {
  return (
    <div className="w-full inset-0 h-screen fixed -z-10 ">
      <SparklesCore
        id="tsparticlesfullpage"
        background="transparent"
        minSize={0.6}
        maxSize={1.4}
        particleDensity={10}
        className="w-full h-full"
        particleColor="#FFFFFF"
      />
    </div>
  );
};

export default SparkelBackground;
