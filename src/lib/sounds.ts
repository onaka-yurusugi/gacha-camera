import { Howl } from 'howler';
import { Rarity } from '@/types/gacha';

type SoundKey = 'gachaRoll' | 'ssrGet' | 'srGet' | 'rGet' | 'nGet' | 'cutin' | 'serifAppear';

interface SoundManager {
  sounds: Map<SoundKey, Howl>;
  isInitialized: boolean;
  isMuted: boolean;
  init: () => void;
  play: (key: SoundKey) => void;
  playForRarity: (rarity: Rarity) => void;
  setMute: (muted: boolean) => void;
  toggleMute: () => boolean;
}

const SOUND_PATHS: Record<SoundKey, string> = {
  gachaRoll: '/sounds/gacha-roll.mp3',
  ssrGet: '/sounds/ssr-get.mp3',
  srGet: '/sounds/sr-get.mp3',
  rGet: '/sounds/r-get.mp3',
  nGet: '/sounds/n-get.mp3',
  cutin: '/sounds/cutin.mp3',
  serifAppear: '/sounds/cutin.mp3', // セリフ登場音（cutinを再利用、後で専用音に変更可）
};

const RARITY_SOUND_MAP: Record<Rarity, SoundKey> = {
  SSR: 'ssrGet',
  SR: 'srGet',
  R: 'rGet',
  N: 'nGet',
};

export const soundManager: SoundManager = {
  sounds: new Map(),
  isInitialized: false,
  isMuted: false,

  init() {
    if (this.isInitialized) return;

    Object.entries(SOUND_PATHS).forEach(([key, path]) => {
      const volume = key === 'gachaRoll' ? 0.5 : key === 'serifAppear' ? 0.4 : 0.7;
      this.sounds.set(key as SoundKey, new Howl({
        src: [path],
        preload: true,
        volume,
      }));
    });

    this.isInitialized = true;
  },

  play(key: SoundKey) {
    if (this.isMuted) return;

    const sound = this.sounds.get(key);
    if (sound) {
      sound.play();
    }
  },

  playForRarity(rarity: Rarity) {
    const soundKey = RARITY_SOUND_MAP[rarity];
    this.play(soundKey);
  },

  setMute(muted: boolean) {
    this.isMuted = muted;
    this.sounds.forEach((sound) => {
      sound.mute(muted);
    });
  },

  toggleMute() {
    this.setMute(!this.isMuted);
    return this.isMuted;
  },
};
