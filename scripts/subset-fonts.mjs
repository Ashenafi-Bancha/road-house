/**
 * Subset the Noto Ethiopic fonts to ONLY the Amharic characters the site uses.
 * Full Ethiopic fonts are ~190 KB each; the subsets are a fraction of that — big win on 3G/4G.
 *
 * Runs automatically before `npm run dev` and `npm run build` (see package.json),
 * so editing Amharic text in src/i18n/am.json, src/config/site.ts or src/data/* just works.
 *
 * Sources: fonts-src/*.ttf (official variable fonts from github.com/google/fonts, SIL OFL 1.1)
 * Output:  src/fonts/*.woff2 (loaded with next/font/local in the layout)
 */
import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync } from "node:fs";
import { join, extname } from "node:path";
import subsetFont from "subset-font";

const ROOT = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const SCAN_DIRS = ["src/i18n", "src/config", "src/data", "src/components", "src/app"];
const ETHIOPIC = /[ሀ-᎟ⶀ-⷟꬀-꬯]/gu;

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if ([".json", ".ts", ".tsx"].includes(extname(p))) out.push(p);
  }
  return out;
}

const chars = new Set();
for (const d of SCAN_DIRS) {
  for (const file of walk(join(ROOT, d))) {
    for (const ch of readFileSync(file, "utf8").match(ETHIOPIC) ?? []) chars.add(ch);
  }
}
// Ethiopic punctuation + digits, so future text with these never falls back.
for (let c = 0x1360; c <= 0x137c; c++) chars.add(String.fromCodePoint(c));
const text = [...chars].join("") + " 0123456789.,:;!?()-–—/";

mkdirSync(join(ROOT, "src/fonts"), { recursive: true });
const fonts = [
  { src: "NotoSansEthiopic.ttf", out: "noto-sans-ethiopic-subset.woff2", wght: { min: 400, max: 600 } },
  { src: "NotoSerifEthiopic.ttf", out: "noto-serif-ethiopic-subset.woff2", wght: { min: 500, max: 700 } },
];
for (const f of fonts) {
  const buf = readFileSync(join(ROOT, "fonts-src", f.src));
  const subset = await subsetFont(buf, text, {
    targetFormat: "woff2",
    variationAxes: { wght: f.wght, wdth: 100 },
  });
  writeFileSync(join(ROOT, "src/fonts", f.out), subset);
  console.log(`subset-fonts: ${f.out} — ${chars.size} Ethiopic chars, ${(subset.length / 1024).toFixed(1)} KB`);
}
