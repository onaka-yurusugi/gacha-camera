'use client';

import { motion } from 'framer-motion';
import { Rarity, RARITY_CONFIG } from '@/types/gacha';

interface RarityBadgeProps {
  rarity: Rarity;
  isVisible: boolean;
}

const getRarityEmoji = (rarity: Rarity): string => {
  switch (rarity) {
    case 'SSR':
      return '🌈';
    case 'SR':
      return '✨';
    case 'R':
      return '💎';
    case 'N':
      return '⚪';
  }
};

export const RarityBadge = ({ rarity, isVisible }: RarityBadgeProps) => {
  const config = RARITY_CONFIG[rarity];
  const emoji = getRarityEmoji(rarity);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed top-1/4 left-0 right-0 flex justify-center z-20"
      initial={{ scale: 0, opacity: 0, y: -50 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0, opacity: 0, y: -50 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <motion.div
        className={`
          px-8 py-4 rounded-xl
          bg-gradient-to-r ${config.color}
          ${config.glowColor}
          text-white font-bold text-3xl
          flex items-center gap-3
        `}
        animate={{
          boxShadow: rarity === 'SSR'
            ? [
                '0 0 20px rgba(255,255,255,0.5)',
                '0 0 60px rgba(255,255,255,0.8)',
                '0 0 20px rgba(255,255,255,0.5)',
              ]
            : undefined,
        }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
        }}
      >
        <span>{emoji}</span>
        <span className="drop-shadow-lg">{config.label}</span>
        <span>{emoji}</span>
      </motion.div>
    </motion.div>
  );
};
