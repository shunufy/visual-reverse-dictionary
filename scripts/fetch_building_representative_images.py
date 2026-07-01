from __future__ import annotations

import argparse
import datetime as dt
import html
import io
import json
import math
import re
import time
import urllib.parse
import urllib.request
from pathlib import Path
from typing import Any

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
DICTIONARY_PATH = ROOT / "data" / "visual-dictionary.json"
CANDIDATES_PATH = ROOT / "data" / "image-candidates.json"
OUT_DIR = ROOT / "tmp"
CANDIDATE_SHEET_PATH = OUT_DIR / "building-punk-candidates.jpg"
SELECTED_SHEET_PATH = OUT_DIR / "building-punk-selected.jpg"
USER_AGENT = "visual-reverse-dictionary/0.1 (local representative-image research)"

TARGET_IDS = [
    "castlepunk",
    "cathedralpunk",
    "dungeonpunk",
    "subterranean_punk",
    "towerpunk",
    "bridgepunk",
    "aqueductpunk",
    "dampunk",
    "bunkerpunk",
    "arcologypunk",
    "megastructure_punk",
    "concretepunk",
    "glasspunk",
    "greenhousepunk",
    "bamboopunk",
    "desertpunk",
    "floating_city_punk",
    "submerged_city_punk",
    "skycitypunk",
    "modularpunk",
    "containerpunk",
    "factorypunk",
    "railpunk",
    "templepunk",
    "monumentpunk",
]

QUERY_OVERRIDES = {
    "castlepunk": ["medieval castle fortress walls", "stone castle drawbridge fortress"],
    "cathedralpunk": ["gothic cathedral interior stained glass", "gothic cathedral spires"],
    "dungeonpunk": ["stone dungeon corridor", "medieval dungeon corridor torch"],
    "subterranean_punk": ["underground city architecture", "Derinkuyu underground city"],
    "towerpunk": ["dense tower city skyline", "skybridge high rise architecture"],
    "bridgepunk": ["giant bridge architecture city", "city bridge elevated walkway"],
    "aqueductpunk": ["ancient aqueduct arches", "stone aqueduct city"],
    "dampunk": ["massive concrete dam spillway", "hydroelectric dam megastructure"],
    "bunkerpunk": ["cold war bunker corridor", "concrete bunker interior"],
    "arcologypunk": ["Habitat 67 modular housing", "dense vertical city architecture"],
    "megastructure_punk": ["colossal architecture megastructure", "massive urban architecture"],
    "concretepunk": ["raw concrete brutalist architecture", "concrete stairway urban architecture"],
    "glasspunk": ["glass atrium architecture", "glass skyscraper facade"],
    "greenhousepunk": ["botanical greenhouse interior architecture", "glass roof garden greenhouse"],
    "bamboopunk": ["bamboo pavilion architecture", "bamboo structure architecture"],
    "desertpunk": ["adobe desert architecture settlement", "sandstone desert fortress city"],
    "floating_city_punk": ["floating village water settlement", "stilt houses water village"],
    "submerged_city_punk": ["flooded city buildings", "submerged ruins underwater city"],
    "skycitypunk": ["mountain top city clouds", "aerial city architecture clouds"],
    "modularpunk": ["stacked modular housing architecture", "prefab modular habitat architecture"],
    "containerpunk": ["shipping container housing architecture", "container village architecture"],
    "factorypunk": ["industrial factory interior pipes", "abandoned factory machinery hall"],
    "railpunk": ["historic train station hall", "railway depot interior architecture"],
    "templepunk": ["ancient stone temple ruins", "temple city architecture"],
    "monumentpunk": ["colossal monument architecture", "memorial plaza monument architecture"],
}

NEGATIVE_TITLE_PATTERNS = [
    r"\.pdf\b",
    r"\.svg\b",
    r"\.webm\b",
    r"\bmap\b",
    r"\blogo\b",
    r"\bdiagram\b",
    r"\bposter\b",
    r"\bbook\b",
    r"\bscan\b",
]

POSITIVE_TOKENS = {
    "castlepunk": ["castle", "fortress", "wall", "medieval"],
    "cathedralpunk": ["cathedral", "gothic", "stained", "spire"],
    "dungeonpunk": ["dungeon", "corridor", "stone", "underground"],
    "subterranean_punk": ["underground", "subterranean", "cave", "derinkuyu"],
    "towerpunk": ["tower", "skyscraper", "high-rise", "skybridge"],
    "bridgepunk": ["bridge", "viaduct", "walkway"],
    "aqueductpunk": ["aqueduct", "arches", "water"],
    "dampunk": ["dam", "spillway", "hydroelectric"],
    "bunkerpunk": ["bunker", "shelter", "cold war", "corridor"],
    "arcologypunk": ["habitat", "modular", "arcology", "housing"],
    "megastructure_punk": ["megastructure", "colossal", "massive", "urban"],
    "concretepunk": ["concrete", "brutalist", "stair", "raw"],
    "glasspunk": ["glass", "atrium", "facade", "skyscraper"],
    "greenhousepunk": ["greenhouse", "botanical", "garden", "glass"],
    "bamboopunk": ["bamboo", "pavilion", "structure"],
    "desertpunk": ["desert", "adobe", "sandstone", "fortress"],
    "floating_city_punk": ["floating", "stilt", "water", "village"],
    "submerged_city_punk": ["flooded", "submerged", "underwater", "ruins"],
    "skycitypunk": ["sky", "cloud", "mountain", "aerial"],
    "modularpunk": ["modular", "prefab", "stacked", "housing"],
    "containerpunk": ["container", "shipping", "housing"],
    "factorypunk": ["factory", "industrial", "pipes", "machinery"],
    "railpunk": ["rail", "station", "train", "depot"],
    "templepunk": ["temple", "ruins", "stone", "ancient"],
    "monumentpunk": ["monument", "memorial", "plaza", "colossal"],
}


def main() -> int:
    parser = argparse.ArgumentParser(description="Fetch licensed representative image references for building-punk entries.")
    parser.add_argument("--apply", action="store_true", help="Write the best candidate to each entry's representative_image.")
    parser.add_argument("--per-entry", type=int, default=8, help="Number of candidates to keep per entry.")
    args = parser.parse_args()

    dictionary = read_json(DICTIONARY_PATH)
    entries_by_id = {entry["id"]: entry for entry in dictionary.get("entries", [])}
    cache = read_json(CANDIDATES_PATH) if CANDIDATES_PATH.exists() else {"schema_version": "1.0.0", "updated_at": None, "candidates": []}
    existing_candidates = [
        item for item in cache.get("candidates", [])
        if item.get("entry_id") not in TARGET_IDS
    ]

    selected_by_id: dict[str, dict[str, Any]] = {}
    fetched: list[dict[str, Any]] = []
    errors: list[str] = []

    for entry_id in TARGET_IDS:
        entry = entries_by_id[entry_id]
        candidates = collect_candidates(entry, args.per_entry, errors)
        fetched.extend(candidates)
        if candidates:
            selected_by_id[entry_id] = candidates[0]
        print(f"{entry_id}: {len(candidates)} candidates", flush=True)
        time.sleep(0.25)

    cache["candidates"] = existing_candidates + fetched
    cache["updated_at"] = now_iso()
    write_json(CANDIDATES_PATH, cache)

    if args.apply:
        for entry_id, candidate in selected_by_id.items():
            entry = entries_by_id[entry_id]
            entry["representative_image"] = representative_from_candidate(entry, candidate)
        write_json(DICTIONARY_PATH, dictionary)

    OUT_DIR.mkdir(exist_ok=True)
    build_candidate_sheet(dictionary, fetched, CANDIDATE_SHEET_PATH, args.per_entry)
    build_selected_sheet(dictionary, selected_by_id, SELECTED_SHEET_PATH)

    if errors:
        print("API warnings:")
        for error in errors:
            print(f"- {error}")
    print(CANDIDATE_SHEET_PATH)
    print(SELECTED_SHEET_PATH)
    return 0


def collect_candidates(entry: dict[str, Any], per_entry: int, errors: list[str]) -> list[dict[str, Any]]:
    entry_id = entry["id"]
    queries = QUERY_OVERRIDES.get(entry_id, [])
    queries.extend(entry.get("image_search_tags", [])[:2])
    seen: set[str] = set()
    candidates: list[dict[str, Any]] = []

    for query in unique(queries):
        for fetcher in (fetch_wikimedia, fetch_openverse):
            try:
                for candidate in fetcher(entry_id, query, 8):
                    key = candidate_key(candidate)
                    if key in seen or not is_usable(candidate):
                        continue
                    seen.add(key)
                    candidate["_score"] = score_candidate(entry_id, candidate)
                    candidates.append(candidate)
            except Exception as exc:  # noqa: BLE001 - keep partial results for a local curation tool.
                errors.append(f"{entry_id} {fetcher.__name__}({query}): {exc}")
        if len(candidates) >= per_entry * 2:
            break

    candidates.sort(key=lambda item: item.get("_score", 0), reverse=True)
    for candidate in candidates:
        candidate.pop("_score", None)
    return candidates[:per_entry]


def fetch_wikimedia(entry_id: str, query: str, limit: int) -> list[dict[str, Any]]:
    params = urllib.parse.urlencode({
        "action": "query",
        "generator": "search",
        "gsrsearch": query,
        "gsrnamespace": "6",
        "gsrlimit": limit,
        "prop": "imageinfo",
        "iiprop": "url|size|mime|extmetadata",
        "iiurlwidth": "640",
        "format": "json",
        "origin": "*",
    })
    data = http_json(f"https://commons.wikimedia.org/w/api.php?{params}")
    pages = data.get("query", {}).get("pages", {})
    items: list[dict[str, Any]] = []
    for page in pages.values():
        info = first(page.get("imageinfo")) or {}
        mime = str(info.get("mime") or "")
        if not mime.startswith("image/") or mime in {"image/svg+xml", "image/vnd.djvu"}:
            continue
        meta = info.get("extmetadata") or {}
        title = clean_html(meta_value(meta, "ObjectName") or page.get("title", "").removeprefix("File:"))
        creator = clean_html(meta_value(meta, "Artist") or meta_value(meta, "Credit") or "")
        license_name = clean_html(meta_value(meta, "LicenseShortName") or meta_value(meta, "License") or "license unknown")
        license_url = meta_value(meta, "LicenseUrl") or ""
        items.append(normalize_candidate(
            entry_id=entry_id,
            query=query,
            source="Wikimedia Commons",
            source_id=str(page.get("pageid") or page.get("title") or ""),
            title=title,
            creator=creator,
            license=license_name,
            license_url=license_url,
            thumbnail_url=info.get("thumburl") or info.get("url") or "",
            image_url=info.get("url") or "",
            source_page_url=info.get("descriptionurl") or "",
            width=info.get("width"),
            height=info.get("height"),
        ))
    return items


def fetch_openverse(entry_id: str, query: str, limit: int) -> list[dict[str, Any]]:
    params = urllib.parse.urlencode({
        "q": query,
        "page_size": limit,
        "mature": "false",
        "license_type": "commercial,modification",
    })
    data = http_json(f"https://api.openverse.org/v1/images/?{params}")
    items: list[dict[str, Any]] = []
    for result in data.get("results", []):
        source_page_url = result.get("foreign_landing_url") or result.get("detail_url") or result.get("url")
        items.append(normalize_candidate(
            entry_id=entry_id,
            query=query,
            source="Openverse",
            source_id=str(result.get("id") or ""),
            title=result.get("title") or "",
            creator=result.get("creator") or "",
            license=format_license(result.get("license"), result.get("license_version")),
            license_url=result.get("license_url") or "",
            thumbnail_url=result.get("thumbnail") or result.get("url") or "",
            image_url=result.get("url") or "",
            source_page_url=source_page_url or "",
            width=result.get("width"),
            height=result.get("height"),
        ))
    return items


def normalize_candidate(**item: Any) -> dict[str, Any]:
    width = as_int(item.get("width"))
    height = as_int(item.get("height"))
    source = item.get("source") or ""
    source_id = item.get("source_id") or item.get("source_page_url") or item.get("image_url") or ""
    return {
        "candidate_id": stable_id(source, str(source_id)),
        "entry_id": item.get("entry_id") or "",
        "query": item.get("query") or "",
        "source": source,
        "source_id": str(source_id),
        "title": clean_html(item.get("title") or ""),
        "creator": clean_html(item.get("creator") or ""),
        "license": item.get("license") or "license unknown",
        "license_url": item.get("license_url") or "",
        "thumbnail_url": item.get("thumbnail_url") or "",
        "image_url": item.get("image_url") or "",
        "source_page_url": item.get("source_page_url") or "",
        "width": width,
        "height": height,
        "aspect_ratio": round(width / height, 4) if width and height else None,
        "orientation": orientation(width, height),
        "is_selected": False,
        "is_rejected": False,
        "notes": "",
        "fetched_at": now_iso(),
    }


def is_usable(candidate: dict[str, Any]) -> bool:
    if not candidate.get("thumbnail_url") and not candidate.get("image_url"):
        return False
    if not candidate.get("source_page_url"):
        return False
    if not candidate.get("license_url") or candidate.get("license") == "license unknown":
        return False
    title_blob = " ".join([
        candidate.get("title", ""),
        candidate.get("image_url", ""),
        candidate.get("source_page_url", ""),
    ]).lower()
    return not any(re.search(pattern, title_blob) for pattern in NEGATIVE_TITLE_PATTERNS)


def score_candidate(entry_id: str, candidate: dict[str, Any]) -> float:
    blob = " ".join([
        candidate.get("title", ""),
        candidate.get("query", ""),
        candidate.get("source_page_url", ""),
    ]).lower()
    score = 0.0
    for token in POSITIVE_TOKENS.get(entry_id, []):
        if token.lower() in blob:
            score += 4.0
    if candidate.get("source") == "Wikimedia Commons":
        score += 2.0
    if candidate.get("orientation") == "landscape":
        score += 1.0
    width = candidate.get("width") or 0
    height = candidate.get("height") or 0
    if width and height:
        score += min(3.0, math.log10(max(width * height, 1)) - 5.0)
    if "flickr" in candidate.get("source_page_url", "").lower():
        score += 0.5
    return score


def representative_from_candidate(entry: dict[str, Any], candidate: dict[str, Any]) -> dict[str, str]:
    cues = []
    for field in ("visual_elements", "materials", "settings"):
        cues.extend(entry.get("tags", {}).get(field, []))
    return {
        "thumbnail_url": candidate.get("thumbnail_url", ""),
        "image_url": candidate.get("image_url", ""),
        "source_page_url": candidate.get("source_page_url", ""),
        "source": candidate.get("source", ""),
        "creator": candidate.get("creator", ""),
        "license": candidate.get("license", ""),
        "license_url": candidate.get("license_url", ""),
        "alt": f"{entry.get('name')}の参考画像。{', '.join(unique(cues)[:5])}",
        "notes": "Representative reference selected from licensed API search for the building-punk expansion.",
    }


def build_candidate_sheet(dictionary: dict[str, Any], candidates: list[dict[str, Any]], path: Path, per_entry: int) -> None:
    by_entry: dict[str, list[dict[str, Any]]] = {}
    for candidate in candidates:
        by_entry.setdefault(candidate["entry_id"], []).append(candidate)
    entries = [entry for entry in dictionary.get("entries", []) if entry["id"] in TARGET_IDS]
    card_w = 210
    image_h = 132
    label_h = 68
    cols = per_entry
    rows = len(entries)
    sheet = Image.new("RGB", (card_w * cols, (image_h + label_h) * rows), "white")
    draw = ImageDraw.Draw(sheet)
    font = ImageFont.load_default()
    for row_index, entry in enumerate(entries):
        for col_index in range(cols):
            x = col_index * card_w
            y = row_index * (image_h + label_h)
            draw.rectangle((x, y, x + card_w - 1, y + image_h + label_h - 1), outline=(205, 205, 205))
            row_candidates = by_entry.get(entry["id"], [])
            if col_index < len(row_candidates):
                candidate = row_candidates[col_index]
                image = fetch_thumb(candidate, card_w, image_h)
                if image:
                    sheet.paste(image, (x, y))
                label = f"{entry['id']} #{col_index + 1}\n{candidate.get('source', '')}\n{candidate.get('license', '')[:28]}"
            else:
                draw.rectangle((x, y, x + card_w - 1, y + image_h - 1), fill=(235, 238, 236))
                label = f"{entry['id']}\nno candidate"
            draw.multiline_text((x + 5, y + image_h + 5), label, fill=(20, 20, 20), font=font, spacing=2)
    sheet.save(path, quality=88)


def build_selected_sheet(dictionary: dict[str, Any], selected_by_id: dict[str, dict[str, Any]], path: Path) -> None:
    entries = [entry for entry in dictionary.get("entries", []) if entry["id"] in TARGET_IDS]
    card_w = 240
    image_h = 150
    label_h = 62
    cols = 5
    rows = math.ceil(len(entries) / cols)
    sheet = Image.new("RGB", (card_w * cols, (image_h + label_h) * rows), "white")
    draw = ImageDraw.Draw(sheet)
    font = ImageFont.load_default()
    for index, entry in enumerate(entries):
        x = (index % cols) * card_w
        y = (index // cols) * (image_h + label_h)
        draw.rectangle((x, y, x + card_w - 1, y + image_h + label_h - 1), outline=(205, 205, 205))
        candidate = selected_by_id.get(entry["id"])
        if candidate:
            image = fetch_thumb(candidate, card_w, image_h)
            if image:
                sheet.paste(image, (x, y))
            label = f"{entry['id']}\n{candidate.get('source', '')}\n{candidate.get('license', '')[:28]}"
        else:
            draw.rectangle((x, y, x + card_w - 1, y + image_h - 1), fill=(235, 238, 236))
            label = f"{entry['id']}\nmissing"
        draw.multiline_text((x + 5, y + image_h + 5), label, fill=(20, 20, 20), font=font, spacing=2)
    sheet.save(path, quality=90)


def fetch_thumb(image_ref: dict[str, Any], width: int, height: int) -> Image.Image | None:
    url = image_ref.get("thumbnail_url") or image_ref.get("image_url")
    if not url:
        return None
    try:
        request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
        with urllib.request.urlopen(request, timeout=6) as response:
            data = response.read(4_000_000)
        image = Image.open(io.BytesIO(data)).convert("RGB")
        image.thumbnail((width, height), Image.Resampling.LANCZOS)
        canvas = Image.new("RGB", (width, height), (235, 238, 236))
        canvas.paste(image, ((width - image.width) // 2, (height - image.height) // 2))
        return canvas
    except Exception:
        return None


def http_json(url: str) -> dict[str, Any]:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=15) as response:
        return json.loads(response.read().decode("utf-8"))


def candidate_key(item: dict[str, Any]) -> str:
    return item.get("source_page_url") or item.get("image_url") or item.get("thumbnail_url") or item.get("candidate_id", "")


def stable_id(source: str, source_id: str) -> str:
    text = f"{source}:{source_id}"
    value = 0
    for char in text:
        value = ((value * 131) + ord(char)) % 0xFFFFFFFF
    return f"{slug(source)}_{value:08x}"


def slug(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "_", value.lower()).strip("_") or "image"


def format_license(name: Any, version: Any) -> str:
    if not name:
        return "license unknown"
    if version:
        return f"{name} {version}"
    return str(name)


def meta_value(meta: dict[str, Any], key: str) -> str:
    value = meta.get(key)
    if isinstance(value, dict):
        return str(value.get("value") or "")
    return ""


def clean_html(value: str) -> str:
    text = re.sub(r"<[^>]*>", " ", str(value))
    text = html.unescape(text)
    return re.sub(r"\s+", " ", text).strip()


def orientation(width: int | None, height: int | None) -> str | None:
    if not width or not height:
        return None
    ratio = width / height
    if ratio > 1.15:
        return "landscape"
    if ratio < 0.87:
        return "portrait"
    return "square"


def as_int(value: Any) -> int | None:
    try:
        if value is None:
            return None
        return int(value)
    except (TypeError, ValueError):
        return None


def first(values: Any) -> Any:
    if isinstance(values, list) and values:
        return values[0]
    return None


def unique(values: list[str]) -> list[str]:
    seen = set()
    result = []
    for value in values:
        if value and value not in seen:
            seen.add(value)
            result.append(value)
    return result


def read_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path: Path, data: Any) -> None:
    temp = path.with_suffix(path.suffix + ".tmp")
    temp.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    temp.replace(path)


def now_iso() -> str:
    return dt.datetime.now(dt.timezone.utc).replace(microsecond=0).isoformat()


if __name__ == "__main__":
    raise SystemExit(main())
