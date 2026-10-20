# CONTENT_TODO — what the owner needs to provide

Everything below is currently a **placeholder** on the site. Nothing has been invented:
where a fact was unknown, the site shows a bracketed placeholder such as
`[MENU ITEM - CONFIRM WITH OWNER]` or uses clearly generic stock photos.

Tick items off as you replace them.

---

## 1. Photos (highest impact)

All 23 photos are **free Unsplash stock placeholders**, not photos of Road House.
Sources: `scripts/placeholder-sources.json`.

To replace one: save the real photo as `images-src/<key>.jpg` (same name), run `npm run images`,
then update its `alt` text in `src/data/images.ts` and set `placeholder: false`.
Use photos of at least 2000px on the long edge.

| Key | Where it's used | Ideal real photo |
|---|---|---|
| `kurt` | Signature dishes #1, menu, gallery | Your Wolaita ጥሬ ስጋ (Kurt) platter |
| `shekla` | Signature dishes #2 (with smoke effect), menu | Shekla Tibs sizzling in the clay pot |
| `kitfo` | Signature dishes #3, menu | Your Kitfo |
| `ranger` | Signature dishes #4, menu | Your Ranger dish |
| `heroJebena` | Hero fallback (slow phones), gallery | Your jebena / coffee pour, ideally dark and moody |
| `cafeInterior` | "Two Gates": Cafe side, About | The **cafe gate** and space |
| `restaurantInterior` | "Two Gates": Kunspagna side, About | The **restaurant (Kunspagna) gate** and space |
| `outdoor`, `outdoorDusk` | About, gallery | Your outdoor seating |
| `entrance` | About (first photo) | The front of Road House from the main road |
| `roasting`, `brewing`, `serving` | Coffee ceremony section | Your coffee roasting, jebena brewing, cups being served |
| `ceremonyHost`, `ceremonyTools` | Gallery | Your coffee ceremony setup |
| `coffeeCup`, `tea`, `beer`, `wine` | Menu thumbnails | Your drinks |
| `injeraPlatter`, `spices`, `flatbread`, `beans` | Gallery | Any real food / kitchen shots |

- [ ] Real photos for all signature dishes (kurt, shekla, kitfo, ranger)
- [ ] Real photos of the two gates (cafe and restaurant)
- [ ] Real interior, exterior and outdoor photos
- [ ] Real coffee ceremony photos (if you hold a ceremony; see section 4)
- [ ] A logo file (SVG preferred). The site currently uses a typographic wordmark.

## 2. Menu and prices (`src/data/menu.ts`)

- [ ] **Full menu.** Only these items are confirmed: Wolaita Raw Meat (Kurt), Shekla Tibs, Ranger, Kitfo, coffee, tea, beer and wine.
- [ ] **Delete or replace** the three `[MENU ITEM - CONFIRM WITH OWNER]` entries.
- [ ] **All prices** in ETB. Every price shows `[PRICE]` until you set `price: 250` (for example).
- [ ] **Ranger:** what is it? Its description is a placeholder in `menu.ts`, `en.json` and `am.json` (`dishes.items.ranger.text`).
- [ ] **Descriptions** for coffee, tea, beer and wine (currently placeholders).
- [ ] Confirm the short descriptions written for Kurt, Kitfo and Shekla Tibs (general descriptions of the dishes, not your recipes).
- [ ] Are the menu categories right (Wolaita Specials / Tibs & Grills / Coffee & Tea / Beer & Wine)?

## 3. Contact and links (`src/config/site.ts`)

- [ ] **WhatsApp number.** Set `whatsapp: "+2519…"` to show a WhatsApp button on /visit.
- [ ] **Instagram URL.** Currently derived from the handle (`instagram.com/roadhousecafeandkunspagna`). Please confirm it.
- [ ] **TikTok profile URL.** Unknown, so the site shows the TikTok name without a link. Set `tiktok.url`.
- [ ] **Website domain.** `url` is a placeholder (`roadhouse-sodo.example.com`). Set it, or set the `NEXT_PUBLIC_SITE_URL` environment variable on Vercel/Netlify. It's used for SEO, the sitemap and Open Graph.
- [ ] Confirm the map pin. The coordinates were decoded from the plus code `VQ45+PPX` (6.85686, 37.75936).
- [ ] Email address, if you want one shown (none is listed now).

## 4. Story and copy

- [ ] **Owner's story** for the About page (`aboutPage.story` in `en.json` and `am.json`): how Road House started, who runs it, what makes it special.
- [ ] **Coffee ceremony.** The section describes the Ethiopian coffee tradition in general terms. Do you serve a traditional ceremony? If so, add details (times, price); if not, consider retitling it.
- [ ] Confirm the "Two Gates" wording describes the cafe and restaurant spaces correctly.
- [ ] Confirm spelling of the name in both languages (`SITE.name` in `site.ts`; change it once there).
- [ ] Opening year / history, if you'd like it mentioned (none is stated now).

## 5. Amharic proofreading (`src/i18n/am.json`)

- [ ] **Have a native Amharic speaker proofread every string.** The Amharic was written for this build and has not been reviewed by a native speaker.
- [ ] Check especially: service names (e.g. "በመኪና ላይ ሆኖ መስተናገድ" for drive-through), the hours line (shows both Ethiopian time "ከጠዋቱ 1:00 – ምሽቱ 3:00" and 7:00 AM – 9:00 PM), and the coffee-ceremony steps.
- After editing Amharic text, the font subset updates automatically on the next `npm run dev` / `npm run build` (or run `npm run fonts`).

## 6. Reviews

- The site shows only your real Google rating (**4.7 from 30 reviews**) and links to the Google listing. No testimonials were written.
- [ ] Update `rating` in `site.ts` when the numbers change.
- [ ] Optional: send 2–3 real reviews (with the reviewers' permission) if you'd like them quoted.
