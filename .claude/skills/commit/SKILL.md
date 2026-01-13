---
name: commit
description: 変更をコミットします。git commit、変更の保存、コミット作成時に使用してください。
allowed-tools:
  - Bash
---

# Git コミット

## 指示

1. `git status` で変更ファイルを確認
2. `git diff` で変更内容を確認
3. 適切なコミットメッセージを作成
4. `git add` と `git commit` を実行

## コミットメッセージ形式

```
<type>: <subject>

<body>
```

### Type の種類

- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメントのみの変更
- `style`: コードの意味に影響しない変更（空白、フォーマット等）
- `refactor`: バグ修正や機能追加ではないコード変更
- `test`: テストの追加・修正
- `chore`: ビルドプロセスやツールの変更

## 例

```bash
git add -A
git commit -m "feat: add new SSR character to gacha pool"
```

## 注意点

- コミット前に `npm run lint` でエラーがないか確認推奨
- 意味のある単位でコミットを分ける
- 日本語でも英語でもOK（プロジェクトの慣習に従う）
