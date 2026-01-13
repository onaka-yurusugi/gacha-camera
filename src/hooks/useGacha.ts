'use client';

import { useCallback, useState } from 'react';
import {
  GachaCharacter,
  GachaResult,
  Rarity,
  RARITY_CONFIG,
  CustomGachaSettings,
} from '@/types/gacha';
import { characters, getCharactersByRarity } from '@/lib/gachaData';

interface PullOptions {
  useCustom?: boolean;
  customSettings?: CustomGachaSettings;
}

interface UseGachaReturn {
  result: GachaResult | null;
  isPlaying: boolean;
  pull: (options?: PullOptions) => void;
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

  const pull = useCallback((options?: PullOptions) => {
    if (isPlaying) return;

    setIsPlaying(true);

    let character: GachaCharacter;

    if (options?.useCustom && options.customSettings) {
      // カスタムモード: 設定からキャラクターを生成
      character = {
        id: 'custom',
        name: options.customSettings.name,
        rarity: options.customSettings.rarity,
        serifs: options.customSettings.serifs,
      };
    } else {
      // ランダムモード: 既存ロジック
      const rarity = determineRarity();
      character = selectCharacter(rarity);
    }

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
