'use client';

import { motion } from 'framer-motion';

interface SerifDisplayProps {
  serif: string;
  isVisible: boolean;
}

export const SerifDisplay = ({ serif, isVisible }: SerifDisplayProps) => {
  if (!isVisible) return null;

  return (
    <motion.div
      className="relative z-20 mt-8"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -50, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
    >
      <motion.div
        className="
          relative px-8 py-4
          bg-black/70 rounded-lg
          border-2 border-white/30
        "
      >
        {/* Quote marks */}
        <span className="absolute -top-4 left-4 text-4xl text-white/50">「</span>
        <span className="absolute -bottom-4 right-4 text-4xl text-white/50">」</span>

        {/* Serif text with typewriter effect */}
        <motion.p
          className="text-2xl text-white text-center font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {serif.split('').map((char, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              {char}
            </motion.span>
          ))}
        </motion.p>
      </motion.div>
    </motion.div>
  );
};
