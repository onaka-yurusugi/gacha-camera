'use client';

import { motion } from 'framer-motion';
import { Camera, ImageIcon } from 'lucide-react';
import { useRef } from 'react';

type SourceMode = 'camera' | 'file';

interface SourceModeTabProps {
  currentMode: SourceMode;
  onModeChange: (mode: SourceMode) => void;
  onFileSelected: (file: File) => void;
  isVisible: boolean;
}

export const SourceModeTab = ({
  currentMode,
  onModeChange,
  onFileSelected,
  isVisible,
}: SourceModeTabProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isVisible) return null;

  const handleFileTabClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelected(file);
      onModeChange('file');
    }
    event.target.value = '';
  };

  const handleCameraClick = () => {
    onModeChange('camera');
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <motion.div
        className="fixed top-20 left-1/2 -translate-x-1/2 z-40"
        initial={{ opacity: 0, y: -20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.9 }}
        transition={{ type: 'spring', bounce: 0.3, duration: 0.5 }}
      >
        {/* Outer glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/30 via-yellow-400/20 to-amber-500/30 rounded-2xl blur-md" />

        {/* Main container */}
        <div className="relative flex rounded-xl overflow-hidden border border-amber-400/40 shadow-lg shadow-amber-500/20">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/95 via-gray-800/95 to-gray-900/95" />

          {/* Gold trim top */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-300/80 to-transparent" />

          {/* Gold trim bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-600/60 to-transparent" />

          {/* Camera tab */}
          <button
            onClick={handleCameraClick}
            className="relative flex items-center gap-2.5 px-6 py-4 transition-all duration-300"
          >
            {currentMode === 'camera' && (
              <motion.div
                className="absolute inset-0"
                layoutId="activeTab"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
              >
                {/* Active background */}
                <div className="absolute inset-0 bg-gradient-to-b from-amber-500/30 via-amber-600/20 to-amber-700/30" />
                {/* Shine effect */}
                <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent" />
                {/* Bottom glow */}
                <div className="absolute inset-x-2 bottom-1 h-1 bg-amber-400/40 blur-sm rounded-full" />
              </motion.div>
            )}
            <Camera
              className={`w-6 h-6 relative z-10 transition-all duration-300 ${
                currentMode === 'camera'
                  ? 'text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                  : 'text-gray-400'
              }`}
            />
            <span
              className={`relative z-10 font-bold text-base tracking-wide transition-all duration-300 ${
                currentMode === 'camera'
                  ? 'text-amber-100 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]'
                  : 'text-gray-400'
              }`}
            >
              カメラ
            </span>
          </button>

          {/* Divider */}
          <div className="relative w-px">
            <div className="absolute inset-y-2 w-px bg-gradient-to-b from-transparent via-amber-500/40 to-transparent" />
          </div>

          {/* File tab */}
          <button
            onClick={handleFileTabClick}
            className="relative flex items-center gap-2.5 px-6 py-4 transition-all duration-300"
          >
            {currentMode === 'file' && (
              <motion.div
                className="absolute inset-0"
                layoutId="activeTab"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
              >
                {/* Active background */}
                <div className="absolute inset-0 bg-gradient-to-b from-amber-500/30 via-amber-600/20 to-amber-700/30" />
                {/* Shine effect */}
                <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent" />
                {/* Bottom glow */}
                <div className="absolute inset-x-2 bottom-1 h-1 bg-amber-400/40 blur-sm rounded-full" />
              </motion.div>
            )}
            <ImageIcon
              className={`w-6 h-6 relative z-10 transition-all duration-300 ${
                currentMode === 'file'
                  ? 'text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                  : 'text-gray-400'
              }`}
            />
            <span
              className={`relative z-10 font-bold text-base tracking-wide transition-all duration-300 whitespace-nowrap ${
                currentMode === 'file'
                  ? 'text-amber-100 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]'
                  : 'text-gray-400'
              }`}
            >
              画像・動画から
            </span>
          </button>
        </div>
      </motion.div>
    </>
  );
};
