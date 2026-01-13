'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { GachaResult } from '@/types/gacha';
import { RainbowEffect } from './RainbowEffect';
import { RarityBadge } from './RarityBadge';
import { SerifDisplay } from './SerifDisplay';
import { NameReveal } from './NameReveal';
import { CrystalShatter } from './CrystalShatter';
import { SSRExplosion } from './SSRExplosion';
import { soundManager } from '@/lib/sounds';

interface GachaOverlayProps {
  isActive: boolean;
  result: GachaResult | null;
  onComplete: () => void;
}

type AnimationPhase =
  | 'idle'
  | 'shatter'
  | 'flash'
  | 'ssrExplosion'
  | 'effect'
  | 'serif'
  | 'rarity'
  | 'name'
  | 'fadeout';

const BASE_PHASE_TIMINGS = {
  idle: 0,
  shatter: 500,      // クリスタル破砕
  flash: 150,
  ssrExplosion: 800,
  effect: 600,       // 背景エフェクト
  rarity: 1000,      // レアリティバッジ
  name: 1200,        // 名前ドカン表示
  fadeout: 500,
} as const;

// セリフ表示時間を動的に計算（セリフ数 × 900ms + 余裕 300ms）
const SERIF_TIME_PER_LINE = 900;
const SERIF_BUFFER = 300;
const calculateSerifTime = (serifCount: number): number =>
  serifCount * SERIF_TIME_PER_LINE + SERIF_BUFFER;

export const GachaOverlay = ({ isActive, result, onComplete }: GachaOverlayProps) => {
  const [phase, setPhase] = useState<AnimationPhase>('idle');

  useEffect(() => {
    if (!isActive || !result) {
      setPhase('idle');
      return;
    }

    const isSSR = result.character.rarity === 'SSR';

    const serifTime = calculateSerifTime(result.character.serifs.length);

    const runSequence = async () => {
      // Crystal Shatter
      setPhase('shatter');
      soundManager.play('gachaRoll');
      await delay(BASE_PHASE_TIMINGS.shatter);

      // Flash
      setPhase('flash');
      await delay(BASE_PHASE_TIMINGS.flash);

      // SSR Explosion (only for SSR)
      if (isSSR) {
        setPhase('ssrExplosion');
        await delay(BASE_PHASE_TIMINGS.ssrExplosion);
      }

      // Effect
      setPhase('effect');
      soundManager.playForRarity(result.character.rarity);
      await delay(BASE_PHASE_TIMINGS.effect);

      // Serif (セリフのみ表示)
      setPhase('serif');
      await delay(serifTime);

      // Rarity badge
      setPhase('rarity');
      await delay(BASE_PHASE_TIMINGS.rarity);

      // Name reveal (名前ドカン！)
      setPhase('name');
      soundManager.play('cutin');
      await delay(BASE_PHASE_TIMINGS.name);

      // Fadeout
      setPhase('fadeout');
      await delay(BASE_PHASE_TIMINGS.fadeout);

      onComplete();
    };

    runSequence();
  }, [isActive, result, onComplete]);

  if (!isActive || !result) return null;

  const rarity = result.character.rarity;
  const isSSR = rarity === 'SSR';
  const showShatter = phase === 'shatter';
  const showSSRExplosion = phase === 'ssrExplosion' && isSSR;
  // shatterフェーズから背景エフェクトを表示（扉が開く時から演出開始）
  const showEffect = !['idle', 'flash'].includes(phase);
  // セリフ・レアリティ・名前は一度表示したら消えない
  const phaseOrder = ['idle', 'shatter', 'flash', 'ssrExplosion', 'effect', 'serif', 'rarity', 'name', 'fadeout'];
  const currentPhaseIndex = phaseOrder.indexOf(phase);
  const showSerif = currentPhaseIndex >= phaseOrder.indexOf('serif') && phase !== 'fadeout';
  const showRarity = currentPhaseIndex >= phaseOrder.indexOf('rarity') && phase !== 'fadeout';
  const showName = currentPhaseIndex >= phaseOrder.indexOf('name') && phase !== 'fadeout';

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === 'fadeout' ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Crystal Shatter effect */}
        <AnimatePresence>
          {showShatter && (
            <CrystalShatter rarity={rarity} isVisible={showShatter} />
          )}
        </AnimatePresence>

        {/* Flash - SSRは虹色、それ以外は白 */}
        {phase === 'flash' && (
          <motion.div
            className="absolute inset-0 z-50"
            style={{
              background: isSSR
                ? 'linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #8b00ff, #ff0000)'
                : 'white',
            }}
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: isSSR ? 0.25 : 0.15 }}
          />
        )}


        {/* SSR Explosion effect */}
        <AnimatePresence>
          {showSSRExplosion && (
            <SSRExplosion isVisible={showSSRExplosion} />
          )}
        </AnimatePresence>

        {/* Rainbow/Gold/Blue effect */}
        <RainbowEffect rarity={rarity} isVisible={showEffect} />

        {/* Main content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {/* 1. セリフのみ表示 */}
          <AnimatePresence>
            {showSerif && (
              <SerifDisplay
                serifs={result.character.serifs}
                rarity={result.character.rarity}
                isVisible={showSerif}
              />
            )}
          </AnimatePresence>

          {/* 2. レアリティバッジ */}
          <AnimatePresence>
            {showRarity && (
              <RarityBadge rarity={rarity} isVisible={showRarity} />
            )}
          </AnimatePresence>

          {/* 3. 名前ドカン！ */}
          <AnimatePresence>
            {showName && (
              <NameReveal
                name={result.character.name}
                rarity={result.character.rarity}
                isVisible={showName}
              />
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));
