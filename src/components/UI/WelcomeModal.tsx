'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback } from 'react';

interface WelcomeModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

interface SlideContent {
  title: string;
  description: string;
  icon: string;
}

const slides: SlideContent[] = [
  {
    title: '虹演出カメラへようこそ！',
    description: 'カメラで撮影した映像に\nガチャ演出をかけて楽しめるアプリです',
    icon: '💎',
  },
  {
    title: 'タップで召喚',
    description: '画面中央のクリスタルをタップすると\nガチャ演出がスタート！',
    icon: '✨',
  },
  {
    title: 'カスタマイズしよう',
    description: '右上の⚙️ボタンから\nキャラ名やセリフを自由に設定できます',
    icon: '⚙️',
  },
  {
    title: '写真を保存・シェア',
    description: '演出終了後に保存ボタンで撮影\n友達にシェアして楽しもう！',
    icon: '🌈',
  },
];

export const WelcomeModal = ({ isOpen, onComplete }: WelcomeModalProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = useCallback(() => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      onComplete();
    }
  }, [currentSlide, onComplete]);

  const handleSkip = useCallback(() => {
    onComplete();
  }, [onComplete]);

  const isLastSlide = currentSlide === slides.length - 1;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative mx-4 w-full max-w-sm overflow-hidden rounded-2xl bg-gradient-to-b from-gray-800 to-gray-900 px-6 pb-8 pt-10 shadow-2xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            {/* Skip button */}
            {!isLastSlide && (
              <button
                onClick={handleSkip}
                className="absolute right-4 top-4 text-sm text-white/50 hover:text-white/80"
              >
                スキップ
              </button>
            )}

            {/* Slide content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                className="flex flex-col items-center text-center"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {/* Icon */}
                <motion.div
                  className="mb-8 text-7xl"
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  {slides[currentSlide].icon}
                </motion.div>

                {/* Title */}
                <h2 className="mb-5 text-xl font-bold text-white">
                  {slides[currentSlide].title}
                </h2>

                {/* Description */}
                <p className="mb-10 whitespace-pre-line text-white/70">
                  {slides[currentSlide].description}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Progress dots */}
            <div className="mb-6 flex justify-center gap-2">
              {slides.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    index === currentSlide ? 'bg-white' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>

            {/* Next button */}
            <motion.button
              onClick={handleNext}
              className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 py-3 font-bold text-white"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLastSlide ? 'はじめる' : '次へ'}
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
