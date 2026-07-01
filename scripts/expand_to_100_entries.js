const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DATA_PATH = path.join(ROOT, "data", "visual-dictionary.json");

const emptyRepresentativeImage = () => ({
  thumbnail_url: "",
  image_url: "",
  source_page_url: "",
  source: "",
  creator: "",
  license: "",
  license_url: "",
  alt: "",
  notes: ""
});

const emptyImageRefs = () => ({
  representative: null,
  thumbnail: null,
  gallery: [],
  reference_urls: [],
  notes: ""
});

function makeEntry(config) {
  const keywordSeed = [
    config.english_name,
    ...config.image_search_tags,
    ...config.common_motifs,
    ...config.visual_features
  ];

  return {
    id: config.id,
    name: config.name,
    reading: config.reading || config.name,
    english_name: config.english_name,
    short_description: config.short_description,
    visual_features: config.visual_features,
    common_motifs: config.common_motifs,
    color_tendencies: config.color_tendencies || config.tags.colors,
    material_feel: config.material_feel || config.tags.materials,
    light_air: config.light_air,
    worldview_direction: config.worldview_direction,
    near_terms: config.near_terms,
    confusable_terms: config.confusable_terms,
    difference_notes: config.difference_notes,
    ai_keywords: [...new Set(keywordSeed)],
    tags: config.tags,
    reverse_lookup: {
      strong_cues: config.strong_cues || [
        config.common_motifs[0],
        config.visual_features[0],
        ...(config.tags.visual_elements || []).slice(0, 2)
      ].filter(Boolean),
      secondary_cues: config.secondary_cues || [
        ...(config.common_motifs || []).slice(1, 4),
        ...(config.tags.settings || []).slice(0, 2)
      ].filter(Boolean),
      avoid_confusing_with: config.avoid_confusing_with || []
    },
    image_refs: emptyImageRefs(),
    image_search_tags: config.image_search_tags,
    representative_image: emptyRepresentativeImage(),
    selected_images: []
  };
}

const entriesToAdd = [
  makeEntry({
    id: "cliff_dwelling_architecture",
    name: "崖住居",
    reading: "がけじゅうきょ",
    english_name: "Cliff Dwelling Architecture",
    short_description: "崖や岩壁に住居が埋め込まれ、垂直地形そのものを生活空間にする建築。",
    visual_features: ["岩壁に窓や入口が並ぶ", "階段やはしごが垂直移動を作る", "建物と地形の境界が曖昧になる"],
    common_motifs: ["崖住居", "岩壁の窓", "階段", "吊り橋"],
    light_air: "乾いた空気、強い逆光、岩陰の低照度が混ざる。",
    worldview_direction: "地形に寄生するように住む、守りと生活が一体化した共同体。",
    near_terms: ["cave_city_architecture", "terraced_city_architecture", "castlepunk"],
    confusable_terms: [{ id: "cave_city_architecture", difference: "洞窟都市は内部空間の穴ぐら感が中心。崖住居は外から見える垂直の住居群が手がかり。" }],
    difference_notes: ["外壁のような崖面に住居が見えるなら崖住居。"],
    tags: {
      visual_elements: ["古代遺跡", "塔", "橋", "要塞"],
      materials: ["石材", "木材", "土"],
      lighting_air: ["乾いた空気", "強い逆光", "低照度"],
      mood: ["荒涼", "共同体的", "冒険的"],
      settings: ["荒野", "砂漠", "居住区"],
      era_technology: ["古代", "中世"],
      colors: ["黄土色", "アースカラー", "灰色"]
    },
    image_search_tags: ["cliff dwelling architecture", "rock cliff village", "ancient cliff houses"]
  }),
  makeEntry({
    id: "cave_city_architecture",
    name: "洞窟都市",
    reading: "どうくつとし",
    english_name: "Cave City Architecture",
    short_description: "岩山や地下空間を掘り抜き、住居・礼拝・通路を内側に作る都市様式。",
    visual_features: ["丸い穴や洞窟入口が反復する", "内部は低い天井と曲がった通路が多い", "石や土の質感が画面を支配する"],
    common_motifs: ["洞窟住居", "地下通路", "岩の礼拝堂", "採光穴"],
    light_air: "低照度、乾いた空気、入口からの自然光が強く対比する。",
    worldview_direction: "外界から守られた地下・岩中の生活共同体。",
    near_terms: ["subterranean_punk", "cliff_dwelling_architecture", "dungeonpunk"],
    confusable_terms: [{ id: "subterranean_punk", difference: "地下都市は近代インフラや配管も含む。洞窟都市は掘削された岩と土の住居感が中心。" }],
    difference_notes: ["岩を掘った丸い穴や土色の内部が主役。"],
    tags: {
      visual_elements: ["地下都市", "迷宮", "古代遺跡"],
      materials: ["石材", "土", "木材"],
      lighting_air: ["低照度", "乾いた空気", "自然光"],
      mood: ["閉塞的", "共同体的", "神秘的"],
      settings: ["地下", "荒野", "居住区"],
      era_technology: ["古代", "中世"],
      colors: ["黄土色", "アースカラー", "灰色"]
    },
    image_search_tags: ["cave city architecture", "underground cave dwellings", "rock carved city"]
  }),
  makeEntry({
    id: "stilt_house_architecture",
    name: "高床建築",
    reading: "たかゆかけんちく",
    english_name: "Stilt House Architecture",
    short_description: "水辺や湿地で建物を柱の上に持ち上げ、地面や水面から離して暮らす建築。",
    visual_features: ["細い柱が建物を支える", "水面や湿地の上に生活空間が浮く", "桟橋や階段が住居をつなぐ"],
    common_motifs: ["高床住居", "桟橋", "水上集落", "木の柱"],
    light_air: "湿気、水面反射、自然光が軽く揺れる。",
    worldview_direction: "水位変化や湿地と共存する生活建築。",
    near_terms: ["floating_city_punk", "canal_city_architecture", "fishing_village_architecture"],
    confusable_terms: [{ id: "floating_city_punk", difference: "水上都市は浮体や船上生活も含む。高床建築は固定された柱で持ち上げる点が中心。" }],
    difference_notes: ["柱脚が見え、家が水面上に持ち上がる。"],
    tags: {
      visual_elements: ["水上都市", "橋", "水路"],
      materials: ["木材", "竹", "植物"],
      lighting_air: ["湿気", "自然光", "水中光"],
      mood: ["牧歌的", "共同体的"],
      settings: ["水上", "港湾", "居住区"],
      era_technology: ["古代", "現代"],
      colors: ["アースカラー", "緑", "青"]
    },
    image_search_tags: ["stilt house village", "water stilt architecture", "wetland stilt houses"]
  }),
  makeEntry({
    id: "canal_city_architecture",
    name: "運河都市",
    reading: "うんがとし",
    english_name: "Canal City Architecture",
    short_description: "街路の代わりに運河が都市を貫き、橋と水路が景観の骨格になる都市様式。",
    visual_features: ["水路が街区を分ける", "小さな橋が反復する", "建物の入口が水面に向いている"],
    common_motifs: ["運河", "小橋", "石造護岸", "水上交通"],
    light_air: "湿気、自然光、水面反射が都市を柔らかく見せる。",
    worldview_direction: "物流、生活、景観が水路を中心に組み上がる都市。",
    near_terms: ["aqueductpunk", "floating_city_punk", "stilt_house_architecture"],
    confusable_terms: [{ id: "aqueductpunk", difference: "水道橋建築は高架の水インフラ。運河都市は街区を流れる水路と橋が中心。" }],
    difference_notes: ["都市の通りが水路になっている。"],
    tags: {
      visual_elements: ["水路", "橋", "アーチ"],
      materials: ["石材", "煉瓦", "木材"],
      lighting_air: ["湿気", "自然光", "夕焼け"],
      mood: ["牧歌的", "共同体的", "神秘的"],
      settings: ["水上", "都市", "港湾"],
      era_technology: ["近世", "現代"],
      colors: ["青", "アースカラー", "白"]
    },
    image_search_tags: ["canal city architecture", "water canal city bridges", "historic canal town"]
  }),
  makeEntry({
    id: "terraced_city_architecture",
    name: "段丘都市",
    reading: "だんきゅうとし",
    english_name: "Terraced City Architecture",
    short_description: "斜面や山腹に段状の住居・畑・通路が重なり、階層そのものが景観になる都市。",
    visual_features: ["水平の段が山腹に反復する", "階段と坂道が都市の主動線になる", "上層と下層の見晴らしが大きく違う"],
    common_motifs: ["段々畑", "階段路地", "山腹住居", "擁壁"],
    light_air: "自然光、高所の風、乾いた空気で立体感が出る。",
    worldview_direction: "地形の高低差を生活、農業、防御に使う都市。",
    near_terms: ["cliff_dwelling_architecture", "towerpunk", "garden_city"],
    confusable_terms: [{ id: "towerpunk", difference: "塔型都市は垂直の建物が主役。段丘都市は地形に沿った水平段の反復が主役。" }],
    difference_notes: ["山腹に水平の段が積み重なる。"],
    tags: {
      visual_elements: ["巨大建築", "庭園", "空中回廊"],
      materials: ["石材", "土", "植物"],
      lighting_air: ["自然光", "高所の風", "乾いた空気"],
      mood: ["共同体的", "牧歌的", "荘厳"],
      settings: ["都市", "庭園", "荒野"],
      era_technology: ["古代", "現代"],
      colors: ["緑", "黄土色", "アースカラー"]
    },
    image_search_tags: ["terraced city architecture", "mountain terrace village", "stepped hillside city"]
  }),
  makeEntry({
    id: "ziggurat_architecture",
    name: "ジッグラト建築",
    reading: "ジッグラトけんちく",
    english_name: "Ziggurat Architecture",
    short_description: "階段状に積み上がる巨大な祭祀建築で、都市の中心に人工の山を作る様式。",
    visual_features: ["階段状の巨大な基壇", "頂部に神殿や祭壇がある", "水平層が強いシルエットを作る"],
    common_motifs: ["階段神殿", "祭壇", "基壇", "古代都市"],
    light_air: "乾いた空気、強い逆光、夕焼けで記念碑的に見える。",
    worldview_direction: "都市と神域を垂直に結ぶ古代的な中心建築。",
    near_terms: ["templepunk", "pyramid_city_architecture", "monumentpunk"],
    confusable_terms: [{ id: "pyramid_city_architecture", difference: "ピラミッドは三角の量塊。ジッグラトは段状の基壇と頂上神殿が特徴。" }],
    difference_notes: ["階段状の人工山と頂部神殿。"],
    tags: {
      visual_elements: ["古代遺跡", "宗教建築", "巨大建築"],
      materials: ["石材", "土", "煉瓦"],
      lighting_air: ["乾いた空気", "強い逆光", "夕焼け"],
      mood: ["荘厳", "神秘的", "記念碑的"],
      settings: ["砂漠", "荒野", "都市"],
      era_technology: ["古代"],
      colors: ["黄土色", "アースカラー", "金"]
    },
    image_search_tags: ["ziggurat architecture", "ancient stepped temple", "Mesopotamian ziggurat city"]
  }),
  makeEntry({
    id: "pyramid_city_architecture",
    name: "ピラミッド都市",
    reading: "ピラミッドとし",
    english_name: "Pyramid City Architecture",
    short_description: "ピラミッド状の巨大建築や神殿群が都市の中心を作る、古代的な記念碑都市。",
    visual_features: ["三角形の量塊が遠景から目立つ", "広場や参道が建物へ向かう", "都市全体が儀式軸で整理される"],
    common_motifs: ["ピラミッド", "参道", "石段", "巨大広場"],
    light_air: "乾いた空気、砂塵、強い逆光で巨大さが出る。",
    worldview_direction: "支配、死後世界、天体観測が都市構造に結びつく。",
    near_terms: ["ziggurat_architecture", "templepunk", "mythic_bronze_age"],
    confusable_terms: [{ id: "ziggurat_architecture", difference: "ジッグラトは段状基壇、ピラミッド都市は三角錐の量塊と儀式軸が中心。" }],
    difference_notes: ["三角錐の巨大建築が都市を支配する。"],
    tags: {
      visual_elements: ["古代遺跡", "巨大建築", "記念碑"],
      materials: ["石材", "土"],
      lighting_air: ["乾いた空気", "砂塵", "強い逆光"],
      mood: ["記念碑的", "神秘的", "荘厳"],
      settings: ["砂漠", "荒野", "都市"],
      era_technology: ["古代"],
      colors: ["黄土色", "白", "金"]
    },
    image_search_tags: ["pyramid city architecture", "ancient pyramid urban complex", "fantasy pyramid city"]
  }),
  makeEntry({
    id: "fortress_city_architecture",
    name: "城塞都市",
    reading: "じょうさいとし",
    english_name: "Fortress City Architecture",
    short_description: "都市全体が防御施設として設計され、城壁、門、塔、居住区が一体化する様式。",
    visual_features: ["外周を厚い壁が囲む", "門楼や塔が防御の節点になる", "生活区と軍事施設が混在する"],
    common_motifs: ["城壁", "門楼", "塔", "兵舎"],
    light_air: "乾いた空気、低照度、夕焼けで重い影が出る。",
    worldview_direction: "都市生活が常に防御と戦争を前提に組み立てられている。",
    near_terms: ["castlepunk", "walled_city_architecture", "citadel_architecture"],
    confusable_terms: [{ id: "castlepunk", difference: "城郭建築は城そのもの。城塞都市は街全体が防御構造になる。" }],
    difference_notes: ["城だけでなく市街地全体が壁に守られる。"],
    tags: {
      visual_elements: ["要塞", "巨大壁", "塔", "古城"],
      materials: ["石材", "鉄", "木材"],
      lighting_air: ["乾いた空気", "低照度", "夕焼け"],
      mood: ["中世風", "軍事的", "荘厳"],
      settings: ["要塞", "古城", "都市"],
      era_technology: ["中世", "近世"],
      colors: ["灰色", "アースカラー", "黒"]
    },
    image_search_tags: ["fortress city walls", "medieval fortified city", "walled fortress town"]
  }),
  makeEntry({
    id: "walled_city_architecture",
    name: "城壁都市",
    reading: "じょうへきとし",
    english_name: "Walled City Architecture",
    short_description: "高密度の市街地が城壁や外周構造に囲まれ、内外の境界が強調される都市様式。",
    visual_features: ["周囲を明確な壁が囲む", "門を通らないと入れない構成", "内部は細い路地や密集建築になりやすい"],
    common_motifs: ["外壁", "城門", "密集路地", "監視塔"],
    light_air: "壁内は低照度や湿気がこもり、外側は自然光が強い。",
    worldview_direction: "内側と外側の差が、政治や生活の緊張を作る。",
    near_terms: ["fortress_city_architecture", "labyrinth_city_architecture", "ruined_city"],
    confusable_terms: [{ id: "fortress_city_architecture", difference: "城塞都市は軍事施設としての性格が強い。城壁都市は境界と密度が主役。" }],
    difference_notes: ["壁の内外の差と密集感を見る。"],
    tags: {
      visual_elements: ["巨大壁", "要塞", "迷宮"],
      materials: ["石材", "煉瓦", "木材"],
      lighting_air: ["低照度", "湿気", "自然光"],
      mood: ["閉塞的", "共同体的", "中世風"],
      settings: ["都市", "要塞", "居住区"],
      era_technology: ["中世", "近世", "現代"],
      colors: ["灰色", "黄土色", "アースカラー"]
    },
    image_search_tags: ["walled city architecture", "dense walled city", "old city walls gate"]
  }),
  makeEntry({
    id: "citadel_architecture",
    name: "シタデル建築",
    reading: "シタデルけんちく",
    english_name: "Citadel Architecture",
    short_description: "都市や要塞の最上部・中心に置かれる、最後の防衛拠点としての高密度な中枢建築。",
    visual_features: ["高台や中心に強固な建物がある", "外側よりさらに壁が厚い", "権力と防御が一つの量塊にまとまる"],
    common_motifs: ["中枢要塞", "高台", "指令所", "厚い門"],
    light_air: "強い逆光や低照度で、近寄りがたい権威が出る。",
    worldview_direction: "都市の支配者や軍事中枢が最後に立てこもる場所。",
    near_terms: ["fortress_city_architecture", "bunkerpunk", "monumentpunk"],
    confusable_terms: [{ id: "bunkerpunk", difference: "バンカー建築は地下や閉鎖性が中心。シタデルは都市を見下ろす中枢拠点になりやすい。" }],
    difference_notes: ["都市の中のさらに硬い中枢要塞。"],
    tags: {
      visual_elements: ["要塞", "巨大建築", "巨大壁", "塔"],
      materials: ["石材", "コンクリート", "鋼鉄"],
      lighting_air: ["強い逆光", "低照度", "乾いた空気"],
      mood: ["軍事的", "記念碑的", "荘厳"],
      settings: ["要塞", "都市", "塔"],
      era_technology: ["中世", "近未来"],
      colors: ["灰色", "黒", "白"]
    },
    image_search_tags: ["citadel architecture", "massive city citadel", "fortress command citadel"]
  }),
  makeEntry({
    id: "caravanserai_architecture",
    name: "隊商宿建築",
    reading: "たいしょうやどけんちく",
    english_name: "Caravanserai Architecture",
    short_description: "砂漠や交易路の中継地として、中庭、厚い壁、門、宿泊空間がまとまる建築。",
    visual_features: ["厚い外壁と大きな門がある", "中央に中庭や水場がある", "周囲に宿泊室や倉庫が並ぶ"],
    common_motifs: ["中庭", "門", "水場", "隊商"],
    light_air: "乾いた空気、強い日差し、日陰の低照度が対比する。",
    worldview_direction: "交易、旅、保護が一つの建築に集まる。",
    near_terms: ["bazaar_architecture", "oasis_city_architecture", "desert_fantasy"],
    confusable_terms: [{ id: "bazaar_architecture", difference: "バザール建築は商業の密度が中心。隊商宿は宿泊と保護の中庭建築が中心。" }],
    difference_notes: ["大門と中庭、旅人や荷のための空間。"],
    tags: {
      visual_elements: ["アーチ", "水路", "要塞"],
      materials: ["石材", "土", "布"],
      lighting_air: ["乾いた空気", "強い逆光", "低照度"],
      mood: ["冒険的", "共同体的", "荒涼"],
      settings: ["砂漠", "荒野", "居住区"],
      era_technology: ["古代", "中世", "近世"],
      colors: ["黄土色", "アースカラー", "白"]
    },
    image_search_tags: ["caravanserai architecture courtyard", "desert caravanserai gate", "ancient caravan inn"]
  }),
  makeEntry({
    id: "bazaar_architecture",
    name: "バザール建築",
    reading: "バザールけんちく",
    english_name: "Bazaar Architecture",
    short_description: "屋根付き市場、細い通路、布、商品、光の漏れが密集する交易空間。",
    visual_features: ["細い市場通路に商品が密集する", "布や日除けで光が細く入る", "曲がり角やアーチが多い"],
    common_motifs: ["市場通路", "屋台", "布の日除け", "商品棚"],
    light_air: "乾いた空気、低照度、隙間からの自然光が混ざる。",
    worldview_direction: "交易と生活が高密度に重なり、都市の腹の中のように機能する。",
    near_terms: ["market_hall_architecture", "caravanserai_architecture", "canal_city_architecture"],
    confusable_terms: [{ id: "market_hall_architecture", difference: "市場ホールは大空間の公共建築。バザールは細い通路と密集した商業迷路が中心。" }],
    difference_notes: ["通路型の市場密度と布の日除け。"],
    tags: {
      visual_elements: ["迷宮", "アーチ", "広告"],
      materials: ["布", "木材", "石材"],
      lighting_air: ["低照度", "乾いた空気", "自然光"],
      mood: ["共同体的", "冒険的", "中世風"],
      settings: ["都市", "商業施設"],
      era_technology: ["中世", "近世", "現代"],
      colors: ["アースカラー", "赤", "黄土色"]
    },
    image_search_tags: ["bazaar architecture", "covered bazaar alley", "traditional market passage"]
  }),
  makeEntry({
    id: "market_hall_architecture",
    name: "市場ホール建築",
    reading: "いちばホールけんちく",
    english_name: "Market Hall Architecture",
    short_description: "大屋根や鉄骨構造の下に売り場が集まる、公共的で開放感のある市場建築。",
    visual_features: ["大きな屋根と広い内部空間", "鉄骨やガラス屋根が目立つ", "売り場が整然と並ぶ"],
    common_motifs: ["大屋根", "売り場", "鉄骨", "天窓"],
    light_air: "自然光と白く平坦な光が混ざり、活気がある。",
    worldview_direction: "食料、交通、公共空間が一つにまとまる都市の台所。",
    near_terms: ["bazaar_architecture", "railpunk", "arcade_architecture"],
    confusable_terms: [{ id: "bazaar_architecture", difference: "バザールは迷路状の通路、市場ホールは大屋根の公共建築が中心。" }],
    difference_notes: ["大空間の屋根と整然とした売り場。"],
    tags: {
      visual_elements: ["駅舎", "アーチ", "巨大建築"],
      materials: ["鉄", "ガラス", "煉瓦"],
      lighting_air: ["自然光", "白く平坦な光"],
      mood: ["共同体的", "清潔"],
      settings: ["商業施設", "駅", "都市"],
      era_technology: ["近代", "現代"],
      colors: ["白", "灰色", "緑"]
    },
    image_search_tags: ["market hall architecture", "covered food market hall", "iron glass market hall"]
  }),
  makeEntry({
    id: "oasis_city_architecture",
    name: "オアシス都市",
    reading: "オアシスとし",
    english_name: "Oasis City Architecture",
    short_description: "砂漠の水源を中心に、日陰、庭園、厚い壁、交易施設が集まる都市様式。",
    visual_features: ["砂色の壁と緑の水辺が対比する", "日陰や中庭が多い", "水路や泉が都市の中心になる"],
    common_motifs: ["泉", "日陰の中庭", "ヤシ", "厚い壁"],
    light_air: "乾いた空気と水辺の湿気が強く対比する。",
    worldview_direction: "水を中心に生存、交易、宗教が集まる砂漠都市。",
    near_terms: ["desertpunk", "desert_fantasy", "caravanserai_architecture"],
    confusable_terms: [{ id: "desertpunk", difference: "砂漠建築は乾燥地建築全般。オアシス都市は水源と緑の中心性が重要。" }],
    difference_notes: ["砂漠の中の水と緑が都市の核。"],
    tags: {
      visual_elements: ["水路", "庭園", "要塞"],
      materials: ["土", "石材", "植物"],
      lighting_air: ["乾いた空気", "湿気", "自然光"],
      mood: ["牧歌的", "共同体的", "神秘的"],
      settings: ["砂漠", "庭園", "都市"],
      era_technology: ["古代", "中世", "現代"],
      colors: ["黄土色", "緑", "アースカラー"]
    },
    image_search_tags: ["oasis city architecture", "desert oasis town", "oasis garden city"]
  }),
  makeEntry({
    id: "nomadic_tent_city",
    name: "天幕都市",
    reading: "てんまくとし",
    english_name: "Nomadic Tent City",
    short_description: "布のテント、仮設の通路、移動可能な生活設備で構成される一時的な都市。",
    visual_features: ["布の屋根や柱が反復する", "建物より仮設の境界が多い", "都市なのに移動できそうな軽さがある"],
    common_motifs: ["天幕", "支柱", "ロープ", "仮設市場"],
    light_air: "乾いた空気、布越しの自然光、夜の低照度が中心。",
    worldview_direction: "定住ではなく移動と仮設性を前提にした共同体。",
    near_terms: ["caravanserai_architecture", "bazaar_architecture", "desert_fantasy"],
    confusable_terms: [{ id: "containerpunk", difference: "コンテナ建築は硬い箱型ユニット。天幕都市は布と仮設の軽さが中心。" }],
    difference_notes: ["布、ロープ、支柱でできた都市。"],
    tags: {
      visual_elements: ["水路", "庭園", "広告"],
      materials: ["布", "木材", "革"],
      lighting_air: ["乾いた空気", "自然光", "低照度"],
      mood: ["共同体的", "冒険的", "牧歌的"],
      settings: ["砂漠", "荒野", "居住区"],
      era_technology: ["古代", "現代"],
      colors: ["アースカラー", "黄土色", "赤"]
    },
    image_search_tags: ["nomadic tent city", "desert tent settlement", "temporary tent market"]
  }),
  makeEntry({
    id: "ice_city_architecture",
    name: "氷雪都市",
    reading: "ひょうせつとし",
    english_name: "Ice City Architecture",
    short_description: "氷、雪、白い壁、暖房インフラで構成される寒冷地の都市景観。",
    visual_features: ["白い雪と建物の輪郭が一体化する", "暖房や煙突が生活の中心に見える", "外部空間が厳しく内部が貴重に見える"],
    common_motifs: ["氷壁", "暖房塔", "雪道", "防寒通路"],
    light_air: "冷たい月光、白く平坦な光、霧で視界が白い。",
    worldview_direction: "寒冷環境で熱と住居を守る都市。",
    near_terms: ["icepunk", "polar_base_architecture", "arctic_sf"],
    confusable_terms: [{ id: "icepunk", difference: "アイスパンクは寒冷世界のパンク的社会。氷雪都市は建築と都市景観の型。" }],
    difference_notes: ["氷雪に覆われた都市構造そのものを見る。"],
    tags: {
      visual_elements: ["巨大壁", "発電施設", "廃墟"],
      materials: ["コンクリート", "鋼鉄", "防水素材"],
      lighting_air: ["冷たい月光", "白く平坦な光", "霧"],
      mood: ["荒涼", "共同体的", "孤独"],
      settings: ["雪原", "都市", "居住区"],
      era_technology: ["近未来", "崩壊後"],
      colors: ["白", "灰色", "青"]
    },
    image_search_tags: ["ice city architecture", "snow city buildings", "frozen city settlement"]
  }),
  makeEntry({
    id: "polar_base_architecture",
    name: "極地基地建築",
    reading: "きょくちきちけんちく",
    english_name: "Polar Base Architecture",
    short_description: "雪原に孤立する観測基地や研究施設で、機能性と隔絶感が強い建築。",
    visual_features: ["白い地平線に低い人工物が置かれる", "アンテナやタンクが目立つ", "連絡通路や防風構造が多い"],
    common_motifs: ["観測基地", "アンテナ", "雪上通路", "タンク"],
    light_air: "白く平坦な光、冷たい月光、吹雪の霧。",
    worldview_direction: "極限環境の中で科学と生活を維持する孤立した拠点。",
    near_terms: ["arctic_sf", "ice_city_architecture", "research_station_architecture"],
    confusable_terms: [{ id: "arctic_sf", difference: "極地SFは物語ジャンル。極地基地建築は基地の形と機能が中心。" }],
    difference_notes: ["雪原に孤立する機能的な基地。"],
    tags: {
      visual_elements: ["無機質", "発電施設", "モノリス"],
      materials: ["軍用金属", "防水素材", "ガラス", "コンクリート"],
      lighting_air: ["白く平坦な光", "冷たい月光", "霧"],
      mood: ["孤独", "清潔", "不穏"],
      settings: ["雪原", "研究施設"],
      era_technology: ["現代", "近未来"],
      colors: ["白", "灰色", "青", "黒"]
    },
    image_search_tags: ["polar research base architecture", "arctic station buildings", "snow research outpost"]
  }),
  makeEntry({
    id: "research_station_architecture",
    name: "研究ステーション建築",
    reading: "けんきゅうステーションけんちく",
    english_name: "Research Station Architecture",
    short_description: "研究、観測、隔離を目的に、モジュールや通路で構成される機能的な拠点建築。",
    visual_features: ["箱型モジュールが連結する", "通路、アンテナ、タンクが機能を示す", "生活感より設備感が強い"],
    common_motifs: ["研究棟", "連絡通路", "アンテナ", "タンク"],
    light_air: "蛍光灯、白く平坦な光、乾いた空気が中心。",
    worldview_direction: "未知を観測するための小さな人工環境。",
    near_terms: ["polar_base_architecture", "labcore", "modularpunk"],
    confusable_terms: [{ id: "labcore", difference: "ラボコアは室内実験器具の美学。研究ステーション建築は拠点全体の外観や構成が中心。" }],
    difference_notes: ["モジュール状の研究拠点と設備群。"],
    tags: {
      visual_elements: ["モジュール建築", "配管", "発電施設"],
      materials: ["軍用金属", "ガラス", "コンクリート", "プラスチック"],
      lighting_air: ["蛍光灯", "白く平坦な光", "乾いた空気"],
      mood: ["清潔", "無機質", "孤独"],
      settings: ["研究施設", "荒野", "雪原"],
      era_technology: ["現代", "近未来"],
      colors: ["白", "灰色", "青"]
    },
    image_search_tags: ["research station architecture", "modular science outpost", "remote research facility"]
  }),
  makeEntry({
    id: "orbital_habitat_architecture",
    name: "軌道居住区",
    reading: "きどうきょじゅうく",
    english_name: "Orbital Habitat Architecture",
    short_description: "宇宙空間に浮かぶリング、筒、モジュールで構成される人工居住環境。",
    visual_features: ["リングや円筒の巨大構造が多い", "居住区と太陽光パネルが見える", "内側に都市や庭園を抱えることがある"],
    common_motifs: ["宇宙ステーション", "リング構造", "太陽光パネル", "居住モジュール"],
    light_air: "宇宙光と白く平坦な内部光が対比する。",
    worldview_direction: "惑星ではなく人工構造物の中で暮らす宇宙文明。",
    near_terms: ["space_opera", "arcologypunk", "terraforming_sf"],
    confusable_terms: [{ id: "space_opera", difference: "スペースオペラは物語スケール。軌道居住区は宇宙生活の建築・都市構造が中心。" }],
    difference_notes: ["宇宙空間にある居住用巨大構造物。"],
    tags: {
      visual_elements: ["ドーム", "巨大建築", "空中都市"],
      materials: ["軍用金属", "ガラス", "クローム"],
      lighting_air: ["宇宙光", "白く平坦な光"],
      mood: ["未来的", "荘厳", "孤独"],
      settings: ["宇宙", "居住区"],
      era_technology: ["宇宙文明", "遠未来"],
      colors: ["白", "銀", "黒", "青"]
    },
    image_search_tags: ["orbital habitat architecture", "space colony ring habitat", "O'Neill cylinder city"]
  }),
  makeEntry({
    id: "generation_ship_interior",
    name: "世代宇宙船内部",
    reading: "せだいうちゅうせんないぶ",
    english_name: "Generation Ship Interior",
    short_description: "長期航行する宇宙船の中に、居住区、農業、公共空間が都市のように入る内部構造。",
    visual_features: ["船内なのに街や畑がある", "天井や壁に機械設備が見える", "閉鎖空間に世代生活の痕跡がある"],
    common_motifs: ["船内居住区", "人工農場", "長い廊下", "中央軸"],
    light_air: "白く平坦な光、宇宙光、閉塞した低照度が混ざる。",
    worldview_direction: "移動する船が都市と世界の代わりになる。",
    near_terms: ["orbital_habitat_architecture", "military_sf", "arcologypunk"],
    confusable_terms: [{ id: "orbital_habitat_architecture", difference: "軌道居住区は定置型の宇宙都市。世代宇宙船内部は航行する船の閉じた都市。" }],
    difference_notes: ["船内に都市や農場がある。"],
    tags: {
      visual_elements: ["巨大建築", "配管", "庭園", "モジュール建築"],
      materials: ["軍用金属", "ガラス", "植物"],
      lighting_air: ["白く平坦な光", "宇宙光", "低照度"],
      mood: ["未来的", "閉塞的", "共同体的"],
      settings: ["宇宙", "居住区", "研究施設"],
      era_technology: ["宇宙文明", "遠未来"],
      colors: ["白", "灰色", "緑", "青"]
    },
    image_search_tags: ["generation ship interior", "space ark interior city", "generation starship habitat"]
  }),
  makeEntry({
    id: "mecha_hangar_architecture",
    name: "メカ格納庫",
    reading: "メカかくのうこ",
    english_name: "Mecha Hangar Architecture",
    short_description: "巨大ロボットや兵器を整備するための、足場、クレーン、照明が密集した格納空間。",
    visual_features: ["巨大な機体に対して人や足場が小さい", "クレーンや整備通路が立体的に走る", "軍事施設と工場の中間に見える"],
    common_motifs: ["巨大ロボット", "整備足場", "クレーン", "格納庫扉"],
    light_air: "低照度、蛍光灯、非常灯、煤けた空気が混ざる。",
    worldview_direction: "兵器や機械を保守する巨大な裏方空間。",
    near_terms: ["military_sf", "factorypunk", "bunkerpunk"],
    confusable_terms: [{ id: "factorypunk", difference: "ファクトリー建築は生産設備全般。メカ格納庫は巨大機体の整備・収納が中心。" }],
    difference_notes: ["巨大ロボットや兵器を支える足場が主役。"],
    tags: {
      visual_elements: ["巨大建築", "廃工場", "配管", "発電施設"],
      materials: ["軍用金属", "鋼鉄", "コンクリート"],
      lighting_air: ["蛍光灯", "非常灯", "煤けた空気"],
      mood: ["軍事的", "未来的", "無機質"],
      settings: ["工場", "戦場", "研究施設"],
      era_technology: ["近未来", "遠未来"],
      colors: ["灰色", "黒", "赤", "シアン"]
    },
    image_search_tags: ["mecha hangar architecture", "giant robot maintenance bay", "sci fi military hangar"]
  }),
  makeEntry({
    id: "airport_city_architecture",
    name: "空港都市",
    reading: "くうこうとし",
    english_name: "Airport City Architecture",
    short_description: "滑走路、ターミナル、ホテル、商業施設が一体化し、空港が都市の中心になる構造。",
    visual_features: ["巨大なターミナルと交通動線が中心", "ガラス屋根や長い通路が多い", "都市なのに移動と待機の場所に見える"],
    common_motifs: ["ターミナル", "滑走路", "搭乗口", "空港ホテル"],
    light_air: "白く平坦な光、自然光、夜の低照度が混ざる。",
    worldview_direction: "移動、物流、商業が巨大空港の周囲で都市化する。",
    near_terms: ["airport_liminal", "railpunk", "corporate_modernism"],
    confusable_terms: [{ id: "airport_liminal", difference: "空港リミナルは空港の空白感。空港都市は空港が都市機能を持つ構造。" }],
    difference_notes: ["ターミナルが都市規模に拡張する。"],
    tags: {
      visual_elements: ["巨大建築", "ガラス", "空中回廊"],
      materials: ["ガラス", "軍用金属", "コンクリート"],
      lighting_air: ["白く平坦な光", "自然光", "低照度"],
      mood: ["未来的", "清潔", "無機質"],
      settings: ["空港", "商業施設", "都市"],
      era_technology: ["現代", "近未来"],
      colors: ["白", "灰色", "青"]
    },
    image_search_tags: ["airport city architecture", "futuristic airport terminal city", "large airport urban complex"]
  }),
  makeEntry({
    id: "transit_hub_architecture",
    name: "交通結節点建築",
    reading: "こうつうけっせつてんけんちく",
    english_name: "Transit Hub Architecture",
    short_description: "駅、バスターミナル、商業施設、通路が多層に接続する移動の巨大建築。",
    visual_features: ["通路や階段が複数方向へ分岐する", "案内サインや人の流れが景観を作る", "鉄道、バス、商業が重なる"],
    common_motifs: ["駅", "連絡通路", "エスカレーター", "案内サイン"],
    light_air: "蛍光灯、自然光、白く平坦な光が混ざる。",
    worldview_direction: "都市の流れが一点に集中し、建築が動線そのものになる。",
    near_terms: ["railpunk", "airport_city_architecture", "mallsoft"],
    confusable_terms: [{ id: "railpunk", difference: "鉄道建築は鉄道と駅舎が主役。交通結節点建築は複数交通と商業の接続が中心。" }],
    difference_notes: ["複数の移動手段が多層に接続する。"],
    tags: {
      visual_elements: ["駅舎", "空中回廊", "広告", "巨大建築"],
      materials: ["ガラス", "鉄", "コンクリート"],
      lighting_air: ["蛍光灯", "自然光", "白く平坦な光"],
      mood: ["無機質", "共同体的", "未来的"],
      settings: ["駅", "商業施設", "都市"],
      era_technology: ["現代", "近未来"],
      colors: ["白", "灰色", "青"]
    },
    image_search_tags: ["transit hub architecture", "multi level station concourse", "urban transport hub"]
  }),
  makeEntry({
    id: "arcade_architecture",
    name: "アーケード街",
    reading: "アーケードがい",
    english_name: "Arcade Street Architecture",
    short_description: "屋根付き商店街や回廊状の商業空間で、連続する店舗と天井が街路を室内化する。",
    visual_features: ["長い屋根が通りを覆う", "店舗看板が連続する", "外の街路と室内商業施設の中間に見える"],
    common_motifs: ["商店街", "ガラス屋根", "看板", "アーチ回廊"],
    light_air: "自然光、蛍光灯、雨の日の湿気が混ざる。",
    worldview_direction: "街路を保護された商業空間として持続させる都市形式。",
    near_terms: ["market_hall_architecture", "mallsoft", "neon_noir"],
    confusable_terms: [{ id: "mallsoft", difference: "モールソフトは空の商業施設の空虚感。アーケード街は屋根付き街路と連続店舗が中心。" }],
    difference_notes: ["通りが屋根で覆われ、店が連続する。"],
    tags: {
      visual_elements: ["広告", "アーチ", "水路"],
      materials: ["ガラス", "鉄", "タイル"],
      lighting_air: ["蛍光灯", "自然光", "湿気"],
      mood: ["共同体的", "退廃的", "清潔"],
      settings: ["商業施設", "都市"],
      era_technology: ["近代", "現代"],
      colors: ["白", "緑", "赤"]
    },
    image_search_tags: ["covered arcade street", "shopping arcade architecture", "glass roof shopping street"]
  }),
  makeEntry({
    id: "alleyway_urbanism",
    name: "路地都市",
    reading: "ろじとし",
    english_name: "Alleyway Urbanism",
    short_description: "細い路地、密集した建物、配管、看板が都市の生活感を作る高密度な街区。",
    visual_features: ["狭い通路に生活要素があふれる", "配管、室外機、看板が近い", "見通しが悪く迷路状に感じる"],
    common_motifs: ["細い路地", "看板", "配管", "階段"],
    light_air: "低照度、湿気、雨、ネオンが混ざる。",
    worldview_direction: "大通りではなく裏側の生活密度で都市を見せる。",
    near_terms: ["neon_noir", "cyberpunk", "walled_city_architecture"],
    confusable_terms: [{ id: "cyberpunk", difference: "サイバーパンクは近未来社会設定が必要。路地都市は狭い生活街区の構造に焦点がある。" }],
    difference_notes: ["狭い路地と生活設備の密度が主役。"],
    tags: {
      visual_elements: ["広告", "配管", "雨", "ネオン"],
      materials: ["コンクリート", "鉄", "プラスチック"],
      lighting_air: ["低照度", "湿気", "雨"],
      mood: ["退廃的", "共同体的", "不穏"],
      settings: ["都市", "商業施設", "居住区"],
      era_technology: ["現代", "近未来"],
      colors: ["黒", "灰色", "赤", "青"]
    },
    image_search_tags: ["dense urban alleyway", "narrow city alley architecture", "crowded alley urbanism"]
  }),
  makeEntry({
    id: "skybridge_city_architecture",
    name: "空中回廊都市",
    reading: "くうちゅうかいろうとし",
    english_name: "Skybridge City Architecture",
    short_description: "高層ビルや塔を空中回廊で結び、地上より上空の移動が都市の骨格になる様式。",
    visual_features: ["建物同士を橋が何層にも結ぶ", "地上が遠く、上層の生活圏が目立つ", "水平の空中通路が密集する"],
    common_motifs: ["空中回廊", "連絡橋", "高層ビル", "塔"],
    light_air: "高所の風、自然光、霧で距離感が出る。",
    worldview_direction: "都市生活が地上から切り離され、上層のネットワークに移る。",
    near_terms: ["towerpunk", "skycitypunk", "bridgepunk"],
    confusable_terms: [{ id: "towerpunk", difference: "塔型都市は縦の量感、空中回廊都市は建物間を結ぶ水平ネットワークが中心。" }],
    difference_notes: ["空中の橋が都市の主動線になる。"],
    tags: {
      visual_elements: ["空中回廊", "高層ビル", "巨大建築", "橋"],
      materials: ["ガラス", "鋼鉄", "コンクリート"],
      lighting_air: ["高所の風", "自然光", "霧"],
      mood: ["未来的", "無機質", "荘厳"],
      settings: ["都市", "空中", "塔"],
      era_technology: ["近未来", "未来都市"],
      colors: ["白", "灰色", "青"]
    },
    image_search_tags: ["skybridge city architecture", "high rise city sky bridges", "futuristic skybridge urbanism"]
  }),
  makeEntry({
    id: "elevated_walkway_architecture",
    name: "高架歩道都市",
    reading: "こうかほどうとし",
    english_name: "Elevated Walkway Architecture",
    short_description: "歩行者用デッキや高架通路が街区を接続し、地上交通と歩行者を分離する都市空間。",
    visual_features: ["歩道が地上から持ち上がる", "商業施設や駅をデッキが結ぶ", "地上と上階の二重都市に見える"],
    common_motifs: ["歩行者デッキ", "階段", "駅前広場", "連絡通路"],
    light_air: "自然光、白く平坦な光、都市の反射が混ざる。",
    worldview_direction: "歩行者の動線が人工地盤として都市を再編する。",
    near_terms: ["skybridge_city_architecture", "transit_hub_architecture", "brutalism"],
    confusable_terms: [{ id: "skybridge_city_architecture", difference: "空中回廊都市は高層間の橋。高架歩道都市は駅前や低中層の歩行者デッキが中心。" }],
    difference_notes: ["駅前や商業施設を結ぶ人工地盤を見る。"],
    tags: {
      visual_elements: ["空中回廊", "橋", "駅舎"],
      materials: ["コンクリート", "鋼鉄", "ガラス"],
      lighting_air: ["自然光", "白く平坦な光"],
      mood: ["無機質", "清潔", "共同体的"],
      settings: ["駅", "都市", "商業施設"],
      era_technology: ["現代", "近未来"],
      colors: ["灰色", "白", "青"]
    },
    image_search_tags: ["elevated pedestrian walkway city", "urban skywalk architecture", "station pedestrian deck"]
  }),
  makeEntry({
    id: "sewer_city_architecture",
    name: "下水道都市",
    reading: "げすいどうとし",
    english_name: "Sewer City Architecture",
    short_description: "下水管、排水路、点検通路、湿った地下空間が都市の裏側として広がる構造。",
    visual_features: ["円形トンネルや排水路が反復する", "湿った壁と水面が目立つ", "生活圏ではないのに都市のように広い"],
    common_motifs: ["排水路", "点検通路", "配管", "地下水路"],
    light_air: "湿気、低照度、非常灯、水面反射が中心。",
    worldview_direction: "都市の不要物とインフラが隠れて流れる裏側の世界。",
    near_terms: ["subterranean_punk", "dungeonpunk", "utility_tunnel_architecture"],
    confusable_terms: [{ id: "dungeonpunk", difference: "地下迷宮は冒険や罠の空間。下水道都市は排水インフラと湿った実用空間が中心。" }],
    difference_notes: ["水と配管、点検通路が主役。"],
    tags: {
      visual_elements: ["地下都市", "配管", "水路", "迷宮"],
      materials: ["コンクリート", "鉄", "タイル"],
      lighting_air: ["湿気", "低照度", "非常灯"],
      mood: ["閉塞的", "不穏", "無機質"],
      settings: ["地下", "都市"],
      era_technology: ["現代", "近未来"],
      colors: ["灰色", "黒", "緑"]
    },
    image_search_tags: ["sewer city tunnels", "underground sewer architecture", "large drainage tunnel"]
  }),
  makeEntry({
    id: "utility_tunnel_architecture",
    name: "共同溝建築",
    reading: "きょうどうこうけんちく",
    english_name: "Utility Tunnel Architecture",
    short_description: "電気、通信、水道、空調などのインフラ配管がまとめて通る地下管理空間。",
    visual_features: ["壁面に配管やケーブルが密集する", "人が歩ける管理通路がある", "機能だけの無機質な地下空間"],
    common_motifs: ["配管", "ケーブル", "点検通路", "制御盤"],
    light_air: "蛍光灯、非常灯、低照度で機械的に見える。",
    worldview_direction: "都市を動かす見えない器官としての地下インフラ。",
    near_terms: ["subterranean_punk", "sewer_city_architecture", "factorypunk"],
    confusable_terms: [{ id: "sewer_city_architecture", difference: "下水道都市は水路と排水。共同溝建築は配管・ケーブル・制御盤が中心。" }],
    difference_notes: ["乾いた管理通路と配線配管が多い。"],
    tags: {
      visual_elements: ["配管", "地下都市", "無機質"],
      materials: ["鉄", "コンクリート", "プラスチック"],
      lighting_air: ["蛍光灯", "非常灯", "低照度"],
      mood: ["無機質", "閉塞的", "不穏"],
      settings: ["地下", "都市"],
      era_technology: ["現代", "近未来"],
      colors: ["灰色", "白", "赤"]
    },
    image_search_tags: ["utility tunnel architecture", "underground service tunnel pipes", "infrastructure tunnel"]
  }),
  makeEntry({
    id: "data_center_architecture",
    name: "データセンター建築",
    reading: "データセンターけんちく",
    english_name: "Data Center Architecture",
    short_description: "サーバーラック、冷却設備、無窓の箱型建築で構成される情報インフラ空間。",
    visual_features: ["ラックや冷却列が反復する", "外観は無窓で箱型になりやすい", "白や青の光で清潔だが人間味が薄い"],
    common_motifs: ["サーバーラック", "冷却設備", "ケーブル", "無窓外壁"],
    light_air: "白く平坦な光、蛍光灯、冷たい青い反射が中心。",
    worldview_direction: "都市や社会の記憶が、無機質な情報倉庫に集まる。",
    near_terms: ["corporate_modernism", "surveillance_futurism", "labcore"],
    confusable_terms: [{ id: "corporate_modernism", difference: "企業モダニズムはオフィスやロビー。データセンター建築はサーバーと冷却設備が中心。" }],
    difference_notes: ["ラックの反復と冷却設備を見る。"],
    tags: {
      visual_elements: ["無機質", "配管", "モジュール建築"],
      materials: ["軍用金属", "ガラス", "プラスチック"],
      lighting_air: ["白く平坦な光", "蛍光灯"],
      mood: ["無機質", "清潔", "未来的"],
      settings: ["研究施設", "商業施設"],
      era_technology: ["現代", "近未来"],
      colors: ["白", "青", "灰色", "黒"]
    },
    image_search_tags: ["data center architecture", "server room rows", "data center cooling corridor"]
  }),
  makeEntry({
    id: "archive_architecture",
    name: "アーカイブ建築",
    reading: "アーカイブけんちく",
    english_name: "Archive Architecture",
    short_description: "書庫、棚、保管箱、閲覧室が秩序立って並ぶ、記録保存のための建築空間。",
    visual_features: ["棚や箱が規則的に反復する", "閲覧室と保管室が分かれる", "静かで乾いた保存空間に見える"],
    common_motifs: ["書庫", "棚", "保管箱", "閲覧机"],
    light_air: "低照度、白く平坦な光、乾いた空気で静か。",
    worldview_direction: "知識や記録を守るための、時間に抵抗する建築。",
    near_terms: ["dark_academia", "library_architecture", "monastic_minimalism"],
    confusable_terms: [{ id: "library_architecture", difference: "図書館建築は閲覧や公共性も強い。アーカイブ建築は保存と管理が中心。" }],
    difference_notes: ["見せる本棚より、保管と秩序の棚が主役。"],
    tags: {
      visual_elements: ["無機質", "迷宮"],
      materials: ["木材", "布", "鉄"],
      lighting_air: ["低照度", "白く平坦な光", "乾いた空気"],
      mood: ["孤独", "清潔", "神秘的"],
      settings: ["学校", "研究施設"],
      era_technology: ["近世", "現代"],
      colors: ["セピア", "白", "灰色", "黒"]
    },
    image_search_tags: ["archive architecture storage shelves", "records archive room", "document archive interior"]
  }),
  makeEntry({
    id: "library_architecture",
    name: "図書館建築",
    reading: "としょかんけんちく",
    english_name: "Library Architecture",
    short_description: "書架、閲覧室、吹き抜け、静かな光で構成される知識の公共建築。",
    visual_features: ["本棚が壁や階層を作る", "閲覧机や吹き抜けが中心になる", "静けさと公共性が同居する"],
    common_motifs: ["書架", "閲覧室", "吹き抜け", "階段"],
    light_air: "自然光、低照度、白く平坦な光が静かに混ざる。",
    worldview_direction: "知識を集め、読むための公共的な聖堂。",
    near_terms: ["archive_architecture", "dark_academia", "monastic_minimalism"],
    confusable_terms: [{ id: "archive_architecture", difference: "アーカイブは保存管理が中心。図書館は閲覧と公共空間の見え方が中心。" }],
    difference_notes: ["本を読む場所としての開放感がある。"],
    tags: {
      visual_elements: ["宗教建築", "アーチ", "迷宮"],
      materials: ["木材", "石材", "ガラス"],
      lighting_air: ["自然光", "低照度", "白く平坦な光"],
      mood: ["神秘的", "清潔", "孤独"],
      settings: ["学校", "商業施設"],
      era_technology: ["近世", "現代"],
      colors: ["セピア", "白", "琥珀色", "灰色"]
    },
    image_search_tags: ["library architecture reading room", "grand library interior", "modern library atrium"]
  }),
  makeEntry({
    id: "monastery_architecture",
    name: "修道院建築",
    reading: "しゅうどういんけんちく",
    english_name: "Monastery Architecture",
    short_description: "回廊、中庭、礼拝堂、簡素な居室が祈りと共同生活を支える宗教建築。",
    visual_features: ["回廊が中庭を囲む", "石壁と木の扉が静かに反復する", "装飾より沈黙と秩序が強い"],
    common_motifs: ["回廊", "中庭", "礼拝堂", "修道房"],
    light_air: "自然光、蝋燭光、低照度で静かな空気。",
    worldview_direction: "共同生活、祈り、禁欲が空間構成になる。",
    near_terms: ["monastic_minimalism", "cathedralpunk", "library_architecture"],
    confusable_terms: [{ id: "cathedralpunk", difference: "聖堂建築は巨大な礼拝空間。修道院建築は生活、回廊、中庭の共同体が中心。" }],
    difference_notes: ["礼拝堂だけでなく回廊と生活空間が見える。"],
    tags: {
      visual_elements: ["宗教建築", "アーチ", "庭園", "蝋燭"],
      materials: ["石材", "木材", "布"],
      lighting_air: ["自然光", "蝋燭光", "低照度"],
      mood: ["神秘的", "共同体的", "清潔"],
      settings: ["古城", "庭園", "学校"],
      era_technology: ["中世", "近世"],
      colors: ["白", "灰色", "琥珀色"]
    },
    image_search_tags: ["monastery architecture cloister", "stone monastery courtyard", "monastery corridor"]
  }),
  makeEntry({
    id: "cloister_architecture",
    name: "回廊建築",
    reading: "かいろうけんちく",
    english_name: "Cloister Architecture",
    short_description: "中庭や聖域を囲む連続したアーチ付き通路で、歩行と静けさを作る建築要素。",
    visual_features: ["同じアーチが連続する", "中庭を囲んで歩く構造", "外光と影が規則的なリズムを作る"],
    common_motifs: ["連続アーチ", "中庭", "石柱", "回廊の影"],
    light_air: "自然光と低照度がアーチごとに反復する。",
    worldview_direction: "移動を儀式化し、内部の静けさを保つ通路建築。",
    near_terms: ["monastery_architecture", "cathedralpunk", "aqueductpunk"],
    confusable_terms: [{ id: "monastery_architecture", difference: "修道院建築は施設全体。回廊建築は中庭を囲む通路要素に焦点を当てる。" }],
    difference_notes: ["アーチの反復と中庭を囲む歩行空間。"],
    tags: {
      visual_elements: ["アーチ", "宗教建築", "庭園"],
      materials: ["石材", "木材"],
      lighting_air: ["自然光", "低照度"],
      mood: ["神秘的", "清潔", "孤独"],
      settings: ["古城", "庭園", "学校"],
      era_technology: ["中世", "近世"],
      colors: ["白", "灰色", "緑"]
    },
    image_search_tags: ["cloister architecture", "arched cloister courtyard", "monastery cloister walkway"]
  }),
  makeEntry({
    id: "observatory_architecture",
    name: "天文台建築",
    reading: "てんもんだいけんちく",
    english_name: "Observatory Architecture",
    short_description: "ドーム、望遠鏡、高所、夜空を中心にした観測のための建築。",
    visual_features: ["丸いドームや開閉屋根が目立つ", "山頂や孤立した場所に立つ", "建物が空を見る装置に見える"],
    common_motifs: ["望遠鏡ドーム", "山頂", "観測室", "星空"],
    light_air: "宇宙光、冷たい月光、低照度が中心。",
    worldview_direction: "建築が地上と宇宙をつなぐ観測装置になる。",
    near_terms: ["cosmic_horror", "research_station_architecture", "orbital_habitat_architecture"],
    confusable_terms: [{ id: "research_station_architecture", difference: "研究ステーションは多目的な拠点。天文台建築は空を見るドームや望遠鏡が中心。" }],
    difference_notes: ["ドームと望遠鏡、星空への向き。"],
    tags: {
      visual_elements: ["ドーム", "塔", "モノリス"],
      materials: ["コンクリート", "ガラス", "軍用金属"],
      lighting_air: ["宇宙光", "冷たい月光", "低照度"],
      mood: ["神秘的", "孤独", "未来的"],
      settings: ["宇宙", "荒野", "研究施設"],
      era_technology: ["現代", "近未来"],
      colors: ["白", "黒", "コバルトブルー"]
    },
    image_search_tags: ["observatory architecture dome", "mountain astronomical observatory", "telescope dome building"]
  }),
  makeEntry({
    id: "planetarium_architecture",
    name: "プラネタリウム建築",
    reading: "プラネタリウムけんちく",
    english_name: "Planetarium Architecture",
    short_description: "半球ドーム、暗い観客席、人工の星空で構成される屋内宇宙体験の建築。",
    visual_features: ["内側から見上げる半球ドーム", "客席が中央や下方に沈む", "人工の星空が天井を覆う"],
    common_motifs: ["半球ドーム", "星空投影", "暗い客席", "中央投影機"],
    light_air: "低照度、宇宙光、白く平坦な投影光が中心。",
    worldview_direction: "宇宙を屋内の教育・体験空間として再現する。",
    near_terms: ["observatory_architecture", "dome_city_architecture", "liminal_space"],
    confusable_terms: [{ id: "observatory_architecture", difference: "天文台は実際に空を観測する。プラネタリウムは室内で星空を投影する。" }],
    difference_notes: ["内側から見る半球ドームと客席が手がかり。"],
    tags: {
      visual_elements: ["ドーム", "無機質", "幾何学"],
      materials: ["コンクリート", "プラスチック", "ガラス"],
      lighting_air: ["低照度", "宇宙光", "白く平坦な光"],
      mood: ["神秘的", "清潔", "孤独"],
      settings: ["商業施設", "学校", "宇宙"],
      era_technology: ["現代", "近未来"],
      colors: ["黒", "青", "白"]
    },
    image_search_tags: ["planetarium interior dome", "planetarium architecture", "star dome theater"]
  }),
  makeEntry({
    id: "dome_city_architecture",
    name: "ドーム都市",
    reading: "ドームとし",
    english_name: "Dome City Architecture",
    short_description: "巨大な透明ドームや耐圧覆いで、内部の都市環境を外界から守る構造。",
    visual_features: ["都市全体を覆うドームがある", "外部環境と内部の差がはっきりする", "ガラスや骨組みの曲面が目立つ"],
    common_motifs: ["巨大ドーム", "内部都市", "環境制御", "耐圧窓"],
    light_air: "自然光や宇宙光がドーム越しに入り、内部は白く平坦に照らされる。",
    worldview_direction: "外部環境が危険な場所で、人工的な空を作って暮らす。",
    near_terms: ["terraforming_sf", "greenhousepunk", "submerged_city_punk"],
    confusable_terms: [{ id: "greenhousepunk", difference: "温室建築は植物栽培が中心。ドーム都市は都市環境全体を覆う保護構造が中心。" }],
    difference_notes: ["都市規模の覆いと内外の環境差を見る。"],
    tags: {
      visual_elements: ["ドーム", "巨大建築", "庭園"],
      materials: ["ガラス", "軍用金属", "コンクリート"],
      lighting_air: ["自然光", "宇宙光", "白く平坦な光"],
      mood: ["未来的", "清潔", "閉塞的"],
      settings: ["宇宙", "海底", "都市"],
      era_technology: ["近未来", "宇宙文明"],
      colors: ["透明", "白", "青", "緑"]
    },
    image_search_tags: ["dome city architecture", "futuristic city under glass dome", "sealed dome habitat"]
  }),
  makeEntry({
    id: "bio_dome_architecture",
    name: "バイオドーム",
    reading: "バイオドーム",
    english_name: "Biodome Architecture",
    short_description: "ドーム内部に植物、生態系、研究設備を閉じ込めた実験的な環境建築。",
    visual_features: ["透明ドームの中に植物が密集する", "研究施設と温室が一体化する", "人工的な生態系の閉鎖感がある"],
    common_motifs: ["生態系ドーム", "植物群", "研究通路", "灌漑設備"],
    light_air: "温室光、湿気、自然光が濃くこもる。",
    worldview_direction: "自然をそのまま守るのではなく、人工環境として設計し直す。",
    near_terms: ["greenhousepunk", "dome_city_architecture", "biopunk"],
    confusable_terms: [{ id: "greenhousepunk", difference: "温室建築は栽培空間全般。バイオドームは閉じた生態系や研究施設の性格が強い。" }],
    difference_notes: ["ドームと生態系実験がセット。"],
    tags: {
      visual_elements: ["ドーム", "温室", "有機的", "庭園"],
      materials: ["ガラス", "植物", "軍用金属"],
      lighting_air: ["温室光", "湿気", "自然光"],
      mood: ["未来的", "牧歌的", "清潔"],
      settings: ["研究施設", "庭園", "宇宙"],
      era_technology: ["バイオテクノロジー", "近未来"],
      colors: ["緑", "透明", "白"]
    },
    image_search_tags: ["biodome architecture", "closed ecosystem dome", "futuristic biodome greenhouse"]
  }),
  makeEntry({
    id: "vertical_farm_architecture",
    name: "垂直農場",
    reading: "すいちょくのうじょう",
    english_name: "Vertical Farm Architecture",
    short_description: "多層棚、LED、灌漑設備で都市内部に食料生産を積み上げる建築。",
    visual_features: ["植物棚が何層にも反復する", "LEDや配管が農場の一部になる", "農業なのに工場や研究施設に見える"],
    common_motifs: ["栽培棚", "LED照明", "灌漑配管", "都市農場"],
    light_air: "温室光、蛍光灯、湿気が人工的に重なる。",
    worldview_direction: "土地ではなく建築内部で食料を作る都市インフラ。",
    near_terms: ["greenhousepunk", "bio_dome_architecture", "solarpunk"],
    confusable_terms: [{ id: "greenhousepunk", difference: "温室建築はガラス屋根と植物空間。垂直農場は多層棚と生産設備の反復が中心。" }],
    difference_notes: ["植物が棚やラックとして積層する。"],
    tags: {
      visual_elements: ["温室", "有機的", "配管", "モジュール建築"],
      materials: ["植物", "ガラス", "プラスチック", "軍用金属"],
      lighting_air: ["温室光", "蛍光灯", "湿気"],
      mood: ["未来的", "清潔", "共同体的"],
      settings: ["研究施設", "都市", "庭園"],
      era_technology: ["近未来", "バイオテクノロジー"],
      colors: ["緑", "白", "シアン"]
    },
    image_search_tags: ["vertical farm architecture", "indoor vertical farming racks", "urban vertical greenhouse"]
  }),
  makeEntry({
    id: "hydroponic_city_architecture",
    name: "水耕都市",
    reading: "すいこうとし",
    english_name: "Hydroponic City Architecture",
    short_description: "水路、栽培槽、透明配管が都市生活と結びつく、水耕栽培中心の都市様式。",
    visual_features: ["水槽や栽培槽が生活空間に入る", "透明な配管や水路が多い", "都市と農業が湿った設備でつながる"],
    common_motifs: ["栽培槽", "透明配管", "水路", "水耕棚"],
    light_air: "湿気、水中光、温室光で青緑に見える。",
    worldview_direction: "水と植物を都市インフラとして循環させる未来生活。",
    near_terms: ["vertical_farm_architecture", "greenhousepunk", "canal_city_architecture"],
    confusable_terms: [{ id: "vertical_farm_architecture", difference: "垂直農場は積層棚。水耕都市は水路と栽培槽が生活空間に広がる。" }],
    difference_notes: ["水と植物の循環設備が主役。"],
    tags: {
      visual_elements: ["水路", "温室", "有機的", "配管"],
      materials: ["ガラス", "植物", "プラスチック"],
      lighting_air: ["湿気", "水中光", "温室光"],
      mood: ["未来的", "牧歌的", "清潔"],
      settings: ["都市", "研究施設", "庭園"],
      era_technology: ["近未来", "バイオテクノロジー"],
      colors: ["緑", "青", "透明"]
    },
    image_search_tags: ["hydroponic city architecture", "hydroponic urban farm", "water based futuristic agriculture city"]
  }),
  makeEntry({
    id: "aquarium_architecture",
    name: "水族館建築",
    reading: "すいぞくかんけんちく",
    english_name: "Aquarium Architecture",
    short_description: "巨大水槽、暗い通路、青い水中光で構成される展示と没入の建築。",
    visual_features: ["水槽が壁や天井になる", "暗い通路に青い光が落ちる", "人間が水中世界の外側から眺める構成"],
    common_motifs: ["巨大水槽", "ガラス通路", "水中トンネル", "展示室"],
    light_air: "水中光、低照度、湿気が中心。",
    worldview_direction: "海を都市内部に切り取り、展示空間として体験させる。",
    near_terms: ["oceanic_sf", "submerged_city_punk", "bio_dome_architecture"],
    confusable_terms: [{ id: "oceanic_sf", difference: "海洋SFは探索基地や潜水艇。水族館建築は展示と観覧通路が中心。" }],
    difference_notes: ["水槽越しに海を見る展示建築。"],
    tags: {
      visual_elements: ["水没都市", "ドーム", "水路"],
      materials: ["ガラス", "コンクリート", "アクリル"],
      lighting_air: ["水中光", "低照度", "湿気"],
      mood: ["神秘的", "清潔", "孤独"],
      settings: ["商業施設", "海底", "研究施設"],
      era_technology: ["現代", "近未来"],
      colors: ["コバルトブルー", "青", "黒"]
    },
    image_search_tags: ["aquarium architecture tunnel", "large aquarium interior", "blue aquarium exhibition space"]
  }),
  makeEntry({
    id: "harbor_industrial_architecture",
    name: "港湾工業地帯",
    reading: "こうわんこうぎょうちたい",
    english_name: "Harbor Industrial Architecture",
    short_description: "クレーン、倉庫、コンテナ、岸壁、工場が水際に密集する港の工業景観。",
    visual_features: ["大型クレーンが地平線に並ぶ", "倉庫やコンテナが反復する", "水面と工場設備が同じ画面にある"],
    common_motifs: ["港湾クレーン", "倉庫", "コンテナ", "岸壁"],
    light_air: "湿気、煤けた空気、低照度、夕焼けが混ざる。",
    worldview_direction: "物流と工業が水際で交差する巨大な裏方都市。",
    near_terms: ["containerpunk", "factorypunk", "floating_city_punk"],
    confusable_terms: [{ id: "containerpunk", difference: "コンテナ建築はコンテナを住居や建築に転用する。港湾工業地帯は物流インフラ全体が中心。" }],
    difference_notes: ["クレーン、岸壁、倉庫、水面が揃う。"],
    tags: {
      visual_elements: ["コンテナ", "廃工場", "黒煙", "水上都市"],
      materials: ["鋼鉄", "鉄", "コンクリート"],
      lighting_air: ["湿気", "煤けた空気", "夕焼け"],
      mood: ["無機質", "退廃的", "共同体的"],
      settings: ["港湾", "工場", "水上"],
      era_technology: ["現代", "近未来"],
      colors: ["灰色", "錆色", "青"]
    },
    image_search_tags: ["harbor industrial architecture", "container port cranes", "industrial waterfront harbor"]
  }),
  makeEntry({
    id: "oil_rig_architecture",
    name: "海上油田プラットフォーム",
    reading: "かいじょうゆでんプラットフォーム",
    english_name: "Offshore Oil Rig Architecture",
    short_description: "海上に立つ掘削塔、居住区、配管、ヘリポートが一体化した孤立した工業構造物。",
    visual_features: ["海面上に鉄骨構造が立つ", "配管やタンクが密集する", "居住区と工場が一つの島のように見える"],
    common_motifs: ["掘削塔", "ヘリポート", "配管", "海上居住区"],
    light_air: "湿気、低照度、煤けた空気、海の反射が混ざる。",
    worldview_direction: "海の上で資源採掘と生活を同時に行う孤立した工業島。",
    near_terms: ["harbor_industrial_architecture", "factorypunk", "oceanic_sf"],
    confusable_terms: [{ id: "factorypunk", difference: "ファクトリー建築は陸上工場も含む。海上油田は海上の採掘プラットフォームが中心。" }],
    difference_notes: ["海上に立つ鉄骨、掘削塔、ヘリポート。"],
    tags: {
      visual_elements: ["配管", "発電施設", "黒煙", "水上都市"],
      materials: ["鋼鉄", "鉄", "軍用金属"],
      lighting_air: ["湿気", "低照度", "煤けた空気"],
      mood: ["無機質", "孤独", "軍事的"],
      settings: ["水上", "港湾", "工場"],
      era_technology: ["現代", "近未来"],
      colors: ["灰色", "黒", "錆色"]
    },
    image_search_tags: ["offshore oil rig architecture", "sea platform industrial", "oil platform at night"]
  }),
  makeEntry({
    id: "power_plant_architecture",
    name: "発電所建築",
    reading: "はつでんしょけんちく",
    english_name: "Power Plant Architecture",
    short_description: "タービン、煙突、冷却塔、変電設備が巨大なエネルギーの存在感を作る建築。",
    visual_features: ["冷却塔や煙突が遠くから見える", "配管、鉄骨、タービンが密集する", "人間より設備のスケールが大きい"],
    common_motifs: ["冷却塔", "煙突", "タービン", "送電線"],
    light_air: "煤けた空気、白く平坦な光、夕焼け、霧が混ざる。",
    worldview_direction: "都市を動かすエネルギーが巨大設備として可視化される。",
    near_terms: ["factorypunk", "dampunk", "utility_tunnel_architecture"],
    confusable_terms: [{ id: "dampunk", difference: "ダム建築は水と巨大壁。発電所建築はタービン、冷却塔、送電設備が中心。" }],
    difference_notes: ["煙突、冷却塔、送電線が手がかり。"],
    tags: {
      visual_elements: ["発電施設", "配管", "黒煙", "巨大建築"],
      materials: ["コンクリート", "鋼鉄", "鉄"],
      lighting_air: ["煤けた空気", "霧", "夕焼け"],
      mood: ["無機質", "記念碑的", "不穏"],
      settings: ["発電所", "工場", "都市"],
      era_technology: ["現代", "近未来"],
      colors: ["灰色", "白", "錆色"]
    },
    image_search_tags: ["power plant architecture", "cooling towers industrial", "turbine hall power station"]
  }),
  makeEntry({
    id: "substation_architecture",
    name: "変電所建築",
    reading: "へんでんしょけんちく",
    english_name: "Electrical Substation Architecture",
    short_description: "鉄骨、碍子、変圧器、送電線が露出した、電力インフラの無機質な構造物。",
    visual_features: ["細い鉄骨と電線が複雑に交差する", "変圧器や碍子が反復する", "建物というより電気の森に見える"],
    common_motifs: ["変圧器", "送電線", "鉄骨架台", "碍子"],
    light_air: "白く平坦な光、低照度、非常灯で硬い。",
    worldview_direction: "都市の見えない電力網が、屋外設備として露出する。",
    near_terms: ["power_plant_architecture", "utility_tunnel_architecture", "factorypunk"],
    confusable_terms: [{ id: "power_plant_architecture", difference: "発電所はエネルギーを作る巨大設備。変電所は電力を分配する露出した鉄骨設備が中心。" }],
    difference_notes: ["送電線と変圧器の露出した集合。"],
    tags: {
      visual_elements: ["発電施設", "無機質", "配管"],
      materials: ["鉄", "鋼鉄", "セラミック"],
      lighting_air: ["白く平坦な光", "低照度", "非常灯"],
      mood: ["無機質", "不穏", "未来的"],
      settings: ["発電所", "工場", "都市"],
      era_technology: ["現代", "近未来"],
      colors: ["灰色", "白", "黒"]
    },
    image_search_tags: ["electrical substation architecture", "power substation transformers", "industrial electrical yard"]
  }),
  makeEntry({
    id: "telecom_tower_architecture",
    name: "通信塔建築",
    reading: "つうしんとうけんちく",
    english_name: "Telecommunication Tower Architecture",
    short_description: "アンテナ、鉄塔、通信設備が遠景のランドマークになる情報インフラ建築。",
    visual_features: ["細い塔が空へ伸びる", "アンテナやパラボラが取り付く", "建築より信号を送る装置に見える"],
    common_motifs: ["アンテナ塔", "パラボラ", "展望台", "鉄塔"],
    light_air: "高所の風、冷たい月光、強い逆光で輪郭が出る。",
    worldview_direction: "情報通信が都市や山頂のランドマークとして立ち上がる。",
    near_terms: ["towerpunk", "observatory_architecture", "surveillance_futurism"],
    confusable_terms: [{ id: "towerpunk", difference: "塔型都市は居住や都市機能を持つ塔。通信塔建築はアンテナと信号設備が中心。" }],
    difference_notes: ["アンテナやパラボラが塔の目的を示す。"],
    tags: {
      visual_elements: ["塔", "モノリス", "高層ビル"],
      materials: ["鋼鉄", "ガラス", "コンクリート"],
      lighting_air: ["高所の風", "冷たい月光", "強い逆光"],
      mood: ["未来的", "孤独", "無機質"],
      settings: ["塔", "都市", "荒野"],
      era_technology: ["現代", "近未来"],
      colors: ["白", "灰色", "赤"]
    },
    image_search_tags: ["telecommunication tower architecture", "antenna tower landscape", "broadcast tower structure"]
  }),
  makeEntry({
    id: "monorail_city_architecture",
    name: "モノレール都市",
    reading: "モノレールとし",
    english_name: "Monorail City Architecture",
    short_description: "高架モノレールの軌道が都市を貫き、駅と高架橋が未来感を作る都市景観。",
    visual_features: ["一本の高架軌道が街を横切る", "駅が空中に浮いたように見える", "都市の中に滑らかな交通線が走る"],
    common_motifs: ["モノレール軌道", "高架駅", "支柱", "未来交通"],
    light_air: "自然光、白く平坦な光、高所の風がある。",
    worldview_direction: "移動インフラが都市の未来感と上空の動線を作る。",
    near_terms: ["railpunk", "skybridge_city_architecture", "transit_hub_architecture"],
    confusable_terms: [{ id: "railpunk", difference: "鉄道建築は線路や駅舎全般。モノレール都市は高架の単軌道と未来交通感が中心。" }],
    difference_notes: ["単軌道の高架が都市を貫く。"],
    tags: {
      visual_elements: ["駅舎", "空中回廊", "橋", "高層ビル"],
      materials: ["コンクリート", "鋼鉄", "ガラス"],
      lighting_air: ["自然光", "白く平坦な光", "高所の風"],
      mood: ["未来的", "清潔", "無機質"],
      settings: ["都市", "駅", "空中"],
      era_technology: ["近未来", "現代"],
      colors: ["白", "灰色", "青"]
    },
    image_search_tags: ["monorail city architecture", "futuristic monorail station", "elevated monorail urban"]
  }),
  makeEntry({
    id: "viaduct_architecture",
    name: "高架橋建築",
    reading: "こうかきょうけんちく",
    english_name: "Viaduct Architecture",
    short_description: "谷や都市を連続した橋脚とアーチで越える、長大な高架インフラの景観。",
    visual_features: ["橋脚やアーチが長く反復する", "地形や街を高い位置で横断する", "下部空間も都市の一部になる"],
    common_motifs: ["高架橋", "連続アーチ", "橋脚", "下部空間"],
    light_air: "自然光、高所の風、強い逆光で長さが強調される。",
    worldview_direction: "移動のための線状インフラが、風景を支配する。",
    near_terms: ["bridgepunk", "aqueductpunk", "railpunk"],
    confusable_terms: [{ id: "aqueductpunk", difference: "水道橋は水を運ぶ高架。高架橋建築は鉄道や道路など移動インフラが中心。" }],
    difference_notes: ["長く続く橋脚やアーチの反復。"],
    tags: {
      visual_elements: ["橋", "アーチ", "巨大建築"],
      materials: ["コンクリート", "石材", "鋼鉄"],
      lighting_air: ["自然光", "高所の風", "強い逆光"],
      mood: ["記念碑的", "無機質", "冒険的"],
      settings: ["橋梁", "都市", "荒野"],
      era_technology: ["近代", "現代"],
      colors: ["灰色", "白", "黄土色"]
    },
    image_search_tags: ["viaduct architecture", "long railway viaduct arches", "urban concrete viaduct"]
  }),
  makeEntry({
    id: "parking_structure_architecture",
    name: "立体駐車場建築",
    reading: "りったいちゅうしゃじょうけんちく",
    english_name: "Parking Structure Architecture",
    short_description: "スロープ、反復する床、白線、低い天井で構成される自動車用の無機質な多層空間。",
    visual_features: ["低い天井と柱が反復する", "スロープが階層をつなぐ", "白線や番号が空間の記号になる"],
    common_motifs: ["駐車区画", "スロープ", "柱", "非常灯"],
    light_air: "蛍光灯、白く平坦な光、低照度で冷たい。",
    worldview_direction: "車のための空間が、人間にはリミナルで無機質に見える。",
    near_terms: ["liminal_space", "desolate_modernism", "bunkerpunk"],
    confusable_terms: [{ id: "liminal_space", difference: "リミナルスペースは空白感全般。立体駐車場建築は車用の反復床とスロープが中心。" }],
    difference_notes: ["柱、白線、スロープ、低い天井が手がかり。"],
    tags: {
      visual_elements: ["無機質", "地下都市", "迷宮"],
      materials: ["コンクリート", "鉄", "プラスチック"],
      lighting_air: ["蛍光灯", "白く平坦な光", "低照度"],
      mood: ["無機質", "孤独", "不穏"],
      settings: ["商業施設", "地下", "都市"],
      era_technology: ["現代"],
      colors: ["灰色", "白", "黒"]
    },
    image_search_tags: ["empty parking structure", "multi storey parking garage", "parking garage liminal"]
  }),
  makeEntry({
    id: "atrium_architecture",
    name: "アトリウム建築",
    reading: "アトリウムけんちく",
    english_name: "Atrium Architecture",
    short_description: "建物内部に大きな吹き抜けを持ち、光、回廊、階層を一つに見せる建築空間。",
    visual_features: ["建物の内側に巨大な空洞がある", "回廊や階段が吹き抜けを囲む", "天窓やガラス屋根から光が入る"],
    common_motifs: ["吹き抜け", "回廊", "天窓", "内部広場"],
    light_air: "自然光、白く平坦な光、ガラス反射が中心。",
    worldview_direction: "室内に都市的な広場や空を作る建築。",
    near_terms: ["glasspunk", "market_hall_architecture", "corporate_modernism"],
    confusable_terms: [{ id: "glasspunk", difference: "ガラス建築は透明素材が主役。アトリウム建築は内部の吹き抜け空間が主役。" }],
    difference_notes: ["大きな内部空洞と周囲の回廊を見る。"],
    tags: {
      visual_elements: ["巨大建築", "空中回廊", "温室"],
      materials: ["ガラス", "鋼鉄", "コンクリート"],
      lighting_air: ["自然光", "白く平坦な光"],
      mood: ["清潔", "未来的", "荘厳"],
      settings: ["商業施設", "都市", "研究施設"],
      era_technology: ["現代", "近未来"],
      colors: ["白", "透明", "灰色"]
    },
    image_search_tags: ["atrium architecture interior", "large glass atrium", "building atrium sky light"]
  }),
  makeEntry({
    id: "courtyard_house_architecture",
    name: "中庭住宅",
    reading: "なかにわじゅうたく",
    english_name: "Courtyard House Architecture",
    short_description: "建物が中庭を囲み、外に閉じて内側に光と庭を開く住宅形式。",
    visual_features: ["外壁は閉じ、内側に庭が開く", "部屋が中庭を囲む", "光と風が中庭から入る"],
    common_motifs: ["中庭", "回廊", "水盤", "囲まれた庭"],
    light_air: "自然光、湿気、日陰の低照度が穏やかに混ざる。",
    worldview_direction: "外界から守られた内側の庭に生活の中心を置く。",
    near_terms: ["garden_city", "oasis_city_architecture", "cloister_architecture"],
    confusable_terms: [{ id: "cloister_architecture", difference: "回廊建築は宗教・公共要素も多い。中庭住宅は住居の内向きな庭が中心。" }],
    difference_notes: ["住宅の中心に囲われた庭がある。"],
    tags: {
      visual_elements: ["庭園", "アーチ", "水路"],
      materials: ["木材", "石材", "植物"],
      lighting_air: ["自然光", "湿気", "低照度"],
      mood: ["牧歌的", "清潔", "共同体的"],
      settings: ["居住区", "庭園", "都市"],
      era_technology: ["古代", "現代"],
      colors: ["白", "緑", "アースカラー"]
    },
    image_search_tags: ["courtyard house architecture", "traditional courtyard home", "modern courtyard house garden"]
  }),
  makeEntry({
    id: "garden_maze_architecture",
    name: "庭園迷路",
    reading: "ていえんめいろ",
    english_name: "Garden Maze Architecture",
    short_description: "生垣、軸線、噴水、彫像で構成される、庭そのものを迷路化した空間。",
    visual_features: ["生垣が壁のように通路を作る", "上から見ると幾何学的な迷路になる", "中心に噴水や彫像が置かれやすい"],
    common_motifs: ["生垣迷路", "噴水", "彫像", "中心広場"],
    light_air: "自然光、湿気、夕焼けで緑の影が濃くなる。",
    worldview_direction: "庭園を散策と迷いの体験として設計する。",
    near_terms: ["garden_city", "labyrinth_city_architecture", "rococo"],
    confusable_terms: [{ id: "labyrinth_city_architecture", difference: "迷宮都市は都市全体の路地構造。庭園迷路は生垣や庭園要素で作る迷路。" }],
    difference_notes: ["生垣の壁と中心の装飾が手がかり。"],
    tags: {
      visual_elements: ["庭園", "迷宮", "幾何学"],
      materials: ["植物", "石材", "土"],
      lighting_air: ["自然光", "湿気", "夕焼け"],
      mood: ["神秘的", "牧歌的"],
      settings: ["庭園", "古城"],
      era_technology: ["近世", "現代"],
      colors: ["緑", "白", "アースカラー"]
    },
    image_search_tags: ["garden maze architecture", "hedge maze garden", "formal labyrinth garden"]
  }),
  makeEntry({
    id: "labyrinth_city_architecture",
    name: "迷宮都市",
    reading: "めいきゅうとし",
    english_name: "Labyrinth City Architecture",
    short_description: "細い路地、曲がり角、階段、壁が複雑に絡み、都市全体が迷路のように感じられる様式。",
    visual_features: ["見通しの悪い路地が続く", "階段やトンネルが方向感覚を狂わせる", "街区の境界が分かりにくい"],
    common_motifs: ["迷路路地", "階段", "壁", "袋小路"],
    light_air: "低照度、湿気、自然光の細い差し込みが中心。",
    worldview_direction: "都市が防御、生活、記憶の積層で読みにくくなっている。",
    near_terms: ["alleyway_urbanism", "dungeonpunk", "walled_city_architecture"],
    confusable_terms: [{ id: "alleyway_urbanism", difference: "路地都市は生活密度が中心。迷宮都市は方向感覚の喪失や複雑な街路構造が中心。" }],
    difference_notes: ["生活感より迷う構造が強ければ迷宮都市。"],
    tags: {
      visual_elements: ["迷宮", "地下都市", "アーチ"],
      materials: ["石材", "煉瓦", "コンクリート"],
      lighting_air: ["低照度", "湿気", "自然光"],
      mood: ["閉塞的", "不穏", "共同体的"],
      settings: ["迷宮", "都市", "地下"],
      era_technology: ["中世", "現代"],
      colors: ["灰色", "黄土色", "黒"]
    },
    image_search_tags: ["labyrinth city streets", "maze like old city", "dense maze city architecture"]
  }),
  makeEntry({
    id: "sacred_geometry_architecture",
    name: "聖幾何学建築",
    reading: "せいきかがくけんちく",
    english_name: "Sacred Geometry Architecture",
    short_description: "円、星形、多角形、軸線を宗教的・神秘的な秩序として使う建築様式。",
    visual_features: ["円や多角形の平面が目立つ", "天井や床に幾何学模様が反復する", "装飾が宇宙秩序のように見える"],
    common_motifs: ["円形平面", "星形模様", "多角形ドーム", "軸線"],
    light_air: "自然光、蝋燭光、宇宙光が幾何学模様を浮かせる。",
    worldview_direction: "建築を宇宙や信仰の秩序の模型として扱う。",
    near_terms: ["templepunk", "cathedralpunk", "observatory_architecture"],
    confusable_terms: [{ id: "templepunk", difference: "神殿建築は祭祀空間全体。聖幾何学建築は幾何学的な秩序と模様が中心。" }],
    difference_notes: ["宗教空間で円や多角形の秩序が強い。"],
    tags: {
      visual_elements: ["幾何学", "宗教建築", "ドーム"],
      materials: ["石材", "ガラス", "金"],
      lighting_air: ["自然光", "蝋燭光", "宇宙光"],
      mood: ["神秘的", "荘厳", "清潔"],
      settings: ["古城", "宇宙", "研究施設"],
      era_technology: ["古代", "中世", "近未来"],
      colors: ["金", "白", "青", "黒"]
    },
    image_search_tags: ["sacred geometry architecture", "geometric sacred temple", "sacred geometry dome interior"]
  }),
  makeEntry({
    id: "soundstage_architecture",
    name: "撮影スタジオ空間",
    reading: "さつえいスタジオくうかん",
    english_name: "Soundstage Architecture",
    short_description: "セット、照明、仮設壁、黒い天井が、現実らしさを裏側から支える撮影用空間。",
    visual_features: ["本物の部屋に見えるが周囲に機材がある", "天井が黒く高く、照明が吊られる", "壁や街並みが途中で終わる"],
    common_motifs: ["撮影セット", "照明グリッド", "仮設壁", "黒い天井"],
    light_air: "強い逆光、白く平坦な光、低照度が人工的に制御される。",
    worldview_direction: "現実を作るための裏側の空間そのものを見せる。",
    near_terms: ["liminal_space", "backstage_architecture", "mallsoft"],
    confusable_terms: [{ id: "liminal_space", difference: "リミナルスペースは空白感。撮影スタジオ空間は作り物の裏側や照明機材が見えることが中心。" }],
    difference_notes: ["セットの端や照明グリッドが見える。"],
    tags: {
      visual_elements: ["無機質", "広告", "巨大建築"],
      materials: ["布", "木材", "軍用金属", "プラスチック"],
      lighting_air: ["強い逆光", "白く平坦な光", "低照度"],
      mood: ["異物感", "無機質", "不穏"],
      settings: ["商業施設", "研究施設"],
      era_technology: ["現代"],
      colors: ["黒", "白", "灰色"]
    },
    image_search_tags: ["soundstage architecture", "film set behind the scenes space", "empty movie studio set"]
  }),
  makeEntry({
    id: "backstage_architecture",
    name: "舞台裏空間",
    reading: "ぶたいうらくうかん",
    english_name: "Backstage Architecture",
    short_description: "劇場やイベント施設の裏側にある、黒幕、足場、搬入口、機材で構成される実用空間。",
    visual_features: ["黒い幕や足場が多い", "表舞台と違って機材や通路が露出する", "狭い動線と仮設性がある"],
    common_motifs: ["黒幕", "足場", "搬入口", "照明機材"],
    light_air: "低照度、非常灯、強い舞台光の漏れが混ざる。",
    worldview_direction: "華やかな表面を支える裏側の機能空間。",
    near_terms: ["soundstage_architecture", "industrial_aesthetic", "liminal_space"],
    confusable_terms: [{ id: "soundstage_architecture", difference: "撮影スタジオは映像セットの空間。舞台裏空間は劇場やイベントの裏動線が中心。" }],
    difference_notes: ["黒幕、足場、搬入口、裏動線。"],
    tags: {
      visual_elements: ["無機質", "配管", "迷宮"],
      materials: ["布", "鉄", "木材"],
      lighting_air: ["低照度", "非常灯", "強い逆光"],
      mood: ["異物感", "閉塞的", "無機質"],
      settings: ["商業施設", "地下"],
      era_technology: ["現代"],
      colors: ["黒", "灰色", "赤"]
    },
    image_search_tags: ["backstage architecture", "theater backstage space", "stage rigging backstage corridor"]
  }),
  makeEntry({
    id: "museum_architecture",
    name: "美術館建築",
    reading: "びじゅつかんけんちく",
    english_name: "Museum Architecture",
    short_description: "展示室、白い壁、吹き抜け、導線によって鑑賞体験を組み立てる公共建築。",
    visual_features: ["白い壁と余白が多い", "展示物のために光が制御される", "順路や吹き抜けが静かな流れを作る"],
    common_motifs: ["展示室", "白い壁", "吹き抜け", "展示ケース"],
    light_air: "白く平坦な光、自然光、低照度が展示に合わせて変わる。",
    worldview_direction: "物を見せ、歩かせ、記憶させるための静かな公共空間。",
    near_terms: ["minimalism", "atrium_architecture", "archive_architecture"],
    confusable_terms: [{ id: "minimalism", difference: "ミニマリズムは様式。美術館建築は展示と鑑賞の導線が中心。" }],
    difference_notes: ["白い壁、展示、順路の組み立て。"],
    tags: {
      visual_elements: ["無機質", "幾何学", "巨大建築"],
      materials: ["コンクリート", "ガラス", "石材"],
      lighting_air: ["白く平坦な光", "自然光", "低照度"],
      mood: ["清潔", "孤独", "荘厳"],
      settings: ["商業施設", "都市"],
      era_technology: ["現代", "近代"],
      colors: ["白", "灰色", "黒"]
    },
    image_search_tags: ["museum architecture interior", "white gallery space", "modern museum atrium"]
  }),
  makeEntry({
    id: "exhibition_hall_architecture",
    name: "展示会場建築",
    reading: "てんじかいじょうけんちく",
    english_name: "Exhibition Hall Architecture",
    short_description: "巨大な無柱空間、仮設ブース、照明、案内サインで構成されるイベント用建築。",
    visual_features: ["天井が高く広いホール", "仮設ブースや看板が並ぶ", "建築よりイベントの一時性が目立つ"],
    common_motifs: ["展示ブース", "大ホール", "案内サイン", "照明トラス"],
    light_air: "白く平坦な光、蛍光灯、強い逆光が多い。",
    worldview_direction: "商業、技術、文化を一時的な都市として並べる。",
    near_terms: ["market_hall_architecture", "airport_city_architecture", "soundstage_architecture"],
    confusable_terms: [{ id: "market_hall_architecture", difference: "市場ホールは日常的な売買。展示会場は仮設ブースとイベント性が中心。" }],
    difference_notes: ["大ホールに仮設ブースが並ぶ。"],
    tags: {
      visual_elements: ["巨大建築", "広告", "無機質"],
      materials: ["鋼鉄", "ガラス", "プラスチック"],
      lighting_air: ["白く平坦な光", "蛍光灯", "強い逆光"],
      mood: ["清潔", "共同体的", "未来的"],
      settings: ["商業施設", "空港", "都市"],
      era_technology: ["現代", "近未来"],
      colors: ["白", "灰色", "青"]
    },
    image_search_tags: ["exhibition hall architecture", "trade fair hall booths", "large convention exhibition space"]
  }),
  makeEntry({
    id: "stadium_architecture",
    name: "スタジアム建築",
    reading: "スタジアムけんちく",
    english_name: "Stadium Architecture",
    short_description: "観客席、フィールド、大屋根、照明塔が巨大な集団視線を作る競技・イベント建築。",
    visual_features: ["中央のフィールドを観客席が囲む", "楕円や円形の大きな器になる", "照明塔や屋根構造が目立つ"],
    common_motifs: ["観客席", "フィールド", "大屋根", "照明塔"],
    light_air: "強い逆光、白く平坦な光、夜間照明が中心。",
    worldview_direction: "集団が一つの中心を見つめるための巨大な器。",
    near_terms: ["monumentpunk", "megastructure_punk", "exhibition_hall_architecture"],
    confusable_terms: [{ id: "monumentpunk", difference: "記念碑建築は権力や追悼が中心。スタジアム建築は観客席とフィールドの構成が中心。" }],
    difference_notes: ["中心の競技場を席が囲む。"],
    tags: {
      visual_elements: ["巨大建築", "記念碑", "アーチ"],
      materials: ["コンクリート", "鋼鉄", "ガラス"],
      lighting_air: ["強い逆光", "白く平坦な光"],
      mood: ["記念碑的", "共同体的", "荘厳"],
      settings: ["都市", "商業施設"],
      era_technology: ["現代", "近未来"],
      colors: ["灰色", "白", "緑"]
    },
    image_search_tags: ["stadium architecture", "large stadium interior", "futuristic stadium roof"]
  })
];

const comparisonGroups = [
  {
    id: "vertical_terrain_architecture",
    terms: ["cliff_dwelling_architecture", "cave_city_architecture", "terraced_city_architecture"],
    summary: "崖住居は外から見える垂直の住居群、洞窟都市は岩や地下の内部空間、段丘都市は地形に沿った水平段の反復で見分ける。",
    quick_check: ["崖面に窓が並ぶなら崖住居。", "穴や洞窟の内部が主役なら洞窟都市。", "山腹に水平段が重なるなら段丘都市。"]
  },
  {
    id: "defensive_city_architecture",
    terms: ["fortress_city_architecture", "walled_city_architecture", "citadel_architecture"],
    summary: "城塞都市は都市全体の防御、城壁都市は内外の境界、シタデルは都市中枢の最後の要塞が中心。",
    quick_check: ["街全体が軍事施設なら城塞都市。", "壁と門が境界を作るなら城壁都市。", "中心や高台の硬い中枢ならシタデル。"]
  },
  {
    id: "water_city_architecture",
    terms: ["stilt_house_architecture", "canal_city_architecture", "floating_city_punk", "harbor_industrial_architecture"],
    summary: "高床は柱、水路都市は運河、浮体都市は水面上の都市、港湾工業は物流とクレーンで分ける。",
    quick_check: ["柱で持ち上がるなら高床。", "街路が水路なら運河都市。", "浮桟橋や浮体なら水上都市。", "クレーンとコンテナなら港湾工業。"]
  },
  {
    id: "research_infrastructure_architecture",
    terms: ["polar_base_architecture", "research_station_architecture", "data_center_architecture", "labcore"],
    summary: "極地基地は雪原の孤立、研究ステーションはモジュール拠点、データセンターはサーバー反復、ラボコアは実験室の器具感が中心。",
    quick_check: ["雪原なら極地基地。", "遠隔拠点なら研究ステーション。", "ラックの反復ならデータセンター。", "白い実験台ならラボコア。"]
  },
  {
    id: "space_habitat_architecture",
    terms: ["orbital_habitat_architecture", "generation_ship_interior", "dome_city_architecture", "terraforming_sf"],
    summary: "軌道居住区は宇宙の定置居住構造、世代宇宙船は移動する船内都市、ドーム都市は外界から保護された都市、テラフォーミングは惑星改造が中心。",
    quick_check: ["宇宙に浮くリングなら軌道居住区。", "船内に街や畑があるなら世代宇宙船。", "都市を覆うドームならドーム都市。", "惑星地表を緑化するならテラフォーミング。"]
  },
  {
    id: "transit_architecture",
    terms: ["airport_city_architecture", "transit_hub_architecture", "monorail_city_architecture", "viaduct_architecture"],
    summary: "空港都市は巨大ターミナル、交通結節点は複数交通の接続、モノレール都市は単軌道高架、高架橋は長大な橋脚反復で見分ける。",
    quick_check: ["搭乗口と滑走路なら空港都市。", "駅やバスや商業が重なるなら交通結節点。", "単軌道ならモノレール都市。", "橋脚が長く続くなら高架橋。"]
  },
  {
    id: "sacred_learning_architecture",
    terms: ["library_architecture", "archive_architecture", "monastery_architecture", "cloister_architecture"],
    summary: "図書館は閲覧、アーカイブは保存、修道院は共同生活と祈り、回廊は中庭を囲む通路要素が中心。",
    quick_check: ["読書空間なら図書館。", "保管棚ならアーカイブ。", "回廊と居室があれば修道院。", "アーチ通路そのものなら回廊。"]
  }
];

const removedIds = new Set([
  "soundstage_architecture",
  "backstage_architecture",
  "garden_maze_architecture",
  "sacred_geometry_architecture"
]);

const referenceReplacements = new Map([
  ["fishing_village_architecture", "floating_city_punk"],
  ["garden_city", "greenhousepunk"],
  ["mythic_bronze_age", "templepunk"],
  ["desert_fantasy", "desertpunk"],
  ["icepunk", "ice_city_architecture"],
  ["arctic_sf", "polar_base_architecture"],
  ["labcore", "research_station_architecture"],
  ["terraforming_sf", "dome_city_architecture"],
  ["airport_liminal", "liminal_space"],
  ["corporate_modernism", "glasspunk"],
  ["mallsoft", "liminal_space"],
  ["surveillance_futurism", "cyberpunk"],
  ["dark_academia", "victorian"],
  ["monastic_minimalism", "monastery_architecture"],
  ["oceanic_sf", "submerged_city_punk"],
  ["desolate_modernism", "brutalism"],
  ["industrial_aesthetic", "factorypunk"],
  ["minimalism", "brutalism"],
  ["rococo", "victorian"],
  ["soundstage_architecture", "exhibition_hall_architecture"],
  ["backstage_architecture", "exhibition_hall_architecture"],
  ["garden_maze_architecture", "courtyard_house_architecture"],
  ["sacred_geometry_architecture", "templepunk"]
]);

function normalizeReferences(data) {
  data.entries = data.entries.filter((entry) => !removedIds.has(entry.id));
  const knownIds = new Set(data.entries.map((entry) => entry.id));

  for (const entry of data.entries) {
    entry.near_terms = normalizeIdList(entry.near_terms, knownIds, entry.id);
    entry.confusable_terms = (entry.confusable_terms || [])
      .map((item) => ({
        ...item,
        id: referenceReplacements.get(item.id) || item.id
      }))
      .filter((item, index, items) => (
        item.id &&
        item.id !== entry.id &&
        knownIds.has(item.id) &&
        items.findIndex((other) => other.id === item.id) === index
      ));

    if (entry.id === "airport_city_architecture") {
      entry.tags.visual_elements = entry.tags.visual_elements.filter((tag) => tag !== "ガラス");
      if (!entry.tags.visual_elements.includes("高層ビル")) entry.tags.visual_elements.push("高層ビル");
    }
  }

  data.comparison_groups = (data.comparison_groups || [])
    .map((group) => ({
      ...group,
      terms: normalizeIdList(group.terms, knownIds)
    }))
    .filter((group) => group.terms.length >= 2);
}

function normalizeIdList(ids = [], knownIds, selfId = null) {
  return [...new Set(ids
    .map((id) => referenceReplacements.get(id) || id)
    .filter((id) => id && id !== selfId && knownIds.has(id))
  )];
}

function main() {
  const data = JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));
  const existingIds = new Set(data.entries.map((entry) => entry.id));
  const additions = entriesToAdd.filter((entry) => !existingIds.has(entry.id));

  data.entries.push(...additions);

  const groupIds = new Set((data.comparison_groups || []).map((group) => group.id));
  for (const group of comparisonGroups) {
    if (!groupIds.has(group.id)) data.comparison_groups.push(group);
  }

  normalizeReferences(data);

  fs.writeFileSync(DATA_PATH, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  console.log(`Added ${additions.length} structure-focused entries. Total: ${data.entries.length}`);
}

main();
