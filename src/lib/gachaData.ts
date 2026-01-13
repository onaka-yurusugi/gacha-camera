import { GachaCharacter } from '@/types/gacha';

export const characters: GachaCharacter[] = [
  // SSR
  {
    id: 'onakayuru',
    name: 'オナカユル',
    rarity: 'SSR',
    serifs: ['腹痛との戦いに…', '終わりはない…', 'すまん…限界や…'],
    description: '排出率は低いが排泄率は高い男',
  },
  {
    id: 'nemui',
    name: 'ネムスギル',
    rarity: 'SSR',
    serifs: ['あと5分…', 'いや、10分…', '5分だけ…5分だけ…'],
    description: '二度寝の覇王',
  },
  {
    id: 'yarukinai',
    name: 'ヤルキナイ',
    rarity: 'SSR',
    serifs: ['今日はもう無理…', 'でも大丈夫…', '明日から本気出す'],
    description: '永遠の明日を生きる者',
  },
  // SR
  {
    id: 'nemusou',
    name: 'ネムソウ',
    rarity: 'SR',
    serifs: ['ふぁ〜…', 'おはよ…'],
  },
  {
    id: 'tsukareta',
    name: 'ツカレタ',
    rarity: 'SR',
    serifs: ['今日もう…', '関節3回鳴った'],
  },
  {
    id: 'harahetta',
    name: 'ハラヘッタ',
    rarity: 'SR',
    serifs: ['お腹すいた…', 'なんか食べたい…'],
  },
  {
    id: 'mendokusai',
    name: 'メンドクサイ',
    rarity: 'SR',
    serifs: ['あー…', 'まあ…うん…'],
  },
  // R
  {
    id: 'normal',
    name: 'フツウノヒト',
    rarity: 'R',
    serifs: ['どうも'],
  },
  {
    id: 'salaryman',
    name: 'シャカイジン',
    rarity: 'R',
    serifs: ['お疲れ様です'],
  },
  {
    id: 'gakusei',
    name: 'ガクセイ',
    rarity: 'R',
    serifs: ['レポートやばい'],
  },
  {
    id: 'shufuA',
    name: 'シュフA',
    rarity: 'R',
    serifs: ['特売日だわ'],
  },
  // N
  {
    id: 'mob',
    name: 'モブ',
    rarity: 'N',
    serifs: ['...'],
  },
  {
    id: 'mobA',
    name: 'モブA',
    rarity: 'N',
    serifs: ['あ、どうも'],
  },
  {
    id: 'mobB',
    name: 'モブB',
    rarity: 'N',
    serifs: ['うん'],
  },
  {
    id: 'mobC',
    name: 'モブC',
    rarity: 'N',
    serifs: ['はい'],
  },
];

export const getCharactersByRarity = (
  rarity: GachaCharacter['rarity']
): GachaCharacter[] => {
  return characters.filter((c) => c.rarity === rarity);
};
