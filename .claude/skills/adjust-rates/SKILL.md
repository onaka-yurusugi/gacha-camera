---
name: adjust-rates
description: ガチャのレアリティ確率を調整します。確率変更、排出率調整、ガチャ確率の設定時に使用してください。
---

# レアリティ確率調整

## 指示

1. [src/types/gacha.ts](src/types/gacha.ts) を開く
2. `RARITY_CONFIG` オブジェクトの `rate` プロパティを変更

## 現在の設定

```typescript
export const RARITY_CONFIG = {
  SSR: { rate: 0.03, color: "#FFD700", label: "SSR" },
  SR: { rate: 0.12, color: "#C0C0C0", label: "SR" },
  R: { rate: 0.35, color: "#CD7F32", label: "R" },
  N: { rate: 0.50, color: "#808080", label: "N" },
}
```

## 重要な注意点

- **全レアリティの確率の合計は必ず 1.0（100%）になること**
- 変更後は `useGacha` フックのロジックが正しく動作するか確認すること
- 確率は 0 から 1 の間の小数で指定する
