'use client';

import { motion } from 'framer-motion';
import {
  Rarity,
  DisplayMode,
  getRarityNameColor,
  getRarityBorderColor,
  getRarityGlowColor,
  getRarityAccentGradient,
} from '@/types/gacha';

interface NameRevealProps {
  name: string;
  rarity: Rarity;
  isVisible: boolean;
  mode?: DisplayMode;
}

export const NameReveal = ({ name, rarity, isVisible, mode = 'cutin' }: NameRevealProps) => {
  if (!isVisible) return null;

  const isSSR = rarity === 'SSR';
  const nameColor = getRarityNameColor(rarity);
  const borderColor = getRarityBorderColor(rarity);
  const glowColor = getRarityGlowColor(rarity);
  const accentGradient = getRarityAccentGradient(rarity);

  // resultモード: コンパクトで静かな表示
  if (mode === 'result') {
    return (
      <motion.div
        className="relative"
        initial={{ scale: 0.8, opacity: 0, y: -20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 25,
          delay: 0.1,
        }}
      >
        <div
          className={`
            relative px-8 py-3
            bg-black/90 backdrop-blur-md
            border-y-2 ${borderColor}
          `}
          style={{
            boxShadow: `0 0 20px ${glowColor}`,
          }}
        >
          {/* グラデーションアクセントライン */}
          <div className={`absolute top-0 left-4 right-4 h-0.5 bg-gradient-to-r ${accentGradient}`} />
          <div className={`absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-l ${accentGradient}`} />

          <h2
            className={`text-3xl font-black text-center tracking-wider ${nameColor}`}
            style={{
              textShadow: isSSR
                ? '0 0 20px rgba(255, 215, 0, 0.6), 0 2px 0 rgba(0, 0, 0, 0.3)'
                : '0 0 10px rgba(255, 255, 255, 0.3), 0 2px 0 rgba(0, 0, 0, 0.3)',
            }}
          >
            【{name}】
          </h2>
        </div>
      </motion.div>
    );
  }

  // cutinモード: 従来の派手な演出
  return (
    <motion.div
      className="fixed inset-x-0 bottom-36 z-30 flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* 画面シェイク用コンテナ */}
      <motion.div
        className="relative w-full flex items-center justify-center"
        animate={isSSR ? {
          x: [0, -15, 15, -10, 10, -5, 5, 0],
          y: [0, 8, -8, 5, -5, 3, -3, 0],
        } : {
          x: [0, -5, 5, -3, 3, 0],
          y: [0, 3, -3, 2, -2, 0],
        }}
        transition={{ duration: isSSR ? 0.5 : 0.3, ease: 'easeOut' }}
      >
        {/* ズームイン演出 */}
        <motion.div
          className="relative"
          initial={{ scale: 5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 20,
            duration: 0.5,
          }}
        >
          {/* インパクトフラッシュ */}
          <motion.div
            className="absolute inset-0 -m-32 rounded-full"
            initial={{ opacity: 1, scale: 0.5 }}
            animate={{ opacity: 0, scale: 2 }}
            transition={{ duration: 0.4 }}
            style={{
              background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
            }}
          />

          {/* SSR用スピードライン */}
          {isSSR && [...Array(16)].map((_, i) => (
            <motion.div
              key={`line-${i}`}
              className="absolute left-1/2 top-1/2 h-[300vh] w-0.5"
              style={{
                transform: `translate(-50%, -50%) rotate(${i * 22.5}deg)`,
                background: `linear-gradient(to bottom, transparent 40%, rgba(255, 215, 0, 0.4) 50%, transparent 60%)`,
              }}
              initial={{ scaleY: 0, opacity: 1 }}
              animate={{ scaleY: 1, opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          ))}

          {/* メインの名前コンテナ */}
          <motion.div
            className={`
              relative px-20 py-10
              bg-gradient-to-r from-black/95 via-black/98 to-black/95
              border-y-4 ${borderColor}
            `}
            animate={{
              borderColor: isSSR
                ? ['rgba(255, 215, 0, 0.8)', 'rgba(255, 255, 255, 1)', 'rgba(255, 215, 0, 0.8)']
                : ['rgba(255, 255, 255, 0.5)', 'rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 0.5)'],
            }}
            transition={{ duration: 0.3, repeat: Infinity }}
          >
            {/* 装飾コーナー */}
            {[
              'top-0 left-0 border-l-4 border-t-4',
              'top-0 right-0 border-r-4 border-t-4',
              'bottom-0 left-0 border-l-4 border-b-4',
              'bottom-0 right-0 border-r-4 border-b-4',
            ].map((pos, i) => (
              <motion.div
                key={`corner-${i}`}
                className={`absolute w-8 h-8 ${pos} ${borderColor}`}
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
              />
            ))}

            {/* グラデーションアクセントライン */}
            <div className={`absolute top-0 left-10 right-10 h-1 bg-gradient-to-r ${accentGradient}`} />
            <div className={`absolute bottom-0 left-10 right-10 h-1 bg-gradient-to-l ${accentGradient}`} />

            {/* 名前テキスト */}
            <motion.h1
              className={`text-6xl font-black text-center tracking-wider ${nameColor}`}
              style={{
                textShadow: isSSR
                  ? '0 0 30px rgba(255, 215, 0, 0.8), 0 0 60px rgba(255, 215, 0, 0.5), 0 4px 0 rgba(0, 0, 0, 0.3)'
                  : '0 0 20px rgba(255, 255, 255, 0.5), 0 4px 0 rgba(0, 0, 0, 0.3)',
              }}
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <motion.span
                animate={isSSR ? {
                  textShadow: [
                    '0 0 30px rgba(255, 215, 0, 0.8), 0 0 60px rgba(255, 215, 0, 0.5)',
                    '0 0 50px rgba(255, 215, 0, 1), 0 0 100px rgba(255, 215, 0, 0.8)',
                    '0 0 30px rgba(255, 215, 0, 0.8), 0 0 60px rgba(255, 215, 0, 0.5)',
                  ],
                } : undefined}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                【{name}】
              </motion.span>
            </motion.h1>
          </motion.div>

          {/* SSR用スパークル */}
          {isSSR && [...Array(12)].map((_, i) => (
            <motion.div
              key={`sparkle-${i}`}
              className="absolute text-3xl"
              style={{
                left: `${5 + (i % 6) * 16}%`,
                top: i < 6 ? '-50px' : 'calc(100% + 20px)',
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 1.5, 0],
                opacity: [0, 1, 0],
                rotate: [0, 180],
              }}
              transition={{
                duration: 0.8,
                delay: 0.2 + i * 0.08,
                repeat: Infinity,
                repeatDelay: 0.4,
              }}
            >
              <span className="text-yellow-300">✦</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* 背景のパーティクル（SSR用） */}
      {isSSR && [...Array(20)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-2 h-2 rounded-full bg-yellow-400"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 0.8, 0],
            y: [0, -100],
          }}
          transition={{
            duration: 1.5,
            delay: 0.3 + i * 0.1,
            repeat: Infinity,
            repeatDelay: 0.5,
          }}
        />
      ))}
    </motion.div>
  );
};
