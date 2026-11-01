# stir-hosyu-lp

**Stir Hosyu Symbol** のランディングページ。<https://stir-hosyu.nemtus.com> で公開します。

Symbol ブロックチェーンのノード運用保守を代行するサービスの案内ページです。HTML と CSS
のみで構成されており、ビルド手順も JavaScript も依存パッケージもありません。

## 構成

```
public/
  index.html          ランディングページ本体
  404.html            404 ページ
  assets/style.css    スタイル（1ファイル）
wrangler.toml         Cloudflare Workers（Static Assets）の設定
```

ファビコンは `index.html` / `404.html` にインライン SVG（data URI）で埋め込んでいます。
画像を用意した場合は、その `<link rel="icon">` を
`<link rel="icon" href="/assets/favicon.ico" />` に差し替えてください。

## 公開前に設定が必要なリンク（3箇所）

Google Form と Google Docs の URL が決まったら差し替えてください。未設定の間は
リンクではなく「準備中」と表示されるため、リンク切れは公開されません。

```bash
grep -n 'TODO:SET-URL' public/index.html
```

| # | 対象 | 箇所 |
| --- | --- | --- |
| 1 | Google Form（申し込み・お問い合わせ） | ヒーロー内の CTA と `#contact` の 2 箇所 |
| 2 | プライバシーポリシー（Google Docs 公開共有リンク） | フッター |
| 3 | 利用規約（Google Docs 公開共有リンク） | フッター |

差し替えるマークアップは、各プレースホルダ直上のコメントにそのまま書いてあります。

Google Docs のリンクは「リンクを知っている全員が閲覧可」で共有し、編集用の `/edit`
ではなく `/view` で終わる URL を使ってください。

## ローカルで確認する

```bash
npx --yes wrangler@4 dev       # http://localhost:8787
npx --yes wrangler@4 deploy --dry-run   # 設定とアセットの検証のみ
```

## デプロイ

Cloudflare Workers Builds（Git 連携）が行います。GitHub Actions は使わないため、
Cloudflare のトークンを GitHub 側に保存する必要はありません。

- PR → プレビュー URL が Cloudflare から PR にコメントされます
- `main` へマージ → 本番（<https://stir-hosyu.nemtus.com>）へ反映されます

Cloudflare ダッシュボード側の設定値は `wrangler.toml` の冒頭コメントに記載しています。

## 掲載内容について

料金は現在提供されている Stir Hosyu Symbol の内容を記載しています。NEMTUS での提供開始に
あたって条件が変わる場合は、`public/index.html` の「料金プラン」節と、同節末尾の注記を
更新してください。
