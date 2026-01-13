export type Rarity = 'N' | 'R' | 'SR' | 'SSR';

export interface GachaCharacter {
  id: string;
  name: string;
  rarity: Rarity;
  serif: string;
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
  serif: string;
}

export interface GachaSettings {
  mode: GachaMode;
  customSettings: CustomGachaSettings;
}

export const DEFAULT_CUSTOM_SETTINGS: CustomGachaSettings = {
  rarity: 'SSR',
  name: '',
  serif: '',
};

export const DEFAULT_GACHA_SETTINGS: GachaSettings = {
  mode: 'random',
  customSettings: DEFAULT_CUSTOM_SETTINGS,
};

export const RARITY_CONFIG: Record<Rarity, RarityConfig> = {
  SSR: {
    rate: 0.03,
    color: 'from-purple-500 via-pink-500 via-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500',
    glowColor: 'shadow-[0_0_60px_rgba(255,255,255,0.8)]',
    label: 'SSR',
  },
  SR: {
    rate: 0.12,
    color: 'from-yellow-400 via-amber-500 to-yellow-400',
    glowColor: 'shadow-[0_0_40px_rgba(255,215,0,0.6)]',
    label: 'SR',
  },
  R: {
    rate: 0.35,
    color: 'from-blue-400 via-cyan-500 to-blue-400',
    glowColor: 'shadow-[0_0_30px_rgba(59,130,246,0.5)]',
    label: 'R',
  },
  N: {
    rate: 0.50,
    color: 'from-gray-300 via-white to-gray-300',
    glowColor: 'shadow-[0_0_20px_rgba(255,255,255,0.3)]',
    label: 'N',
  },
};
