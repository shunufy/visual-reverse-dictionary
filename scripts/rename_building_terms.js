const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DATA_PATH = path.join(ROOT, "data", "visual-dictionary.json");

const RENAMES = {
  castlepunk: {
    name: "城塞美学",
    reading: "じょうさいびがく",
    english_name: "Fortress Aesthetic",
    old: ["キャッスルパンク", "Castlepunk"],
    short_description: "城塞、城壁、塔、跳ね橋を主役にした、中世要塞の視覚カテゴリ。"
  },
  cathedralpunk: {
    name: "大聖堂ゴシック",
    reading: "だいせいどうゴシック",
    english_name: "Cathedral Gothic",
    old: ["カテドラルパンク", "Cathedralpunk"],
    short_description: "大聖堂、尖塔、ステンドグラス、祭壇の垂直性を強調する宗教建築の視覚カテゴリ。"
  },
  dungeonpunk: {
    name: "ダンジョン美学",
    reading: "ダンジョンびがく",
    english_name: "Dungeon Aesthetic",
    old: ["ダンジョンパンク", "Dungeonpunk"],
    short_description: "地下迷宮、罠、石室、格子扉を、探索できる建造物として見せる視覚カテゴリ。"
  },
  subterranean_punk: {
    name: "地下都市美学",
    reading: "ちかとしびがく",
    english_name: "Subterranean Urbanism",
    old: ["サブテラニアンパンク", "Subterranean Punk"],
    short_description: "地下都市、地下居住区、地下鉄網、採掘空間を主役にした地下インフラの視覚カテゴリ。"
  },
  towerpunk: {
    name: "垂直都市",
    reading: "すいちょくとし",
    english_name: "Vertical City",
    old: ["タワーパンク", "Towerpunk"],
    short_description: "塔、超高層、垂直居住区、空中回廊を主役にした高層建築の視覚カテゴリ。"
  },
  bridgepunk: {
    name: "橋梁都市",
    reading: "きょうりょうとし",
    english_name: "Bridge Urbanism",
    old: ["ブリッジパンク", "Bridgepunk"],
    short_description: "巨大橋、橋上都市、高架歩廊など、接続構造を主役にした都市・建築の視覚カテゴリ。"
  },
  aqueductpunk: {
    name: "水道橋都市",
    reading: "すいどうきょうとし",
    english_name: "Aqueduct Urbanism",
    old: ["アクエダクトパンク", "Aqueductpunk"],
    short_description: "水道橋、水路、高架水路、水門を主役にした水インフラ建築の視覚カテゴリ。"
  },
  dampunk: {
    name: "ダム建築",
    reading: "ダムけんちく",
    english_name: "Dam Architecture",
    old: ["ダムパンク", "Dampunk"],
    short_description: "巨大ダム、堤体、発電施設、放水路を主役にした水力インフラの視覚カテゴリ。"
  },
  bunkerpunk: {
    name: "バンカー美学",
    reading: "バンカーびがく",
    english_name: "Bunker Aesthetic",
    old: ["バンカーパンク", "Bunkerpunk"],
    short_description: "地下壕、防空壕、シェルター、要塞化したコンクリート空間を主役にする視覚カテゴリ。"
  },
  arcologypunk: {
    name: "アーコロジー",
    reading: "アーコロジー",
    english_name: "Arcology",
    old: ["アーコロジーパンク", "Arcologypunk"],
    short_description: "都市、住居、農業、交通を巨大建築内にまとめる自己完結型都市構想。"
  },
  megastructure_punk: {
    name: "メガストラクチャー",
    reading: "メガストラクチャー",
    english_name: "Megastructure",
    old: ["メガストラクチャーパンク", "Megastructure Punk"],
    short_description: "人間のスケールを超える巨大構造物そのものを主役にした建築・SFの視覚カテゴリ。"
  },
  concretepunk: {
    name: "コンクリート建築",
    reading: "コンクリートけんちく",
    english_name: "Concrete Architecture",
    old: ["コンクリートパンク", "Concretepunk"],
    short_description: "コンクリートの壁、床、階段、地下通路を無骨に押し出す建築の視覚カテゴリ。"
  },
  glasspunk: {
    name: "ガラス建築",
    reading: "ガラスけんちく",
    english_name: "Glass Architecture",
    old: ["グラスパンク", "Glasspunk"],
    short_description: "透明な外皮、ガラスの高層建築、反射する都市景観を主役にした建築の視覚カテゴリ。"
  },
  greenhousepunk: {
    name: "温室建築",
    reading: "おんしつけんちく",
    english_name: "Greenhouse Architecture",
    old: ["温室パンク", "Greenhousepunk"],
    short_description: "温室、ガラス屋根、栽培設備、植物に満ちた建築を主役にした視覚カテゴリ。"
  },
  bamboopunk: {
    name: "竹建築",
    reading: "たけけんちく",
    english_name: "Bamboo Architecture",
    old: ["バンブーパンク", "Bamboopunk"],
    short_description: "竹、木組み、軽い足場、自然素材の構造美を主役にする建築の視覚カテゴリ。"
  },
  desertpunk: {
    name: "砂漠建築",
    reading: "さばくけんちく",
    english_name: "Desert Architecture",
    old: ["デザートパンク", "Desertpunk"],
    short_description: "砂漠都市、日干し煉瓦、要塞集落、乾いたインフラを主役にした建築の視覚カテゴリ。"
  },
  floating_city_punk: {
    name: "水上都市",
    reading: "すいじょうとし",
    english_name: "Floating City",
    old: ["水上都市パンク", "Floating City Punk"],
    short_description: "水上都市、浮桟橋、船上建築、港湾居住区を主役にした水辺都市の視覚カテゴリ。"
  },
  submerged_city_punk: {
    name: "水没都市",
    reading: "すいぼつとし",
    english_name: "Submerged City",
    old: ["水没都市パンク", "Submerged City Punk"],
    short_description: "水没した都市、水中建築、海底ドーム、沈んだビル群を主役にした視覚カテゴリ。"
  },
  skycitypunk: {
    name: "空中都市",
    reading: "くうちゅうとし",
    english_name: "Sky City",
    old: ["空中都市パンク", "Skycitypunk"],
    short_description: "浮遊都市、空中基盤、雲上の居住区を主役にした空の都市イメージ。"
  },
  modularpunk: {
    name: "モジュラー建築",
    reading: "モジュラーけんちく",
    english_name: "Modular Architecture",
    old: ["モジュラーパンク", "Modularpunk"],
    short_description: "モジュール建築、増築ユニット、交換可能な居住ブロックを主役にした建築の視覚カテゴリ。"
  },
  containerpunk: {
    name: "コンテナ建築",
    reading: "コンテナけんちく",
    english_name: "Container Architecture",
    old: ["コンテナパンク", "Containerpunk"],
    short_description: "輸送コンテナ、港湾、再利用された箱型居住区を主役にした建築の視覚カテゴリ。"
  },
  factorypunk: {
    name: "インダストリアル建築",
    reading: "インダストリアルけんちく",
    english_name: "Industrial Architecture",
    old: ["ファクトリーパンク", "Factorypunk"],
    short_description: "工場、配管、煙突、ベルトコンベア、産業設備を建築の主役にする視覚カテゴリ。"
  },
  railpunk: {
    name: "鉄道建築",
    reading: "てつどうけんちく",
    english_name: "Railway Architecture",
    old: ["レールパンク", "Railpunk"],
    short_description: "駅舎、線路、高架、車庫、鉄道インフラを主役にした建築の視覚カテゴリ。"
  },
  templepunk: {
    name: "神殿建築",
    reading: "しんでんけんちく",
    english_name: "Temple Architecture",
    old: ["テンプルパンク", "Templepunk"],
    short_description: "古代神殿、祭壇、列柱、遺跡都市を主役にした神殿建築の視覚カテゴリ。"
  },
  monumentpunk: {
    name: "記念碑建築",
    reading: "きねんひけんちく",
    english_name: "Monumental Architecture",
    old: ["モニュメントパンク", "Monumentpunk"],
    short_description: "巨大記念碑、慰霊建築、国家的モニュメントを主役にした記念碑性の強い建築カテゴリ。"
  }
};

const REPLACEMENTS = Object.fromEntries(
  Object.values(RENAMES).flatMap((item) => item.old.map((oldName) => [oldName, item.name]))
);
REPLACEMENTS["スカイシティパンク"] = "空中都市";

function replaceText(value) {
  let output = value;
  for (const [from, to] of Object.entries(REPLACEMENTS)) {
    output = output.split(from).join(to);
  }
  return output;
}

function walk(value) {
  if (typeof value === "string") return replaceText(value);
  if (Array.isArray(value)) return value.map(walk);
  if (value && typeof value === "object") {
    for (const key of Object.keys(value)) {
      if (key === "id" || key === "terms" || key === "near_terms") continue;
      value[key] = walk(value[key]);
    }
  }
  return value;
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function main() {
  const data = JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));
  walk(data);

  for (const entry of data.entries) {
    const rename = RENAMES[entry.id];
    if (!rename) continue;
    entry.name = rename.name;
    entry.reading = rename.reading;
    entry.english_name = rename.english_name;
    entry.short_description = rename.short_description;
    entry.ai_keywords = unique([
      rename.name,
      rename.english_name,
      ...(rename.old || []),
      ...(entry.ai_keywords || [])
    ]);
    if (entry.representative_image) {
      const cues = [];
      for (const category of ["visual_elements", "materials", "settings"]) {
        cues.push(...(entry.tags?.[category] || []));
      }
      entry.representative_image.alt = `${rename.name}の参考画像。${unique(cues).slice(0, 5).join(", ")}`;
    }
  }

  fs.writeFileSync(DATA_PATH, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  console.log(`Renamed ${Object.keys(RENAMES).length} building terms`);
}

main();
