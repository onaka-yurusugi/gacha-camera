import { GachaCharacter } from '@/types/gacha';

export const characters: GachaCharacter[] = [
  // SSR
  {
    id: 'onakayuru',
    name: 'オナカユル',
    rarity: 'SSR',
    serif: 'すまん…限界や…',
    description: '排出率は低いが排泄率は高い男',
  },
  {
    id: 'nemui',
    name: 'ネムスギル',
    rarity: 'SSR',
    serif: '5分だけ…5分だけ…',
    description: '二度寝の覇王',
  },
  {
    id: 'yarukinai',
    name: 'ヤルキナイ',
    rarity: 'SSR',
    serif: '明日から本気出す',
    description: '永遠の明日を生きる者',
  },
  // SR
  {
    id: 'nemusou',
    name: 'ネムソウ',
    rarity: 'SR',
    serif: 'ふぁ〜…おはよ…',
  },
  {
    id: 'tsukareta',
    name: 'ツカレタ',
    rarity: 'SR',
    serif: '今日もう関節3回鳴った',
  },
  {
    id: 'harahetta',
    name: 'ハラヘッタ',
    rarity: 'SR',
    serif: 'なんか食べたい…',
  },
  {
    id: 'mendokusai',
    name: 'メンドクサイ',
    rarity: 'SR',
    serif: 'あー…まあ…うん…',
  },
  // R
  {
    id: 'normal',
    name: 'フツウノヒト',
    rarity: 'R',
    serif: 'どうも',
  },
  {
    id: 'salaryman',
    name: 'シャカイジン',
    rarity: 'R',
    serif: 'お疲れ様です',
  },
  {
    id: 'gakusei',
    name: 'ガクセイ',
    rarity: 'R',
    serif: 'レポートやばい',
  },
  {
    id: 'shufuA',
    name: 'シュフA',
    rarity: 'R',
    serif: '特売日だわ',
  },
  // N
  {
    id: 'mob',
    name: 'モブ',
    rarity: 'N',
    serif: '...',
  },
  {
    id: 'mobA',
    name: 'モブA',
    rarity: 'N',
    serif: 'あ、どうも',
  },
  {
    id: 'mobB',
    name: 'モブB',
    rarity: 'N',
    serif: 'うん',
  },
  {
    id: 'mobC',
    name: 'モブC',
    rarity: 'N',
    serif: 'はい',
  },
];

export const getCharactersByRarity = (
  rarity: GachaCharacter['rarity']
): GachaCharacter[] => {
  return characters.filter((c) => c.rarity === rarity);
};
