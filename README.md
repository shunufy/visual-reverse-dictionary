# ビジュアル逆引き辞典

頭の中にある「見た目」「雰囲気」「色」「素材」「モチーフ」から、サイバーパンク、スチームパンク、リミナルスペース、ブルータリズムのような視覚ジャンル名を探すためのローカル辞典です。

画像機能は、大量の候補画像を並べる画面ではなく、各ジャンルを象徴する代表画像を1枚ずつ並べるビジュアル索引として扱います。

## ディレクトリ構成

```text
visual-reverse-dictionary/
  README.md
  app/
    index.html
    styles.css
    app.js
  data/
    visual-dictionary.json
    image-candidates.json
  docs/
    building-visual-categories.md
    visual-dictionary-template.md
    tag-system.md
    style-comparison.md
  scripts/
    serve.py
    validate_dictionary.py
    fetch_building_representative_images.py
    rename_building_terms.js
```

## ローカル起動

追加パッケージなしで起動できます。

```powershell
cd F:\codex\マイクラモッド系\モッド改造\visual-reverse-dictionary
python scripts/serve.py --port 8765
```

ブラウザで開きます。

```text
http://127.0.0.1:8765/app/
```

## 画面

### ビジュアル一覧

代表画像が設定済みの項目をカード型グリッドで表示します。

カードには以下を表示します。

- 代表画像
- ジャンル名
- 英語名
- 一言説明
- 主要タグ
- 詳細を見る
- 画像元を開く

代表画像またはカードをクリックすると、その辞書項目の詳細へ移動します。`画像元を開く` を押した場合のみ、`source_page_url` を新しいタブで開きます。

### 辞書詳細

検索、タグ逆引き、詳細表示の画面です。代表画像、視覚的特徴、近い用語、混同しやすい用語、AI画像生成・検索キーワード、`image_search_tags` を確認できます。

### 代表画像未設定

`representative_image` が空の項目を一覧表示します。現在は45項目すべてに代表画像が設定済みです。

## 画像の扱い

画像は「各ジャンルの代表画像」として扱います。画像一覧は、画像から言葉を思い出すためのビジュアル索引です。

代表画像は1ジャンル1枚を基本にします。候補画像収集は補助機能であり、メインではありません。

代表画像には以下のメタデータを必ず保存します。

```json
{
  "thumbnail_url": "",
  "image_url": "",
  "source_page_url": "",
  "source": "",
  "creator": "",
  "license": "",
  "license_url": "",
  "alt": "",
  "notes": ""
}
```

画像ファイルは自動でローカル保存しません。出典、作者表記、ライセンス確認、差し替え、除外対応をしやすくするため、まずはリンク参照で管理します。

Google画像検索やPinterestを直接スクレイピングしません。候補を探す場合は Openverse API / Wikimedia Commons API / Unsplash API など、利用条件とメタデータを確認しやすいソースを使います。

一部の代表画像は、既存候補よりも視覚的特徴を分かりやすくするためにローカル生成画像へ差し替えています。生成画像は `app/generated/representatives/` に保存し、`source` は `OpenAI image generation` として記録します。外部出典画像と生成画像は、`representative_image.source` で区別できます。

## APIキー

Openverse と Wikimedia Commons はAPIキーなしで使います。Unsplash はAPIキーがある場合のみ使います。

```powershell
copy .env.example .env
```

`.env` の例:

```text
UNSPLASH_ACCESS_KEY=your_access_key_here
```

APIキーは公開リポジトリに入れないでください。

## データ形式

一次データは `data/visual-dictionary.json` です。

JSONを採用している理由:

- アプリから読み込みやすい
- 検索、タグ集計、画像参照、検証を実装しやすい
- 将来的に編集UIやインポート処理へ拡張しやすい

Markdownは説明書とテンプレートに使います。YAMLは人間には読みやすい一方、インデント崩れや型の揺れが起きやすいため、一次データには使っていません。

## 登録データ

現在45項目を登録済みです。初期20項目に加えて、建造物から逆引きしやすい視覚カテゴリを25項目追加しています。

初期20項目:

- サイバーパンク
- スチームパンク
- ディーゼルパンク
- ソーラーパンク
- バイオパンク
- レトロフューチャー
- スペースオペラ
- ダークファンタジー
- ゴシックファンタジー
- コズミックホラー
- ボディホラー
- リミナルスペース
- ブルータリズム
- アールデコ
- ヴィクトリアン
- テックウェア
- ミリタリーSF
- ポストアポカリプス
- 荒廃都市
- ネオンノワール

建造物系視覚カテゴリ:

- 城塞美学
- 大聖堂ゴシック
- ダンジョン美学
- 地下都市美学
- 垂直都市
- 橋梁都市
- 水道橋都市
- ダム建築
- バンカー美学
- アーコロジー
- メガストラクチャー
- コンクリート建築
- ガラス建築
- 温室建築
- 竹建築
- 砂漠建築
- 水上都市
- 水没都市
- 空中都市
- モジュラー建築
- コンテナ建築
- インダストリアル建築
- 鉄道建築
- 神殿建築
- 記念碑建築

建造物系語彙の命名方針と使い分けは [docs/building-visual-categories.md](F:/codex/マイクラモッド系/モッド改造/visual-reverse-dictionary/docs/building-visual-categories.md) にまとめています。

## 命名方針

「○○パンク」は便利な仮称ですが、すべてに付けると辞典として雑になります。

そのため、現在の建造物系語彙では以下のルールにしています。

- 実在・定着している建築用語はそのまま使う: アーコロジー、メガストラクチャー。
- 視覚モチーフとして使いやすいものは「美学」「建築」「都市」に寄せる: 城塞美学、竹建築、橋梁都市。
- 明らかに不自然な「○○パンク」は表示名から外す: 空中都市パンク -> 空中都市。
- 旧称は検索補助として `ai_keywords` に残す。

このため、内部IDが `skycitypunk` のままでも、画面上では `空中都市 / Sky City` と表示されます。

## 逆引きの考え方

検索では、名前だけでなく複数の視覚タグを組み合わせます。

例:

- `ネオン` + `雨` + `探偵` + `路地裏` -> ネオンノワール、サイバーパンク
- `歯車` + `真鍮` + `蒸気` + `飛行船` -> スチームパンク
- `黒煙` + `学校` + `誰もいない` -> リミナルスペース
- `コンクリート` + `巨大建築` + `無機質` -> ブルータリズム、コンクリート建築
- `雲上` + `空中回廊` + `浮遊基盤` -> 空中都市

## 検証

項目を追加・編集したら以下を実行します。

```powershell
python scripts/validate_dictionary.py
```

## 現在の規模メモ

現在の辞書は100項目です。初期20項目、建造物系の追加カテゴリ、さらに構造物・都市・建築空間から逆引きしやすい55項目を含みます。

代表画像は45項目に設定済みで、新規追加した構造物系55項目は `代表画像未設定` タブで確認できます。追加内容の概要は `docs/structure-expansion-100.md` にまとめています。

構文チェック:

```powershell
node --check app/app.js
node --check scripts/rename_building_terms.js
python -m py_compile scripts/serve.py scripts/validate_dictionary.py
```

代表画像確認用のコンタクトシート:

```powershell
python scripts/build_representative_contact_sheet.py
```
