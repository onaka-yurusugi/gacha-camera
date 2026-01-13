'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Rarity, RARITY_CONFIG } from '@/types/gacha';

interface RainbowEffectProps {
  rarity: Rarity;
  isVisible: boolean;
  isSubdued?: boolean; // 控えめモード（結果表示時）
}

interface ParticlePosition {
  left: string;
  top: string;
  delay: number;
}

export const RainbowEffect = ({ rarity, isVisible, isSubdued = false }: RainbowEffectProps) => {
  const config = RARITY_CONFIG[rarity];
  const isSSR = rarity === 'SSR';

  // Pre-calculate random positions for sparkles to avoid hydration issues
  const sparklePositions = useMemo((): ParticlePosition[] => {
    const count = isSSR ? 25 : rarity === 'SR' ? 15 : 10;
    return [...Array(count)].map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: Math.random() * 2,
    }));
  }, [rarity, isSSR]);

  if (!isVisible) return null;

  // 控えめモードの時の透明度調整
  const subduedMultiplier = isSubdued ? 0.3 : 1;

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: isSubdued ? 0.4 : 1 }}
      transition={{ duration: isSubdued ? 0.5 : 0.3 }}
    >
      {/* SSR Screen shake - 控えめ時は無効 */}
      {isSSR && !isSubdued && (
        <motion.div
          className="absolute inset-0"
          animate={{
            x: [0, -3, 3, -2, 2, -1, 1, 0],
            y: [0, 2, -2, 1, -1, 0],
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatDelay: 2,
          }}
        />
      )}

      {/* SSR Golden vignette */}
      {isSSR && (
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 30%, rgba(255, 215, 0, 0.2) 100%)',
          }}
          animate={{
            opacity: isSubdued ? [0.1, 0.2, 0.1] : [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}

      {/* Radial gradient overlay */}
      <motion.div
        className={`absolute inset-0 bg-gradient-radial ${config.glowColor}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: isSSR ? 2 : 1.5,
          opacity: (isSSR ? 0.8 : 0.6) * subduedMultiplier
        }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          background: isSSR
            ? 'radial-gradient(circle at center, rgba(255,255,255,0.5) 0%, rgba(255,215,0,0.3) 30%, transparent 70%)'
            : rarity === 'SR'
            ? 'radial-gradient(circle at center, rgba(255,215,0,0.3) 0%, transparent 70%)'
            : rarity === 'R'
            ? 'radial-gradient(circle at center, rgba(59,130,246,0.3) 0%, transparent 70%)'
            : 'radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, transparent 70%)',
        }}
      />

      {/* SSR Rainbow border */}
      {isSSR && (
        <motion.div
          className="absolute inset-4 rounded-lg pointer-events-none"
          style={{
            background: 'linear-gradient(45deg, red, orange, yellow, green, blue, purple, red)',
            padding: '3px',
          }}
          animate={{
            opacity: isSubdued ? [0.2, 0.3, 0.2] : [0.6, 1, 0.6],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="absolute inset-[3px] bg-transparent rounded-lg" />
        </motion.div>
      )}

      {/* Sparkles - 控えめ時は非表示 */}
      {(isSSR || rarity === 'SR' || rarity === 'R') && !isSubdued && (
        <>
          {sparklePositions.map((pos, i) => (
            <motion.div
              key={`sparkle-${i}`}
              className={`absolute ${isSSR ? 'text-3xl' : 'text-2xl'}`}
              style={{
                left: pos.left,
                top: pos.top,
                textShadow: isSSR ? '0 0 10px rgba(255, 215, 0, 1)' : undefined,
              }}
              initial={{ scale: 0, opacity: 0, rotate: 0 }}
              animate={{
                scale: [0, isSSR ? 1.5 : 1, 0],
                opacity: [0, 1, 0],
                rotate: 180,
              }}
              transition={{
                duration: isSSR ? 0.8 : 1,
                delay: pos.delay,
                repeat: Infinity,
              }}
            >
              {isSSR ? '✦' : '✨'}
            </motion.div>
          ))}
        </>
      )}

      {/* SSR Floating orbs - 控えめ時は非表示 */}
      {isSSR && !isSubdued && (
        <>
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`orb-${i}`}
              className="absolute w-8 h-8 rounded-full"
              style={{
                background: `radial-gradient(circle, hsl(${i * 45}, 100%, 80%) 0%, hsl(${i * 45}, 100%, 50%) 100%)`,
                boxShadow: `0 0 20px hsl(${i * 45}, 100%, 60%)`,
                left: `${15 + (i % 4) * 25}%`,
                top: i < 4 ? '10%' : '80%',
              }}
              animate={{
                y: i < 4 ? [0, 20, 0] : [0, -20, 0],
                scale: [1, 1.2, 1],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 2,
                delay: i * 0.2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </>
      )}

      {/* SSR Corner flares - 控えめ時は薄く */}
      {isSSR && (
        <>
          {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((pos, i) => (
            <motion.div
              key={`flare-${i}`}
              className={`absolute ${pos} w-32 h-32`}
              style={{
                background: `radial-gradient(circle at ${i % 2 === 0 ? '0%' : '100%'} ${i < 2 ? '0%' : '100%'}, rgba(255, 215, 0, ${isSubdued ? 0.2 : 0.6}) 0%, transparent 70%)`,
              }}
              animate={{
                opacity: isSubdued ? [0.1, 0.3, 0.1] : [0.3, 0.8, 0.3],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 1.5,
                delay: i * 0.3,
                repeat: Infinity,
              }}
            />
          ))}
        </>
      )}
    </motion.div>
  );
};
