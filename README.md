# 💣 マインスイーパー Online

React で作成されたクラシックなマインスイーパーゲームです。GitHub Pages でホスティングされています。

## 🎮 プレイ方法

[ここをクリックしてプレイ](https://rspepe.github.io/minesweeper-online/)

### ルール

- **左クリック**: セルを開く
- **右クリック**: 旗を立てる/外す
- **目標**: すべての地雷を避けて、地雷以外のすべてのセルを開く

### 難易度

- **初級**: 9x9 グリッド、10個の地雷
- **中級**: 16x16 グリッド、40個の地雷
- **上級**: 16x30 グリッド、99個の地雷

## 🚀 技術スタック

- **React 18**: UI フレームワーク
- **Vite**: ビルドツール
- **GitHub Actions**: CI/CD
- **GitHub Pages**: ホスティング

## 🛠️ ローカル開発

### 前提条件

- Node.js 20 以上
- npm

### セットアップ

```bash
# リポジトリをクローン
git clone https://github.com/rspepe/minesweeper-online.git
cd minesweeper-online

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

開発サーバーは `http://localhost:5173` で起動します。

### ビルド

```bash
# プロダクションビルド
npm run build

# ビルドをプレビュー
npm run preview
```

## 📦 デプロイ

このプロジェクトは GitHub Actions を使用して自動的にデプロイされます。

1. GitHub リポジトリの Settings > Pages に移動
2. Source を「GitHub Actions」に設定
3. `main` ブランチにプッシュすると、自動的にビルドとデプロイが実行されます

## 🎯 機能

- ✅ 3つの難易度レベル
- ✅ タイマー機能
- ✅ 地雷カウンター
- ✅ 旗の設置機能
- ✅ 自動セル展開（0の場合）
- ✅ ゲーム終了判定
- ✅ レスポンシブデザイン

## 📝 ライセンス

MIT License

## 👤 作者

rspepe

## 🙏 謝辞

クラシックなマインスイーパーゲームにインスパイアされています。
