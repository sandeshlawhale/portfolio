"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Work = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/work/trueno_wheels");
  }, [router]);
  return (
    <div className="mt-30 flex items-center justify-center"> Loading...</div>
  );
};

export default Work;
