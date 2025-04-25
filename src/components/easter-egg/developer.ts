import { useState, useRef } from "react";
import { toast } from "sonner";

type UseEasterEggProps = {
  sequence: string[];
  onUnlock: () => void;
};

type StatusItem = {
  correct: boolean;
  index: number | null;
};

const hints = [
  "Strike: Some parts of this page are still in draft...",
  "Strike: This might not be the final version. Keep exploring!",
  "Strike: Not everything is polished yet, but you're close!",
  "Strike: There's more to see when this page is finished!",
  "Strike: Some elements are still a work in progress. Stay tuned!",
  "Strike: It's still a draft, but you're on the right track!",
];

export function useEasterEggSequence({
  sequence,
  onUnlock,
}: UseEasterEggProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [statusMap, setStatusMap] = useState<StatusItem[]>(
    Array(sequence.length).fill({ correct: false, index: null })
  );
  const errorCountRef = useRef(0);
  function registerClick(letter: string, clickedIndex: number) {
    if (letter === sequence[currentIndex]) {
      const updatedStatus = [...statusMap];
      updatedStatus[currentIndex] = {
        correct: true,
        index: clickedIndex,
      };

      if (currentIndex + 1 === sequence.length) {
        setStatusMap(updatedStatus);
        onUnlock();
        errorCountRef.current = 0;

        setTimeout(() => {
          setStatusMap(
            Array(sequence.length).fill({ correct: false, index: null })
          );
          setCurrentIndex(0);
        }, 400);
      } else {
        setStatusMap(updatedStatus);
        setCurrentIndex((prev) => prev + 1);
      }
    } else {
      errorCountRef.current += 1;

      if (errorCountRef.current >= 3) {
        const randomHint = hints[Math.floor(Math.random() * hints.length)];
        toast.info(`${randomHint}`);
        errorCountRef.current = 0;
      }

      setStatusMap(
        Array(sequence.length).fill({ correct: false, index: null })
      );
      setCurrentIndex(0);
    }
  }

  return { registerClick, statusMap, currentIndex };
}
