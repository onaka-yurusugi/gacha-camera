'use client';

import { motion } from 'framer-motion';
import { Rarity } from '@/types/gacha';

interface NameRevealProps {
  name: string;
  rarity: Rarity;
  isVisible: boolean;
}

const getNameColor = (rarity: Rarity): string => {
  switch (rarity) {
    case 'SSR':
      return 'bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-400 bg-clip-text text-transparent';
    case 'SR':
      return 'text-yellow-400';
    case 'R':
      return 'text-blue-400';
    default:
      return 'text-white';
  }
};

const getBorderColor = (rarity: Rarity): string => {
  switch (rarity) {
    case 'SSR':
      return 'border-yellow-400';
    case 'SR':
      return 'border-yellow-500';
    case 'R':
      return 'border-blue-400';
    default:
      return 'border-white/50';
  }
};

const getGlowColor = (rarity: Rarity): string => {
  switch (rarity) {
    case 'SSR':
      return 'rgba(255, 215, 0, 0.8)';
    case 'SR':
      return 'rgba(255, 200, 0, 0.5)';
    case 'R':
      return 'rgba(59, 130, 246, 0.5)';
    default:
      return 'rgba(255, 255, 255, 0.3)';
  }
};

export const NameReveal = ({ name, rarity, isVisible }: NameRevealProps) => {
  if (!isVisible) return null;

  const isSSR = rarity === 'SSR';
  const nameColor = getNameColor(rarity);
  const borderColor = getBorderColor(rarity);
  const glowColor = getGlowColor(rarity);

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
            <div className={`absolute top-0 left-10 right-10 h-1 bg-gradient-to-r ${
              isSSR ? 'from-yellow-400 via-pink-500 to-purple-500' :
              rarity === 'SR' ? 'from-yellow-400 via-amber-500 to-yellow-400' :
              rarity === 'R' ? 'from-blue-400 via-cyan-500 to-blue-400' :
              'from-gray-400 via-white to-gray-400'
            }`} />
            <div className={`absolute bottom-0 left-10 right-10 h-1 bg-gradient-to-r ${
              isSSR ? 'from-purple-500 via-pink-500 to-yellow-400' :
              rarity === 'SR' ? 'from-yellow-400 via-amber-500 to-yellow-400' :
              rarity === 'R' ? 'from-blue-400 via-cyan-500 to-blue-400' :
              'from-gray-400 via-white to-gray-400'
            }`} />

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
