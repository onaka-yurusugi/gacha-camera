'use client';

import { motion } from 'framer-motion';

interface AIAnalyzingProps {
  isVisible: boolean;
}

export const AIAnalyzing = ({ isVisible }: AIAnalyzingProps) => {
  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex flex-col items-center gap-6">
        {/* AI Icon with pulse animation */}
        <motion.div
          className="relative"
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <div className="text-8xl">🤖</div>
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 blur-3xl opacity-50"
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </motion.div>

        {/* Loading text */}
        <div className="flex flex-col items-center gap-2">
          <motion.p
            className="text-white text-xl font-bold"
            animate={{
              opacity: [1, 0.5, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            AI判定中...
          </motion.p>
          <p className="text-white/60 text-sm">
            レアリティと個性を分析しています
          </p>
        </div>

        {/* Loading dots */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
              animate={{
                y: [0, -10, 0],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};
