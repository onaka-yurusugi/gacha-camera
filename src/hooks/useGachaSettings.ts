'use client';

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import {
  GachaSettings,
  GachaMode,
  CustomGachaSettings,
  DEFAULT_GACHA_SETTINGS,
  DEFAULT_CUSTOM_SETTINGS,
  Rarity,
} from '@/types/gacha';

const STORAGE_KEY = 'gacha-camera-settings';
const FIRST_LAUNCH_KEY = 'gacha-camera-first-launch';

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

// 初回起動かどうかをチェック（設定画面を自動で開くために使用）
const checkIsFirstLaunch = (): boolean => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(FIRST_LAUNCH_KEY) === null;
};

// 初回起動フラグをマーク済みにする
const markFirstLaunchComplete = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(FIRST_LAUNCH_KEY, 'done');
};

// 設定がデフォルトから変更されているかチェック（名前またはセリフ）
const isSettingsCustomized = (custom: CustomGachaSettings): boolean => {
  const nameChanged = custom.name !== DEFAULT_CUSTOM_SETTINGS.name;
  const serifsChanged =
    custom.serifs.length !== DEFAULT_CUSTOM_SETTINGS.serifs.length ||
    custom.serifs.some((s, i) => s !== DEFAULT_CUSTOM_SETTINGS.serifs[i]);
  return nameChanged || serifsChanged;
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
  isFirstLaunch: boolean;
  completeFirstLaunch: () => void;
  showWelcome: boolean;
  showCoachMark: boolean;
  completeWelcome: () => void;
  completeCoachMark: () => void;
}

export const useGachaSettings = (): UseGachaSettingsReturn => {
  const [settings, setSettings] = useState<GachaSettings>(getInitialSettings);
  const [isFirstLaunch, setIsFirstLaunch] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showCoachMark, setShowCoachMark] = useState(false);

  // Hydrationをトラッキング（useSyncExternalStoreパターン）
  const isHydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  // 設定がデフォルトのままならウェルカムモーダルを表示
  useEffect(() => {
    if (!isHydrated) return;
    setIsFirstLaunch(checkIsFirstLaunch());

    if (!isSettingsCustomized(settings.customSettings)) {
      setShowWelcome(true);
    }
  }, [isHydrated, settings.customSettings]);

  // 初回起動完了をマークする関数
  const completeFirstLaunch = useCallback(() => {
    markFirstLaunchComplete();
    setIsFirstLaunch(false);
  }, []);

  // ウェルカムモーダル完了（コーチマークへ移行）
  const completeWelcome = useCallback(() => {
    setShowWelcome(false);
    // 設定がまだカスタマイズされてなければコーチマーク表示
    if (!isSettingsCustomized(settings.customSettings)) {
      setShowCoachMark(true);
    }
  }, [settings.customSettings]);

  // コーチマーク一時非表示（設定変更されるまで次回も表示）
  const completeCoachMark = useCallback(() => {
    setShowCoachMark(false);
  }, []);

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
    isFirstLaunch,
    completeFirstLaunch,
    showWelcome,
    showCoachMark,
    completeWelcome,
    completeCoachMark,
  };
};
