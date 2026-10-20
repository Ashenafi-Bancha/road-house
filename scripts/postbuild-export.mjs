/**
 * Static-export fix-up (runs automatically after `npm run build`).
 *
 * Next 16 writes per-segment prefetch data as folders, e.g.
 *   out/en/menu/__next.$d$locale/menu/__PAGE__.txt
 * but the client requests the flattened name
 *   /en/menu/__next.$d$locale.menu.__PAGE__.txt
 * On a plain static host that's a 404 (console error + slower navigations).
 * This copies every such file to its flattened name so both URLs work.
 */
import { copyFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const OUT = join(new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"), "out");

function filesIn(dir) {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? filesIn(p) : [p];
  });
}

let copied = 0;
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (!statSync(p).isDirectory()) continue;
    if (name.startsWith("__next.")) {
      for (const f of filesIn(p)) {
        const flat = `${name}.${relative(p, f).split(sep).join(".")}`;
        copyFileSync(f, join(dir, flat));
        copied++;
      }
    } else if (name !== "_next") {
      walk(p);
    }
  }
})(OUT);
console.log(`postbuild: flattened ${copied} prefetch file(s)`);
