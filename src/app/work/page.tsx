"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Work = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/work/trueno_wheels");
  }, [router]);
  return <div className=""></div>;
};

export default Work;
