# XYMPOSIUM 2025 - Landing Page

Symbol ブロックチェーンの未来を形作るテクノロジーとコミュニティの祭典「XYMPOSIUM 2025」の公式ランディングページです。

## イベント概要

- **開催日**: 2025年9月19日（金）
- **昼の部**: TOKYO CULTURE CULTURE (渋谷) 12:00-17:00
- **夜の部**: Crypto Lounge GOX 19:00-21:00

## 技術仕様

- **単一HTMLファイル**: `index.html`
- **スタイリング**: Tailwind CSS (CDN)
- **レスポンシブデザイン**: モバイル・デスクトップ対応
- **言語**: 日本語
- **フォント**: Inter (Google Fonts)

## 特徴

- 🎨 **モダンなデザイン**: 未来的でシンプルなSymbolブロックチェーンのイメージ
- 📱 **レスポンシブ**: モバイル・タブレット・デスクトップ対応
- ⚡ **高速読み込み**: 最適化されたCSS・JavaScript
- 🌈 **グラデーション**: Symbol ブランドカラーを使用
- 🎭 **アニメーション**: 浮遊エフェクト・スムーズスクロール
- 📝 **Google Form 対応**: 参加申し込みフォーム統合

## 使用方法

### 1. ローカル環境での確認

```bash
# HTTPサーバーを起動
python3 -m http.server 8000

# ブラウザで確認
open http://localhost:8000
```

### 2. デプロイ

単一のHTMLファイルなので、任意のWebホスティングサービスにそのままアップロードできます。

- GitHub Pages
- Netlify
- Vercel
- AWS S3 Static Website
- など

### 3. Google Form の設定

`index.html` の以下の部分を実際のGoogle FormのURLに更新してください：

```html
<!-- 現在 -->
<a href="#" class="inline-block bg-gradient-to-r from-green-500 to-green-600...">
    Google フォームで申し込む
</a>

<!-- 実際のGoogle FormのURL -->
<a href="https://forms.google.com/d/YOUR_FORM_ID" class="inline-block bg-gradient-to-r from-green-500 to-green-600...">
    Google フォームで申し込む
</a>
```

## カスタマイズ

### カラーテーマの変更

Tailwind configでSymbolブランドカラーを定義しています：

```javascript
colors: {
    'symbol-blue': '#1E40AF',
    'symbol-cyan': '#06B6D4',
    'symbol-purple': '#8B5CF6',
    'symbol-dark': '#0F172A',
}
```

### コンテンツの更新

- イベント詳細の変更
- スケジュールの追加・修正
- 会場情報の更新
- 参加費や定員の変更

## ライセンス

MIT License - 詳細は [LICENSE](LICENSE) ファイルを参照してください。