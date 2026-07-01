from __future__ import annotations

import io
import json
import urllib.request
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "tmp"
OUT_PATH = OUT_DIR / "candidate-contact-sheet.jpg"
THUMB_W = 180
THUMB_H = 120
LABEL_H = 54
PER_ENTRY = 6


def main() -> None:
    dictionary = json.loads((ROOT / "data" / "visual-dictionary.json").read_text(encoding="utf-8"))
    cache = json.loads((ROOT / "data" / "image-candidates.json").read_text(encoding="utf-8"))
    candidates = cache.get("candidates", [])
    by_entry = {
        entry["id"]: [item for item in candidates if item.get("entry_id") == entry["id"] and not item.get("is_rejected")]
        for entry in dictionary.get("entries", [])
    }

    rows = []
    for entry in dictionary.get("entries", []):
        row_images = []
        for candidate in by_entry.get(entry["id"], [])[:PER_ENTRY]:
            row_images.append((entry, candidate, fetch_thumb(candidate)))
        rows.append(row_images)

    width = THUMB_W * PER_ENTRY
    height = (THUMB_H + LABEL_H) * len(rows)
    sheet = Image.new("RGB", (width, height), "white")
    draw = ImageDraw.Draw(sheet)
    font = ImageFont.load_default()

    for row_index, row in enumerate(rows):
        y = row_index * (THUMB_H + LABEL_H)
        for col_index in range(PER_ENTRY):
            x = col_index * THUMB_W
            draw.rectangle((x, y, x + THUMB_W - 1, y + THUMB_H + LABEL_H - 1), outline=(210, 210, 210))
            if col_index < len(row):
                entry, candidate, image = row[col_index]
                if image:
                    sheet.paste(image, (x, y))
                label = f"{entry['id']} #{col_index + 1}\n{candidate.get('source', '')}\n{candidate.get('license', '')[:26]}"
                draw.multiline_text((x + 4, y + THUMB_H + 4), label, fill=(20, 20, 20), font=font, spacing=2)
            else:
                draw.text((x + 4, y + 4), "no candidate", fill=(120, 120, 120), font=font)

    OUT_DIR.mkdir(exist_ok=True)
    sheet.save(OUT_PATH, quality=88)
    print(OUT_PATH)


def fetch_thumb(candidate: dict) -> Image.Image | None:
    url = candidate.get("thumbnail_url") or candidate.get("image_url")
    if not url:
        return None
    try:
        request = urllib.request.Request(url, headers={"User-Agent": "visual-reverse-dictionary/0.1"})
        with urllib.request.urlopen(request, timeout=12) as response:
            data = response.read(2_000_000)
        image = Image.open(io.BytesIO(data)).convert("RGB")
        image.thumbnail((THUMB_W, THUMB_H), Image.Resampling.LANCZOS)
        canvas = Image.new("RGB", (THUMB_W, THUMB_H), (235, 238, 236))
        x = (THUMB_W - image.width) // 2
        y = (THUMB_H - image.height) // 2
        canvas.paste(image, (x, y))
        return canvas
    except Exception:
        return None


if __name__ == "__main__":
    main()
