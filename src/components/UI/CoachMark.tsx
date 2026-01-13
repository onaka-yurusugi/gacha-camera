'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface CoachMarkProps {
  isVisible: boolean;
  onDismiss: () => void;
}

export const CoachMark = ({ isVisible, onDismiss }: CoachMarkProps) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[60]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onDismiss}
        >
          {/* Semi-transparent overlay with cutout effect */}
          <div className="absolute inset-0 bg-black/60" />

          {/* Highlight circle around settings button */}
          <motion.div
            className="absolute right-[60px] top-4 h-14 w-14 rounded-full"
            style={{
              boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.6)',
              background: 'transparent',
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          />

          {/* Pulsing ring effect */}
          <motion.div
            className="absolute right-[60px] top-4 h-14 w-14 rounded-full border-2 border-white"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [1, 0, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Arrow and tooltip */}
          <motion.div
            className="absolute right-4 top-24 flex flex-col items-end"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* Arrow pointing up */}
            <motion.div
              className="mb-2 text-3xl text-white"
              animate={{ y: [-4, 4, -4] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              ↑
            </motion.div>

            {/* Tooltip */}
            <div className="rounded-xl bg-white px-4 py-3 shadow-lg">
              <p className="text-sm font-bold text-gray-800">
                ⚙️ ここをタップ！
              </p>
              <p className="mt-1 text-xs text-gray-600">
                キャラ名やセリフを
                <br />
                自由に設定できます
              </p>
            </div>
          </motion.div>

          {/* Dismiss hint at bottom */}
          <motion.div
            className="absolute bottom-8 left-0 right-0 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-sm text-white/60">
              画面をタップして閉じる
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
