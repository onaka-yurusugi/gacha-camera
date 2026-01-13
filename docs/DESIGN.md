# ガチャ演出ARアプリ 設計書

## 1. プロジェクト概要

### コンセプト
カメラ映像上でガチャ召喚演出を発動させるWebアプリ。
日常のあらゆる瞬間をソシャゲ風の演出で彩る。

### ターゲット
- スマートフォンブラウザ（iOS Safari / Android Chrome）
- PCブラウザ（デモ用）

### デプロイ先
- Vercel

---

## 2. 技術スタック

| カテゴリ | 技術 | 備考 |
|----------|------|------|
| フレームワーク | Next.js 14+ (App Router) | Vercel最適化 |
| 言語 | TypeScript | 型安全性確保 |
| スタイリング | Tailwind CSS | ユーティリティファースト |
| アニメーション | Framer Motion | React向け宣言的アニメーション |
| 効果音 | Howler.js | クロスブラウザ対応 |
| カメラ | navigator.mediaDevices API | 標準Web API |

---

## 3. ディレクトリ構成

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx           # メイン画面
│   └── globals.css
├── components/
│   ├── Camera/
│   │   └── CameraView.tsx       # カメラ映像表示
│   ├── Gacha/
│   │   ├── GachaOverlay.tsx     # ガチャ演出全体を制御
│   │   ├── RainbowEffect.tsx    # 虹演出
│   │   ├── RarityBadge.tsx      # レアリティ表示（SSR等）
│   │   ├── CharacterCutin.tsx   # キャラカットイン
│   │   └── SerifDisplay.tsx     # セリフ表示
│   └── UI/
│       └── TapToSummon.tsx      # タップ誘導UI
├── hooks/
│   ├── useCamera.ts             # カメラ制御
│   └── useGacha.ts              # ガチャロジック
├── lib/
│   ├── sounds.ts                # 効果音管理
│   └── gachaData.ts             # キャラ/セリフデータ
├── types/
│   └── gacha.ts                 # 型定義
└── public/
    ├── sounds/
    │   ├── gacha-roll.mp3       # ガチャ回転音
    │   ├── ssr-get.mp3          # SSR獲得音
    │   └── cutin.mp3            # カットイン音
    └── images/
        └── effects/             # エフェクト画像
```

---

## 4. 機能仕様

### 4.1 MVP（Phase 1）

#### カメラ表示
- 画面全体にカメラ映像を表示
- 前面/背面カメラ切り替えボタン

#### ガチャ発動トリガー
- 画面タップで発動

#### 演出シーケンス
```
[タップ]
  ↓ 0ms
[画面フラッシュ（白）]
  ↓ 100ms
[ガチャ回転SE再生]
  ↓ 500ms
[虹エフェクト（SSR時）/ 金エフェクト（SR時）/ 青エフェクト（R時）]
  ↓ 1000ms
[レアリティバッジ表示] 例: 🌈 SSR 🌈
  ↓ 200ms
[キャラ名カットイン] 例: 【オナカユル】
  ↓ 300ms
[専用セリフ表示] 例: 「すまん…限界や…」
  ↓ 2000ms
[フェードアウト → 待機状態に戻る]
```

#### レアリティ判定
| レアリティ | 排出率 | エフェクト色 |
|------------|--------|--------------|
| SSR | 3% | 虹色 |
| SR | 12% | 金色 |
| R | 35% | 青色 |
| N | 50% | 白色 |

---

### 4.2 将来拡張（Phase 2以降）

- 人物検出による自動発動（TensorFlow.js）
- カスタムキャラ登録機能
- ガチャ履歴表示
- SNSシェア機能（演出のスクリーンショット）

---

## 5. 画面構成

### メイン画面（唯一の画面）

```
┌─────────────────────────────┐
│ [カメラ切替ボタン]    [音ON/OFF] │  ← ヘッダー（半透明）
│                             │
│                             │
│      （カメラ映像）           │
│                             │
│                             │
│     「タップで召喚」          │  ← 誘導テキスト（待機時）
│                             │
└─────────────────────────────┘
```

### ガチャ演出中

```
┌─────────────────────────────┐
│                             │
│    ✨🌈✨🌈✨🌈✨🌈✨         │  ← 虹エフェクト
│                             │
│  ╭━━━━━━━━━━━━━━━━━━━╮      │
│  │      🌈 SSR 🌈       │      │  ← レアリティバッジ
│  │    【オナカユル】     │      │  ← キャラ名
│  ╰━━━━━━━━━━━━━━━━━━━╯      │
│                             │
│    「すまん…限界や…」        │  ← セリフ
│                             │
└─────────────────────────────┘
```

---

## 6. データ構造

### types/gacha.ts

```typescript
type Rarity = 'N' | 'R' | 'SR' | 'SSR';

interface GachaCharacter {
  id: string;
  name: string;           // 例: "オナカユル"
  rarity: Rarity;
  serif: string;          // 例: "すまん…限界や…"
  description?: string;   // 例: "排出率は低いが排泄率は高い男"
}

interface GachaResult {
  character: GachaCharacter;
  timestamp: Date;
}
```

### lib/gachaData.ts（初期データ例）

```typescript
const characters: GachaCharacter[] = [
  // SSR
  {
    id: 'onakayuru',
    name: 'オナカユル',
    rarity: 'SSR',
    serif: 'すまん…限界や…',
    description: '排出率は低いが排泄率は高い男'
  },
  {
    id: 'nemui',
    name: 'ネムスギル',
    rarity: 'SSR',
    serif: '5分だけ…5分だけ…',
    description: '二度寝の覇王'
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
  // R
  {
    id: 'normal',
    name: 'フツウノヒト',
    rarity: 'R',
    serif: 'どうも',
  },
  // N
  {
    id: 'mob',
    name: 'モブ',
    rarity: 'N',
    serif: '...',
  },
];
```

---

## 7. 主要コンポーネント仕様

### CameraView

| Props | 型 | 説明 |
|-------|-----|------|
| facingMode | 'user' \| 'environment' | 前面/背面カメラ |
| onReady | () => void | カメラ準備完了時 |

### GachaOverlay

| Props | 型 | 説明 |
|-------|-----|------|
| isActive | boolean | 演出中かどうか |
| result | GachaResult \| null | ガチャ結果 |
| onComplete | () => void | 演出完了時 |

### useGacha（カスタムフック）

```typescript
interface UseGachaReturn {
  result: GachaResult | null;
  isPlaying: boolean;
  pull: () => void;      // ガチャを引く
  reset: () => void;     // 状態リセット
}
```

---

## 8. 効果音仕様

| ファイル名 | タイミング | 長さ目安 |
|------------|------------|----------|
| gacha-roll.mp3 | タップ直後 | 1〜2秒 |
| ssr-get.mp3 | SSR確定時 | 1秒 |
| sr-get.mp3 | SR確定時 | 0.5秒 |
| cutin.mp3 | カットイン表示時 | 0.3秒 |

※ フリー素材サイトから調達（例: 効果音ラボ、OtoLogic）

---

## 9. 実装フェーズ

### Phase 1: MVP（目標: 1日）

1. プロジェクトセットアップ（Next.js + Tailwind + Framer Motion）
2. カメラ表示実装
3. ガチャロジック実装
4. 基本演出（レアリティ表示 + セリフ）
5. 効果音追加
6. Vercelデプロイ

### Phase 2: 演出強化（目標: +1日）

1. 虹/金/青エフェクトアニメーション
2. カットイン演出
3. レアリティ別演出分岐
4. スマホ最適化（タッチ操作、画面固定）

### Phase 3: 機能拡張（将来）

1. 人物検出トリガー
2. カスタムキャラ登録
3. SNSシェア

---

## 10. 開発コマンド

```bash
# プロジェクト作成
npx create-next-app@latest gacha-ar-app --typescript --tailwind --app --src-dir

# 依存関係追加
npm install framer-motion howler
npm install -D @types/howler

# 開発サーバー起動
npm run dev

# ビルド & デプロイ
vercel
```

---

## 11. 注意事項

### カメラ権限
- HTTPSが必須（localhost除く）
- 権限拒否時のフォールバック表示を実装する

### iOS Safari対応
- 音声再生は必ずユーザーインタラクション後に行う
- 初回タップで `AudioContext` を初期化

### パフォーマンス
- 動画/エフェクトは軽量に（60fps維持）
- 不要な再レンダリング抑制

---

## 12. OSS運用

### リポジトリ名（案）

```
gacha-camera
```

シンプルで覚えやすく、何のアプリか想像しやすい。

### ライセンス

MIT License（自由に使ってもらいやすい）

### リポジトリ構成

```
gacha-camera/
├── src/                    # ソースコード
├── public/                 # 静的ファイル
├── docs/                   # ドキュメント
│   └── DESIGN.md          # この設計書
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   └── pull_request_template.md
├── README.md
├── README.ja.md            # 日本語README
├── CONTRIBUTING.md
├── LICENSE
├── package.json
└── ...
```

### README.md 構成

```markdown
# 🎰 Gacha Camera

Turn your camera into a gacha game.

[Demo](https://gacha-camera.vercel.app) | [日本語](./README.ja.md)

## ✨ Features
- Real-time camera feed with gacha overlay
- SSR/SR/R/N rarity system
- Sound effects & animations
- Works on mobile browsers

## 🚀 Quick Start
git clone ...
npm install
npm run dev

## 🎮 How to Use
1. Allow camera access
2. Tap the screen
3. Get your character!

## 🛠 Tech Stack
- Next.js 14
- Framer Motion
- Howler.js
- Tailwind CSS

## 📝 License
MIT
```

### Issue ラベル

| ラベル | 用途 |
|--------|------|
| `good first issue` | 初心者向け |
| `help wanted` | 助けてほしい |
| `enhancement` | 機能追加 |
| `bug` | バグ |
| `documentation` | ドキュメント |
| `character` | キャラ追加提案 |

### コントリビューション歓迎ポイント

1. **新キャラ追加** → `gachaData.ts` にPR（一番参加しやすい）
2. **エフェクト改善** → アニメーション得意な人向け
3. **多言語対応** → i18n
4. **アクセシビリティ** → a11y対応

### CONTRIBUTING.md 概要

```markdown
# Contributing

## キャラ追加の場合
1. Fork & Clone
2. `src/lib/gachaData.ts` にキャラ追加
3. PR作成（キャラ名・セリフ・レアリティを明記）

## 開発の場合
1. Issue で相談
2. Fork & Clone
3. ブランチ作成: `feature/xxx` or `fix/xxx`
4. PR作成

## コミットメッセージ
- `feat:` 機能追加
- `fix:` バグ修正
- `docs:` ドキュメント
- `chore:` 雑務
```

---

## 13. ポートフォリオ向けアピールポイント

### 技術面

- **モダンなスタック**: Next.js 14 App Router + TypeScript
- **Web API活用**: MediaDevices API（カメラ）、Web Audio API（音声）
- **アニメーション実装**: Framer Motionによる宣言的アニメーション
- **レスポンシブ対応**: モバイルファースト設計
- **PWA対応可能**: 将来的にオフライン対応も

### プロダクト面

- **オリジナルの企画**: 既存サービスのクローンではない
- **遊び心のあるUX**: ガチャ演出という馴染みのある体験
- **SNS拡散性**: 思わずシェアしたくなる設計

### OSS運営面

- **ドキュメント整備**: README、設計書、コントリビューションガイド
- **Issue/PR管理**: テンプレート整備
- **コミュニティ設計**: 初心者でも参加しやすいキャラ追加PR

---

## 14. 参考リンク

- [Next.js App Router ドキュメント](https://nextjs.org/docs/app)
- [Framer Motion](https://www.framer.com/motion/)
- [Howler.js](https://howlerjs.com/)
- [MediaDevices API](https://developer.mozilla.org/ja/docs/Web/API/MediaDevices/getUserMedia)
