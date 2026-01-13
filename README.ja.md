# Gacha Camera

カメラ映像上でガチャ召喚演出を発動させるWebアプリ。
日常のあらゆる瞬間をソシャゲ風の演出で彩ります。

[デモ](https://gacha-camera.vercel.app) | [English](./README.md)

## 特徴

- リアルタイムカメラ映像にガチャ演出をオーバーレイ
- SSR/SR/R/N のレアリティシステム（レアリティ別エフェクト）
- 効果音 & スムーズなアニメーション
- モバイルブラウザ対応（iOS Safari / Android Chrome）
- 前面/背面カメラ切り替え

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
2. 画面をタップ
3. ガチャ演出を楽しむ
4. キャラをゲット！

## 技術スタック

| カテゴリ | 技術 | 備考 |
|----------|------|------|
| フレームワーク | Next.js 14+ (App Router) | Vercel最適化 |
| 言語 | TypeScript | 型安全性確保 |
| スタイリング | Tailwind CSS | ユーティリティファースト |
| アニメーション | Framer Motion | 宣言的アニメーション |
| 効果音 | Howler.js | クロスブラウザ対応 |
| カメラ | MediaDevices API | 標準Web API |

## レアリティシステム

| レアリティ | 排出率 | エフェクト色 |
|------------|--------|--------------|
| SSR | 3% | 虹色 |
| SR | 12% | 金色 |
| R | 35% | 青色 |
| N | 50% | 白色 |

## プロジェクト構成

```
src/
├── app/                    # Next.js App Router
├── components/
│   ├── Camera/            # カメラコンポーネント
│   ├── Gacha/             # ガチャ演出コンポーネント
│   └── UI/                # UIコンポーネント
├── hooks/                 # カスタムフック
├── lib/                   # ユーティリティ & データ
└── types/                 # TypeScript型定義
```

## コントリビュート

コントリビュートを歓迎します！詳しくは [CONTRIBUTING.md](./CONTRIBUTING.md) をご覧ください。

### 簡単に参加できる方法

- **新キャラ追加** - `src/lib/gachaData.ts` を編集してPRを送る
- **アニメーション改善** - ガチャ演出をより良くする
- **翻訳追加** - 多言語対応のお手伝い
- **バグ報告** - Issueを作成

## 開発

```bash
# 開発サーバー起動
npm run dev

# 本番ビルド
npm run build

# リンター実行
npm run lint
```

## デプロイ

このプロジェクトは [Vercel](https://vercel.com) に最適化されています：

```bash
# Vercelにデプロイ
vercel
```

## ライセンス

[MIT](./LICENSE)

## 謝辞

- 効果音: [効果音ラボ](https://soundeffect-lab.info/)（プレースホルダー）
- モバイルガチャゲームからインスピレーション
