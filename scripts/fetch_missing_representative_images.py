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
SELECTED_SHEET_PATH = OUT_DIR / "missing-representatives-selected.jpg"
USER_AGENT = "visual-reverse-dictionary/0.1 (local representative-image research)"

NEGATIVE_TITLE_PATTERNS = [
    r"\.pdf\b",
    r"\.svg\b",
    r"\.webm\b",
    r"\bmap\b",
    r"\blogo\b",
    r"\bdiagram\b",
    r"\bposter\b",
    r"\bscan\b",
    r"\bflag\b",
    r"\bicon\b",
]


QUERY_OVERRIDES = {
    "cliff_dwelling_architecture": ["Mesa Verde cliff dwellings architecture", "rock cliff village houses"],
    "cave_city_architecture": ["Cappadocia cave city architecture", "underground cave dwellings city"],
    "stilt_house_architecture": ["stilt house village water architecture", "traditional stilt houses over water"],
    "canal_city_architecture": ["historic canal city bridges architecture", "canal city architecture waterways"],
    "terraced_city_architecture": ["terraced hillside village architecture", "mountain terrace city architecture"],
    "ziggurat_architecture": ["ancient ziggurat architecture", "stepped temple ziggurat"],
    "pyramid_city_architecture": ["ancient pyramid complex city", "pyramid temple city architecture"],
    "fortress_city_architecture": ["medieval fortified city walls", "fortress city architecture walls"],
    "walled_city_architecture": ["walled city gate dense streets", "old walled city architecture"],
    "citadel_architecture": ["massive citadel fortress architecture", "city citadel architecture"],
    "caravanserai_architecture": ["caravanserai courtyard architecture", "desert caravanserai gate"],
    "bazaar_architecture": ["covered bazaar architecture", "traditional bazaar alley market"],
    "market_hall_architecture": ["iron glass market hall architecture", "covered food market hall interior"],
    "oasis_city_architecture": ["oasis town architecture desert", "desert oasis settlement architecture"],
    "nomadic_tent_city": ["nomadic tent city desert settlement", "temporary tent market desert"],
    "ice_city_architecture": ["ice city architecture snow buildings", "winter city architecture snow"],
    "polar_base_architecture": ["arctic research station architecture", "polar research base buildings"],
    "research_station_architecture": ["remote research station architecture", "modular science outpost"],
    "orbital_habitat_architecture": ["space colony habitat ring", "orbital habitat architecture"],
    "generation_ship_interior": ["generation ship interior habitat", "space ark interior city"],
    "mecha_hangar_architecture": ["sci fi mecha hangar", "giant robot hangar interior"],
    "airport_city_architecture": ["large airport terminal architecture", "airport city architecture terminal"],
    "transit_hub_architecture": ["multi level transit hub architecture", "urban transport hub concourse"],
    "arcade_architecture": ["covered shopping arcade architecture", "glass roof shopping arcade street"],
    "alleyway_urbanism": ["dense urban alleyway architecture", "narrow city alley buildings"],
    "skybridge_city_architecture": ["high rise skybridge city architecture", "skybridge urban architecture"],
    "elevated_walkway_architecture": ["elevated pedestrian walkway city", "urban skywalk architecture"],
    "sewer_city_architecture": ["large sewer tunnel architecture", "underground drainage tunnel"],
    "utility_tunnel_architecture": ["utility tunnel pipes infrastructure", "underground service tunnel pipes"],
    "data_center_architecture": ["data center server room rows", "data center architecture cooling corridor"],
    "archive_architecture": ["archive storage shelves architecture", "records archive room"],
    "library_architecture": ["grand library reading room architecture", "library architecture interior"],
    "monastery_architecture": ["monastery cloister courtyard architecture", "stone monastery architecture"],
    "cloister_architecture": ["arched cloister courtyard", "cloister architecture walkway"],
    "observatory_architecture": ["astronomical observatory dome architecture", "mountain observatory telescope dome"],
    "planetarium_architecture": ["planetarium interior dome", "planetarium architecture dome theater"],
    "dome_city_architecture": ["city under glass dome architecture", "futuristic dome city habitat"],
    "bio_dome_architecture": ["biodome architecture greenhouse ecosystem", "closed ecosystem biodome"],
    "vertical_farm_architecture": ["vertical farm architecture indoor", "indoor vertical farming racks"],
    "hydroponic_city_architecture": ["hydroponic urban farm architecture", "hydroponic greenhouse city"],
    "aquarium_architecture": ["aquarium tunnel architecture interior", "large aquarium interior blue"],
    "harbor_industrial_architecture": ["container port cranes industrial harbor", "industrial waterfront harbor architecture"],
    "oil_rig_architecture": ["offshore oil rig platform architecture", "sea oil platform industrial"],
    "power_plant_architecture": ["power plant cooling towers architecture", "power station turbine hall"],
    "substation_architecture": ["electrical substation transformers", "power substation architecture"],
    "telecom_tower_architecture": ["telecommunication tower architecture", "broadcast antenna tower structure"],
    "monorail_city_architecture": ["monorail city architecture", "elevated monorail station urban"],
    "viaduct_architecture": ["long railway viaduct arches", "urban concrete viaduct architecture"],
    "parking_structure_architecture": ["empty parking garage architecture", "multi storey parking structure"],
    "atrium_architecture": ["large glass atrium architecture interior", "building atrium skylight"],
    "courtyard_house_architecture": ["courtyard house architecture", "traditional courtyard home garden"],
    "labyrinth_city_architecture": ["maze like old city streets", "labyrinth city narrow streets"],
    "museum_architecture": ["modern museum architecture interior", "white gallery museum space"],
    "exhibition_hall_architecture": ["large exhibition hall architecture", "trade fair hall booths"],
    "stadium_architecture": ["stadium architecture interior", "large stadium roof architecture"],
}


def main() -> int:
    parser = argparse.ArgumentParser(description="Fetch representative images for entries without representative_image.")
    parser.add_argument("--apply", action="store_true", help="Write selected references to data/visual-dictionary.json.")
    parser.add_argument("--limit", type=int, default=55, help="Maximum missing entries to process.")
    args = parser.parse_args()

    dictionary = read_json(DICTIONARY_PATH)
    missing = [
        entry for entry in dictionary.get("entries", [])
        if not (entry.get("representative_image", {}).get("thumbnail_url") or entry.get("representative_image", {}).get("image_url"))
    ][: args.limit]

    cache = read_json(CANDIDATES_PATH) if CANDIDATES_PATH.exists() else {"schema_version": "1.0.0", "updated_at": None, "candidates": []}
    existing_candidates = [
        item for item in cache.get("candidates", [])
        if item.get("entry_id") not in {entry["id"] for entry in missing}
    ]

    selected_by_id: dict[str, dict[str, Any]] = {}
    fetched: list[dict[str, Any]] = []
    errors: list[str] = []

    for entry in missing:
        candidates = collect_candidates(entry, errors)
        fetched.extend(candidates)
        if candidates:
            selected_by_id[entry["id"]] = candidates[0]
            if args.apply:
                entry["representative_image"] = representative_from_candidate(entry, candidates[0])
        print(f"{entry['id']}: {len(candidates)} candidates", flush=True)
        time.sleep(0.18)

    cache["candidates"] = existing_candidates + fetched
    cache["updated_at"] = now_iso()
    write_json(CANDIDATES_PATH, cache)

    if args.apply:
        write_json(DICTIONARY_PATH, dictionary)

    OUT_DIR.mkdir(exist_ok=True)
    build_selected_sheet(missing, selected_by_id, SELECTED_SHEET_PATH)

    if errors:
        print("API warnings:")
        for error in errors[:80]:
            print(f"- {error}")
    print(SELECTED_SHEET_PATH)
    print(f"selected={len(selected_by_id)} missing={len(missing) - len(selected_by_id)}")
    return 0


def collect_candidates(entry: dict[str, Any], errors: list[str]) -> list[dict[str, Any]]:
    entry_id = entry["id"]
    queries = list(QUERY_OVERRIDES.get(entry_id, []))
    queries.extend(entry.get("image_search_tags", [])[:3])
    queries.append(f"{entry.get('english_name', '')} architecture")

    seen: set[str] = set()
    candidates: list[dict[str, Any]] = []
    for query in unique(queries):
        for fetcher in (fetch_wikimedia, fetch_openverse):
            try:
                for candidate in fetcher(entry_id, query, 10):
                    key = candidate_key(candidate)
                    if key in seen or not is_usable(candidate):
                        continue
                    seen.add(key)
                    candidate["_score"] = score_candidate(entry, candidate)
                    candidates.append(candidate)
            except Exception as exc:  # noqa: BLE001
                errors.append(f"{entry_id} {fetcher.__name__}({query}): {exc}")
        if len(candidates) >= 14:
            break

    candidates.sort(key=lambda item: item.get("_score", 0), reverse=True)
    for candidate in candidates:
        candidate.pop("_score", None)
    return candidates[:8]


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
    items: list[dict[str, Any]] = []
    for page in data.get("query", {}).get("pages", {}).values():
        info = first(page.get("imageinfo")) or {}
        mime = str(info.get("mime") or "")
        if not mime.startswith("image/") or mime in {"image/svg+xml", "image/vnd.djvu"}:
            continue
        meta = info.get("extmetadata") or {}
        title = clean_html(meta_value(meta, "ObjectName") or page.get("title", "").removeprefix("File:"))
        items.append(normalize_candidate(
            entry_id=entry_id,
            query=query,
            source="Wikimedia Commons",
            source_id=str(page.get("pageid") or page.get("title") or ""),
            title=title,
            creator=clean_html(meta_value(meta, "Artist") or meta_value(meta, "Credit") or ""),
            license=clean_html(meta_value(meta, "LicenseShortName") or meta_value(meta, "License") or "license unknown"),
            license_url=meta_value(meta, "LicenseUrl") or "",
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
            source_page_url=result.get("foreign_landing_url") or result.get("detail_url") or result.get("url") or "",
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
    blob = " ".join([
        candidate.get("title", ""),
        candidate.get("image_url", ""),
        candidate.get("source_page_url", ""),
    ]).lower()
    return not any(re.search(pattern, blob) for pattern in NEGATIVE_TITLE_PATTERNS)


def score_candidate(entry: dict[str, Any], candidate: dict[str, Any]) -> float:
    blob = " ".join([
        candidate.get("title", ""),
        candidate.get("query", ""),
        candidate.get("source_page_url", ""),
    ]).lower()
    tokens = []
    tokens.extend(re.split(r"[_\s-]+", entry.get("id", "")))
    tokens.extend(re.split(r"\s+", entry.get("english_name", "")))
    tokens.extend(str(tag) for tag in entry.get("common_motifs", []))
    tokens.extend(str(tag) for tag in entry.get("image_search_tags", []))
    score = 0.0
    for token in unique([token.lower() for token in tokens if len(token) >= 4]):
        if token in blob:
            score += 2.5
    if candidate.get("source") == "Wikimedia Commons":
        score += 2.0
    if candidate.get("orientation") == "landscape":
        score += 1.0
    width = candidate.get("width") or 0
    height = candidate.get("height") or 0
    if width and height:
        score += min(3.0, math.log10(max(width * height, 1)) - 5.0)
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
        "alt": f"{entry.get('name')}の参考代表画像。{', '.join(unique(cues)[:5])}",
        "notes": "Representative reference selected from licensed API search for the structure-focused expansion.",
    }


def build_selected_sheet(entries: list[dict[str, Any]], selected_by_id: dict[str, dict[str, Any]], path: Path) -> None:
    card_w = 220
    image_h = 132
    label_h = 64
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
            label = f"{entry['id']}\nneeds generation"
        draw.multiline_text((x + 5, y + image_h + 5), label, fill=(20, 20, 20), font=font, spacing=2)
    sheet.save(path, quality=90)


def fetch_thumb(image_ref: dict[str, Any], width: int, height: int) -> Image.Image | None:
    url = image_ref.get("thumbnail_url") or image_ref.get("image_url")
    if not url:
        return None
    try:
        request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
        with urllib.request.urlopen(request, timeout=8) as response:
            data = response.read(5_000_000)
        image = Image.open(io.BytesIO(data)).convert("RGB")
        image.thumbnail((width, height), Image.Resampling.LANCZOS)
        canvas = Image.new("RGB", (width, height), (235, 238, 236))
        canvas.paste(image, ((width - image.width) // 2, (height - image.height) // 2))
        return canvas
    except Exception:
        return None


def http_json(url: str) -> dict[str, Any]:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=18) as response:
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


def clean_html(value: Any) -> str:
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


def now_iso() -> str:
    return dt.datetime.now(dt.timezone.utc).replace(microsecond=0).isoformat()


def unique(values: list[Any]) -> list[Any]:
    result = []
    for value in values:
        if value and value not in result:
            result.append(value)
    return result


def read_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path: Path, data: dict[str, Any]) -> None:
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    raise SystemExit(main())
