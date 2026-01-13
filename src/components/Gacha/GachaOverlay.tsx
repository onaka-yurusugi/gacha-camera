'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { GachaResult } from '@/types/gacha';
import { RainbowEffect } from './RainbowEffect';
import { RarityBadge } from './RarityBadge';
import { CharacterCutin } from './CharacterCutin';
import { SerifDisplay } from './SerifDisplay';
import { soundManager } from '@/lib/sounds';

interface GachaOverlayProps {
  isActive: boolean;
  result: GachaResult | null;
  onComplete: () => void;
}

type AnimationPhase =
  | 'idle'
  | 'flash'
  | 'rolling'
  | 'effect'
  | 'rarity'
  | 'cutin'
  | 'serif'
  | 'fadeout';

const PHASE_TIMINGS: Record<AnimationPhase, number> = {
  idle: 0,
  flash: 100,
  rolling: 500,
  effect: 1000,
  rarity: 200,
  cutin: 300,
  serif: 2000,
  fadeout: 500,
};

export const GachaOverlay = ({ isActive, result, onComplete }: GachaOverlayProps) => {
  const [phase, setPhase] = useState<AnimationPhase>('idle');

  useEffect(() => {
    if (!isActive || !result) {
      setPhase('idle');
      return;
    }

    const runSequence = async () => {
      // Flash
      setPhase('flash');
      await delay(PHASE_TIMINGS.flash);

      // Rolling
      setPhase('rolling');
      soundManager.play('gachaRoll');
      await delay(PHASE_TIMINGS.rolling);

      // Effect
      setPhase('effect');
      soundManager.playForRarity(result.character.rarity);
      await delay(PHASE_TIMINGS.effect);

      // Rarity badge
      setPhase('rarity');
      await delay(PHASE_TIMINGS.rarity);

      // Character cutin
      setPhase('cutin');
      soundManager.play('cutin');
      await delay(PHASE_TIMINGS.cutin);

      // Serif
      setPhase('serif');
      await delay(PHASE_TIMINGS.serif);

      // Fadeout
      setPhase('fadeout');
      await delay(PHASE_TIMINGS.fadeout);

      onComplete();
    };

    runSequence();
  }, [isActive, result, onComplete]);

  if (!isActive || !result) return null;

  const rarity = result.character.rarity;
  const showEffect = phase !== 'idle' && phase !== 'flash' && phase !== 'rolling';
  const showRarity = phase === 'rarity' || phase === 'cutin' || phase === 'serif';
  const showCutin = phase === 'cutin' || phase === 'serif';
  const showSerif = phase === 'serif';

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === 'fadeout' ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* White flash */}
        {phase === 'flash' && (
          <motion.div
            className="absolute inset-0 bg-white z-50"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          />
        )}

        {/* Rolling animation */}
        {phase === 'rolling' && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-black/50 z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="w-24 h-24 rounded-full border-4 border-white border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }}
            />
          </motion.div>
        )}

        {/* Rainbow/Gold/Blue effect */}
        <RainbowEffect rarity={rarity} isVisible={showEffect} />

        {/* Main content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <AnimatePresence>
            {showRarity && (
              <RarityBadge rarity={rarity} isVisible={showRarity} />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showCutin && (
              <div className="mt-4">
                <CharacterCutin character={result.character} isVisible={showCutin} />
              </div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showSerif && (
              <SerifDisplay serif={result.character.serif} isVisible={showSerif} />
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));
