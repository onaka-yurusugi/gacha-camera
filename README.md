# Gacha Camera

カメラをガチャゲームに変えるWebアプリ。

[Demo](https://gacha-camera.vercel.app)

## 特徴

- リアルタイムカメラ映像にガチャ演出をオーバーレイ
- SSR/SR/R/N のレアリティシステム
- 豪華な召喚演出（扉・クリスタル破砕・虹色フラッシュ）
- 効果音＆スムーズなアニメーション
- モバイルブラウザ対応（iOS Safari / Android Chrome）
- フロント/バックカメラ切り替え

## クイックスタート

```bash
# リポジトリをクローン
git clone https://github.com/onaka-yurusugi/gacha-camera.git
cd gacha-camera

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## 使い方

1. カメラへのアクセスを許可
2. 画面のどこかをタップ
3. ガチャ演出を楽しむ
4. キャラクターをゲット！

## 技術スタック

| カテゴリ | 技術 | 備考 |
|----------|------|------|
| フレームワーク | Next.js 16 (App Router) | Vercel最適化 |
| 言語 | TypeScript | 型安全 |
| スタイリング | Tailwind CSS | ユーティリティファースト |
| アニメーション | Framer Motion | 宣言的アニメーション |
| サウンド | Howler.js | クロスブラウザ対応 |
| カメラ | MediaDevices API | 標準Web API |

## レアリティシステム

| レアリティ | 確率 | エフェクト |
|------------|------|------------|
| SSR | 3% | 虹色フラッシュ・画面揺れ・爆発エフェクト |
| SR | 12% | ゴールド |
| R | 35% | ブルー |
| N | 50% | ホワイト |

## 演出フロー

```
[待機状態]
  扉＋クリスタル表示（脈動アニメーション）
       ↓ タップ
[破砕フェーズ] 500ms
  クリスタル発光 → 破砕 → 光の粒子飛散
  ※背景エフェクト開始
       ↓
[フラッシュ] 150ms（SSR: 250ms 虹色）
       ↓
[SSR爆発] 800ms（SSRのみ）
  画面揺れ・金色オーラ・パーティクル
       ↓
[エフェクト] 600ms
  レアリティに応じた背景エフェクト
       ↓
[セリフ] 900ms × セリフ数 + 300ms
  中央にカットイン表示（SE付き）
  ※表示後も残る
       ↓
[レアリティ] 1000ms
  バッジ表示
  ※表示後も残る
       ↓
[名前ドカン！] 1200ms
  ズームイン＋震動
       ↓
[フェードアウト] 500ms
```

## プロジェクト構成

```
src/
├── app/                    # Next.js App Router
├── components/
│   ├── Camera/            # カメラコンポーネント
│   ├── Gacha/             # ガチャ演出コンポーネント
│   │   ├── GachaOverlay.tsx      # 演出オーケストレーション
│   │   ├── SummonGate.tsx        # 召喚扉＋クリスタル
│   │   ├── CrystalShatter.tsx    # クリスタル破砕
│   │   ├── SSRExplosion.tsx      # SSR専用爆発
│   │   ├── RainbowEffect.tsx     # 背景エフェクト
│   │   ├── SerifDisplay.tsx      # セリフ表示
│   │   ├── RarityBadge.tsx       # レアリティバッジ
│   │   └── NameReveal.tsx        # 名前ドカン表示
│   └── UI/                # UIコンポーネント
├── hooks/                 # カスタムフック
│   ├── useCamera.ts       # カメラ制御
│   └── useGacha.ts        # ガチャロジック
├── lib/                   # ユーティリティ
│   ├── gachaData.ts       # キャラクターデータ
│   └── sounds.ts          # サウンドマネージャー
└── types/                 # TypeScript型定義
    └── gacha.ts           # レアリティ・キャラクター型
```

## キャラクター追加方法

`src/lib/gachaData.ts` を編集：

```typescript
{
  id: 'new-character',
  name: 'キャラクター名',
  rarity: 'SSR', // SSR | SR | R | N
  serifs: [
    'セリフ1',
    'セリフ2',
  ],
}
```

## 開発コマンド

```bash
# 開発サーバー起動
npm run dev

# 本番ビルド
npm run build

# リンター実行
npm run lint
```

## デプロイ

[Vercel](https://vercel.com) に最適化されています：

```bash
vercel
```

## ライセンス

[MIT](./LICENSE)

## 謝辞

- 効果音: [効果音ラボ](https://soundeffect-lab.info/)（仮）
- モバイルガチャゲームにインスパイア
