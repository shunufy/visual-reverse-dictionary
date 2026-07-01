from __future__ import annotations

import io
import json
import urllib.request
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "tmp"
OUT_PATH = OUT_DIR / "representative-contact-sheet.jpg"
CARD_W = 220
IMAGE_H = 145
LABEL_H = 58
COLS = 4


def main() -> None:
    dictionary = json.loads((ROOT / "data" / "visual-dictionary.json").read_text(encoding="utf-8"))
    entries = dictionary.get("entries", [])
    rows = (len(entries) + COLS - 1) // COLS
    sheet = Image.new("RGB", (CARD_W * COLS, (IMAGE_H + LABEL_H) * rows), "white")
    draw = ImageDraw.Draw(sheet)
    font = ImageFont.load_default()

    for index, entry in enumerate(entries):
        x = (index % COLS) * CARD_W
        y = (index // COLS) * (IMAGE_H + LABEL_H)
        draw.rectangle((x, y, x + CARD_W - 1, y + IMAGE_H + LABEL_H - 1), outline=(205, 205, 205))
        image = fetch_thumb(entry.get("representative_image", {}))
        if image:
            sheet.paste(image, (x, y))
        else:
            draw.rectangle((x, y, x + CARD_W - 1, y + IMAGE_H - 1), fill=(235, 238, 236))
            draw.text((x + 10, y + 60), "missing image", fill=(120, 120, 120), font=font)
        label = f"{entry['id']}\n{entry.get('representative_image', {}).get('source', '')}\n{entry.get('representative_image', {}).get('license', '')[:28]}"
        draw.multiline_text((x + 6, y + IMAGE_H + 6), label, fill=(20, 20, 20), font=font, spacing=2)

    OUT_DIR.mkdir(exist_ok=True)
    sheet.save(OUT_PATH, quality=90)
    print(OUT_PATH)


def fetch_thumb(image_ref: dict) -> Image.Image | None:
    urls = [
        image_ref.get("thumbnail_url"),
        image_ref.get("image_url"),
    ]
    for url in [candidate for candidate in urls if candidate]:
        image = fetch_image_url(url)
        if image:
            return image
    return None


def fetch_image_url(url: str) -> Image.Image | None:
    try:
        if url.startswith("/"):
            data = (ROOT / url.lstrip("/")).read_bytes()
        else:
            request = urllib.request.Request(url, headers={"User-Agent": "visual-reverse-dictionary/0.1"})
            with urllib.request.urlopen(request, timeout=10) as response:
                data = response.read(4_000_000)
        image = Image.open(io.BytesIO(data)).convert("RGB")
        image.thumbnail((CARD_W, IMAGE_H), Image.Resampling.LANCZOS)
        canvas = Image.new("RGB", (CARD_W, IMAGE_H), (235, 238, 236))
        canvas.paste(image, ((CARD_W - image.width) // 2, (IMAGE_H - image.height) // 2))
        return canvas
    except Exception:
        return None


if __name__ == "__main__":
    main()
