'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Rarity } from '@/types/gacha';
import { soundManager } from '@/lib/sounds';

type DisplayMode = 'cutin' | 'result';

interface SerifDisplayProps {
  serifs: string[];
  rarity: Rarity;
  isVisible: boolean;
  mode?: DisplayMode;
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

const SERIF_DISPLAY_TIME = 900; // 各セリフの表示時間(ms)

export const SerifDisplay = ({ serifs, rarity, isVisible, mode = 'cutin' }: SerifDisplayProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const prevIndexRef = useRef(0);

  useEffect(() => {
    if (!isVisible) {
      setCurrentIndex(0);
      prevIndexRef.current = 0;
      return;
    }

    // resultモードでは全セリフを即座に表示
    if (mode === 'result') {
      setCurrentIndex(serifs.length);
      return;
    }

    // cutinモード: セリフを順番に表示
    if (currentIndex < serifs.length) {
      const timer = setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, SERIF_DISPLAY_TIME);
      return () => clearTimeout(timer);
    }
  }, [isVisible, currentIndex, serifs.length, mode]);

  // セリフが増えたらSEを再生（cutinモードのみ）
  useEffect(() => {
    if (mode === 'cutin' && currentIndex > prevIndexRef.current && currentIndex <= serifs.length) {
      soundManager.play('serifAppear');
    }
    prevIndexRef.current = currentIndex;
  }, [currentIndex, serifs.length, mode]);

  if (!isVisible) return null;

  const isSSR = rarity === 'SSR';
  const accentColor = getAccentColor(rarity);

  // resultモード: 下からスライドして登場するシンプルな表示
  if (mode === 'result') {
    const lastSerif = serifs[serifs.length - 1];
    return (
      <motion.div
        className="relative w-full max-w-md px-4"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 25,
          delay: 0.2,
        }}
      >
        <div
          className={`
            relative px-6 py-4
            bg-black/90 backdrop-blur-md
            border-y-2 border-white/40
            shadow-[0_0_20px_rgba(0,0,0,0.6)]
            ${isSSR ? 'border-yellow-400/60' : ''}
          `}
        >
          {/* アクセントライン（左右両方） */}
          <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${accentColor}`} />
          <div className={`absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b ${accentColor}`} />

          {/* セリフテキスト */}
          <p
            className="text-xl font-bold text-white text-center"
            style={{
              textShadow: isSSR
                ? '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 0 0 15px rgba(255, 215, 0, 0.6)'
                : '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000',
            }}
          >
            「{lastSerif}」
          </p>
        </div>
      </motion.div>
    );
  }

  // cutinモード: 従来のカットイン演出
  return (
    <motion.div
      className="fixed inset-0 z-20 flex flex-col items-center justify-center overflow-hidden"
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
                    relative mx-4 px-8 py-5
                    bg-black/95 backdrop-blur-md
                    border-y-2 border-white/40
                    shadow-[0_0_30px_rgba(0,0,0,0.8)]
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
                        ? '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 0 0 20px rgba(255, 215, 0, 0.8)'
                        : '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 0 0 10px rgba(255, 255, 255, 0.5)',
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
