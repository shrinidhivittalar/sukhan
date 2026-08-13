from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "tmp" / "docx-renders"
DESTINATION = ROOT / "tmp" / "pdf-contact-sheets"
THUMB_WIDTH = 180
GAP = 12
LABEL_HEIGHT = 24
COLUMNS = 5


def page_number(path: Path) -> int:
    return int(path.stem.split("-")[-1])


def make_sheet(volume_dir: Path) -> None:
    pages = sorted(volume_dir.glob("page-*.png"), key=page_number)
    if not pages:
        return

    with Image.open(pages[0]) as sample:
        thumb_height = round(sample.height * THUMB_WIDTH / sample.width)

    rows = math.ceil(len(pages) / COLUMNS)
    sheet = Image.new(
        "RGB",
        (
            GAP + COLUMNS * (THUMB_WIDTH + GAP),
            GAP + rows * (thumb_height + LABEL_HEIGHT + GAP),
        ),
        "#c7cbc5",
    )
    draw = ImageDraw.Draw(sheet)

    for index, path in enumerate(pages):
        with Image.open(path) as image:
            thumbnail = image.convert("RGB")
            thumbnail.thumbnail((THUMB_WIDTH, thumb_height), Image.Resampling.LANCZOS)
            x = GAP + (index % COLUMNS) * (THUMB_WIDTH + GAP)
            y = GAP + (index // COLUMNS) * (thumb_height + LABEL_HEIGHT + GAP)
            sheet.paste(thumbnail, (x, y))
            draw.text((x, y + thumb_height + 5), f"Page {page_number(path)}", fill="#202724")

    DESTINATION.mkdir(parents=True, exist_ok=True)
    sheet.save(DESTINATION / f"{volume_dir.name}.jpg", quality=88, optimize=True)


def main() -> None:
    for volume_dir in sorted(SOURCE.glob("volume-*"), key=lambda path: int(path.name.split("-")[-1])):
        make_sheet(volume_dir)
    print(DESTINATION)


if __name__ == "__main__":
    main()
