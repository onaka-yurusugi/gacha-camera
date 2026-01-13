'use client';

import { motion } from 'framer-motion';

interface TapToSummonProps {
  isVisible: boolean;
  onTap: () => void;
}

export const TapToSummon = ({ isVisible, onTap }: TapToSummonProps) => {
  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-30"
      onClick={onTap}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="text-center cursor-pointer select-none"
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* Pulsing ring */}
        <motion.div
          className="absolute inset-0 -m-8 rounded-full border-2 border-white/30"
          animate={{
            scale: [1, 1.5],
            opacity: [0.5, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />

        {/* Main button */}
        <motion.div
          className="
            relative px-8 py-4
            bg-gradient-to-b from-white/20 to-white/5
            backdrop-blur-sm
            rounded-full
            border border-white/40
            shadow-lg
          "
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <p className="text-white text-xl font-bold tracking-wider drop-shadow-lg">
            タップで召喚
          </p>
        </motion.div>

        {/* Tap indicator */}
        <motion.div
          className="mt-4 text-white/60 text-sm"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ▼ TAP ▼
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
