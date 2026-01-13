'use client';

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import {
  GachaSettings,
  GachaMode,
  CustomGachaSettings,
  DEFAULT_GACHA_SETTINGS,
  Rarity,
} from '@/types/gacha';

const STORAGE_KEY = 'gacha-camera-settings';

// LocalStorageから設定を読み込む関数
const getStoredSettings = (): GachaSettings => {
  if (typeof window === 'undefined') return DEFAULT_GACHA_SETTINGS;

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return DEFAULT_GACHA_SETTINGS;

  try {
    const parsed = JSON.parse(stored) as GachaSettings;
    // バリデーション: 必要なプロパティが存在するか確認
    if (
      parsed.mode &&
      parsed.customSettings &&
      typeof parsed.customSettings.name === 'string' &&
      Array.isArray(parsed.customSettings.serifs) &&
      parsed.customSettings.rarity
    ) {
      return parsed;
    }
  } catch {
    // パース失敗時はデフォルト値を使用
  }
  return DEFAULT_GACHA_SETTINGS;
};

// 初期値を取得する関数（useState用）
const getInitialSettings = (): GachaSettings => {
  // サーバーサイドではデフォルト値を返す
  if (typeof window === 'undefined') return DEFAULT_GACHA_SETTINGS;
  return getStoredSettings();
};

interface UseGachaSettingsReturn {
  settings: GachaSettings;
  setMode: (mode: GachaMode) => void;
  updateCustomField: <K extends keyof CustomGachaSettings>(
    field: K,
    value: CustomGachaSettings[K]
  ) => void;
  setRarity: (rarity: Rarity) => void;
  setName: (name: string) => void;
  setSerifs: (serifs: string[]) => void;
  isCustomMode: boolean;
  isValidCustomSettings: boolean;
}

export const useGachaSettings = (): UseGachaSettingsReturn => {
  const [settings, setSettings] = useState<GachaSettings>(getInitialSettings);

  // Hydrationをトラッキング（useSyncExternalStoreパターン）
  const isHydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  // LocalStorageへ保存
  useEffect(() => {
    if (!isHydrated || typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings, isHydrated]);

  const setMode = useCallback((mode: GachaMode) => {
    setSettings((prev) => ({ ...prev, mode }));
  }, []);

  const updateCustomField = useCallback(
    <K extends keyof CustomGachaSettings>(field: K, value: CustomGachaSettings[K]) => {
      setSettings((prev) => ({
        ...prev,
        customSettings: { ...prev.customSettings, [field]: value },
      }));
    },
    []
  );

  // 便利なセッター
  const setRarity = useCallback(
    (rarity: Rarity) => updateCustomField('rarity', rarity),
    [updateCustomField]
  );

  const setName = useCallback(
    (name: string) => updateCustomField('name', name),
    [updateCustomField]
  );

  const setSerifs = useCallback(
    (serifs: string[]) => updateCustomField('serifs', serifs),
    [updateCustomField]
  );

  // カスタム設定のバリデーション（名前とセリフが必須）
  const isValidCustomSettings =
    settings.customSettings.name.trim() !== '' &&
    settings.customSettings.serifs.some((s) => s.trim() !== '');

  return {
    settings,
    setMode,
    updateCustomField,
    setRarity,
    setName,
    setSerifs,
    isCustomMode: settings.mode === 'custom',
    isValidCustomSettings,
  };
};
