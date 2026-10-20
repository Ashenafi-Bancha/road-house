/**
 * Download the Unsplash PLACEHOLDER photos into images-src/ (one-time setup).
 * Skips any key that already has a file in images-src/ — so real photos are never overwritten.
 *
 *   npm run placeholders
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import dns from "node:dns";

dns.setDefaultResultOrder("ipv4first"); // avoids IPv6 connect timeouts on some networks

const ROOT = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const SRC = join(ROOT, "images-src");
const sources = JSON.parse(readFileSync(join(ROOT, "scripts/placeholder-sources.json"), "utf8"));
mkdirSync(SRC, { recursive: true });
const existing = new Set(readdirSync(SRC).map((f) => f.replace(/\.[^.]+$/, "")));

for (const [key, url] of Object.entries(sources)) {
  if (existing.has(key)) continue;
  let ok = false;
  for (let attempt = 1; attempt <= 3 && !ok; attempt++) {
    try {
      const res = await fetch(`${url}?w=2000&q=85&fm=jpg&fit=max`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      writeFileSync(join(SRC, `${key}.jpg`), Buffer.from(await res.arrayBuffer()));
      console.log(`placeholders: ${key}.jpg`);
      ok = true;
    } catch (err) {
      console.warn(`placeholders: ${key} attempt ${attempt} failed — ${err.cause?.code ?? err.message}`);
    }
  }
}
if (!existsSync(join(SRC, "README.txt"))) {
  writeFileSync(join(SRC, "README.txt"), "Original photos. File name = image key in src/data/images.ts.\nReplace a placeholder with a real photo using the same name, then run `npm run images`.\n");
}
