from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]

# Candidate numbers are 1-based within each entry's cached candidate list.
SELECTIONS = {
    "cyberpunk": (4, "ネオンが反射する雨の都市夜景として暫定選定。"),
    "steampunk": (8, "真鍮・歯車・工房的な密度を感じる室内参考として暫定選定。"),
    "dieselpunk": (28, "装甲列車と戦間期風の重工業感を優先して暫定選定。"),
    "solarpunk": (4, "明るい近未来・持続可能性の参考として暫定選定。"),
    "biopunk": (1, "研究施設と生物工学の不穏さを示す参考として暫定選定。"),
    "retrofuturism": (3, "古い未来予想図らしい質感を優先して暫定選定。"),
    "space_opera": (21, "宇宙戦闘とスペースオペラ的スケールの参考として暫定選定。"),
    "dark_fantasy": (1, "暗い城内と幻想的な重さを優先して暫定選定。"),
    "gothic_fantasy": (1, "ゴシック城郭のシルエットを優先して暫定選定。"),
    "cosmic_horror": (7, "多腕の異形・宇宙的恐怖の参考として暫定選定。"),
    "body_horror": (2, "身体の歪みと生理的不快感の参考として暫定選定。"),
    "liminal_space": (25, "空の学校廊下というリミナル感を優先して暫定選定。"),
    "brutalism": (3, "巨大なコンクリート建築の量塊感を優先して暫定選定。"),
    "art_deco": (2, "アールデコ建築の幾何学的な外観を優先して暫定選定。"),
    "victorian": (2, "ヴィクトリアン室内の装飾性を優先して暫定選定。"),
    "techwear": (1, "黒い都市機能服の参考として暫定選定。"),
    "military_sf": (1, "未来兵器・軍事SFの雰囲気を示す参考として暫定選定。"),
    "post_apocalyptic": (6, "荒野サバイバルの人物・装備感を優先して暫定選定。"),
    "ruined_city": (17, "都市建築の放置・荒廃感を優先して暫定選定。"),
    "neon_noir": (13, "雨の夜と都市ネオンのノワール感を優先して暫定選定。"),
}


def main() -> None:
    dictionary_path = ROOT / "data" / "visual-dictionary.json"
    candidates_path = ROOT / "data" / "image-candidates.json"
    dictionary = json.loads(dictionary_path.read_text(encoding="utf-8"))
    candidates = json.loads(candidates_path.read_text(encoding="utf-8")).get("candidates", [])

    for entry in dictionary.get("entries", []):
        entry_id = entry["id"]
        if entry_id not in SELECTIONS:
            continue
        candidate_number, note = SELECTIONS[entry_id]
        entry_candidates = [item for item in candidates if item.get("entry_id") == entry_id and not item.get("is_rejected")]
        if len(entry_candidates) < candidate_number:
            raise RuntimeError(f"{entry_id}: candidate #{candidate_number} is not available")
        candidate = entry_candidates[candidate_number - 1]
        entry["representative_image"] = {
            "thumbnail_url": candidate.get("thumbnail_url", ""),
            "image_url": candidate.get("image_url", ""),
            "source_page_url": candidate.get("source_page_url", ""),
            "source": candidate.get("source", ""),
            "creator": candidate.get("creator", ""),
            "license": candidate.get("license", ""),
            "license_url": candidate.get("license_url", ""),
            "alt": build_alt(entry),
            "notes": note,
        }

    dictionary_path.write_text(json.dumps(dictionary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Applied {len(SELECTIONS)} representative images")


def build_alt(entry: dict) -> str:
    tags = []
    tags.extend(entry.get("reverse_lookup", {}).get("strong_cues", []))
    tags.extend(entry.get("common_motifs", []))
    unique_tags = []
    for tag in tags:
        if tag not in unique_tags:
            unique_tags.append(tag)
    summary = "、".join(unique_tags[:4])
    if summary:
        return f"{entry.get('name')}を象徴する参考画像: {summary}"
    return f"{entry.get('name')}を象徴する参考画像"


if __name__ == "__main__":
    main()
