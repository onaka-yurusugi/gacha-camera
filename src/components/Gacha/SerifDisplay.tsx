'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Rarity } from '@/types/gacha';

interface SerifDisplayProps {
  serifs: string[];
  rarity: Rarity;
  isVisible: boolean;
}

const getAccentColor = (rarity: Rarity): string => {
  switch (rarity) {
    case 'SSR':
      return 'from-yellow-400 via-pink-500 to-purple-500';
    case 'SR':
      return 'from-yellow-400 to-amber-500';
    case 'R':
      return 'from-blue-400 to-cyan-500';
    default:
      return 'from-gray-400 to-gray-500';
  }
};

const SERIF_DISPLAY_TIME = 700; // 各セリフの表示時間(ms)

export const SerifDisplay = ({ serifs, rarity, isVisible }: SerifDisplayProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setCurrentIndex(0);
      return;
    }

    // セリフを順番に表示
    if (currentIndex < serifs.length) {
      const timer = setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, SERIF_DISPLAY_TIME);
      return () => clearTimeout(timer);
    }
  }, [isVisible, currentIndex, serifs.length]);

  if (!isVisible) return null;

  const isSSR = rarity === 'SSR';
  const accentColor = getAccentColor(rarity);

  return (
    <motion.div
      className="fixed inset-0 z-20 flex flex-col items-center justify-end pb-48 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* セリフカットイン */}
      <div className="relative w-full flex flex-col items-center gap-2">
        <AnimatePresence mode="wait">
          {serifs.slice(0, currentIndex).map((serif, index) => {
            const isFromRight = index % 2 === 0;
            const isLast = index === serifs.length - 1;

            return (
              <motion.div
                key={`serif-${index}`}
                className="relative w-full"
                initial={{
                  x: isFromRight ? '100%' : '-100%',
                  opacity: 0,
                }}
                animate={{
                  x: 0,
                  opacity: 1,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 30,
                }}
              >
                {/* カットインライン（スピードライン風） */}
                <motion.div
                  className={`absolute inset-y-0 ${isFromRight ? 'right-0' : 'left-0'} w-full h-full`}
                  initial={{ scaleX: 1.5, opacity: 0.8 }}
                  animate={{ scaleX: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    background: isFromRight
                      ? 'linear-gradient(to left, rgba(255,255,255,0.4), transparent)'
                      : 'linear-gradient(to right, rgba(255,255,255,0.4), transparent)',
                    transformOrigin: isFromRight ? 'right' : 'left',
                  }}
                />

                {/* セリフボックス */}
                <motion.div
                  className={`
                    relative mx-4 px-8 py-4
                    bg-black/85 backdrop-blur-sm
                    border-y-2 border-white/30
                    ${isLast && isSSR ? 'border-yellow-400/60' : ''}
                  `}
                  animate={isLast && isSSR ? {
                    borderColor: ['rgba(250, 204, 21, 0.6)', 'rgba(255, 255, 255, 0.8)', 'rgba(250, 204, 21, 0.6)'],
                  } : undefined}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  {/* アクセントライン */}
                  <div
                    className={`absolute ${isFromRight ? 'right-0' : 'left-0'} top-0 bottom-0 w-1 bg-gradient-to-b ${accentColor}`}
                  />

                  {/* セリフテキスト */}
                  <motion.p
                    className={`
                      text-2xl font-bold text-white text-center
                      ${isLast ? 'text-3xl' : ''}
                    `}
                    style={{
                      textShadow: isSSR
                        ? '0 0 20px rgba(255, 215, 0, 0.5)'
                        : '0 0 10px rgba(255, 255, 255, 0.3)',
                    }}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  >
                    「{serif}」
                  </motion.p>
                </motion.div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
