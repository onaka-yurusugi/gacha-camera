import { GachaCharacter } from '@/types/gacha';

export const characters: GachaCharacter[] = [
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
];

export const getCharactersByRarity = (
  rarity: GachaCharacter['rarity']
): GachaCharacter[] => {
  return characters.filter((c) => c.rarity === rarity);
};
