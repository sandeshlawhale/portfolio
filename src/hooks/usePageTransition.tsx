import { useRouter } from "next/navigation";
import { useState } from "react";

const usePageTransition = () => {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const navigate = (path: string) => {
    setIsTransitioning(true);
    setTimeout(() => {
      router.push(path);
      setIsTransitioning(false);
    }, 1200); // Matches the animation duration
  };

  return { navigate, isTransitioning };
};

export default usePageTransition;
