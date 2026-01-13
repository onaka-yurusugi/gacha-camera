# Contributing to Gacha Camera

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

[日本語版](#日本語)

## Ways to Contribute

### 1. Adding New Characters (Easiest!)

The simplest way to contribute is by adding new characters to the gacha pool.

1. Fork this repository
2. Edit `src/lib/gachaData.ts`
3. Add your character following this format:

```typescript
{
  id: 'unique-id',        // Unique identifier (lowercase, hyphenated)
  name: 'キャラ名',        // Character name
  rarity: 'SR',           // N, R, SR, or SSR
  serif: 'セリフ',         // Character's catchphrase
  description: '説明',     // Optional description
}
```

4. Submit a Pull Request with:
   - Character name
   - Rarity level
   - Serif (catchphrase)
   - Why this character is fun/interesting

### 2. Improving Animations

If you're skilled with animations, help us make the gacha effects more exciting!

- Rainbow effects for SSR
- Gold shimmer for SR
- Particle effects
- Transition animations

### 3. Bug Fixes

Found a bug? Please:

1. Check if an issue already exists
2. If not, create a new issue with:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Browser/device info
3. If you can fix it, submit a PR referencing the issue

### 4. New Features

Want to add a feature?

1. Open an issue first to discuss
2. Wait for feedback from maintainers
3. Fork and implement
4. Submit a PR

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/gacha-camera.git
cd gacha-camera

# Install dependencies
npm install

# Start development server
npm run dev
```

## Pull Request Process

1. Create a branch from `main`:
   - `feature/your-feature-name` for new features
   - `fix/bug-description` for bug fixes
   - `docs/what-you-changed` for documentation
   - `chore/task-name` for maintenance

2. Make your changes

3. Test your changes:
   ```bash
   npm run build
   npm run lint
   ```

4. Commit with a clear message:
   - `feat: add new SSR character`
   - `fix: camera not working on iOS`
   - `docs: update README`
   - `chore: update dependencies`

5. Push to your fork and create a PR

6. Fill out the PR template

## Code Style

- Use TypeScript
- Follow existing code patterns
- Use meaningful variable names
- Add comments for complex logic

## Questions?

Feel free to open an issue for any questions!

---

# 日本語

## コントリビュートの方法

### 1. 新キャラ追加（一番簡単！）

最も簡単なコントリビュート方法は、新しいキャラクターを追加することです。

1. このリポジトリをフォーク
2. `src/lib/gachaData.ts` を編集
3. 以下の形式でキャラを追加：

```typescript
{
  id: 'unique-id',        // 一意のID（小文字、ハイフン区切り）
  name: 'キャラ名',        // キャラクター名
  rarity: 'SR',           // N, R, SR, SSR のいずれか
  serif: 'セリフ',         // キャラのセリフ
  description: '説明',     // 説明（任意）
}
```

4. Pull Requestを作成（以下を記載）：
   - キャラクター名
   - レアリティ
   - セリフ
   - このキャラが面白い理由

### 2. アニメーション改善

アニメーションが得意な方は、ガチャ演出をより魅力的にしてください！

- SSR用の虹エフェクト
- SR用の金色キラキラ
- パーティクルエフェクト
- トランジションアニメーション

### 3. バグ修正

バグを見つけたら：

1. 既存のIssueがないか確認
2. なければ新しいIssueを作成（以下を記載）：
   - 再現手順
   - 期待する動作
   - 実際の動作
   - ブラウザ/デバイス情報
3. 修正できる場合はIssueを参照してPRを送信

### 4. 新機能追加

機能を追加したい場合：

1. まずIssueを作成して相談
2. メンテナーからのフィードバックを待つ
3. フォークして実装
4. PRを送信

## 開発環境セットアップ

```bash
# フォークをクローン
git clone https://github.com/YOUR_USERNAME/gacha-camera.git
cd gacha-camera

# 依存関係をインストール
npm install

# 開発サーバー起動
npm run dev
```

## Pull Requestの流れ

1. `main` からブランチを作成：
   - `feature/機能名` - 新機能
   - `fix/バグの説明` - バグ修正
   - `docs/変更内容` - ドキュメント
   - `chore/タスク名` - メンテナンス

2. 変更を加える

3. テスト：
   ```bash
   npm run build
   npm run lint
   ```

4. 明確なコミットメッセージ：
   - `feat: 新SSRキャラ追加`
   - `fix: iOSでカメラが動かない問題を修正`
   - `docs: READMEを更新`
   - `chore: 依存関係を更新`

5. フォークにプッシュしてPRを作成

6. PRテンプレートに記入

## コードスタイル

- TypeScriptを使用
- 既存のコードパターンに従う
- 意味のある変数名を使用
- 複雑なロジックにはコメントを追加

## 質問がある場合

お気軽にIssueを作成してください！
