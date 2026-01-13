'use client';

import { motion } from 'framer-motion';

interface SSRExplosionProps {
  isVisible: boolean;
}

export const SSRExplosion = ({ isVisible }: SSRExplosionProps) => {
  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-15"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Screen shake effect container */}
      <motion.div
        className="absolute inset-0"
        animate={{
          x: [0, -5, 5, -3, 3, -2, 2, 0],
          y: [0, 3, -3, 2, -2, 1, -1, 0],
        }}
        transition={{
          duration: 0.6,
          ease: 'easeOut',
        }}
      >
        {/* Multiple flash layers */}
        <motion.div
          className="absolute inset-0 bg-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0, 0.5, 0, 0.3, 0] }}
          transition={{ duration: 0.8, times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6] }}
        />

        {/* Golden flash */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at center, rgba(255, 215, 0, 0.6) 0%, transparent 70%)',
          }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: [0, 1, 0.5, 0], scale: [0.5, 1.5, 2, 2.5] }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />

        {/* Rainbow burst from center */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'conic-gradient(from 0deg at 50% 50%, red, orange, yellow, green, blue, purple, red)',
            mixBlendMode: 'overlay',
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 0.4, 0], scale: [0, 2, 3] }}
          transition={{ duration: 1, delay: 0.1 }}
        />

        {/* Golden aura */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(255, 215, 0, 0.3) 0%, rgba(255, 215, 0, 0.1) 40%, transparent 70%)',
          }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Light explosion rays */}
        {[...Array(16)].map((_, i) => (
          <motion.div
            key={`ray-${i}`}
            className="absolute left-1/2 top-1/2 origin-center"
            style={{
              width: '4px',
              height: '100vh',
              transform: `translate(-50%, -100%) rotate(${i * 22.5}deg)`,
              background: `linear-gradient(to top, transparent 0%, rgba(255, 215, 0, 0.8) 30%, rgba(255, 255, 255, 1) 50%, rgba(255, 215, 0, 0.8) 70%, transparent 100%)`,
            }}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: [0, 1, 0], opacity: [0, 1, 0] }}
            transition={{
              duration: 0.6,
              delay: i * 0.02,
              ease: 'easeOut',
            }}
          />
        ))}

        {/* Expanding rings */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`ring-${i}`}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-4"
            style={{
              borderColor: i === 0 ? 'rgba(255, 215, 0, 0.8)' : i === 1 ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 192, 203, 0.5)',
            }}
            initial={{ width: 0, height: 0, opacity: 1 }}
            animate={{ width: 600 + i * 100, height: 600 + i * 100, opacity: 0 }}
            transition={{ duration: 0.8, delay: i * 0.15, ease: 'easeOut' }}
          />
        ))}

        {/* Massive particle explosion */}
        {[...Array(50)].map((_, i) => {
          const angle = Math.random() * Math.PI * 2;
          const distance = 200 + Math.random() * 400;
          const size = 4 + Math.random() * 8;
          const hue = Math.random() * 60 + 30; // Gold to yellow range

          return (
            <motion.div
              key={`particle-${i}`}
              className="absolute left-1/2 top-1/2 rounded-full"
              style={{
                width: size,
                height: size,
                background: `hsl(${hue}, 100%, ${60 + Math.random() * 30}%)`,
                boxShadow: `0 0 ${size}px hsl(${hue}, 100%, 70%)`,
              }}
              initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
              animate={{
                x: Math.cos(angle) * distance,
                y: Math.sin(angle) * distance,
                scale: 0,
                opacity: 0,
              }}
              transition={{
                duration: 1 + Math.random() * 0.5,
                delay: Math.random() * 0.2,
                ease: 'easeOut',
              }}
            />
          );
        })}

        {/* Star burst */}
        {[...Array(20)].map((_, i) => {
          const angle = (i / 20) * Math.PI * 2;
          const distance = 150 + Math.random() * 100;

          return (
            <motion.div
              key={`star-${i}`}
              className="absolute left-1/2 top-1/2 text-3xl"
              style={{
                textShadow: '0 0 10px rgba(255, 215, 0, 1)',
              }}
              initial={{ x: 0, y: 0, scale: 0, opacity: 0, rotate: 0 }}
              animate={{
                x: Math.cos(angle) * distance,
                y: Math.sin(angle) * distance,
                scale: [0, 1.5, 0],
                opacity: [0, 1, 0],
                rotate: 180,
              }}
              transition={{
                duration: 0.8,
                delay: i * 0.03,
                ease: 'easeOut',
              }}
            >
              ✦
            </motion.div>
          );
        })}

        {/* Rainbow sparkles floating */}
        {[...Array(30)].map((_, i) => {
          const hue = (i * 12) % 360;

          return (
            <motion.div
              key={`sparkle-${i}`}
              className="absolute w-2 h-2 rounded-full"
              style={{
                left: `${10 + Math.random() * 80}%`,
                top: `${10 + Math.random() * 80}%`,
                background: `hsl(${hue}, 100%, 70%)`,
                boxShadow: `0 0 10px hsl(${hue}, 100%, 70%)`,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 1,
                delay: 0.3 + Math.random() * 0.5,
                repeat: Infinity,
                repeatDelay: Math.random() * 0.5,
              }}
            />
          );
        })}

        {/* Central intense glow */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255, 255, 255, 1) 0%, rgba(255, 215, 0, 0.8) 30%, transparent 70%)',
            filter: 'blur(20px)',
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0, 3, 2],
            opacity: [0, 1, 0.5],
          }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </motion.div>
    </motion.div>
  );
};
