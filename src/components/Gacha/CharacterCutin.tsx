'use client';

import { motion } from 'framer-motion';
import { GachaCharacter } from '@/types/gacha';

interface CharacterCutinProps {
  character: GachaCharacter;
  isVisible: boolean;
}

export const CharacterCutin = ({ character, isVisible }: CharacterCutinProps) => {
  if (!isVisible) return null;

  return (
    <motion.div
      className="relative z-20"
      initial={{ x: -200, opacity: 0, skewX: -10 }}
      animate={{ x: 0, opacity: 1, skewX: 0 }}
      exit={{ x: 200, opacity: 0, skewX: 10 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    >
      <motion.div
        className="
          relative px-12 py-6
          bg-gradient-to-r from-black/80 via-black/90 to-black/80
          border-y-4 border-white/50
        "
        animate={{
          borderColor: ['rgba(255,255,255,0.5)', 'rgba(255,255,255,1)', 'rgba(255,255,255,0.5)'],
        }}
        transition={{ duration: 0.5, repeat: Infinity }}
      >
        {/* Decorative corners */}
        <div className="absolute top-0 left-0 w-4 h-4 border-l-4 border-t-4 border-white/70" />
        <div className="absolute top-0 right-0 w-4 h-4 border-r-4 border-t-4 border-white/70" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-l-4 border-b-4 border-white/70" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-r-4 border-b-4 border-white/70" />

        {/* Character name */}
        <motion.h2
          className="text-4xl font-bold text-white text-center tracking-wider"
          initial={{ letterSpacing: '0.5em', opacity: 0 }}
          animate={{ letterSpacing: '0.1em', opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          【{character.name}】
        </motion.h2>

        {/* Description (if exists) */}
        {character.description && (
          <motion.p
            className="text-sm text-gray-400 text-center mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {character.description}
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  );
};
