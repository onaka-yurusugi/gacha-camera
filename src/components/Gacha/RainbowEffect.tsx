'use client';

import { motion } from 'framer-motion';
import { Rarity, RARITY_CONFIG } from '@/types/gacha';

interface RainbowEffectProps {
  rarity: Rarity;
  isVisible: boolean;
}

export const RainbowEffect = ({ rarity, isVisible }: RainbowEffectProps) => {
  const config = RARITY_CONFIG[rarity];

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Radial gradient overlay */}
      <motion.div
        className={`absolute inset-0 bg-gradient-radial ${config.glowColor}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1.5, opacity: 0.6 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          background: rarity === 'SSR'
            ? 'radial-gradient(circle at center, rgba(255,255,255,0.3) 0%, transparent 70%)'
            : rarity === 'SR'
            ? 'radial-gradient(circle at center, rgba(255,215,0,0.3) 0%, transparent 70%)'
            : rarity === 'R'
            ? 'radial-gradient(circle at center, rgba(59,130,246,0.3) 0%, transparent 70%)'
            : 'radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, transparent 70%)',
        }}
      />

      {/* Animated particles */}
      {rarity === 'SSR' && (
        <>
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: `hsl(${(i * 18) % 360}, 100%, 60%)`,
                left: `${50 + Math.cos((i * Math.PI * 2) / 20) * 40}%`,
                top: `${50 + Math.sin((i * Math.PI * 2) / 20) * 40}%`,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 1.5, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 1.5,
                delay: i * 0.05,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </>
      )}

      {/* Light rays for SSR/SR */}
      {(rarity === 'SSR' || rarity === 'SR') && (
        <motion.div
          className="absolute inset-0"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        >
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute left-1/2 top-1/2 h-[150vh] w-1"
              style={{
                transform: `translate(-50%, -50%) rotate(${i * 30}deg)`,
                background: rarity === 'SSR'
                  ? `linear-gradient(to bottom, transparent, hsl(${i * 30}, 100%, 60%), transparent)`
                  : 'linear-gradient(to bottom, transparent, rgba(255,215,0,0.5), transparent)',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{
                duration: 1,
                delay: i * 0.1,
                repeat: Infinity,
              }}
            />
          ))}
        </motion.div>
      )}

      {/* Sparkles */}
      {(rarity === 'SSR' || rarity === 'SR' || rarity === 'R') && (
        <>
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={`sparkle-${i}`}
              className="absolute text-2xl"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              initial={{ scale: 0, opacity: 0, rotate: 0 }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
                rotate: 180,
              }}
              transition={{
                duration: 1,
                delay: Math.random() * 2,
                repeat: Infinity,
              }}
            >
              ✨
            </motion.div>
          ))}
        </>
      )}
    </motion.div>
  );
};
