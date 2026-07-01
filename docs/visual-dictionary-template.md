# 辞書項目テンプレート

新しい項目は `data/visual-dictionary.json` の `entries` 配列に追加します。`id` は英小文字、数字、アンダースコアだけにすると、将来アプリ化しやすくなります。

## 必須フィールド

```json
{
  "id": "example_style",
  "name": "項目名",
  "reading": "よみかた",
  "english_name": "English Name",
  "short_description": "一言で何の見た目か分かる説明。",
  "visual_features": [
    "画面に出やすい形や構図",
    "背景やシルエットの特徴",
    "他ジャンルと区別しやすい見た目"
  ],
  "common_motifs": [
    "よく出る小物",
    "建物",
    "服飾",
    "生物",
    "乗り物"
  ],
  "color_tendencies": [
    "主な色",
    "差し色",
    "避けたい色"
  ],
  "material_feel": [
    "金属",
    "布",
    "石材",
    "有機物"
  ],
  "light_air": "光、天候、空気感、音のなさ、湿度など。",
  "worldview_direction": "その見た目がどんな世界観や価値観を表すか。",
  "near_terms": [
    "related_style_id"
  ],
  "confusable_terms": [
    {
      "id": "confusable_style_id",
      "difference": "何が似ていて、どこで見分けるか。"
    }
  ],
  "difference_notes": [
    "初心者が判定するときのコツ。"
  ],
  "ai_keywords": [
    "English prompt keyword",
    "日本語検索語",
    "material, lighting, motif"
  ],
  "tags": {
    "visual_elements": [],
    "materials": [],
    "lighting_air": [],
    "mood": [],
    "settings": [],
    "era_technology": [],
    "colors": []
  },
  "reverse_lookup": {
    "strong_cues": [],
    "secondary_cues": [],
    "avoid_confusing_with": []
  },
  "image_refs": {
    "representative": null,
    "thumbnail": null,
    "gallery": [],
    "reference_urls": [],
    "notes": ""
  },
  "image_search_tags": [
    "visual search keyword",
    "material motif keyword"
  ],
  "representative_image": {
    "thumbnail_url": "",
    "image_url": "",
    "source_page_url": "",
    "source": "",
    "creator": "",
    "license": "",
    "license_url": "",
    "alt": "",
    "notes": ""
  },
  "selected_images": []
}
```

## 書き方のコツ

- `short_description` は、初見で「何の辞書項目か」分かる一文にします。
- `visual_features` は、絵を見たときに判定できる特徴を優先します。
- `common_motifs` は、検索ワードやAIプロンプトに使える名詞を多めに入れます。
- `difference_notes` は、似た用語との違いを一言で判断できる形にします。
- `ai_keywords` は英語を多めにすると画像生成や海外画像検索に使いやすくなります。
- `tags` は必ず `docs/tag-system.md` の分類に合わせます。
- `representative_image` はビジュアル一覧で使う1ジャンル1枚の代表画像です。ライセンスと出典が確認できる画像だけを設定します。
- `image_search_tags` は代表画像探しの補助用です。候補画像を大量に並べるためではなく、手動選定の検索語として使います。

## 画像フィールドの将来利用

画像機能を追加するときは、まず各項目の `image_refs` を埋めます。

```json
"image_refs": {
  "representative": {
    "asset_id": "cyberpunk_main_001",
    "path": "assets/cyberpunk/main.jpg",
    "url": null,
    "caption": "雨の近未来都市とネオン看板",
    "license": "own",
    "credit": "created by project"
  },
  "thumbnail": {
    "asset_id": "cyberpunk_thumb_001",
    "path": "assets/cyberpunk/thumb.jpg",
    "url": null
  },
  "gallery": [
    {
      "asset_id": "cyberpunk_ref_001",
      "path": "assets/cyberpunk/ref-001.jpg",
      "caption": "義体と路地裏の例"
    }
  ],
  "reference_urls": [
    {
      "url": "https://example.com/reference",
      "label": "参考ページ",
      "license_note": "引用不可。確認用リンクのみ。"
    }
  ],
  "notes": "画像を追加したときの選定メモ。"
}
```

画像を独立管理したくなったら、`data/assets.json` を作り、項目側は `asset_id` だけを参照する方式に移行できます。
