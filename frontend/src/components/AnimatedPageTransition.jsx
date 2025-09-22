import { AnimatePresence, motion } from "framer-motion";

const variants = {
  initial: { opacity: 0, x: 40 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
  },
  exit: {
    opacity: 0,
    x: -40,
    transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
  },
};

export default function AnimatedPageTransition({ children, pageKey }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pageKey}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{ width: "100%" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
