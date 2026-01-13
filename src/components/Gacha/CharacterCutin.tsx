'use client';

import { motion } from 'framer-motion';
import { GachaCharacter, Rarity } from '@/types/gacha';

interface CharacterCutinProps {
  character: GachaCharacter;
  isVisible: boolean;
}

const getAccentColor = (rarity: Rarity): string => {
  switch (rarity) {
    case 'SSR':
      return 'from-purple-500 via-pink-500 to-yellow-500';
    case 'SR':
      return 'from-yellow-400 via-amber-500 to-yellow-400';
    case 'R':
      return 'from-blue-400 via-cyan-500 to-blue-400';
    default:
      return 'from-gray-400 via-white to-gray-400';
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

export const CharacterCutin = ({ character, isVisible }: CharacterCutinProps) => {
  if (!isVisible) return null;

  const accentColor = getAccentColor(character.rarity);
  const borderColor = getBorderColor(character.rarity);
  const isSSR = character.rarity === 'SSR';

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-30"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Screen shake container */}
      <motion.div
        className="relative w-full flex items-center justify-center"
        animate={isSSR ? {
          x: [0, -8, 8, -6, 6, -4, 4, -2, 2, 0],
          y: [0, 4, -4, 3, -3, 2, -2, 1, -1, 0],
        } : {
          x: [0, -4, 4, -2, 2, 0],
          y: [0, 2, -2, 1, -1, 0],
        }}
        transition={{ duration: isSSR ? 0.5 : 0.3, ease: 'easeOut' }}
      >
        {/* Zoom-in container */}
        <motion.div
          className="relative"
          initial={{ scale: 3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 25,
            duration: 0.4,
          }}
        >
          {/* Impact flash */}
          <motion.div
            className="absolute inset-0 -m-20 rounded-full"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)',
            }}
          />

          {/* Speed lines */}
          {isSSR && [...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute left-1/2 top-1/2 h-[200vh] w-1 -translate-x-1/2 -translate-y-1/2"
              style={{
                transform: `translate(-50%, -50%) rotate(${i * 30}deg)`,
                background: `linear-gradient(to bottom, transparent 45%, rgba(255, 215, 0, 0.3) 50%, transparent 55%)`,
              }}
              initial={{ scaleY: 0, opacity: 1 }}
              animate={{ scaleY: 1, opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          ))}

          {/* Main name container */}
          <motion.div
            className={`
              relative px-16 py-8
              bg-gradient-to-r from-black/90 via-black/95 to-black/90
              border-y-4 ${borderColor}
            `}
            animate={{
              borderColor: isSSR
                ? ['rgba(255,215,0,0.8)', 'rgba(255,255,255,1)', 'rgba(255,215,0,0.8)']
                : ['rgba(255,255,255,0.5)', 'rgba(255,255,255,1)', 'rgba(255,255,255,0.5)'],
            }}
            transition={{ duration: 0.3, repeat: Infinity }}
          >
            {/* Decorative corners with glow */}
            <motion.div
              className={`absolute top-0 left-0 w-6 h-6 border-l-4 border-t-4 ${borderColor}`}
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
            <motion.div
              className={`absolute top-0 right-0 w-6 h-6 border-r-4 border-t-4 ${borderColor}`}
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 0.5, repeat: Infinity, delay: 0.1 }}
            />
            <motion.div
              className={`absolute bottom-0 left-0 w-6 h-6 border-l-4 border-b-4 ${borderColor}`}
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
            />
            <motion.div
              className={`absolute bottom-0 right-0 w-6 h-6 border-r-4 border-b-4 ${borderColor}`}
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 0.5, repeat: Infinity, delay: 0.3 }}
            />

            {/* Gradient accent line */}
            <div className={`absolute top-0 left-8 right-8 h-1 bg-gradient-to-r ${accentColor}`} />
            <div className={`absolute bottom-0 left-8 right-8 h-1 bg-gradient-to-r ${accentColor}`} />

            {/* Character name with impact */}
            <motion.h2
              className="text-5xl font-black text-white text-center tracking-wider"
              style={{
                textShadow: isSSR
                  ? '0 0 20px rgba(255, 215, 0, 0.8), 0 0 40px rgba(255, 215, 0, 0.5)'
                  : '0 0 10px rgba(255, 255, 255, 0.5)',
              }}
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.1 }}
            >
              <motion.span
                animate={isSSR ? {
                  textShadow: [
                    '0 0 20px rgba(255, 215, 0, 0.8)',
                    '0 0 40px rgba(255, 215, 0, 1)',
                    '0 0 20px rgba(255, 215, 0, 0.8)',
                  ],
                } : undefined}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                【{character.name}】
              </motion.span>
            </motion.h2>

            {/* Description (if exists) */}
            {character.description && (
              <motion.p
                className="text-base text-gray-300 text-center mt-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {character.description}
              </motion.p>
            )}
          </motion.div>

          {/* SSR special sparkles */}
          {isSSR && [...Array(8)].map((_, i) => (
            <motion.div
              key={`sparkle-${i}`}
              className="absolute text-2xl"
              style={{
                left: `${10 + (i % 4) * 25}%`,
                top: i < 4 ? '-30px' : 'calc(100% + 10px)',
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 1.2, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 0.6,
                delay: 0.2 + i * 0.1,
                repeat: Infinity,
                repeatDelay: 0.5,
              }}
            >
              ✦
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
