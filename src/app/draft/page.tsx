"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const DraftPage = () => {
  const router = useRouter();

  useEffect(() => {
    const easterEggTriggered = localStorage.getItem("easterEggTriggered");

    if (!easterEggTriggered) {
      router.replace("/");
    }
  }, [router]);

  return (
    <div>
      <h1>Welcome to the Draft Page!</h1>
    </div>
  );
};

export default DraftPage;
