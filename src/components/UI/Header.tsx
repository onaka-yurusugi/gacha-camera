'use client';

import { motion } from 'framer-motion';

interface HeaderProps {
  onCameraSwitch: () => void;
  onMuteToggle: () => void;
  isMuted: boolean;
  isVisible: boolean;
}

export const Header = ({
  onCameraSwitch,
  onMuteToggle,
  isMuted,
  isVisible,
}: HeaderProps) => {
  if (!isVisible) return null;

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 p-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="flex justify-between items-center">
        {/* Camera switch button */}
        <motion.button
          className="
            p-3 rounded-full
            bg-black/30 backdrop-blur-sm
            border border-white/20
            text-white text-xl
            active:scale-95
            transition-transform
          "
          onClick={onCameraSwitch}
          whileTap={{ scale: 0.9 }}
          aria-label="カメラ切り替え"
        >
          🔄
        </motion.button>

        {/* Sound toggle button */}
        <motion.button
          className="
            p-3 rounded-full
            bg-black/30 backdrop-blur-sm
            border border-white/20
            text-white text-xl
            active:scale-95
            transition-transform
          "
          onClick={onMuteToggle}
          whileTap={{ scale: 0.9 }}
          aria-label={isMuted ? '音声オン' : '音声オフ'}
        >
          {isMuted ? '🔇' : '🔊'}
        </motion.button>
      </div>
    </motion.header>
  );
};
