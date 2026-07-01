# 建造物系視覚カテゴリ

この辞典では、建物、都市基盤、インフラ、巨大構造物から逆引きしやすい語彙を追加しています。

当初は便宜上「○○パンク」として増やしましたが、すべてをパンク扱いすると用語が雑になります。そのため、より自然な呼び名があるものは「美学」「建築」「都市」「実在する構想名」に寄せています。

内部IDは既存データや画像参照を壊さないため維持しています。旧称の「○○パンク」は検索キーワードとして残してあるので、旧名で検索しても見つかります。

## 追加語彙

| ID | 表示名 | 英語名 | 逆引きの核 |
| --- | --- | --- | --- |
| `castlepunk` | 城塞美学 | Fortress Aesthetic | 城塞、城壁、塔、跳ね橋 |
| `cathedralpunk` | 大聖堂ゴシック | Cathedral Gothic | 大聖堂、尖塔、ステンドグラス、祭壇 |
| `dungeonpunk` | ダンジョン美学 | Dungeon Aesthetic | 地下迷宮、石室、罠、格子扉 |
| `subterranean_punk` | 地下都市美学 | Subterranean Urbanism | 地下都市、地下鉄網、換気塔、地下居住区 |
| `towerpunk` | 垂直都市 | Vertical City | 塔、垂直都市、空中回廊、高層居住区 |
| `bridgepunk` | 橋梁都市 | Bridge Urbanism | 巨大橋、橋上都市、高架歩廊、ケーブル |
| `aqueductpunk` | 水道橋都市 | Aqueduct Urbanism | 水道橋、水路、アーチ、水門 |
| `dampunk` | ダム建築 | Dam Architecture | 巨大ダム、放水路、発電施設、貯水池 |
| `bunkerpunk` | バンカー美学 | Bunker Aesthetic | 防空壕、シェルター、隔壁、非常灯 |
| `arcologypunk` | アーコロジー | Arcology | 自己完結都市、巨大居住区、内部庭園 |
| `megastructure_punk` | メガストラクチャー | Megastructure | 巨大構造物、巨大壁、人間が小さいスケール |
| `concretepunk` | コンクリート建築 | Concrete Architecture | コンクリート壁、地下通路、高架下 |
| `glasspunk` | ガラス建築 | Glass Architecture | ガラスドーム、透明回廊、反射、アトリウム |
| `greenhousepunk` | 温室建築 | Greenhouse Architecture | 温室、屋内庭園、ガラス屋根、灌漑 |
| `bamboopunk` | 竹建築 | Bamboo Architecture | 竹足場、木組み、編み込み、高床 |
| `desertpunk` | 砂漠建築 | Desert Architecture | 砂漠都市、日干し煉瓦、中庭、日除け |
| `floating_city_punk` | 水上都市 | Floating City | 水上都市、浮桟橋、船上住宅、港湾 |
| `submerged_city_punk` | 水没都市 | Submerged City | 水没都市、海底ドーム、沈んだビル、水中光 |
| `skycitypunk` | 空中都市 | Sky City | 空中都市、浮遊基盤、雲上、空中回廊 |
| `modularpunk` | モジュラー建築 | Modular Architecture | 居住モジュール、プレハブ、反復ユニット |
| `containerpunk` | コンテナ建築 | Container Architecture | コンテナ、港湾、クレーン、仮設住宅 |
| `factorypunk` | インダストリアル建築 | Industrial Architecture | 廃工場、煙突、配管、ベルトコンベア |
| `railpunk` | 鉄道建築 | Railway Architecture | 駅舎、線路、ホーム、鉄道高架 |
| `templepunk` | 神殿建築 | Temple Architecture | 神殿、祭壇、列柱、古代遺跡 |
| `monumentpunk` | 記念碑建築 | Monumental Architecture | 巨大記念碑、広場、慰霊碑、階段 |

## 命名方針

- すでに建築・都市計画用語として自然なものは、そのまま採用します。例: アーコロジー、メガストラクチャー。
- 視覚モチーフとして使いやすいが一般ジャンル名ではないものは、「美学」「建築」「都市」に寄せます。例: 城塞美学、竹建築、橋梁都市。
- 「パンク」と呼ぶことで誤解が増えるものは、表示名から外します。例: 空中都市パンク -> 空中都市。
- 旧称は検索補助として `ai_keywords` に残します。ユーザーが「空中都市パンク」と検索しても、空中都市に到達できます。

## 見分け方

| 比較 | 見分け方 |
| --- | --- |
| 城塞美学 / 大聖堂ゴシック | 防衛建築なら城塞美学。宗教建築と垂直性なら大聖堂ゴシック。 |
| ダンジョン美学 / 地下都市美学 | 罠と探索の迷宮ならダンジョン美学。地下生活と都市機能なら地下都市美学。 |
| アーコロジー / メガストラクチャー | 都市機能が建物内に完結するならアーコロジー。巨大さ自体が主役ならメガストラクチャー。 |
| ガラス建築 / 温室建築 | 透明素材と反射ならガラス建築。植物栽培と湿った温室空間なら温室建築。 |
| 水上都市 / 水没都市 | 水面上で暮らすなら水上都市。水中や沈んだ建物なら水没都市。 |
| モジュラー建築 / コンテナ建築 | 規格化された建築ユニットならモジュラー建築。輸送コンテナの転用感ならコンテナ建築。 |
| 橋梁都市 / 鉄道建築 | 接続構造としての橋なら橋梁都市。駅舎や線路なら鉄道建築。 |

## 代表画像

各項目には `representative_image` を1枚設定します。画像は作品素材として同梱せず、出典ページへのリンク参照として扱います。

代表画像を設定するときは、必ず以下を保存します。

- `source`
- `creator`
- `license`
- `license_url`
- `source_page_url`

ライセンス不明の画像は代表画像にしません。
