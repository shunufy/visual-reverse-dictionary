from __future__ import annotations

import argparse
import datetime as dt
import functools
import html
import http.server
import json
import os
import re
import urllib.parse
import urllib.request
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
DICTIONARY_PATH = ROOT / "data" / "visual-dictionary.json"
CANDIDATES_PATH = ROOT / "data" / "image-candidates.json"
USER_AGENT = "visual-reverse-dictionary/0.1 (local research tool)"
PER_QUERY_LIMIT = 12
PER_ENTRY_LIMIT = 40


class ReusableThreadingHTTPServer(http.server.ThreadingHTTPServer):
    allow_reuse_address = True


class VisualDictionaryHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args: Any, directory: str | None = None, **kwargs: Any) -> None:
        super().__init__(*args, directory=directory or str(ROOT), **kwargs)

    def end_headers(self) -> None:
        self.send_header("Cache-Control", "no-store, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def do_GET(self) -> None:
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path == "/api/image-candidates":
            self.handle_get_image_candidates(parsed)
            return
        if parsed.path == "/api/image-sources":
            self.send_json({"sources": available_sources()})
            return
        super().do_GET()

    def do_POST(self) -> None:
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path == "/api/image-candidates/refresh":
            self.handle_refresh_candidates()
            return
        if parsed.path == "/api/image-candidates/update":
            self.handle_update_candidate()
            return
        self.send_error(404, "Unknown API endpoint")

    def handle_get_image_candidates(self, parsed: urllib.parse.ParseResult) -> None:
        query = urllib.parse.parse_qs(parsed.query)
        entry_id = first(query.get("entry_id"))
        data = read_candidates()
        candidates = data.get("candidates", [])
        if entry_id:
            candidates = [item for item in candidates if item.get("entry_id") == entry_id]
        self.send_json({"candidates": candidates, "updated_at": data.get("updated_at")})

    def handle_refresh_candidates(self) -> None:
        payload = self.read_json_body()
        entry_id = payload.get("entry_id")
        if not entry_id:
            self.send_error(400, "entry_id is required")
            return

        dictionary = read_dictionary()
        entry = find_entry(dictionary, entry_id)
        if not entry:
            self.send_error(404, f"Unknown entry_id: {entry_id}")
            return

        queries = entry.get("image_search_tags") or []
        if not queries:
            self.send_error(400, f"No image_search_tags for {entry_id}")
            return

        cache = read_candidates()
        old_by_key = {
            candidate_key(item): item
            for item in cache.get("candidates", [])
            if item.get("entry_id") == entry_id
        }

        fresh: list[dict[str, Any]] = []
        seen: set[str] = set()
        errors: list[str] = []

        for query in queries:
            query_results = fetch_candidates_for_query(entry_id, query, old_by_key, errors)
            for item in query_results:
                key = candidate_key(item)
                if key in seen:
                    continue
                seen.add(key)
                fresh.append(item)
                if len(fresh) >= PER_ENTRY_LIMIT:
                    break
            if len(fresh) >= PER_ENTRY_LIMIT:
                break

        remaining = [
            item
            for item in cache.get("candidates", [])
            if item.get("entry_id") != entry_id
        ]
        cache["candidates"] = remaining + fresh
        cache["updated_at"] = now_iso()
        write_json(CANDIDATES_PATH, cache)
        self.send_json({"entry_id": entry_id, "count": len(fresh), "errors": errors, "candidates": fresh})

    def handle_update_candidate(self) -> None:
        payload = self.read_json_body()
        entry_id = payload.get("entry_id")
        candidate_id = payload.get("candidate_id")
        action = payload.get("action")
        notes = payload.get("notes")

        if not entry_id or not candidate_id or action not in {"select", "reject", "unreject", "notes"}:
            self.send_error(400, "entry_id, candidate_id and valid action are required")
            return

        cache = read_candidates()
        target = None
        for item in cache.get("candidates", []):
            if item.get("entry_id") == entry_id and item.get("candidate_id") == candidate_id:
                target = item
                break

        if not target:
            self.send_error(404, "Candidate not found")
            return

        if action == "select":
            target["is_selected"] = True
            target["is_rejected"] = False
            update_selected_image(entry_id, target)
        elif action == "reject":
            target["is_rejected"] = True
            target["is_selected"] = False
        elif action == "unreject":
            target["is_rejected"] = False
        elif action == "notes":
            target["notes"] = str(notes or "")

        cache["updated_at"] = now_iso()
        write_json(CANDIDATES_PATH, cache)
        dictionary = read_dictionary()
        self.send_json({
            "candidate": target,
            "entry": find_entry(dictionary, entry_id),
            "updated_at": cache["updated_at"],
        })

    def read_json_body(self) -> dict[str, Any]:
        length = int(self.headers.get("Content-Length", "0"))
        if length <= 0:
            return {}
        raw = self.rfile.read(length).decode("utf-8")
        return json.loads(raw or "{}")

    def send_json(self, payload: Any, status: int = 200) -> None:
        body = json.dumps(payload, ensure_ascii=False, indent=2).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)


def fetch_candidates_for_query(
    entry_id: str,
    query: str,
    old_by_key: dict[str, dict[str, Any]],
    errors: list[str],
) -> list[dict[str, Any]]:
    results: list[dict[str, Any]] = []
    seen: set[str] = set()

    for fetcher, limit in (
        (fetch_openverse, PER_QUERY_LIMIT),
        (fetch_wikimedia, max(0, PER_QUERY_LIMIT - len(results))),
        (fetch_unsplash, max(0, PER_QUERY_LIMIT - len(results))),
    ):
        if len(results) >= PER_QUERY_LIMIT:
            break
        if limit <= 0:
            continue
        try:
            for item in fetcher(entry_id, query, limit):
                key = candidate_key(item)
                if key in seen:
                    continue
                seen.add(key)
                previous = old_by_key.get(key)
                if previous:
                    item["is_selected"] = previous.get("is_selected", False)
                    item["is_rejected"] = previous.get("is_rejected", False)
                    item["notes"] = previous.get("notes", "")
                results.append(item)
                if len(results) >= PER_QUERY_LIMIT:
                    break
        except Exception as exc:  # noqa: BLE001 - local tool should keep partial API results.
            errors.append(f"{fetcher.__name__}({query}): {exc}")

    return results[:PER_QUERY_LIMIT]


def fetch_openverse(entry_id: str, query: str, limit: int) -> list[dict[str, Any]]:
    params = urllib.parse.urlencode({"q": query, "page_size": limit, "mature": "false"})
    data = http_json(f"https://api.openverse.org/v1/images/?{params}")
    items = []
    for result in data.get("results", []):
        source_page_url = result.get("foreign_landing_url") or result.get("detail_url") or result.get("url")
        items.append(normalize_candidate(
            entry_id=entry_id,
            query=query,
            source="Openverse",
            source_id=str(result.get("id") or ""),
            title=result.get("title") or "",
            creator=result.get("creator") or "",
            license_name=format_license(result.get("license"), result.get("license_version")),
            license_url=result.get("license_url") or "",
            thumbnail_url=result.get("thumbnail") or result.get("url") or "",
            image_url=result.get("url") or "",
            source_page_url=source_page_url or "",
            width=result.get("width"),
            height=result.get("height"),
        ))
    return items


def fetch_wikimedia(entry_id: str, query: str, limit: int) -> list[dict[str, Any]]:
    params = urllib.parse.urlencode({
        "action": "query",
        "generator": "search",
        "gsrsearch": query,
        "gsrnamespace": "6",
        "gsrlimit": limit,
        "prop": "imageinfo",
        "iiprop": "url|size|mime|extmetadata",
        "iiurlwidth": "420",
        "format": "json",
        "origin": "*",
    })
    data = http_json(f"https://commons.wikimedia.org/w/api.php?{params}")
    pages = data.get("query", {}).get("pages", {})
    items = []
    for page in pages.values():
        info = first(page.get("imageinfo")) or {}
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
            license_name=license_name,
            license_url=license_url,
            thumbnail_url=info.get("thumburl") or info.get("url") or "",
            image_url=info.get("url") or "",
            source_page_url=info.get("descriptionurl") or "",
            width=info.get("width"),
            height=info.get("height"),
        ))
    return items


def fetch_unsplash(entry_id: str, query: str, limit: int) -> list[dict[str, Any]]:
    env = load_env()
    access_key = env.get("UNSPLASH_ACCESS_KEY") or os.environ.get("UNSPLASH_ACCESS_KEY")
    if not access_key:
        return []
    params = urllib.parse.urlencode({"query": query, "per_page": min(limit, 30)})
    headers = {
        "Authorization": f"Client-ID {access_key}",
        "Accept-Version": "v1",
        "User-Agent": USER_AGENT,
    }
    data = http_json(f"https://api.unsplash.com/search/photos?{params}", headers=headers)
    items = []
    for result in data.get("results", []):
        user = result.get("user") or {}
        urls = result.get("urls") or {}
        links = result.get("links") or {}
        items.append(normalize_candidate(
            entry_id=entry_id,
            query=query,
            source="Unsplash",
            source_id=str(result.get("id") or ""),
            title=result.get("description") or result.get("alt_description") or "",
            creator=user.get("name") or user.get("username") or "",
            license_name="Unsplash License",
            license_url="https://unsplash.com/license",
            thumbnail_url=urls.get("thumb") or urls.get("small") or "",
            image_url=urls.get("regular") or urls.get("full") or "",
            source_page_url=links.get("html") or "",
            width=result.get("width"),
            height=result.get("height"),
        ))
    return items


def normalize_candidate(**item: Any) -> dict[str, Any]:
    width = as_int(item.get("width"))
    height = as_int(item.get("height"))
    source = item.get("source") or ""
    source_id = item.get("source_id") or item.get("source_page_url") or item.get("image_url") or ""
    candidate = {
        "candidate_id": stable_id(source, str(source_id)),
        "entry_id": item.get("entry_id") or "",
        "query": item.get("query") or "",
        "source": source,
        "source_id": str(source_id),
        "title": item.get("title") or "",
        "creator": item.get("creator") or "",
        "license": item.get("license_name") or "license unknown",
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
    return candidate


def update_selected_image(entry_id: str, candidate: dict[str, Any]) -> None:
    dictionary = read_dictionary()
    entry = find_entry(dictionary, entry_id)
    if not entry:
        return
    selected = entry.setdefault("selected_images", [])
    existing_pages = {item.get("source_page_url") for item in selected}
    if candidate.get("source_page_url") in existing_pages:
        return
    role = "representative" if not selected else "reference"
    selected.append({
        "role": role,
        "source": candidate.get("source", ""),
        "title": candidate.get("title", ""),
        "creator": candidate.get("creator", ""),
        "license": candidate.get("license", "license unknown"),
        "license_url": candidate.get("license_url", ""),
        "thumbnail_url": candidate.get("thumbnail_url", ""),
        "source_page_url": candidate.get("source_page_url", ""),
        "notes": candidate.get("notes", ""),
    })
    write_json(DICTIONARY_PATH, dictionary)


def available_sources() -> dict[str, bool]:
    env = load_env()
    return {
        "Openverse": True,
        "Wikimedia Commons": True,
        "Unsplash": bool(env.get("UNSPLASH_ACCESS_KEY") or os.environ.get("UNSPLASH_ACCESS_KEY")),
    }


def read_dictionary() -> dict[str, Any]:
    return json.loads(DICTIONARY_PATH.read_text(encoding="utf-8"))


def read_candidates() -> dict[str, Any]:
    if not CANDIDATES_PATH.exists():
        return {"schema_version": "1.0.0", "updated_at": None, "candidates": []}
    return json.loads(CANDIDATES_PATH.read_text(encoding="utf-8"))


def write_json(path: Path, data: Any) -> None:
    tmp = path.with_suffix(path.suffix + ".tmp")
    tmp.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    tmp.replace(path)


def find_entry(dictionary: dict[str, Any], entry_id: str) -> dict[str, Any] | None:
    return next((entry for entry in dictionary.get("entries", []) if entry.get("id") == entry_id), None)


def http_json(url: str, headers: dict[str, str] | None = None) -> dict[str, Any]:
    request_headers = {"User-Agent": USER_AGENT, **(headers or {})}
    request = urllib.request.Request(url, headers=request_headers)
    with urllib.request.urlopen(request, timeout=30) as response:
        return json.loads(response.read().decode("utf-8"))


def load_env() -> dict[str, str]:
    path = ROOT / ".env"
    values: dict[str, str] = {}
    if not path.exists():
        return values
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        values[key.strip()] = value.strip().strip("\"'")
    return values


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
    text = re.sub(r"<[^>]*>", " ", value)
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


def main() -> None:
    parser = argparse.ArgumentParser(description="Serve the visual reverse dictionary locally.")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8765)
    args = parser.parse_args()

    handler = functools.partial(VisualDictionaryHandler, directory=str(ROOT))
    with ReusableThreadingHTTPServer((args.host, args.port), handler) as httpd:
        url = f"http://{args.host}:{args.port}/app/"
        print(f"Serving visual reverse dictionary at {url}")
        print("Press Ctrl+C to stop.")
        httpd.serve_forever()


if __name__ == "__main__":
    main()
