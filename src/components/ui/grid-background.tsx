import React from "react";

const GridBackground = () => {
  return (
    <div className="fixed h-screen w-screen bg-black bg-grid flex items-center justify-center -z-10">
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-primary  [mask-image:radial-gradient(ellipse_at_center,transparent_0%,#222222_75%)]"></div>
    </div>
  );
};

export default GridBackground;
