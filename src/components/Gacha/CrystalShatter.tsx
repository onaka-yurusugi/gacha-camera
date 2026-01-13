'use client';

import { motion } from 'framer-motion';
import { Rarity } from '@/types/gacha';

interface CrystalShatterProps {
  isVisible: boolean;
  rarity: Rarity;
}

interface ShardProps {
  index: number;
  rarity: Rarity;
}

const Shard = ({ index, rarity }: ShardProps) => {
  const angle = (index * Math.PI * 2) / 12 + (Math.random() - 0.5) * 0.5;
  const distance = 150 + Math.random() * 200;
  const rotation = Math.random() * 720 - 360;
  const size = 10 + Math.random() * 20;

  const getShardColor = (): string => {
    switch (rarity) {
      case 'SSR':
        return `hsl(${(index * 30) % 360}, 100%, 70%)`;
      case 'SR':
        return `hsl(${45 + Math.random() * 15}, 100%, ${60 + Math.random() * 20}%)`;
      case 'R':
        return `hsl(${200 + Math.random() * 20}, 80%, ${60 + Math.random() * 20}%)`;
      default:
        return `hsl(0, 0%, ${70 + Math.random() * 20}%)`;
    }
  };

  return (
    <motion.div
      className="absolute left-1/2 top-1/2"
      initial={{
        x: 0,
        y: 0,
        scale: 1,
        opacity: 1,
        rotate: 0,
      }}
      animate={{
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        scale: 0,
        opacity: 0,
        rotate: rotation,
      }}
      transition={{
        duration: 0.8,
        ease: 'easeOut',
      }}
    >
      <div
        style={{
          width: size,
          height: size * 1.5,
          background: getShardColor(),
          clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
          boxShadow: `0 0 10px ${getShardColor()}`,
        }}
      />
    </motion.div>
  );
};

interface SparkProps {
  index: number;
  rarity: Rarity;
}

const Spark = ({ index, rarity }: SparkProps) => {
  const angle = Math.random() * Math.PI * 2;
  const distance = 100 + Math.random() * 300;

  const getSparkColor = (): string => {
    switch (rarity) {
      case 'SSR':
        return `hsl(${Math.random() * 360}, 100%, 80%)`;
      case 'SR':
        return '#FFD700';
      case 'R':
        return '#60A5FA';
      default:
        return '#FFFFFF';
    }
  };

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full"
      style={{
        background: getSparkColor(),
        boxShadow: `0 0 6px ${getSparkColor()}`,
      }}
      initial={{
        x: 0,
        y: 0,
        scale: 1,
        opacity: 1,
      }}
      animate={{
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        scale: 0,
        opacity: 0,
      }}
      transition={{
        duration: 0.6 + Math.random() * 0.4,
        delay: Math.random() * 0.1,
        ease: 'easeOut',
      }}
    />
  );
};

export const CrystalShatter = ({ isVisible, rarity }: CrystalShatterProps) => {
  if (!isVisible) return null;

  const shardCount = rarity === 'SSR' ? 16 : rarity === 'SR' ? 12 : 8;
  const sparkCount = rarity === 'SSR' ? 40 : rarity === 'SR' ? 25 : 15;

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Central flash */}
      <motion.div
        className="absolute w-32 h-32 rounded-full"
        style={{
          background: rarity === 'SSR'
            ? 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 70%)'
            : rarity === 'SR'
            ? 'radial-gradient(circle, rgba(255,215,0,1) 0%, rgba(255,215,0,0) 70%)'
            : rarity === 'R'
            ? 'radial-gradient(circle, rgba(96,165,250,1) 0%, rgba(96,165,250,0) 70%)'
            : 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)',
        }}
        initial={{ scale: 0.5, opacity: 1 }}
        animate={{ scale: 3, opacity: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />

      {/* Shards */}
      {[...Array(shardCount)].map((_, i) => (
        <Shard key={`shard-${i}`} index={i} rarity={rarity} />
      ))}

      {/* Sparks */}
      {[...Array(sparkCount)].map((_, i) => (
        <Spark key={`spark-${i}`} index={i} rarity={rarity} />
      ))}

      {/* Ring wave */}
      <motion.div
        className="absolute rounded-full border-4"
        style={{
          borderColor: rarity === 'SSR'
            ? 'rgba(255, 255, 255, 0.8)'
            : rarity === 'SR'
            ? 'rgba(255, 215, 0, 0.8)'
            : rarity === 'R'
            ? 'rgba(96, 165, 250, 0.8)'
            : 'rgba(255, 255, 255, 0.5)',
        }}
        initial={{ width: 0, height: 0, opacity: 1 }}
        animate={{ width: 400, height: 400, opacity: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      />

      {/* Second ring for SSR/SR */}
      {(rarity === 'SSR' || rarity === 'SR') && (
        <motion.div
          className="absolute rounded-full border-2"
          style={{
            borderColor: rarity === 'SSR'
              ? 'rgba(255, 215, 0, 0.6)'
              : 'rgba(255, 215, 0, 0.4)',
          }}
          initial={{ width: 0, height: 0, opacity: 1 }}
          animate={{ width: 500, height: 500, opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
        />
      )}

      {/* Extra effects for SSR */}
      {rarity === 'SSR' && (
        <>
          {/* Rainbow burst */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`ray-${i}`}
              className="absolute left-1/2 top-1/2 h-[50vh] w-2"
              style={{
                transformOrigin: 'top center',
                transform: `translate(-50%, 0) rotate(${i * 45}deg)`,
                background: `linear-gradient(to bottom, hsl(${i * 45}, 100%, 60%), transparent)`,
              }}
              initial={{ scaleY: 0, opacity: 1 }}
              animate={{ scaleY: 1, opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          ))}
        </>
      )}
    </motion.div>
  );
};
