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
import { analyzeImageForGacha, captureImageDataUrl } from '@/lib/aiAnalysis';

interface PullOptions {
  useCustom?: boolean;
  customSettings?: CustomGachaSettings;
  useAI?: boolean;
  videoElement?: HTMLVideoElement | null;
}

interface UseGachaReturn {
  result: GachaResult | null;
  isPlaying: boolean;
  isAnalyzing: boolean;
  pull: (options?: PullOptions) => Promise<void>;
  reset: () => void;
  error: string | null;
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
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pull = useCallback(async (options?: PullOptions) => {
    if (isPlaying) return;

    setIsPlaying(true);
    setError(null);

    try {
      let character: GachaCharacter;

      if (options?.useAI && options.videoElement) {
        // AIモード: 画像を分析してキャラクターを生成
        setIsAnalyzing(true);
        try {
          const imageDataUrl = captureImageDataUrl(options.videoElement);
          const aiResult = await analyzeImageForGacha(imageDataUrl);

          character = {
            id: 'ai-generated',
            name: aiResult.name,
            rarity: aiResult.rarity,
            serifs: aiResult.serifs,
          };
        } catch (aiError) {
          console.error('AI analysis failed:', aiError);
          setError(aiError instanceof Error ? aiError.message : 'AI分析に失敗しました');
          // AIが失敗した場合はランダムモードにフォールバック
          const rarity = determineRarity();
          character = selectCharacter(rarity);
        } finally {
          setIsAnalyzing(false);
        }
      } else if (options?.useCustom && options.customSettings) {
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
    } catch (err) {
      console.error('Gacha pull error:', err);
      setError(err instanceof Error ? err.message : 'ガチャの実行に失敗しました');
      setIsPlaying(false);
    }
  }, [isPlaying]);

  const reset = useCallback(() => {
    setResult(null);
    setIsPlaying(false);
    setIsAnalyzing(false);
    setError(null);
  }, []);

  return {
    result,
    isPlaying,
    isAnalyzing,
    pull,
    reset,
    error,
  };
};
