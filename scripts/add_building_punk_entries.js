const fs = require("fs");

const path = "data/visual-dictionary.json";
const data = JSON.parse(fs.readFileSync(path, "utf8"));

const catalogAdditions = {
  visual_elements: [
    "塔",
    "要塞",
    "迷宮",
    "アーチ",
    "ドーム",
    "空中都市",
    "水上都市",
    "水没都市",
    "橋",
    "温室",
    "モジュール建築",
    "プレハブ",
    "空中回廊",
    "地下都市",
    "巨大ダム",
    "巨大壁",
    "発電施設",
    "廃工場",
    "駅舎",
    "コンテナ",
    "水路",
    "庭園",
    "記念碑",
    "古代遺跡",
    "モノリス"
  ],
  materials: [
    "煉瓦",
    "鋼鉄",
    "タイル",
    "アクリル",
    "セラミック",
    "竹",
    "土",
    "再生素材",
    "金"
  ],
  lighting_air: [
    "水中光",
    "砂塵",
    "高所の風",
    "温室光",
    "非常灯"
  ],
  mood: [
    "記念碑的",
    "閉塞的",
    "荒涼",
    "共同体的",
    "無機質"
  ],
  settings: [
    "空中",
    "水上",
    "水没都市",
    "発電所",
    "橋梁",
    "要塞",
    "庭園",
    "港湾",
    "ダム",
    "塔",
    "迷宮",
    "居住区"
  ],
  era_technology: [
    "近代",
    "現代",
    "未来都市"
  ],
  colors: [
    "黄土色",
    "透明",
    "コバルトブルー"
  ],
  motifs: [
    "城塞",
    "大聖堂",
    "地下迷宮",
    "巨大構造物",
    "アーコロジー",
    "空中庭園",
    "浮遊都市",
    "水中都市",
    "コンテナ居住",
    "工業地帯",
    "鉄道駅",
    "神殿",
    "巨大記念碑",
    "防空壕",
    "温室都市",
    "砂漠都市",
    "水道橋",
    "巨大橋"
  ]
};

for (const [category, tags] of Object.entries(catalogAdditions)) {
  data.tag_catalog[category] = data.tag_catalog[category] || [];
  for (const tag of tags) {
    if (!data.tag_catalog[category].includes(tag)) data.tag_catalog[category].push(tag);
  }
}

const emptyImageRefs = {
  representative: null,
  thumbnail: null,
  gallery: [],
  reference_urls: [],
  notes: ""
};

const emptyRepresentative = {
  thumbnail_url: "",
  image_url: "",
  source_page_url: "",
  source: "",
  creator: "",
  license: "",
  license_url: "",
  alt: "",
  notes: ""
};

function entry(config) {
  return {
    id: config.id,
    name: config.name,
    reading: config.reading,
    english_name: config.english_name,
    short_description: config.short_description,
    visual_features: config.visual_features,
    common_motifs: config.common_motifs,
    color_tendencies: config.color_tendencies,
    material_feel: config.material_feel,
    light_air: config.light_air,
    worldview_direction: config.worldview_direction,
    near_terms: config.near_terms,
    confusable_terms: config.confusable_terms,
    difference_notes: config.difference_notes,
    ai_keywords: config.ai_keywords,
    tags: config.tags,
    reverse_lookup: config.reverse_lookup,
    image_refs: { ...emptyImageRefs },
    image_search_tags: config.image_search_tags,
    representative_image: { ...emptyRepresentative },
    selected_images: []
  };
}

const newEntries = [
  entry({
    id: "castlepunk",
    name: "キャッスルパンク",
    reading: "キャッスルパンク",
    english_name: "Castlepunk",
    short_description: "城塞、城壁、塔、跳ね橋を主役にした、中世要塞美の創作タグ。",
    visual_features: ["厚い城壁と門楼", "塔や胸壁がシルエットを作る", "石造建築と軍事的な生活空間が同居する"],
    common_motifs: ["城塞", "跳ね橋", "城壁", "塔", "旗", "堀"],
    color_tendencies: ["灰色", "黒", "赤", "黄土色"],
    material_feel: ["石材", "鉄", "木材"],
    light_air: "曇天、冷たい風、松明や蝋燭の小さな光が似合う。",
    worldview_direction: "権力、防衛、封建社会、籠城の緊張感を建築から見せる。",
    near_terms: ["dark_fantasy", "gothic_fantasy", "bunkerpunk"],
    confusable_terms: [
      { id: "gothic_fantasy", difference: "ゴシックファンタジーは聖堂や吸血鬼的な様式美。キャッスルパンクは軍事的な城塞構造が中心。" },
      { id: "bunkerpunk", difference: "バンカーパンクは近現代の防護施設。キャッスルパンクは石造の中世要塞。" }
    ],
    difference_notes: ["古城の怪奇性より、城壁、門、堀、塔など防衛建築としての読みやすさを重視する。"],
    ai_keywords: ["castlepunk", "fortress city", "medieval castle walls", "stone keep", "drawbridge", "城塞都市", "城壁", "中世要塞"],
    tags: {
      visual_elements: ["古城", "要塞", "塔", "巨大壁"],
      materials: ["石材", "鉄", "木材"],
      lighting_air: ["冷たい月光", "蝋燭光", "霧"],
      mood: ["中世風", "荘厳", "不穏"],
      settings: ["古城", "要塞", "塔"],
      era_technology: ["中世"],
      colors: ["灰色", "黒", "赤"]
    },
    reverse_lookup: {
      strong_cues: ["城塞", "城壁", "塔", "跳ね橋"],
      secondary_cues: ["堀", "旗", "門楼"],
      avoid_confusing_with: ["尖塔や聖堂美が主ならゴシックファンタジー"]
    },
    image_search_tags: ["castle fortress", "medieval fortress city", "stone castle walls", "drawbridge castle"]
  }),
  entry({
    id: "cathedralpunk",
    name: "カテドラルパンク",
    reading: "カテドラルパンク",
    english_name: "Cathedralpunk",
    short_description: "大聖堂、尖塔、ステンドグラス、宗教的な垂直性を誇張する建築系創作タグ。",
    visual_features: ["極端に高い天井と尖塔", "ステンドグラスの色光", "柱、アーチ、祭壇が反復する", "都市そのものが聖堂化する"],
    common_motifs: ["大聖堂", "ステンドグラス", "尖塔", "祭壇", "聖像", "回廊"],
    color_tendencies: ["黒", "金", "紫", "赤", "青"],
    material_feel: ["石材", "ガラス", "金", "布"],
    light_air: "色付きの光、香煙、低照度、広い空間の反響。",
    worldview_direction: "信仰、権威、罪、儀式を建築の巨大さで感じさせる。",
    near_terms: ["gothic_fantasy", "templepunk", "monumentpunk"],
    confusable_terms: [
      { id: "gothic_fantasy", difference: "ゴシックファンタジーは怪奇や吸血鬼まで含む。カテドラルパンクは大聖堂建築そのものが主役。" },
      { id: "templepunk", difference: "テンプルパンクは古代神殿や遺跡寄り。カテドラルパンクは西洋聖堂的な垂直性とステンドグラスが中心。" }
    ],
    difference_notes: ["宗教建築の装飾だけでなく、建物のスケールと垂直性が世界観を支配しているかを見る。"],
    ai_keywords: ["cathedralpunk", "massive gothic cathedral", "stained glass megastructure", "cathedral city", "尖塔", "大聖堂都市"],
    tags: {
      visual_elements: ["宗教建築", "アーチ", "塔", "巨大建築"],
      materials: ["石材", "ガラス", "布"],
      lighting_air: ["蝋燭光", "低照度", "強い逆光"],
      mood: ["荘厳", "神秘的", "不穏"],
      settings: ["都市", "塔", "古城"],
      era_technology: ["中世", "近世"],
      colors: ["黒", "金", "紫", "青"]
    },
    reverse_lookup: {
      strong_cues: ["大聖堂", "尖塔", "ステンドグラス", "祭壇"],
      secondary_cues: ["聖像", "回廊", "香煙"],
      avoid_confusing_with: ["古代遺跡や神殿ならテンプルパンク"]
    },
    image_search_tags: ["massive gothic cathedral", "stained glass cathedral interior", "cathedral city", "cathedral spires"]
  }),
  entry({
    id: "dungeonpunk",
    name: "ダンジョンパンク",
    reading: "ダンジョンパンク",
    english_name: "Dungeonpunk",
    short_description: "地下迷宮、罠、石室、魔法装置を、探索可能な建造物として見せる創作タグ。",
    visual_features: ["石造の通路が迷路状に続く", "扉、格子、階段、罠が多い", "地下なのに生活や機械の痕跡がある"],
    common_motifs: ["地下迷宮", "石室", "罠", "格子扉", "宝物庫", "階段"],
    color_tendencies: ["灰色", "黒", "琥珀色", "緑"],
    material_feel: ["石材", "鉄", "木材", "タイル"],
    light_air: "松明、湿気、低い天井、地下の反響音。",
    worldview_direction: "建物そのものを冒険対象にし、探索、危険、未知の層構造を強調する。",
    near_terms: ["dark_fantasy", "subterranean_punk", "templepunk"],
    confusable_terms: [
      { id: "dark_fantasy", difference: "ダークファンタジーは暗い幻想全般。ダンジョンパンクは迷宮建築と探索導線が中心。" },
      { id: "subterranean_punk", difference: "サブテラニアンパンクは地下都市や地下生活。ダンジョンパンクは罠と探索の建造物。" }
    ],
    difference_notes: ["地下であることだけでなく、通路、部屋、罠、鍵、階層が視覚的に読めるかが重要。"],
    ai_keywords: ["dungeonpunk", "underground dungeon architecture", "stone labyrinth", "fantasy dungeon corridor", "地下迷宮", "石造迷宮"],
    tags: {
      visual_elements: ["迷宮", "地下都市", "アーチ", "蝋燭"],
      materials: ["石材", "鉄", "タイル"],
      lighting_air: ["低照度", "蝋燭光", "湿気"],
      mood: ["不穏", "閉塞的", "中世風"],
      settings: ["地下", "迷宮"],
      era_technology: ["中世"],
      colors: ["灰色", "黒", "琥珀色"]
    },
    reverse_lookup: {
      strong_cues: ["地下迷宮", "石室", "罠", "格子扉"],
      secondary_cues: ["宝物庫", "階段", "松明"],
      avoid_confusing_with: ["地下生活や都市機能が主ならサブテラニアンパンク"]
    },
    image_search_tags: ["underground dungeon corridor", "stone labyrinth architecture", "fantasy dungeon room", "torchlit dungeon"]
  }),
  entry({
    id: "subterranean_punk",
    name: "サブテラニアンパンク",
    reading: "サブテラニアンパンク",
    english_name: "Subterranean Punk",
    short_description: "地下都市、地下居住区、地下鉄網、採掘空間を主役にした建築系創作タグ。",
    visual_features: ["地上光が届かない階層都市", "換気塔、地下鉄、配管、居住区が重なる", "天井の低さと都市機能の密度が同居する"],
    common_motifs: ["地下都市", "地下鉄", "換気塔", "採掘坑", "配管", "居住区"],
    color_tendencies: ["灰色", "黒", "琥珀色", "緑"],
    material_feel: ["コンクリート", "鉄", "鋼鉄", "タイル"],
    light_air: "蛍光灯、非常灯、湿気、換気音、地下の重い空気。",
    worldview_direction: "地上を失った社会、密集した生活、インフラ依存を地下建築で見せる。",
    near_terms: ["dungeonpunk", "bunkerpunk", "liminal_space"],
    confusable_terms: [
      { id: "dungeonpunk", difference: "ダンジョンパンクは罠と探索の迷宮。サブテラニアンパンクは地下都市や地下生活のインフラが中心。" },
      { id: "bunkerpunk", difference: "バンカーパンクは防護施設。サブテラニアンパンクは生活都市としての地下空間。" }
    ],
    difference_notes: ["地下であるだけでなく、交通、居住、換気、配管など都市機能が見えるかを見る。"],
    ai_keywords: ["subterranean punk", "underground city", "subway city interior", "underground habitat", "地下都市", "地下居住区"],
    tags: {
      visual_elements: ["地下都市", "配管", "駅舎", "無機質"],
      materials: ["コンクリート", "鉄", "鋼鉄", "タイル"],
      lighting_air: ["蛍光灯", "非常灯", "湿気"],
      mood: ["閉塞的", "不穏", "無機質"],
      settings: ["地下", "地下", "居住区"],
      era_technology: ["現代", "近未来"],
      colors: ["灰色", "黒", "琥珀色", "緑"]
    },
    reverse_lookup: {
      strong_cues: ["地下都市", "地下鉄網", "換気塔", "地下居住区"],
      secondary_cues: ["配管", "採掘坑", "非常灯"],
      avoid_confusing_with: ["罠と迷宮探索が主ならダンジョンパンク"]
    },
    image_search_tags: ["underground city", "subterranean city architecture", "underground habitat", "subway city interior"]
  }),
  entry({
    id: "towerpunk",
    name: "タワーパンク",
    reading: "タワーパンク",
    english_name: "Towerpunk",
    short_description: "塔、超高層、垂直都市、空中回廊を主役にした高層建造物系タグ。",
    visual_features: ["地面より垂直方向の移動が目立つ", "塔と塔を空中回廊がつなぐ", "下層と上層で生活圏が分かれる"],
    common_motifs: ["塔", "空中回廊", "展望台", "エレベーター", "高層居住区", "風"],
    color_tendencies: ["灰色", "青", "白", "銀"],
    material_feel: ["ガラス", "鋼鉄", "コンクリート"],
    light_air: "高所の風、強い逆光、雲、遠景の霞。",
    worldview_direction: "都市や社会を垂直方向の階層として見せる。",
    near_terms: ["cyberpunk", "skycitypunk", "megastructure_punk"],
    confusable_terms: [
      { id: "cyberpunk", difference: "サイバーパンクは社会と技術の退廃。タワーパンクは塔や高層構造そのものが主役。" },
      { id: "skycitypunk", difference: "スカイシティパンクは都市全体が空に浮く。タワーパンクは地上から伸びる垂直建築が中心。" }
    ],
    difference_notes: ["高層ビルではなく、塔という垂直構造が景観と社会を決めているかを見る。"],
    ai_keywords: ["towerpunk", "vertical city towers", "skybridges", "high-rise megacity", "空中回廊", "垂直都市"],
    tags: {
      visual_elements: ["塔", "高層ビル", "空中回廊", "巨大建築"],
      materials: ["ガラス", "鋼鉄", "コンクリート"],
      lighting_air: ["高所の風", "強い逆光", "霧"],
      mood: ["未来的", "荘厳", "孤独"],
      settings: ["都市", "塔", "空中"],
      era_technology: ["近未来", "未来都市"],
      colors: ["灰色", "青", "白", "銀"]
    },
    reverse_lookup: {
      strong_cues: ["塔", "垂直都市", "空中回廊", "高層居住区"],
      secondary_cues: ["展望台", "雲", "エレベーター"],
      avoid_confusing_with: ["都市が浮いているならスカイシティパンク"]
    },
    image_search_tags: ["vertical city towers", "skybridge architecture", "tower city concept", "high-rise megastructure"]
  }),
  entry({
    id: "bridgepunk",
    name: "ブリッジパンク",
    reading: "ブリッジパンク",
    english_name: "Bridgepunk",
    short_description: "巨大橋、橋上都市、高架歩廊など、接続構造を主役にした建築系創作タグ。",
    visual_features: ["都市や谷を巨大橋が貫く", "橋の上や下に生活空間がある", "ケーブル、鉄骨、支柱が景観を支配する"],
    common_motifs: ["巨大橋", "吊り橋", "高架歩廊", "橋上市場", "支柱", "ケーブル"],
    color_tendencies: ["灰色", "赤", "錆色", "青"],
    material_feel: ["鋼鉄", "コンクリート", "鉄"],
    light_air: "風、霧、下方の水面や谷から来る湿気。",
    worldview_direction: "離れた場所をつなぐインフラが、そのまま都市や生活圏になる。",
    near_terms: ["railpunk", "megastructure_punk", "floating_city_punk"],
    confusable_terms: [
      { id: "railpunk", difference: "レールパンクは鉄道と駅。ブリッジパンクは橋梁と接続構造が中心。" },
      { id: "megastructure_punk", difference: "メガストラクチャーパンクは巨大構造物全般。ブリッジパンクは橋に特化。" }
    ],
    difference_notes: ["橋が背景ではなく、建物、街路、社会の骨格になっているとブリッジパンク。"],
    ai_keywords: ["bridgepunk", "city on a bridge", "giant suspension bridge city", "elevated walkway city", "巨大橋", "橋上都市"],
    tags: {
      visual_elements: ["橋", "巨大建築", "空中回廊"],
      materials: ["鋼鉄", "コンクリート", "鉄"],
      lighting_air: ["霧", "高所の風", "自然光"],
      mood: ["未来的", "記念碑的", "孤独"],
      settings: ["橋梁", "都市", "水上"],
      era_technology: ["近代", "近未来"],
      colors: ["灰色", "赤", "錆色"]
    },
    reverse_lookup: {
      strong_cues: ["巨大橋", "橋上都市", "高架歩廊", "ケーブル"],
      secondary_cues: ["支柱", "谷", "水面"],
      avoid_confusing_with: ["鉄道や駅が主役ならレールパンク"]
    },
    image_search_tags: ["city on a bridge", "giant bridge architecture", "suspension bridge city", "elevated walkway city"]
  }),
  entry({
    id: "aqueductpunk",
    name: "アクエダクトパンク",
    reading: "アクエダクトパンク",
    english_name: "Aqueductpunk",
    short_description: "水道橋、水路、高架水路を主役にした、水インフラ建築の創作タグ。",
    visual_features: ["アーチ状の水道橋が連続する", "都市に水路や樋が張り巡らされる", "石造インフラと水の流れが景観を作る"],
    common_motifs: ["水道橋", "水路", "貯水槽", "アーチ", "噴水", "水門"],
    color_tendencies: ["灰色", "青", "緑", "白"],
    material_feel: ["石材", "煉瓦", "タイル"],
    light_air: "水の反射光、湿気、苔、涼しい空気。",
    worldview_direction: "水の供給や制御が都市の形と権力を決める。",
    near_terms: ["dampunk", "floating_city_punk", "templepunk"],
    confusable_terms: [
      { id: "dampunk", difference: "ダムパンクは貯水と巨大堤体。アクエダクトパンクは水を運ぶ水路・水道橋が中心。" },
      { id: "floating_city_punk", difference: "水上都市は水面に住む。アクエダクトパンクは水を都市に通す建築。" }
    ],
    difference_notes: ["水が背景ではなく、アーチ、水門、水路として建築の骨格になっているかを見る。"],
    ai_keywords: ["aqueductpunk", "ancient aqueduct city", "water channel architecture", "stone aqueduct arches", "水道橋", "水路都市"],
    tags: {
      visual_elements: ["水路", "アーチ", "巨大建築"],
      materials: ["石材", "煉瓦", "タイル"],
      lighting_air: ["自然光", "湿気", "霧"],
      mood: ["荘厳", "神秘的", "共同体的"],
      settings: ["都市", "水上", "庭園"],
      era_technology: ["古代", "近世"],
      colors: ["灰色", "青", "緑"]
    },
    reverse_lookup: {
      strong_cues: ["水道橋", "水路", "アーチ", "水門"],
      secondary_cues: ["貯水槽", "噴水", "苔"],
      avoid_confusing_with: ["巨大な堤体が主ならダムパンク"]
    },
    image_search_tags: ["aqueduct city", "stone aqueduct arches", "water channel architecture", "ancient water infrastructure"]
  }),
  entry({
    id: "dampunk",
    name: "ダムパンク",
    reading: "ダムパンク",
    english_name: "Dampunk",
    short_description: "巨大ダム、堤体、発電施設、放水路を主役にした水力インフラ系タグ。",
    visual_features: ["巨大なコンクリート壁が谷を塞ぐ", "放水路や発電設備が見える", "人間よりインフラが圧倒的に大きい"],
    common_motifs: ["巨大ダム", "放水路", "発電施設", "水門", "監視通路", "貯水池"],
    color_tendencies: ["灰色", "青", "白", "錆色"],
    material_feel: ["コンクリート", "鋼鉄", "鉄"],
    light_air: "水しぶき、霧、強い日差し、硬い反響音。",
    worldview_direction: "自然を制御する巨大インフラの権力と危うさを見せる。",
    near_terms: ["brutalism", "aqueductpunk", "megastructure_punk"],
    confusable_terms: [
      { id: "brutalism", difference: "ブルータリズムは建築様式。ダムパンクは水力インフラと制御構造が中心。" },
      { id: "aqueductpunk", difference: "アクエダクトパンクは水を運ぶ。ダムパンクは水を堰き止めて制御する。" }
    ],
    difference_notes: ["巨大な壁、放水、発電、貯水池がそろうとダムパンクとして使いやすい。"],
    ai_keywords: ["dampunk", "massive hydroelectric dam", "concrete spillway", "industrial waterworks", "巨大ダム", "水力発電施設"],
    tags: {
      visual_elements: ["巨大ダム", "巨大壁", "発電施設"],
      materials: ["コンクリート", "鋼鉄", "鉄"],
      lighting_air: ["霧", "自然光", "強い逆光"],
      mood: ["記念碑的", "無機質", "不穏"],
      settings: ["ダム", "発電所", "荒野"],
      era_technology: ["近代", "現代"],
      colors: ["灰色", "青", "白"]
    },
    reverse_lookup: {
      strong_cues: ["巨大ダム", "放水路", "発電施設", "貯水池"],
      secondary_cues: ["水門", "監視通路", "霧"],
      avoid_confusing_with: ["水路やアーチが主ならアクエダクトパンク"]
    },
    image_search_tags: ["massive hydroelectric dam", "concrete dam spillway", "industrial waterworks", "dam megastructure"]
  }),
  entry({
    id: "bunkerpunk",
    name: "バンカーパンク",
    reading: "バンカーパンク",
    english_name: "Bunkerpunk",
    short_description: "地下壕、防空壕、シェルター、要塞化したコンクリート空間を主役にする建築系タグ。",
    visual_features: ["厚いコンクリート壁と低い天井", "非常灯、隔壁、金属扉", "外界から切り離された閉塞的な居住空間"],
    common_motifs: ["防空壕", "シェルター", "隔壁", "非常灯", "監視室", "備蓄庫"],
    color_tendencies: ["灰色", "黒", "赤", "緑"],
    material_feel: ["コンクリート", "鋼鉄", "鉄"],
    light_air: "非常灯、低い換気音、乾いた閉塞感。",
    worldview_direction: "防衛、隔離、災害、冷戦的な不安を建築で表現する。",
    near_terms: ["brutalism", "post_apocalyptic", "subterranean_punk"],
    confusable_terms: [
      { id: "post_apocalyptic", difference: "ポストアポカリプスは崩壊後の生活全般。バンカーパンクは防護施設そのものが中心。" },
      { id: "brutalism", difference: "ブルータリズムは外観の量塊美。バンカーパンクは閉鎖・防護・地下性が強い。" }
    ],
    difference_notes: ["厚い壁、隔壁、非常灯、備蓄という生存設備が見えるかを見る。"],
    ai_keywords: ["bunkerpunk", "underground bunker interior", "concrete shelter", "cold war bunker", "防空壕", "地下シェルター"],
    tags: {
      visual_elements: ["地下都市", "要塞", "巨大壁"],
      materials: ["コンクリート", "鋼鉄", "鉄"],
      lighting_air: ["非常灯", "低照度", "乾いた空気"],
      mood: ["閉塞的", "不穏", "軍事的"],
      settings: ["地下", "要塞", "居住区"],
      era_technology: ["冷戦期", "現代"],
      colors: ["灰色", "黒", "赤"]
    },
    reverse_lookup: {
      strong_cues: ["防空壕", "シェルター", "隔壁", "非常灯"],
      secondary_cues: ["備蓄庫", "監視室", "厚い壁"],
      avoid_confusing_with: ["崩壊後の屋外生活が中心ならポストアポカリプス"]
    },
    image_search_tags: ["underground bunker interior", "concrete fallout shelter", "cold war bunker", "bunker corridor"]
  }),
  entry({
    id: "arcologypunk",
    name: "アーコロジーパンク",
    reading: "アーコロジーパンク",
    english_name: "Arcologypunk",
    short_description: "都市、住居、農業、交通を巨大建築内にまとめる自己完結都市系タグ。",
    visual_features: ["建物単体が都市規模になる", "内部に居住区、庭園、交通、商業がある", "外観は巨大な人工山や塔に見える"],
    common_motifs: ["アーコロジー", "巨大居住区", "内部庭園", "交通層", "空中回廊", "居住モジュール"],
    color_tendencies: ["白", "灰色", "緑", "青"],
    material_feel: ["コンクリート", "ガラス", "鋼鉄", "植物"],
    light_air: "人工光と自然光が混ざり、巨大室内の空気感がある。",
    worldview_direction: "都市問題、人口密度、持続可能性、管理社会を巨大建築として見せる。",
    near_terms: ["megastructure_punk", "solarpunk", "cyberpunk"],
    confusable_terms: [
      { id: "megastructure_punk", difference: "メガストラクチャーパンクは巨大構造物全般。アーコロジーパンクは都市機能が内部に完結する。" },
      { id: "solarpunk", difference: "ソーラーパンクは共生と持続可能性が価値観の中心。アーコロジーパンクは自己完結都市の構造が中心。" }
    ],
    difference_notes: ["巨大建築の中に生活や都市機能が階層化されているとアーコロジーパンク。"],
    ai_keywords: ["arcologypunk", "arcology megastructure", "self contained city building", "vertical city interior", "アーコロジー", "自己完結都市"],
    tags: {
      visual_elements: ["巨大建築", "空中回廊", "庭園", "モジュール建築"],
      materials: ["コンクリート", "ガラス", "鋼鉄", "植物"],
      lighting_air: ["自然光", "温室光", "白く平坦な光"],
      mood: ["未来的", "清潔", "共同体的"],
      settings: ["都市", "居住区", "庭園"],
      era_technology: ["近未来", "未来都市"],
      colors: ["白", "灰色", "緑", "青"]
    },
    reverse_lookup: {
      strong_cues: ["アーコロジー", "自己完結都市", "巨大居住区", "内部庭園"],
      secondary_cues: ["交通層", "居住モジュール", "空中回廊"],
      avoid_confusing_with: ["単に大きいだけならメガストラクチャーパンク"]
    },
    image_search_tags: ["arcology megastructure", "self contained city building", "vertical city interior", "arcology concept architecture"]
  }),
  entry({
    id: "megastructure_punk",
    name: "メガストラクチャーパンク",
    reading: "メガストラクチャーパンク",
    english_name: "Megastructure Punk",
    short_description: "人間のスケールを超える巨大構造物そのものを主役にした建築系タグ。",
    visual_features: ["構造物が地平線を支配する", "人間や車が点のように小さい", "都市、橋、壁、塔が一体化する"],
    common_motifs: ["巨大構造物", "巨大壁", "支柱", "空中回廊", "都市基盤", "モノリス"],
    color_tendencies: ["灰色", "白", "黒", "青"],
    material_feel: ["コンクリート", "鋼鉄", "ガラス"],
    light_air: "強い逆光、遠景の霞、巨大空間の無音。",
    worldview_direction: "人間よりも構造物が大きい世界の畏怖、制度、圧迫感を見せる。",
    near_terms: ["brutalism", "arcologypunk", "towerpunk"],
    confusable_terms: [
      { id: "brutalism", difference: "ブルータリズムはコンクリート様式。メガストラクチャーパンクは素材を問わず巨大構造が中心。" },
      { id: "arcologypunk", difference: "アーコロジーは都市機能が建物内に完結する。メガストラクチャーは巨大さ自体が主役。" }
    ],
    difference_notes: ["建築物の用途より、圧倒的なスケール感で逆引きするときに使う。"],
    ai_keywords: ["megastructure punk", "colossal architecture", "giant urban structure", "massive concrete city", "巨大構造物", "巨大建築"],
    tags: {
      visual_elements: ["巨大建築", "巨大壁", "空中回廊", "モノリス"],
      materials: ["コンクリート", "鋼鉄", "ガラス"],
      lighting_air: ["強い逆光", "霧", "白く平坦な光"],
      mood: ["記念碑的", "荘厳", "不穏"],
      settings: ["都市", "塔", "橋梁"],
      era_technology: ["近未来", "未来都市"],
      colors: ["灰色", "白", "黒", "青"]
    },
    reverse_lookup: {
      strong_cues: ["巨大構造物", "巨大壁", "人間が小さい", "都市基盤"],
      secondary_cues: ["支柱", "モノリス", "遠景の霞"],
      avoid_confusing_with: ["打ち放しコンクリート様式が主ならブルータリズム"]
    },
    image_search_tags: ["colossal architecture", "giant urban structure", "megastructure city", "massive architectural scale"]
  }),
  entry({
    id: "concretepunk",
    name: "コンクリートパンク",
    reading: "コンクリートパンク",
    english_name: "Concretepunk",
    short_description: "コンクリートの壁、床、階段、地下通路を無骨に押し出す建築系タグ。",
    visual_features: ["打ち放しや荒いコンクリート面", "階段、スロープ、地下通路が多い", "装飾が少なく硬い印象"],
    common_motifs: ["コンクリート壁", "階段", "地下通路", "立体駐車場", "擁壁", "高架下"],
    color_tendencies: ["灰色", "白", "黒"],
    material_feel: ["コンクリート", "鉄", "ガラス"],
    light_air: "白く平坦な光、冷たい反射、乾いた粉っぽさ。",
    worldview_direction: "都市の地味な硬さ、公共空間、無骨な機能性を見せる。",
    near_terms: ["brutalism", "bunkerpunk", "liminal_space"],
    confusable_terms: [
      { id: "brutalism", difference: "ブルータリズムは建築様式としての量塊美。コンクリートパンクは素材感と都市の硬さを広く扱う。" },
      { id: "liminal_space", difference: "リミナルスペースは不在感。コンクリートパンクは素材と構造の硬さが中心。" }
    ],
    difference_notes: ["巨大でなくても、コンクリートの質感が画面を支配していれば使える。"],
    ai_keywords: ["concretepunk", "raw concrete corridor", "concrete urban stairway", "underground concrete passage", "コンクリート空間"],
    tags: {
      visual_elements: ["無機質", "地下都市", "巨大建築"],
      materials: ["コンクリート", "鉄", "ガラス"],
      lighting_air: ["白く平坦な光", "乾いた空気", "低照度"],
      mood: ["無機質", "孤独", "閉塞的"],
      settings: ["都市", "地下", "商業施設"],
      era_technology: ["現代", "近未来"],
      colors: ["灰色", "白", "黒"]
    },
    reverse_lookup: {
      strong_cues: ["コンクリート壁", "地下通路", "階段", "高架下"],
      secondary_cues: ["立体駐車場", "擁壁", "粉っぽさ"],
      avoid_confusing_with: ["建築様式としての巨大量塊ならブルータリズム"]
    },
    image_search_tags: ["raw concrete corridor", "concrete urban stairway", "underground concrete passage", "concrete architecture texture"]
  }),
  entry({
    id: "glasspunk",
    name: "グラスパンク",
    reading: "グラスパンク",
    english_name: "Glasspunk",
    short_description: "透明な外皮、ガラスの高層建築、反射する都市景観を主役にした建築系タグ。",
    visual_features: ["ガラス面と反射が画面を支配する", "透明なアトリウムやドーム", "内外の境界が曖昧になる"],
    common_motifs: ["ガラスドーム", "アトリウム", "透明回廊", "高層ファサード", "反射", "温室"],
    color_tendencies: ["透明", "白", "青", "銀"],
    material_feel: ["ガラス", "鋼鉄", "アクリル"],
    light_air: "強い自然光、反射、清潔な空気、少し冷たい透明感。",
    worldview_direction: "都市の清潔さ、企業性、透明性と監視性を同時に感じさせる。",
    near_terms: ["cyberpunk", "greenhousepunk", "arcologypunk"],
    confusable_terms: [
      { id: "cyberpunk", difference: "サイバーパンクは退廃と社会構造。グラスパンクは透明素材と反射する建築が主役。" },
      { id: "greenhousepunk", difference: "温室パンクは植物と栽培空間。グラスパンクはガラス素材と反射性が中心。" }
    ],
    difference_notes: ["ガラスが単なる窓ではなく、都市の質感そのものになっているかを見る。"],
    ai_keywords: ["glasspunk", "glass city architecture", "transparent atrium", "futuristic glass dome", "ガラス建築", "透明都市"],
    tags: {
      visual_elements: ["ドーム", "高層ビル", "温室"],
      materials: ["ガラス", "鋼鉄", "アクリル"],
      lighting_air: ["自然光", "強い逆光", "白く平坦な光"],
      mood: ["清潔", "未来的", "無機質"],
      settings: ["都市", "商業施設", "庭園"],
      era_technology: ["現代", "近未来"],
      colors: ["透明", "白", "青", "銀"]
    },
    reverse_lookup: {
      strong_cues: ["ガラスドーム", "透明回廊", "反射", "アトリウム"],
      secondary_cues: ["高層ファサード", "清潔感", "企業ロビー"],
      avoid_confusing_with: ["植物栽培が主なら温室パンク"]
    },
    image_search_tags: ["glass city architecture", "transparent atrium", "futuristic glass dome", "glass skyscraper facade"]
  }),
  entry({
    id: "greenhousepunk",
    name: "温室パンク",
    reading: "おんしつパンク",
    english_name: "Greenhousepunk",
    short_description: "温室、ガラス屋根、栽培設備、植物に満ちた建築を主役にした創作タグ。",
    visual_features: ["ガラス屋根と植物がセットになる", "室内に畑や樹木がある", "配管や灌漑設備が生活空間に見える"],
    common_motifs: ["温室", "屋内庭園", "灌漑", "植物棚", "ガラス屋根", "水滴"],
    color_tendencies: ["緑", "白", "透明", "アースカラー"],
    material_feel: ["ガラス", "植物", "鋼鉄", "木材"],
    light_air: "温室光、湿気、植物の匂い、水滴の反射。",
    worldview_direction: "建築を栽培装置として扱い、暮らしと植物生産を結びつける。",
    near_terms: ["solarpunk", "glasspunk", "arcologypunk"],
    confusable_terms: [
      { id: "solarpunk", difference: "ソーラーパンクは社会全体の共生思想。温室パンクは温室建築と栽培空間に特化。" },
      { id: "glasspunk", difference: "グラスパンクは透明素材。温室パンクは植物と栽培設備が中心。" }
    ],
    difference_notes: ["植物が装飾ではなく、建築の目的や機能になっていると温室パンク。"],
    ai_keywords: ["greenhousepunk", "greenhouse city", "indoor botanical architecture", "glass roof garden", "温室都市", "屋内庭園"],
    tags: {
      visual_elements: ["温室", "庭園", "有機的"],
      materials: ["ガラス", "植物", "木材", "鋼鉄"],
      lighting_air: ["温室光", "湿気", "自然光"],
      mood: ["牧歌的", "清潔", "共同体的"],
      settings: ["庭園", "都市", "居住区"],
      era_technology: ["近未来", "未来都市"],
      colors: ["緑", "白", "透明", "アースカラー"]
    },
    reverse_lookup: {
      strong_cues: ["温室", "屋内庭園", "ガラス屋根", "灌漑"],
      secondary_cues: ["植物棚", "水滴", "湿気"],
      avoid_confusing_with: ["都市思想や太陽光が主ならソーラーパンク"]
    },
    image_search_tags: ["greenhouse city", "indoor botanical architecture", "glass roof garden", "urban greenhouse interior"]
  }),
  entry({
    id: "bamboopunk",
    name: "バンブーパンク",
    reading: "バンブーパンク",
    english_name: "Bamboopunk",
    short_description: "竹、木組み、軽い足場、自然素材の構造美を主役にする建築系創作タグ。",
    visual_features: ["竹の骨組みが露出する", "軽く編まれた構造体", "仮設と自然建築の中間に見える"],
    common_motifs: ["竹足場", "木組み", "編み込み", "高床", "吊り橋", "村落"],
    color_tendencies: ["緑", "黄土色", "アースカラー", "白"],
    material_feel: ["竹", "木材", "布", "土"],
    light_air: "自然光、木陰、湿った森の空気。",
    worldview_direction: "工業素材ではなく、軽い自然素材で作る未来・共同体・仮設性を見せる。",
    near_terms: ["solarpunk", "greenhousepunk", "desertpunk"],
    confusable_terms: [
      { id: "solarpunk", difference: "ソーラーパンクは持続可能な未来社会全体。バンブーパンクは竹や木組みの建築言語に特化。" },
      { id: "greenhousepunk", difference: "温室パンクはガラスと植物栽培。バンブーパンクは竹構造と自然素材。" }
    ],
    difference_notes: ["植物そのものより、竹や木材が構造体として読めるかを見る。"],
    ai_keywords: ["bamboopunk", "bamboo architecture", "bamboo scaffold city", "organic bamboo structure", "竹建築", "竹足場"],
    tags: {
      visual_elements: ["有機的", "橋", "庭園"],
      materials: ["竹", "木材", "布", "土"],
      lighting_air: ["自然光", "湿気", "高所の風"],
      mood: ["牧歌的", "共同体的", "神秘的"],
      settings: ["森", "庭園", "水上"],
      era_technology: ["近未来", "現代"],
      colors: ["緑", "黄土色", "アースカラー"]
    },
    reverse_lookup: {
      strong_cues: ["竹足場", "木組み", "編み込み", "高床"],
      secondary_cues: ["吊り橋", "村落", "自然光"],
      avoid_confusing_with: ["ガラス温室と植物栽培なら温室パンク"]
    },
    image_search_tags: ["bamboo architecture", "bamboo scaffold city", "organic bamboo structure", "bamboo pavilion"]
  }),
  entry({
    id: "desertpunk",
    name: "デザートパンク",
    reading: "デザートパンク",
    english_name: "Desertpunk",
    short_description: "砂漠都市、日干し煉瓦、要塞集落、乾いたインフラを主役にした建築系タグ。",
    visual_features: ["砂色の建物が地形に溶ける", "日除け、厚い壁、中庭が多い", "水や影が貴重な設計になっている"],
    common_motifs: ["砂漠都市", "日干し煉瓦", "中庭", "日除け布", "井戸", "要塞集落"],
    color_tendencies: ["黄土色", "錆色", "白", "アースカラー"],
    material_feel: ["土", "煉瓦", "布", "石材"],
    light_air: "砂塵、強い日差し、乾いた空気、夕焼け。",
    worldview_direction: "乾燥地帯で生きるための建築、交易、防衛、水管理を見せる。",
    near_terms: ["post_apocalyptic", "castlepunk", "bamboopunk"],
    confusable_terms: [
      { id: "post_apocalyptic", difference: "ポストアポカリプスは文明崩壊後。デザートパンクは砂漠環境に適応した建築が中心。" },
      { id: "castlepunk", difference: "キャッスルパンクは中世城塞。デザートパンクは乾燥地と砂色の生活建築。" }
    ],
    difference_notes: ["砂漠は舞台ではなく、建築の厚み、日陰、水管理に影響しているかを見る。"],
    ai_keywords: ["desertpunk architecture", "desert fortress city", "adobe desert city", "sandstone settlement", "砂漠都市", "日干し煉瓦"],
    tags: {
      visual_elements: ["要塞", "水路", "庭園"],
      materials: ["土", "煉瓦", "布", "石材"],
      lighting_air: ["砂塵", "強い逆光", "夕焼け"],
      mood: ["荒涼", "牧歌的", "不穏"],
      settings: ["砂漠", "要塞", "荒野"],
      era_technology: ["近世", "崩壊後"],
      colors: ["黄土色", "錆色", "白", "アースカラー"]
    },
    reverse_lookup: {
      strong_cues: ["砂漠都市", "日干し煉瓦", "中庭", "日除け"],
      secondary_cues: ["井戸", "要塞集落", "交易"],
      avoid_confusing_with: ["文明崩壊後のサバイバルが主ならポストアポカリプス"]
    },
    image_search_tags: ["desert fortress city", "adobe desert architecture", "sandstone settlement", "desert city courtyard"]
  }),
  entry({
    id: "floating_city_punk",
    name: "水上都市パンク",
    reading: "すいじょうとしパンク",
    english_name: "Floating City Punk",
    short_description: "水上都市、浮桟橋、船上建築、港湾居住区を主役にした建築系タグ。",
    visual_features: ["建物が水面や浮桟橋の上に並ぶ", "橋、船、港湾設備が生活空間になる", "水位や潮の変化が都市の形を決める"],
    common_motifs: ["水上都市", "浮桟橋", "船上住宅", "港湾", "ロープ", "市場"],
    color_tendencies: ["青", "白", "錆色", "アースカラー"],
    material_feel: ["木材", "鉄", "鋼鉄", "再生素材"],
    light_air: "水面反射、潮風、湿気、朝夕の霧。",
    worldview_direction: "陸地ではなく水面を生活基盤にする共同体や交易を見せる。",
    near_terms: ["aqueductpunk", "submerged_city_punk", "bridgepunk"],
    confusable_terms: [
      { id: "submerged_city_punk", difference: "水没都市パンクは水中や沈んだ都市。水上都市パンクは水面上で生活する。" },
      { id: "aqueductpunk", difference: "アクエダクトパンクは水を運ぶインフラ。水上都市パンクは水面に住む都市。" }
    ],
    difference_notes: ["水辺ではなく、水面そのものが地面の代わりになっているかを見る。"],
    ai_keywords: ["floating city architecture", "water city settlement", "floating platform houses", "harbor settlement", "水上都市", "浮桟橋"],
    tags: {
      visual_elements: ["水上都市", "橋", "水路"],
      materials: ["木材", "鉄", "鋼鉄", "再生素材"],
      lighting_air: ["湿気", "霧", "自然光"],
      mood: ["共同体的", "牧歌的", "不穏"],
      settings: ["水上", "港湾", "海底"],
      era_technology: ["現代", "近未来"],
      colors: ["青", "白", "錆色"]
    },
    reverse_lookup: {
      strong_cues: ["水上都市", "浮桟橋", "船上住宅", "港湾"],
      secondary_cues: ["ロープ", "市場", "潮風"],
      avoid_confusing_with: ["都市が水中に沈んでいるなら水没都市パンク"]
    },
    image_search_tags: ["floating city architecture", "water city settlement", "floating platform houses", "harbor settlement"]
  }),
  entry({
    id: "submerged_city_punk",
    name: "水没都市パンク",
    reading: "すいぼつとしパンク",
    english_name: "Submerged City Punk",
    short_description: "水没した都市、水中建築、海底ドーム、沈んだビル群を主役にした建築系タグ。",
    visual_features: ["建物が水中に沈んでいる", "水中光と気泡が都市を包む", "ドームや耐圧窓が生活圏を守る"],
    common_motifs: ["水没都市", "海底ドーム", "沈んだビル", "潜水艇", "耐圧窓", "海藻"],
    color_tendencies: ["青", "緑", "黒", "コバルトブルー"],
    material_feel: ["ガラス", "鋼鉄", "コンクリート", "植物"],
    light_air: "水中光、暗い青、浮遊感、圧力のある静けさ。",
    worldview_direction: "海面上昇、海底開発、失われた都市を水中建築として見せる。",
    near_terms: ["floating_city_punk", "solarpunk", "cosmic_horror"],
    confusable_terms: [
      { id: "floating_city_punk", difference: "水上都市は水面上の生活。水没都市は水中や沈んだ建物が中心。" },
      { id: "cosmic_horror", difference: "深海の異界感が恐怖の主役ならコズミックホラー。建築と都市が主なら水没都市パンク。" }
    ],
    difference_notes: ["水中光、耐圧構造、沈んだビルがそろうと判定しやすい。"],
    ai_keywords: ["submerged city", "underwater city architecture", "flooded skyscrapers", "undersea dome habitat", "水没都市", "海底ドーム"],
    tags: {
      visual_elements: ["水没都市", "ドーム", "巨大建築"],
      materials: ["ガラス", "鋼鉄", "コンクリート"],
      lighting_air: ["水中光", "低照度", "湿気"],
      mood: ["神秘的", "孤独", "不穏"],
      settings: ["水没都市", "海底", "都市"],
      era_technology: ["近未来", "崩壊後"],
      colors: ["青", "緑", "黒", "コバルトブルー"]
    },
    reverse_lookup: {
      strong_cues: ["水没都市", "海底ドーム", "沈んだビル", "水中光"],
      secondary_cues: ["潜水艇", "耐圧窓", "海藻"],
      avoid_confusing_with: ["水面上に住むなら水上都市パンク"]
    },
    image_search_tags: ["underwater city architecture", "submerged skyscrapers", "undersea dome habitat", "flooded city buildings"]
  }),
  entry({
    id: "skycitypunk",
    name: "空中都市パンク",
    reading: "くうちゅうとしパンク",
    english_name: "Skycitypunk",
    short_description: "浮遊都市、空中基盤、雲上の居住区を主役にした建築系創作タグ。",
    visual_features: ["都市が地面から離れている", "空中回廊や飛行船が交通になる", "雲、浮遊基盤、反重力装置が見える"],
    common_motifs: ["空中都市", "浮遊基盤", "空中回廊", "飛行船", "雲上庭園", "ドック"],
    color_tendencies: ["白", "青", "金", "銀"],
    material_feel: ["ガラス", "鋼鉄", "石材"],
    light_air: "高所の風、雲、強い日差し、空の広さ。",
    worldview_direction: "地上から切り離された階級、楽園、または孤立を建築で見せる。",
    near_terms: ["towerpunk", "steampunk", "space_opera"],
    confusable_terms: [
      { id: "towerpunk", difference: "タワーパンクは地上から伸びる塔。空中都市パンクは都市自体が浮遊・雲上にある。" },
      { id: "steampunk", difference: "飛行船があっても、蒸気機械より空中居住区が主役なら空中都市パンク。" }
    ],
    difference_notes: ["空を飛ぶ乗り物ではなく、都市や建築基盤が空にあるかを見る。"],
    ai_keywords: ["sky city", "floating city in the clouds", "aerial city architecture", "skybridge city", "空中都市", "雲上都市"],
    tags: {
      visual_elements: ["空中都市", "空中回廊", "巨大建築"],
      materials: ["ガラス", "鋼鉄", "石材"],
      lighting_air: ["高所の風", "自然光", "強い逆光"],
      mood: ["荘厳", "未来的", "孤独"],
      settings: ["空中", "都市", "塔"],
      era_technology: ["近未来", "未来都市"],
      colors: ["白", "青", "金", "銀"]
    },
    reverse_lookup: {
      strong_cues: ["空中都市", "浮遊基盤", "雲上", "空中回廊"],
      secondary_cues: ["飛行船", "ドック", "雲上庭園"],
      avoid_confusing_with: ["地上から伸びる垂直建築ならタワーパンク"]
    },
    image_search_tags: ["floating city in the clouds", "aerial city architecture", "sky city concept", "city above the clouds"]
  }),
  entry({
    id: "modularpunk",
    name: "モジュラーパンク",
    reading: "モジュラーパンク",
    english_name: "Modularpunk",
    short_description: "モジュール建築、増築ユニット、交換可能な居住ブロックを主役にした建築系タグ。",
    visual_features: ["同じ形のユニットが反復する", "増築や交換の痕跡が見える", "建物が組み替え可能なシステムに見える"],
    common_motifs: ["居住モジュール", "プレハブ", "接続ジョイント", "ユニット住宅", "通路", "配線"],
    color_tendencies: ["白", "灰色", "青", "オリーブ"],
    material_feel: ["鋼鉄", "プラスチック", "ガラス", "セラミック"],
    light_air: "白く平坦な光、機能的な清潔さ、少し仮設的な空気。",
    worldview_direction: "都市や住居を固定物ではなく、交換・拡張できる部品として扱う。",
    near_terms: ["arcologypunk", "containerpunk", "military_sf"],
    confusable_terms: [
      { id: "containerpunk", difference: "コンテナパンクは輸送コンテナの再利用感。モジュラーパンクは規格化された建築ユニット全般。" },
      { id: "arcologypunk", difference: "アーコロジーは都市機能の巨大統合。モジュラーパンクは小さなユニットの集合と交換性。" }
    ],
    difference_notes: ["同じパーツが反復し、建物が後から増減できそうに見えるかを見る。"],
    ai_keywords: ["modularpunk", "modular habitat", "prefab architecture modules", "stacked housing units", "モジュール建築", "プレハブ都市"],
    tags: {
      visual_elements: ["モジュール建築", "プレハブ", "空中回廊"],
      materials: ["鋼鉄", "プラスチック", "ガラス", "セラミック"],
      lighting_air: ["白く平坦な光", "自然光", "乾いた空気"],
      mood: ["未来的", "清潔", "無機質"],
      settings: ["居住区", "都市", "宇宙"],
      era_technology: ["近未来", "未来都市"],
      colors: ["白", "灰色", "青"]
    },
    reverse_lookup: {
      strong_cues: ["居住モジュール", "プレハブ", "反復ユニット", "接続ジョイント"],
      secondary_cues: ["通路", "配線", "仮設感"],
      avoid_confusing_with: ["輸送コンテナの再利用が強ければコンテナパンク"]
    },
    image_search_tags: ["modular habitat architecture", "prefab housing modules", "stacked modular housing", "modular city architecture"]
  }),
  entry({
    id: "containerpunk",
    name: "コンテナパンク",
    reading: "コンテナパンク",
    english_name: "Containerpunk",
    short_description: "輸送コンテナ、港湾、再利用された箱型居住区を主役にした建築系タグ。",
    visual_features: ["コンテナが積み上がって建物になる", "港湾や倉庫の質感が生活空間に残る", "仮設、低コスト、再利用の雰囲気が強い"],
    common_motifs: ["コンテナ", "港湾", "クレーン", "仮設住宅", "倉庫", "落書き"],
    color_tendencies: ["錆色", "赤", "青", "灰色"],
    material_feel: ["鋼鉄", "鉄", "再生素材"],
    light_air: "潮風、錆、工業地帯の乾いた空気。",
    worldview_direction: "物流の箱を生活や都市へ転用する、再利用と荒さの建築感。",
    near_terms: ["modularpunk", "post_apocalyptic", "factorypunk"],
    confusable_terms: [
      { id: "modularpunk", difference: "モジュラーパンクは規格化建築全般。コンテナパンクは輸送コンテナの素材感と港湾性が中心。" },
      { id: "post_apocalyptic", difference: "コンテナ利用が崩壊後サバイバルならポストアポカリプスにも寄る。" }
    ],
    difference_notes: ["箱型ユニットがコンテナ由来に見えるか、港湾・物流の痕跡があるかを見る。"],
    ai_keywords: ["containerpunk", "shipping container city", "container housing stack", "industrial container architecture", "コンテナ建築", "港湾居住区"],
    tags: {
      visual_elements: ["コンテナ", "廃工場", "モジュール建築"],
      materials: ["鋼鉄", "鉄", "再生素材"],
      lighting_air: ["乾いた空気", "自然光", "霧"],
      mood: ["退廃的", "共同体的", "無機質"],
      settings: ["港湾", "居住区", "都市"],
      era_technology: ["現代", "崩壊後"],
      colors: ["錆色", "赤", "青", "灰色"]
    },
    reverse_lookup: {
      strong_cues: ["コンテナ", "港湾", "クレーン", "仮設住宅"],
      secondary_cues: ["倉庫", "落書き", "錆"],
      avoid_confusing_with: ["規格化された清潔なユニットならモジュラーパンク"]
    },
    image_search_tags: ["shipping container city", "container housing stack", "industrial container architecture", "container village"]
  }),
  entry({
    id: "factorypunk",
    name: "ファクトリーパンク",
    reading: "ファクトリーパンク",
    english_name: "Factorypunk",
    short_description: "工場、配管、煙突、ベルトコンベア、産業設備を建築の主役にする創作タグ。",
    visual_features: ["建物より配管や機械設備が目立つ", "煙突、タンク、梁、クレーンが景観を支配する", "作業動線がそのまま空間の美学になる"],
    common_motifs: ["廃工場", "煙突", "配管", "タンク", "ベルトコンベア", "クレーン"],
    color_tendencies: ["錆色", "灰色", "黒", "琥珀色"],
    material_feel: ["鉄", "鋼鉄", "コンクリート", "煉瓦"],
    light_air: "煤けた空気、火花、低照度、油の匂い。",
    worldview_direction: "生産、労働、機械の反復を建築空間として見せる。",
    near_terms: ["dieselpunk", "steampunk", "containerpunk"],
    confusable_terms: [
      { id: "dieselpunk", difference: "ディーゼルパンクは戦間期と内燃機関の世界観。ファクトリーパンクは工場建築と生産設備が中心。" },
      { id: "steampunk", difference: "スチームパンクは蒸気と真鍮の発明感。ファクトリーパンクは工業設備全般。" }
    ],
    difference_notes: ["工場が背景ではなく、配管・設備・作業動線が画面の主役ならファクトリーパンク。"],
    ai_keywords: ["factorypunk", "industrial factory interior", "abandoned factory pipes", "industrial complex architecture", "廃工場", "工業地帯"],
    tags: {
      visual_elements: ["廃工場", "配管", "黒煙", "発電施設"],
      materials: ["鉄", "鋼鉄", "コンクリート", "煉瓦"],
      lighting_air: ["煤けた空気", "低照度", "非常灯"],
      mood: ["退廃的", "無機質", "暴力的"],
      settings: ["工場", "発電所", "都市"],
      era_technology: ["産業革命", "近代", "現代"],
      colors: ["錆色", "灰色", "黒", "琥珀色"]
    },
    reverse_lookup: {
      strong_cues: ["廃工場", "煙突", "配管", "ベルトコンベア"],
      secondary_cues: ["タンク", "クレーン", "火花"],
      avoid_confusing_with: ["戦間期軍事感が強ければディーゼルパンク"]
    },
    image_search_tags: ["industrial factory interior", "abandoned factory pipes", "industrial complex architecture", "factory machinery hall"]
  }),
  entry({
    id: "railpunk",
    name: "レールパンク",
    reading: "レールパンク",
    english_name: "Railpunk",
    short_description: "駅舎、線路、高架、車庫、鉄道インフラを主役にした建築系タグ。",
    visual_features: ["線路やホームが空間の軸になる", "駅舎や車庫が巨大な公共建築として見える", "高架やトラスが都市を貫く"],
    common_motifs: ["駅舎", "線路", "ホーム", "高架", "車庫", "時計"],
    color_tendencies: ["灰色", "錆色", "黒", "白"],
    material_feel: ["鉄", "鋼鉄", "煉瓦", "ガラス"],
    light_air: "朝霧、構内放送が聞こえそうな空気、鉄と油の匂い。",
    worldview_direction: "移動、接続、時刻表、都市の流れを鉄道建築で見せる。",
    near_terms: ["dieselpunk", "bridgepunk", "liminal_space"],
    confusable_terms: [
      { id: "dieselpunk", difference: "ディーゼルパンクは重工業と軍事感。レールパンクは駅と鉄道インフラが中心。" },
      { id: "liminal_space", difference: "無人駅の不気味さが主ならリミナルスペース。鉄道構造が主ならレールパンク。" }
    ],
    difference_notes: ["列車そのものより、駅、線路、高架、車庫が景観の中心になっているかを見る。"],
    ai_keywords: ["railpunk", "massive train station architecture", "railway depot", "elevated rail city", "駅舎", "鉄道高架"],
    tags: {
      visual_elements: ["駅舎", "橋", "巨大建築"],
      materials: ["鉄", "鋼鉄", "煉瓦", "ガラス"],
      lighting_air: ["霧", "自然光", "低照度"],
      mood: ["記念碑的", "孤独", "産業革命風"],
      settings: ["駅", "都市", "橋梁"],
      era_technology: ["産業革命", "近代", "現代"],
      colors: ["灰色", "錆色", "黒"]
    },
    reverse_lookup: {
      strong_cues: ["駅舎", "線路", "ホーム", "鉄道高架"],
      secondary_cues: ["車庫", "時計", "トラス"],
      avoid_confusing_with: ["空っぽの駅の違和感だけならリミナルスペース"]
    },
    image_search_tags: ["massive train station architecture", "railway depot interior", "elevated rail city", "historic train station hall"]
  }),
  entry({
    id: "templepunk",
    name: "テンプルパンク",
    reading: "テンプルパンク",
    english_name: "Templepunk",
    short_description: "古代神殿、祭壇、列柱、遺跡都市を主役にした神殿建築系タグ。",
    visual_features: ["列柱や階段状の祭壇が目立つ", "古代遺跡と儀式空間が同居する", "石造建築が神話的スケールを持つ"],
    common_motifs: ["神殿", "祭壇", "列柱", "古代遺跡", "聖域", "供物"],
    color_tendencies: ["白", "黄土色", "金", "灰色"],
    material_feel: ["石材", "土", "金", "木材"],
    light_air: "強い日差し、砂塵、神秘的な静けさ、儀式の煙。",
    worldview_direction: "信仰、古代文明、儀式、失われた技術を建築で見せる。",
    near_terms: ["cathedralpunk", "dungeonpunk", "cosmic_horror"],
    confusable_terms: [
      { id: "cathedralpunk", difference: "カテドラルパンクは西洋聖堂的。テンプルパンクは古代神殿や遺跡の水平・列柱感が中心。" },
      { id: "cosmic_horror", difference: "理解不能な古代神が恐怖の主役ならコズミックホラー。神殿建築が主ならテンプルパンク。" }
    ],
    difference_notes: ["聖堂ではなく、列柱、祭壇、遺跡、神殿都市として読めるかを見る。"],
    ai_keywords: ["templepunk", "ancient temple city", "stone temple ruins", "mythic temple architecture", "古代神殿", "遺跡都市"],
    tags: {
      visual_elements: ["古代遺跡", "宗教建築", "アーチ", "巨大建築"],
      materials: ["石材", "土", "木材"],
      lighting_air: ["自然光", "砂塵", "強い逆光"],
      mood: ["神秘的", "荘厳", "記念碑的"],
      settings: ["古城", "砂漠", "森"],
      era_technology: ["古代"],
      colors: ["白", "黄土色", "金", "灰色"]
    },
    reverse_lookup: {
      strong_cues: ["神殿", "祭壇", "列柱", "古代遺跡"],
      secondary_cues: ["供物", "聖域", "儀式"],
      avoid_confusing_with: ["尖塔とステンドグラスならカテドラルパンク"]
    },
    image_search_tags: ["ancient temple city", "stone temple ruins", "mythic temple architecture", "ancient ritual altar"]
  }),
  entry({
    id: "monumentpunk",
    name: "モニュメントパンク",
    reading: "モニュメントパンク",
    english_name: "Monumentpunk",
    short_description: "巨大記念碑、慰霊建築、国家的モニュメントを主役にした記念碑建築系タグ。",
    visual_features: ["人間より巨大な記念碑が中心にある", "左右対称、広場、長い階段が多い", "権力や歴史の重さを感じさせる"],
    common_motifs: ["巨大記念碑", "広場", "階段", "慰霊碑", "旗", "銅像"],
    color_tendencies: ["白", "灰色", "黒", "金"],
    material_feel: ["石材", "コンクリート", "金", "鋼鉄"],
    light_air: "強い逆光、広い空、静けさ、式典の緊張感。",
    worldview_direction: "国家、記憶、権威、英雄化を巨大な建築で見せる。",
    near_terms: ["art_deco", "megastructure_punk", "cathedralpunk"],
    confusable_terms: [
      { id: "art_deco", difference: "アールデコは装飾様式。モニュメントパンクは記念碑性と国家的スケールが中心。" },
      { id: "megastructure_punk", difference: "メガストラクチャーは巨大構造物全般。モニュメントパンクは記憶や権威の象徴性が強い。" }
    ],
    difference_notes: ["巨大さだけでなく、記念、追悼、権威、式典の気配があるかを見る。"],
    ai_keywords: ["monumentpunk", "colossal monument architecture", "memorial plaza", "authoritarian monument", "巨大記念碑", "記念碑建築"],
    tags: {
      visual_elements: ["記念碑", "巨大建築", "巨大壁"],
      materials: ["石材", "コンクリート", "金", "鋼鉄"],
      lighting_air: ["強い逆光", "自然光", "白く平坦な光"],
      mood: ["記念碑的", "荘厳", "不穏"],
      settings: ["都市", "塔", "要塞"],
      era_technology: ["近代", "現代", "戦間期"],
      colors: ["白", "灰色", "黒", "金"]
    },
    reverse_lookup: {
      strong_cues: ["巨大記念碑", "広場", "慰霊碑", "階段"],
      secondary_cues: ["旗", "銅像", "式典"],
      avoid_confusing_with: ["装飾様式が主ならアールデコ"]
    },
    image_search_tags: ["colossal monument architecture", "memorial plaza", "authoritarian monument", "giant civic monument"]
  })
];

const byId = new Map(data.entries.map((item, index) => [item.id, index]));
for (const item of newEntries) {
  if (byId.has(item.id)) {
    data.entries[byId.get(item.id)] = item;
  } else {
    data.entries.push(item);
  }
}

const comparisonGroups = [
  {
    id: "castlepunk_vs_cathedralpunk",
    terms: ["castlepunk", "cathedralpunk"],
    summary: "どちらも石造で荘厳だが、キャッスルパンクは防衛建築、カテドラルパンクは宗教建築が中心。",
    quick_check: ["城壁、堀、門楼ならキャッスルパンク。", "尖塔、ステンドグラス、祭壇ならカテドラルパンク。"]
  },
  {
    id: "arcologypunk_vs_megastructure_punk",
    terms: ["arcologypunk", "megastructure_punk"],
    summary: "アーコロジーパンクは都市機能が巨大建築内に完結し、メガストラクチャーパンクは巨大構造物のスケールそのものを重視する。",
    quick_check: ["住居、農業、交通が建物内にあるならアーコロジーパンク。", "用途より圧倒的な大きさが主ならメガストラクチャーパンク。"]
  },
  {
    id: "floating_vs_submerged_city_punk",
    terms: ["floating_city_punk", "submerged_city_punk"],
    summary: "水上都市パンクは水面上で生活し、水没都市パンクは水中や沈んだ都市を見せる。",
    quick_check: ["浮桟橋や船上住宅なら水上都市パンク。", "海底ドームや沈んだビルなら水没都市パンク。"]
  },
  {
    id: "modularpunk_vs_containerpunk",
    terms: ["modularpunk", "containerpunk"],
    summary: "どちらも箱型ユニットだが、モジュラーパンクは規格建築全般、コンテナパンクは輸送コンテナの転用感が中心。",
    quick_check: ["清潔で交換可能なユニットならモジュラーパンク。", "港湾、錆、輸送コンテナならコンテナパンク。"]
  },
  {
    id: "glasspunk_vs_greenhousepunk",
    terms: ["glasspunk", "greenhousepunk"],
    summary: "グラスパンクは透明素材と反射、温室パンクは植物栽培と湿った温室空間を重視する。",
    quick_check: ["反射するガラス都市ならグラスパンク。", "ガラス屋根と植物生産なら温室パンク。"]
  },
  {
    id: "bridgepunk_vs_railpunk",
    terms: ["bridgepunk", "railpunk"],
    summary: "ブリッジパンクは接続構造としての橋、レールパンクは駅と鉄道インフラが中心。",
    quick_check: ["巨大橋や橋上都市ならブリッジパンク。", "駅舎、線路、ホームならレールパンク。"]
  }
];

for (const group of comparisonGroups) {
  const existing = data.comparison_groups.findIndex((item) => item.id === group.id);
  if (existing >= 0) data.comparison_groups[existing] = group;
  else data.comparison_groups.push(group);
}

fs.writeFileSync(path, JSON.stringify(data, null, 2) + "\n", "utf8");
console.log(`entries=${data.entries.length} comparison_groups=${data.comparison_groups.length}`);
