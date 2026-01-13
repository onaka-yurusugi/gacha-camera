export type Rarity = 'N' | 'R' | 'SR' | 'SSR';

// Display mode for gacha result components
export type DisplayMode = 'cutin' | 'result';

export interface GachaCharacter {
  id: string;
  name: string;
  rarity: Rarity;
  serifs: string[];  // 複数セリフ対応（順番に表示される）
  description?: string;
}

export interface GachaResult {
  character: GachaCharacter;
  timestamp: Date;
}

export interface RarityConfig {
  rate: number;
  color: string;
  glowColor: string;
  label: string;
}

// Gacha Mode Types
export type GachaMode = 'random' | 'custom';

export interface CustomGachaSettings {
  rarity: Rarity;
  name: string;
  serifs: string[];
}

export interface GachaSettings {
  mode: GachaMode;
  customSettings: CustomGachaSettings;
}

export const DEFAULT_CUSTOM_SETTINGS: CustomGachaSettings = {
  rarity: 'SSR',
  name: '',
  serifs: [''],
};

export const DEFAULT_GACHA_SETTINGS: GachaSettings = {
  mode: 'random',
  customSettings: DEFAULT_CUSTOM_SETTINGS,
};

export const RARITY_CONFIG: Record<Rarity, RarityConfig> = {
  SSR: {
    rate: 1.0,
    color: 'from-purple-500 via-pink-500 via-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500',
    glowColor: 'shadow-[0_0_60px_rgba(255,255,255,0.8)]',
    label: 'SSR',
  },
  SR: {
    rate: 0,
    color: 'from-yellow-400 via-amber-500 to-yellow-400',
    glowColor: 'shadow-[0_0_40px_rgba(255,215,0,0.6)]',
    label: 'SR',
  },
  R: {
    rate: 0,
    color: 'from-blue-400 via-cyan-500 to-blue-400',
    glowColor: 'shadow-[0_0_30px_rgba(59,130,246,0.5)]',
    label: 'R',
  },
  N: {
    rate: 0,
    color: 'from-gray-300 via-white to-gray-300',
    glowColor: 'shadow-[0_0_20px_rgba(255,255,255,0.3)]',
    label: 'N',
  },
};

// Rarity utility functions
export const getRarityEmoji = (rarity: Rarity): string => {
  const emojiMap: Record<Rarity, string> = {
    SSR: '🌈',
    SR: '✨',
    R: '💎',
    N: '⚪',
  };
  return emojiMap[rarity];
};

export const getRarityGlowColor = (rarity: Rarity): string => {
  const glowMap: Record<Rarity, string> = {
    SSR: 'rgba(255, 215, 0, 0.8)',
    SR: 'rgba(255, 200, 0, 0.6)',
    R: 'rgba(59, 130, 246, 0.6)',
    N: 'rgba(255, 255, 255, 0.4)',
  };
  return glowMap[rarity];
};

export const getRarityAccentGradient = (rarity: Rarity): string => {
  const gradientMap: Record<Rarity, string> = {
    SSR: 'from-yellow-400 via-pink-500 to-purple-500',
    SR: 'from-yellow-400 to-amber-500',
    R: 'from-blue-400 to-cyan-500',
    N: 'from-gray-400 to-gray-500',
  };
  return gradientMap[rarity];
};

export const getRarityBorderColor = (rarity: Rarity): string => {
  const borderMap: Record<Rarity, string> = {
    SSR: 'border-yellow-400',
    SR: 'border-yellow-500',
    R: 'border-blue-400',
    N: 'border-white/50',
  };
  return borderMap[rarity];
};

export const getRarityNameColor = (rarity: Rarity): string => {
  const colorMap: Record<Rarity, string> = {
    SSR: 'bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-400 bg-clip-text text-transparent',
    SR: 'text-yellow-400',
    R: 'text-blue-400',
    N: 'text-white',
  };
  return colorMap[rarity];
};
