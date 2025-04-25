import { easeInOut, motion } from "framer-motion";

const DURATION = 0.25;
const STAGGER = 0.025;

const FlipEffect = ({
  children,
  sidename,
}: {
  children: React.ReactNode;
  sidename: string;
}) => {
  return (
    <motion.div
      initial="initial"
      whileTap="hovered"
      className="relative overflow-hidden w-fit cursor-pointer whitespace-nowrap"
    >
      <div>
        {children
          ?.toString()
          .split("")
          .map((l, i) => (
            <motion.span
              className="inline-block whitespace-break-spaces"
              variants={{
                initial: { y: 0 },
                hovered: { y: "-100%" },
              }}
              transition={{
                delay: STAGGER * i,
                duration: DURATION,
                ease: easeInOut,
              }}
              key={`l_${i}`}
            >
              {l}
            </motion.span>
          ))}
      </div>
      <div className="absolute inset-0">
        {sidename
          ?.toString()
          .split("")
          .map((l, i) => (
            <motion.span
              className="inline-block whitespace-break-spaces"
              variants={{
                initial: { y: "100%" },
                hovered: { y: "0%" },
              }}
              transition={{
                delay: STAGGER * i,
                duration: DURATION,
                ease: easeInOut,
              }}
              key={`l2_${i}`}
            >
              {l}
            </motion.span>
          ))}
      </div>
    </motion.div>
  );
};

export default FlipEffect;
