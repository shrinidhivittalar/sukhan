import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const guides = JSON.parse(await readFile(new URL("app/guide-content.json", root), "utf8"));

test("ships complete study material for all ten volumes", () => {
  assert.equal(guides.length, 10);
  assert.equal(guides.reduce((total, guide) => total + guide.sections.length, 0), 471);
  assert.equal(guides.reduce((total, guide) => total + guide.vocabulary.length, 0), 350);
  assert.equal(guides.reduce((total, guide) => total + guide.tables.length, 0), 125);

  for (const [index, guide] of guides.entries()) {
    assert.equal(guide.volume, index + 1);
    assert.ok(guide.sections.length >= 20, `Volume ${guide.volume} has too few sections`);
    assert.ok(guide.sections.every((section) => section.id && section.title && section.kind));
    assert.ok(guide.vocabulary.every((word) => word.roman && word.roman !== "·" && word.meaning));
  }
});

test("keeps every source PDF available to the in-page reader", async () => {
  const pdfNames = [
    "volume-01-100-words.pdf",
    "volume-02-grammar-and-couplets.pdf",
    "volume-03-read-the-script.pdf",
    "volume-04-art-of-urdu-poetry.pdf",
    "volume-05-beyond-the-ghazal.pdf",
    "volume-06-living-lexicon.pdf",
    "volume-07-thematic-anthology.pdf",
    "volume-08-poets-and-qawwali.pdf",
    "volume-09-listening-companion.pdf",
    "volume-10-annotated-anthology.pdf",
  ];

  for (const name of pdfNames) {
    const bytes = await readFile(new URL(`public/pdfs/${name}`, root));
    assert.equal(bytes.subarray(0, 4).toString(), "%PDF");
  }
});
