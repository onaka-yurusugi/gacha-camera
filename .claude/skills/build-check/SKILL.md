---
name: build-check
description: プロジェクトをビルドして型エラーを確認します。ビルドチェック、本番ビルド、デプロイ前確認時に使用してください。
allowed-tools:
  - Bash
---

# ビルドチェック

## 指示

以下のコマンドを順番に実行:

```bash
# ESLint チェック
npm run lint

# 本番ビルド
npm run build
```

## エラー対応

### 型エラーの場合

1. エラーメッセージを確認
2. 該当ファイルを開いて修正
3. 再度ビルドを実行

### Lint エラーの場合

1. `npm run lint` の出力を確認
2. 自動修正可能な場合は `npm run lint -- --fix` を試す
3. 手動修正が必要な場合は該当箇所を修正

## 成功基準

- `npm run lint` がエラーなしで完了
- `npm run build` が成功し、`.next` ディレクトリが生成される
