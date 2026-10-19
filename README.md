# 東貴志公認会計士税理士事務所（csuite-tax.com）コーポレートサイト

静的サイト。外部ライブラリ・ビルドツール不要（Python 3 標準ライブラリのみ）。GitHub Pages で `docs/` を公開。

```
build.py            ビルドスクリプト（src → docs）
src/
  site.json         サイト設定（名称・URL・ナビ・フッター・フォームURL・電話）
  layout.html       共通レイアウト（head / ヘッダー / フッター）
  pages/*.html      各ページ本文（先頭の <!-- meta {...} --> でパス・タイトル・説明文を定義）
  assets/           css / js / img
  favicon.svg, CNAME, privacy.html（旧URLからのリダイレクト）
docs/               ビルド出力（GitHub Pages の公開フォルダ・コミットする）
notes/              作業メモ・スクリーンショット
```

## 更新手順
1. `src/pages/` の該当ファイルを編集
2. `python3 build.py`
3. `docs/` を含めてコミット → push → GitHub Pages が自動公開

## ページ構成
/ トップ ／ /services/（一覧）／ /services/corporate/ ／ /services/sole-proprietor/ ／ /services/startup/ ／ /about/ ／ /profile/ ／ /faq/ ／ /contact/ ／ /privacy/
