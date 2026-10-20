# Road House Cafe & Kunspagna — website

Bilingual (English / አማርኛ) static website for Road House Cafe & Kunspagna, Wolaita Sodo.
Next.js 16 (App Router, static export) · TypeScript · Tailwind CSS 4 · GSAP + ScrollTrigger · Lenis ·
React Three Fiber + drei (lazy-loaded 3D) · Framer Motion.

> **Before launch:** read [`CONTENT_TODO.md`](CONTENT_TODO.md). It lists every placeholder the owner needs to replace.

## Run it

Requires Node.js 20+.

```bash
npm install
npm run dev          # http://localhost:3000 → redirects to /en/ or /am/
npm run build        # static site in ./out
npm start            # preview ./out locally (http://localhost:3000)
npm run lint         # type-check
```

`dev` and `build` first run two helper scripts automatically:
- `npm run fonts` subsets the Noto Ethiopic fonts to the Amharic characters the site uses (~70 KB instead of ~380 KB).
- `npm run images` turns photos in `images-src/` into responsive AVIF files in `public/images/`.

After `build`, `scripts/postbuild-export.mjs` patches the static export so page prefetching works on any static host.

## Edit content

| What | Where |
|---|---|
| Name, phone, address, hours, rating, map links, socials, WhatsApp, domain | `src/config/site.ts` (single source of truth) |
| All interface text | `src/i18n/en.json`, `src/i18n/am.json` (same keys in both; write `{name}` wherever the brand name should appear) |
| Menu items, categories, prices | `src/data/menu.ts` |
| Photos and their alt text | `images-src/<key>.jpg` + `src/data/images.ts` |
| Gallery order | `src/data/gallery.ts` |

**Replacing a photo:** save the real photo as `images-src/<key>.jpg` with the same key (e.g. `kurt.jpg`), run `npm run images`, then update its alt text in `src/data/images.ts`. `npm run placeholders` re-downloads any missing placeholder photos; it never overwrites existing files.

**Changing the name spelling:** edit `SITE.name` in `src/config/site.ts` (including `heroLines`, the three lines of the big hero headline). Every page, the logo, the preloader, SEO data and the Open Graph image read from it.

## Project structure

```
src/
  app/
    [locale]/            /en/… and /am/… pages (home, menu, gallery, about, visit)
      layout.tsx         fonts, JSON-LD, header/footer, preloader, cursor, grain
      template.tsx       page transition
    (root)/page.tsx      "/" → language redirect
    sitemap.ts, robots.ts, og.png/route.tsx (Open Graph image, generated at build)
  components/
    home/                Hero, HeroVisual, Marquee, TwoGates, SignatureDishes (+SmokeCanvas),
                         CoffeeCeremony, Rating, Visit
    three/HeroScene.tsx  procedural 3D jebena, shader steam, embers (lazy-loaded)
    layout/              Header, MenuOverlay, MobileBar, Footer, Cursor, Preloader
    pages/               PageHero, MenuBrowser, GalleryGrid, AboutContent, ContactCards
    providers/           LocaleProvider, SmoothScroll (Lenis ↔ ScrollTrigger)
    ui/                  Button (magnetic), Photo, OpenBadge, Icons
  config/site.ts         business facts
  data/                  images, menu, gallery
  i18n/                  en.json, am.json, helpers
  lib/                   gsap registry, opening hours (Africa/Addis_Ababa), device tiers, SEO, image loader
scripts/                 fonts, images, placeholders, post-build fix
images-src/              original photos (placeholders for now)
fonts-src/               Noto Sans/Serif Ethiopic variable fonts (SIL OFL)
```

## Performance and accessibility notes

- **3D tiers** (`src/lib/device.ts`):
  - Desktops get the full jebena scene a few seconds after load.
  - Phones get a lighter version, loaded on first touch or scroll.
  - Data-saver, 2G, low-memory devices, no WebGL, or reduced motion get a static photo with CSS steam.
- **Hero text reveals are pure CSS**, so text paints without waiting for JavaScript.
- **Pinned scroll scenes** (dishes, ceremony) run on desktop only; phones get swipe and stacked layouts.
- **`prefers-reduced-motion`** turns off smooth scroll, pinning, grain animation, the preloader and the cursor.
- **Lighthouse** (local static build, Lighthouse 12; mobile numbers vary a few points between runs):
  - Accessibility, Best Practices and SEO: **100** on every page tested.
  - Performance, desktop: 97–99.
  - Performance, simulated mobile (slow 4G, 4× CPU): about 78–89, held back by the JavaScript cost of the animation libraries.
- **Open status** uses Ethiopian time (`Africa/Addis_Ababa`) and is computed in the browser, so it stays correct on a static host.

## Deploy

The output is a fully static site (`out/`).

**Vercel:** import the repo. The framework is detected automatically and `vercel.json` adds the `/` → `/en/` or `/am/` redirect and caching headers. Set `NEXT_PUBLIC_SITE_URL` to your domain.

**Netlify:** set build command `npm run build` and publish directory `out`. `public/_redirects` handles the language redirect. Set `NEXT_PUBLIC_SITE_URL`.

**Any static host** (cPanel, S3, GitHub Pages…): upload the contents of `out/`. Visitors to `/` are redirected by a tiny script in `out/index.html`.

## Credits

Placeholder photos: Unsplash (free license; see `scripts/placeholder-sources.json`).
Fonts: Fraunces, Inter Tight (Google Fonts); Noto Sans/Serif Ethiopic (SIL Open Font License).
