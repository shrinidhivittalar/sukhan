#!/usr/bin/env python3
"""Build browser-ready study data from the extracted guide analysis."""

import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "tmp" / "guide-analysis.json"
OUTPUT = ROOT / "app" / "guide-content.json"


def classify(title: str) -> str:
    if re.search(r"workshop|laborator|encounter|self-test|completion test|practice|notebook|trace|recognition set|sher \d", title, re.I):
        return "Practice"
    if re.search(r"listen|qawwali|recit|voice|performance|cinema", title, re.I):
        return "Listening"
    if re.search(r"index|reference|map|gallery|lexicon|vocabular|words for|words that", title, re.I):
        return "Reference"
    return "Lesson"


def split_field(text: str, label: str, next_labels: list[str]) -> str:
    start = re.search(rf"(?:^|\s){re.escape(label)}\s*·\s*", text, re.I)
    if not start:
        return ""
    value_start = start.end()
    end = len(text)
    for next_label in next_labels:
        match = re.search(rf"\s{re.escape(next_label)}\s*·\s*", text[value_start:], re.I)
        if match:
            end = min(end, value_start + match.start())
    return text[value_start:end].strip()


def parse_word(header: str, bodies: list[str]) -> dict:
    cleaned = re.sub(r"^\s*\d+\s*(?:·\s*)?", "", header).strip()
    parts = [part.strip() for part in re.split(r"\s+·\s+|\s{2,}", cleaned) if part.strip()]
    roman = parts[0].lower() if parts else cleaned.lower()
    urdu = parts[-1] if len(parts) > 1 else ""
    joined = " ".join(bodies)
    return {
        "roman": roman,
        "urdu": urdu,
        "meaning": split_field(joined, "Meaning", ["Connection", "Memory hook", "Try it", "Use it"]),
        "connection": split_field(joined, "Connection", ["Memory hook", "Try it", "Use it"]),
        "memory": split_field(joined, "Memory hook", ["Try it", "Use it"]),
        "example": split_field(joined, "Try it", []) or split_field(joined, "Use it", []),
    }


def build_volume(raw: dict) -> dict:
    sections = []
    vocabulary = []
    current = None
    paragraphs = raw["paragraphs"]
    index = 0

    while index < len(paragraphs):
        paragraph = paragraphs[index]
        style = paragraph.get("style", "")
        text = paragraph.get("text", "").strip()

        if style in {"Heading 1", "Heading 2"} and text:
            current = {
                "title": text,
                "depth": 1 if style == "Heading 1" else 2,
                "kind": classify(text),
                "paragraphs": [],
            }
            sections.append(current)
        elif style == "Word Header" and text:
            bodies = []
            lookahead = index + 1
            while lookahead < len(paragraphs) and paragraphs[lookahead].get("style") == "Word Body":
                body = paragraphs[lookahead].get("text", "").strip()
                if body:
                    bodies.append(body)
                lookahead += 1
            vocabulary.append(parse_word(text, bodies))
            index = lookahead - 1
        elif current is not None and style == "Normal" and text:
            current["paragraphs"].append(text)

        index += 1

    for section_index, section in enumerate(sections):
        section["id"] = f"v{raw['volume']}-s{section_index + 1}"

    tables = []
    for table in raw.get("tables", []):
        rows = [[str(cell).strip() for cell in row] for row in table]
        rows = [row for row in rows if any(row)]
        if rows:
            tables.append(rows)

    return {
        "volume": raw["volume"],
        "title": raw["title"],
        "sections": sections,
        "vocabulary": vocabulary,
        "tables": tables,
        "links": raw.get("links", []),
    }


def main() -> None:
    source = json.loads(SOURCE.read_text(encoding="utf-8"))
    output = [build_volume(volume) for volume in source]
    OUTPUT.write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(
        f"Wrote {OUTPUT}: "
        f"{sum(len(v['sections']) for v in output)} sections, "
        f"{sum(len(v['vocabulary']) for v in output)} vocabulary entries, "
        f"{sum(len(v['tables']) for v in output)} tables"
    )


if __name__ == "__main__":
    main()
