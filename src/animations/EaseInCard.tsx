import { motion } from "framer-motion";
import React from "react";

type EaseInCardProps = {
  children: React.ReactNode;
};

const EaseInCardAnimation = ({ children }: EaseInCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.8,
        delay: 0.5,
        ease: [0, 0.6, 0.92, 1.01],
      }}>
      {children}
    </motion.div>
  );
};

export default EaseInCardAnimation;
