# XYMPOSIUM - Landing Page

Symbol ブロックチェーンの未来を形作るテクノロジーとコミュニティの祭典「XYMPOSIUM」の公式ランディングページです。

https://xymposium.io/2025/

## 技術仕様

- **単一HTMLファイル**: `index.html`
- **スタイリング**: Tailwind CSS (CDN)
- **レスポンシブデザイン**: モバイル・デスクトップ対応
- **言語**: 日本語
- **フォント**: Inter (Google Fonts)

## 特徴

- **シンプル**: 静的 HTML のみで公開可能であり、低コストで公開可能
- **シンプル**: フォームも Google Form + Google Apps Script を使用し、極力低コスト
- **シンプル**: 次年度の公開時も年度フォルダを追加して静的 HTML を加えるのみ。

## 使用方法

### 1. ローカル環境での確認

```bash
python3 -m http.server 8000 --directory public --bind 127.0.0.1
```

### 2. デプロイ

2025年度は Value Domain の [CORESERVER](https://www.coreserver.jp) の Core-X プランを使用しました。
FTP にてアクセスし、変更のあった html を差し替えるのみで公開可能です。SSL 証明書は Core Server 側でマネージド・サービスとして管理されています。

FTP の ID/PW は CORESERVER の[管理コンソール](https://cp.coreserver.jp)より確認出来ます。

- [FTPパスワードの変更](https://help.coreserver.jp/manual/ftp-pass/)
- [FTP クライアント例 FileZilla](https://filezilla-project.org/download.php?platform=macos-arm64)

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
