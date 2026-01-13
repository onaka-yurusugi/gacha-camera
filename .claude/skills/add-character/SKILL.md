---
name: add-character
description: ガチャに新しいキャラクターを追加します。キャラクター追加、ガチャプール編集、新規キャラ登録時に使用してください。
---

# キャラクター追加

## 指示

1. [src/lib/gachaData.ts](src/lib/gachaData.ts) を開く
2. `GACHA_CHARACTERS` 配列に新しいキャラクターを追加
3. 以下の形式で追加:

```typescript
{
  id: "unique-id",
  name: "キャラクター名",
  rarity: "SSR" | "SR" | "R" | "N",
  serif: "キャラクターのセリフ",
}
```

## レアリティの確率

- SSR: 3%
- SR: 12%
- R: 35%
- N: 50%

## 注意点

- `id` は一意である必要がある
- `rarity` は `Rarity` 型に準拠すること
- セリフはキャラクターの性格を反映させること
