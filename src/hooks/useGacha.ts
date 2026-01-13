'use client';

import { useCallback, useState } from 'react';
import { GachaCharacter, GachaResult, Rarity, RARITY_CONFIG } from '@/types/gacha';
import { characters, getCharactersByRarity } from '@/lib/gachaData';

interface UseGachaReturn {
  result: GachaResult | null;
  isPlaying: boolean;
  pull: () => void;
  reset: () => void;
}

const determineRarity = (): Rarity => {
  const rand = Math.random();
  let cumulative = 0;

  const rarities: Rarity[] = ['SSR', 'SR', 'R', 'N'];
  for (const rarity of rarities) {
    cumulative += RARITY_CONFIG[rarity].rate;
    if (rand < cumulative) {
      return rarity;
    }
  }

  return 'N';
};

const selectCharacter = (rarity: Rarity): GachaCharacter => {
  const pool = getCharactersByRarity(rarity);

  if (pool.length === 0) {
    return characters[0];
  }

  const index = Math.floor(Math.random() * pool.length);
  return pool[index];
};

export const useGacha = (): UseGachaReturn => {
  const [result, setResult] = useState<GachaResult | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const pull = useCallback(() => {
    if (isPlaying) return;

    setIsPlaying(true);

    const rarity = determineRarity();
    const character = selectCharacter(rarity);

    setResult({
      character,
      timestamp: new Date(),
    });
  }, [isPlaying]);

  const reset = useCallback(() => {
    setResult(null);
    setIsPlaying(false);
  }, []);

  return {
    result,
    isPlaying,
    pull,
    reset,
  };
};
