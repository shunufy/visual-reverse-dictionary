from __future__ import annotations

import json
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DATA_PATH = ROOT / "data" / "visual-dictionary.json"

REQUIRED_ENTRY_FIELDS = {
    "id",
    "name",
    "reading",
    "english_name",
    "short_description",
    "visual_features",
    "common_motifs",
    "color_tendencies",
    "material_feel",
    "light_air",
    "worldview_direction",
    "near_terms",
    "confusable_terms",
    "difference_notes",
    "ai_keywords",
    "tags",
    "reverse_lookup",
    "image_refs",
    "image_search_tags",
    "representative_image",
    "selected_images",
}

TAG_CATEGORIES = {
    "visual_elements",
    "materials",
    "lighting_air",
    "mood",
    "settings",
    "era_technology",
    "colors",
}

REPRESENTATIVE_IMAGE_FIELDS = {
    "thumbnail_url",
    "image_url",
    "source_page_url",
    "source",
    "creator",
    "license",
    "license_url",
    "alt",
    "notes",
}


def main() -> int:
    errors: list[str] = []
    data = json.loads(DATA_PATH.read_text(encoding="utf-8"))

    entries = data.get("entries", [])
    if not isinstance(entries, list):
        errors.append("entries must be a list")
        entries = []

    ids = [entry.get("id") for entry in entries if isinstance(entry, dict)]
    duplicate_ids = sorted({entry_id for entry_id in ids if ids.count(entry_id) > 1})
    for entry_id in duplicate_ids:
        errors.append(f"duplicate entry id: {entry_id}")

    known_ids = set(ids)
    tag_catalog = data.get("tag_catalog", {})
    allowed_tags = {
        category: set(tag_catalog.get(category, []))
        for category in TAG_CATEGORIES
    }

    for index, entry in enumerate(entries):
        if not isinstance(entry, dict):
            errors.append(f"entries[{index}] must be an object")
            continue

        entry_id = entry.get("id", f"entries[{index}]")
        missing_fields = sorted(REQUIRED_ENTRY_FIELDS - set(entry))
        for field in missing_fields:
            errors.append(f"{entry_id}: missing field {field}")

        for target_id in entry.get("near_terms", []):
            if target_id not in known_ids:
                errors.append(f"{entry_id}.near_terms references unknown id: {target_id}")

        for item in entry.get("confusable_terms", []):
            target_id = item.get("id") if isinstance(item, dict) else None
            if target_id not in known_ids:
                errors.append(f"{entry_id}.confusable_terms references unknown id: {target_id}")

        tags = entry.get("tags", {})
        for category in TAG_CATEGORIES:
            if category not in tags:
                errors.append(f"{entry_id}.tags missing category: {category}")
                continue
            for tag in tags.get(category, []):
                if tag not in allowed_tags[category]:
                    errors.append(f"{entry_id}.tags.{category} uses unknown tag: {tag}")

        representative_image = entry.get("representative_image")
        if not isinstance(representative_image, dict):
            errors.append(f"{entry_id}.representative_image must be an object")
        else:
            for field in sorted(REPRESENTATIVE_IMAGE_FIELDS - set(representative_image)):
                errors.append(f"{entry_id}.representative_image missing field: {field}")

    for group in data.get("comparison_groups", []):
        group_id = group.get("id", "comparison_group")
        for target_id in group.get("terms", []):
            if target_id not in known_ids:
                errors.append(f"{group_id}.terms references unknown id: {target_id}")

    if errors:
        print("Validation failed:")
        for error in errors:
            print(f"- {error}")
        return 1

    print(
        "Validation passed: "
        f"{len(entries)} entries, "
        f"{len(data.get('comparison_groups', []))} comparison groups."
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
