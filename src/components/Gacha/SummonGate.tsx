'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

interface SummonGateProps {
  isVisible: boolean;
  onTap: () => void;
}

export const SummonGate = ({ isVisible, onTap }: SummonGateProps) => {
  const [isOpening, setIsOpening] = useState(false);

  if (!isVisible) return null;

  const handleTap = () => {
    if (isOpening) return;
    setIsOpening(true);
    // 扉が開き始めてから少し遅らせてガチャ開始
    setTimeout(() => {
      onTap();
      setIsOpening(false);
    }, 600);
  };

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-30"
      onClick={handleTap}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Dark overlay */}
      <motion.div
        className="absolute inset-0 bg-black/60"
        animate={isOpening ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.5 }}
      />

      {/* Gate container with image */}
      <div className="relative w-[95vw] h-[70vh] cursor-pointer select-none">
        {/* Outer glow effect */}
        <motion.div
          className="absolute inset-0 -m-4"
          animate={
            isOpening
              ? {
                  boxShadow:
                    '0 0 150px rgba(255, 255, 255, 0.9), 0 0 200px rgba(255, 215, 0, 0.7)',
                }
              : {
                  boxShadow: [
                    '0 0 40px rgba(255, 215, 0, 0.3), 0 0 80px rgba(147, 197, 253, 0.2)',
                    '0 0 80px rgba(255, 215, 0, 0.5), 0 0 120px rgba(147, 197, 253, 0.4)',
                    '0 0 40px rgba(255, 215, 0, 0.3), 0 0 80px rgba(147, 197, 253, 0.2)',
                  ],
                }
          }
          transition={
            isOpening
              ? { duration: 0.3 }
              : { duration: 2, repeat: Infinity, ease: 'easeInOut' }
          }
        />

        {/* Left door - clips left half of image */}
        <motion.div
          className="absolute left-0 top-0 w-1/2 h-full overflow-hidden origin-left"
          animate={
            isOpening
              ? { rotateY: -120, x: '-30%', opacity: 0 }
              : { rotateY: 0, x: 0, opacity: 1 }
          }
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
        >
          <div className="relative w-[200%] h-full">
            <Image
              src="/images/gate.jpg"
              alt="Summon Gate"
              fill
              className="object-cover"
              priority
            />
          </div>
        </motion.div>

        {/* Right door - clips right half of image */}
        <motion.div
          className="absolute right-0 top-0 w-1/2 h-full overflow-hidden origin-right"
          animate={
            isOpening
              ? { rotateY: 120, x: '30%', opacity: 0 }
              : { rotateY: 0, x: 0, opacity: 1 }
          }
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
        >
          <div className="relative w-[200%] h-full -translate-x-1/2">
            <Image
              src="/images/gate.jpg"
              alt="Summon Gate"
              fill
              className="object-cover"
              priority
            />
          </div>
        </motion.div>

        {/* Center glow line - intensifies when opening */}
        <motion.div
          className="absolute left-1/2 top-0 w-1 h-full -translate-x-1/2 z-10"
          style={{
            background:
              'linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.8), rgba(147, 197, 253, 1), rgba(255, 255, 255, 0.8), transparent)',
          }}
          animate={
            isOpening
              ? {
                  opacity: 1,
                  scaleX: 50,
                  backgroundColor: 'rgba(255, 255, 255, 1)',
                }
              : {
                  opacity: [0.5, 1, 0.5],
                  scaleX: 1,
                  boxShadow: [
                    '0 0 20px rgba(147, 197, 253, 0.5)',
                    '0 0 40px rgba(147, 197, 253, 1)',
                    '0 0 20px rgba(147, 197, 253, 0.5)',
                  ],
                }
          }
          transition={
            isOpening ? { duration: 0.4 } : { duration: 1.5, repeat: Infinity }
          }
        />

        {/* Sparkles around the gate */}
        {!isOpening &&
          [...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl text-yellow-300 z-20"
              style={{
                left: `${10 + (i % 4) * 25}%`,
                top: i < 4 ? '10%' : '80%',
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0.5, 1.2, 0.5],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 2,
                delay: i * 0.3,
                repeat: Infinity,
              }}
            >
              ✦
            </motion.div>
          ))}

        {/* Opening burst effect */}
        {isOpening && (
          <motion.div
            className="absolute inset-0 z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.6 }}
            style={{
              background:
                'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,215,0,0.5) 40%, transparent 70%)',
            }}
          />
        )}
      </div>

      {/* Tap instruction */}
      {!isOpening && (
        <motion.div
          className="absolute bottom-20 left-1/2 -translate-x-1/2 text-center z-20"
          animate={{ y: [0, -5, 0], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <p className="text-white text-xl font-bold tracking-wider drop-shadow-lg">
            タップで召喚
          </p>
          <p className="text-white/60 text-sm mt-1">▼ TAP ▼</p>
        </motion.div>
      )}

      {/* Floating particles */}
      {!isOpening &&
        [...Array(16)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1.5 h-1.5 rounded-full"
            style={{
              left: `${15 + Math.random() * 70}%`,
              bottom: '5%',
              background:
                i % 2 === 0
                  ? 'rgba(255, 215, 0, 0.8)'
                  : 'rgba(147, 197, 253, 0.8)',
            }}
            animate={{
              y: [0, -300 - Math.random() * 200],
              opacity: [0, 1, 0],
              x: [0, (Math.random() - 0.5) * 80],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              delay: Math.random() * 3,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        ))}
    </motion.div>
  );
};
