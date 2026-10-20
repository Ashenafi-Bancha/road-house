/**
 * ─────────────────────────────────────────────────────────────
 *  MENU DATA — edit the menu here. Everything on /menu reads from this file.
 *
 *  - `price`: a number in ETB, or null to show the "[PRICE]" placeholder.
 *  - `signature: true` adds the "Signature" tag.
 *  - Items named "[MENU ITEM - CONFIRM WITH OWNER]" are placeholders:
 *    replace or delete them once the owner provides the real menu.
 * ─────────────────────────────────────────────────────────────
 */
import type { ImageKey } from "./images";

type Text = { en: string; am: string };

export type MenuCategory = { id: string; name: Text };

export type MenuItem = {
  id: string;
  category: MenuCategory["id"];
  name: Text;
  description: Text;
  price: number | null;
  signature?: boolean;
  image?: ImageKey;
};

export const MENU_CATEGORIES: MenuCategory[] = [
  { id: "wolaita", name: { en: "Wolaita Specials", am: "የወላይታ ልዩ ምግቦች" } },
  { id: "tibs", name: { en: "Tibs & Grills", am: "ጥብስ" } },
  { id: "coffee", name: { en: "Coffee & Tea", am: "ቡና እና ሻይ" } },
  { id: "drinks", name: { en: "Beer & Wine", am: "ቢራ እና ወይን" } },
];

const TBC: Text = { en: "[DESCRIPTION - CONFIRM WITH OWNER]", am: "[መግለጫ - ከባለቤቱ ያረጋግጡ]" };
const PLACEHOLDER_NAME: Text = { en: "[MENU ITEM - CONFIRM WITH OWNER]", am: "[የሜኑ ምግብ - ከባለቤቱ ያረጋግጡ]" };

export const MENU_ITEMS: MenuItem[] = [
  // ── Wolaita specials ─────────────────────────────
  {
    id: "kurt",
    category: "wolaita",
    name: { en: "Wolaita Raw Meat (Kurt)", am: "የወላይታ ጥሬ ስጋ" },
    description: { en: "The house signature — serving the best Wolaita ጥሬ ስጋ.", am: "የቤቱ መለያ — ምርጡ የወላይታ ጥሬ ስጋ።" },
    price: null,
    signature: true,
    image: "kurt",
  },
  {
    id: "kitfo",
    category: "wolaita",
    name: { en: "Kitfo", am: "ክትፎ" },
    description: { en: "Ethiopia's beloved minced-beef classic.", am: "የኢትዮጵያ ተወዳጅ የተከተፈ ስጋ ምግብ።" },
    price: null,
    signature: true,
    image: "kitfo",
  },
  { id: "wolaita-tbc-1", category: "wolaita", name: PLACEHOLDER_NAME, description: TBC, price: null },

  // ── Tibs & grills ───────────────────────────────
  {
    id: "shekla-tibs",
    category: "tibs",
    name: { en: "Shekla Tibs", am: "ሸክላ ጥብስ" },
    description: { en: "Tibs served sizzling in a clay shekla.", am: "በሸክላ ውስጥ እየተንጣጣ የሚቀርብ ጥብስ።" },
    price: null,
    signature: true,
    image: "shekla",
  },
  {
    id: "ranger",
    category: "tibs",
    name: { en: "Ranger", am: "ሬንጀር" },
    description: TBC,
    price: null,
    signature: true,
    image: "ranger",
  },
  { id: "tibs-tbc-1", category: "tibs", name: PLACEHOLDER_NAME, description: TBC, price: null },

  // ── Coffee & tea ────────────────────────────────
  {
    id: "coffee",
    category: "coffee",
    name: { en: "Coffee", am: "ቡና" },
    description: TBC,
    price: null,
    image: "coffeeCup",
  },
  {
    id: "tea",
    category: "coffee",
    name: { en: "Tea", am: "ሻይ" },
    description: TBC,
    price: null,
    image: "tea",
  },
  { id: "coffee-tbc-1", category: "coffee", name: PLACEHOLDER_NAME, description: TBC, price: null },

  // ── Beer & wine ─────────────────────────────────
  {
    id: "beer",
    category: "drinks",
    name: { en: "Beer", am: "ቢራ" },
    description: TBC,
    price: null,
    image: "beer",
  },
  {
    id: "wine",
    category: "drinks",
    name: { en: "Wine", am: "ወይን" },
    description: TBC,
    price: null,
    image: "wine",
  },
];
