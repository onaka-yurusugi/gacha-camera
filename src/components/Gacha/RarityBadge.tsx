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

const getGlowColor = (rarity: Rarity): string => {
  switch (rarity) {
    case 'SSR':
      return 'rgba(255, 215, 0, 0.8)';
    case 'SR':
      return 'rgba(255, 200, 0, 0.6)';
    case 'R':
      return 'rgba(59, 130, 246, 0.6)';
    default:
      return 'rgba(255, 255, 255, 0.4)';
  }
};

export const RarityBadge = ({ rarity, isVisible }: RarityBadgeProps) => {
  const config = RARITY_CONFIG[rarity];
  const emoji = getRarityEmoji(rarity);
  const glowColor = getGlowColor(rarity);
  const isSSR = rarity === 'SSR';
  const isHighRarity = rarity === 'SSR' || rarity === 'SR';

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed bottom-56 left-0 right-0 flex justify-center z-20 overflow-visible"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* 画面シェイク */}
      <motion.div
        className="relative"
        animate={isHighRarity ? {
          x: [0, -8, 8, -5, 5, -2, 2, 0],
          y: [0, 4, -4, 2, -2, 1, -1, 0],
        } : {
          x: [0, -3, 3, -2, 2, 0],
          y: [0, 2, -2, 1, -1, 0],
        }}
        transition={{ duration: isSSR ? 0.4 : 0.25, ease: 'easeOut' }}
      >
        {/* インパクトフラッシュ */}
        <motion.div
          className="absolute inset-0 -m-20 rounded-full pointer-events-none"
          initial={{ opacity: 1, scale: 0.3 }}
          animate={{ opacity: 0, scale: 2.5 }}
          transition={{ duration: 0.5 }}
          style={{
            background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
          }}
        />

        {/* スピードライン（SSR/SR用） */}
        {isHighRarity && [...Array(8)].map((_, i) => (
          <motion.div
            key={`line-${i}`}
            className="absolute left-1/2 top-1/2 h-[200px] w-0.5 pointer-events-none"
            style={{
              transform: `translate(-50%, -50%) rotate(${i * 45}deg)`,
              background: `linear-gradient(to bottom, transparent 30%, ${glowColor} 50%, transparent 70%)`,
            }}
            initial={{ scaleY: 0, opacity: 1 }}
            animate={{ scaleY: 1, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        ))}

        {/* メインのバッジ - ズームイン演出 */}
        <motion.div
          initial={{ scale: 3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: 'spring',
            stiffness: 250,
            damping: 18,
          }}
        >
          <motion.div
            className={`
              px-10 py-5 rounded-2xl
              bg-gradient-to-r ${config.color}
              text-white font-black text-4xl
              flex items-center gap-4
              border-2 border-white/30
            `}
            animate={{
              boxShadow: isSSR
                ? [
                    `0 0 30px ${glowColor}, 0 0 60px ${glowColor}`,
                    `0 0 50px ${glowColor}, 0 0 100px ${glowColor}`,
                    `0 0 30px ${glowColor}, 0 0 60px ${glowColor}`,
                  ]
                : [
                    `0 0 20px ${glowColor}`,
                    `0 0 40px ${glowColor}`,
                    `0 0 20px ${glowColor}`,
                  ],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
            }}
          >
            <motion.span
              initial={{ rotate: -180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
            >
              {emoji}
            </motion.span>
            <motion.span
              className="drop-shadow-lg tracking-wider"
              style={{
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              {config.label}
            </motion.span>
            <motion.span
              initial={{ rotate: 180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
            >
              {emoji}
            </motion.span>
          </motion.div>
        </motion.div>

        {/* パーティクル（SSR用） */}
        {isSSR && [...Array(8)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute text-2xl pointer-events-none"
            style={{
              left: '50%',
              top: '50%',
            }}
            initial={{
              x: 0,
              y: 0,
              scale: 0,
              opacity: 1
            }}
            animate={{
              x: Math.cos(i * Math.PI / 4) * 80,
              y: Math.sin(i * Math.PI / 4) * 80,
              scale: [0, 1.2, 0],
              opacity: [1, 1, 0],
            }}
            transition={{
              duration: 0.6,
              delay: 0.15,
              ease: 'easeOut',
            }}
          >
            ✦
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};
