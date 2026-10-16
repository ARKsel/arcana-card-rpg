# ARCANA — 武器と魔法のカードRPG

公開ゲーム：https://arksel.github.io/arcana-card-rpg/

ARKselの公開リポジトリです。GitHub ActionsでGitHub Pagesへ配信しています。

## 現在のソース構成

- `ARCANA-source.zip`：基礎ゲームとカード画像1692枚などを含む `dist` 一式。
- `game.js`：最新のゲームルール。初期デッキ10枚、冒険中の上限15枚。
- `index.html`：最新の画面構造・開発会話ログ・使用画像アーカイブ。
- `pixel-stage.js` / `pixel-stage.css`：キャラクター、武器、探索・戦闘のアニメーションと画面配置。
- `heroine-reference-v1.png`、`heroine-weapons-v2.png`、`heroine-walk-v2.png`、`character-art-v1.png`：現在のキャラクター素材。
- `.github/workflows/pages.yml`：ZIPを展開し、ルートの最新HTMLと演出ファイル・素材を上書きして公開。

ルートの `game.js` は配信用ソースです。ワークフローは基礎ZIPを展開した後、このファイルを上書きして公開します。`style.css` は参照用コピーで、基礎ZIP側のものを使用します。

## ローカルで起動する場合

ZIPを展開して `dist` フォルダを作り、公開ワークフローと同じルートの上書きファイルを `dist` へコピーしてください。フォルダ構成を保ち、ローカルHTTPサーバーで配信すると現在の公開版を再現できます。ZIP単体は最新のキャラクター演出や開発ログを含まない基礎版です。

セーブデータはブラウザ内に保存します。別端末や別URLへ移す際は「保存 / 冒険者」からエクスポート／インポートしてください。
