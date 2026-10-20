/**
 * ─────────────────────────────────────────────────────────────
 *  IMAGE MAP — every photo on the site is referenced from here.
 *
 *  Photos are self-hosted as pre-sized AVIF files (fast on mobile data):
 *    images-src/<key>.jpg  →  npm run images  →  public/images/<key>-<width>.avif
 *
 *  All current photos are PLACEHOLDERS from Unsplash (free license; sources in
 *  scripts/placeholder-sources.json). To use a real photo:
 *   1. Save it as images-src/<key>.jpg (e.g. images-src/kurt.jpg), replacing the placeholder.
 *   2. Run `npm run images` (also runs automatically on `npm run build`).
 *   3. Update its alt text below and set `placeholder: false`.
 *  To add a NEW photo: add images-src/<newKey>.jpg and an entry below with src "/images/<newKey>".
 * ─────────────────────────────────────────────────────────────
 */

export type SiteImage = {
  src: string;
  width: number;
  height: number;
  alt: { en: string; am: string };
  /** true = stock placeholder; listed in CONTENT_TODO.md */
  placeholder: boolean;
  credit?: string;
};

export const IMAGES = {
  heroJebena: {
    src: "/images/heroJebena",
    width: 1600, height: 2400,
    alt: { en: "Coffee being poured from a clay jebena into a small cup", am: "ከሸክላ ጀበና ወደ ስኒ የሚቀዳ ቡና" },
    placeholder: true,
  },
  kurt: {
    src: "/images/kurt",
    width: 1600, height: 2000,
    alt: { en: "A platter of Ethiopian raw beef (kurt) with knives and dipping sauces", am: "የጥሬ ስጋ ሰሃን ከቢላዎች እና ከአዋዜ ጋር" },
    placeholder: true,
  },
  shekla: {
    src: "/images/shekla",
    width: 1600, height: 2000,
    alt: { en: "Sizzling grilled meat with tomato and green pepper in a dark pan", am: "በሸክላ ውስጥ የሚንጣጣ ጥብስ" },
    placeholder: true,
  },
  kitfo: {
    src: "/images/kitfo",
    width: 1600, height: 2000,
    alt: { en: "Finely minced beef served on a plate", am: "በሰሃን የቀረበ ክትፎ" },
    placeholder: true,
  },
  ranger: {
    src: "/images/ranger",
    width: 1600, height: 2000,
    alt: { en: "Grilled meat with vegetables on a round wooden tray", am: "በክብ የእንጨት ትሪ ላይ የተጠበሰ ስጋ" },
    placeholder: true,
  },
  injeraPlatter: {
    src: "/images/injeraPlatter",
    width: 1600, height: 1200,
    alt: { en: "Ethiopian platter of injera with assorted stews", am: "እንጀራ ከተለያዩ ወጦች ጋር" },
    placeholder: true,
  },
  roasting: {
    src: "/images/roasting",
    width: 1600, height: 1200,
    alt: { en: "Coffee beans being stirred as they roast", am: "እየተቆላ ያለ ቡና" },
    placeholder: true,
  },
  brewing: {
    src: "/images/brewing",
    width: 1600, height: 2000,
    alt: { en: "Coffee ceremony: pouring from a jebena with incense smoke rising", am: "የቡና ሥነ ሥርዓት፦ ከጀበና መቅዳት እና የእጣን ጭስ" },
    placeholder: true,
  },
  serving: {
    src: "/images/serving",
    width: 1600, height: 2000,
    alt: { en: "A small cup of Ethiopian coffee being served", am: "የሚቀርብ ስኒ ቡና" },
    placeholder: true,
  },
  ceremonyHost: {
    src: "/images/ceremonyHost",
    width: 1600, height: 2000,
    alt: { en: "A woman in traditional dress seated at a coffee ceremony", am: "በባህል ልብስ ቡና የምታፈላ ሴት" },
    placeholder: true,
  },
  cafeInterior: {
    src: "/images/cafeInterior",
    width: 1600, height: 1100,
    alt: { en: "Warm cafe interior with hanging bulbs", am: "የተንጠለጠሉ አምፖሎች ያሉት ሞቅ ያለ ካፌ" },
    placeholder: true,
  },
  restaurantInterior: {
    src: "/images/restaurantInterior",
    width: 1600, height: 1100,
    alt: { en: "Guests dining inside a busy restaurant", am: "በምግብ ቤት ውስጥ የሚመገቡ እንግዶች" },
    placeholder: true,
  },
  outdoor: {
    src: "/images/outdoor",
    width: 1600, height: 1100,
    alt: { en: "Outdoor seating under string lights at night", am: "ምሽት ላይ በመብራቶች ስር ያለ የውጪ መቀመጫ" },
    placeholder: true,
  },
  entrance: {
    src: "/images/entrance",
    width: 1600, height: 2000,
    alt: { en: "A restaurant entrance glowing with warm lights at night", am: "ምሽት ላይ በሞቀ ብርሃን የደመቀ የምግብ ቤት መግቢያ" },
    placeholder: true,
  },
  outdoorDusk: {
    src: "/images/outdoorDusk",
    width: 1600, height: 1100,
    alt: { en: "Outdoor restaurant seating at dusk", am: "ምሽት ላይ የውጪ መቀመጫ" },
    placeholder: true,
  },
  beer: {
    src: "/images/beer",
    width: 1200, height: 1500,
    alt: { en: "A tall glass of cold golden beer", am: "ቀዝቃዛ ቢራ" },
    placeholder: true,
  },
  wine: {
    src: "/images/wine",
    width: 1200, height: 1500,
    alt: { en: "Red wine being poured into a glass", am: "ወደ ብርጭቆ የሚቀዳ ቀይ ወይን" },
    placeholder: true,
  },
  tea: {
    src: "/images/tea",
    width: 1200, height: 1500,
    alt: { en: "A glass mug of hot tea", am: "ትኩስ ሻይ" },
    placeholder: true,
  },
  coffeeCup: {
    src: "/images/coffeeCup",
    width: 1200, height: 1500,
    alt: { en: "Black coffee being poured into a ceramic mug", am: "ወደ ስኒ የሚቀዳ ጥቁር ቡና" },
    placeholder: true,
  },
  spices: {
    src: "/images/spices",
    width: 1600, height: 1100,
    alt: { en: "Colourful spices in metal bowls", am: "በብረት ሳህኖች ውስጥ ያሉ ቅመሞች" },
    placeholder: true,
  },
  flatbread: {
    src: "/images/flatbread",
    width: 1600, height: 1100,
    alt: { en: "Hands cooking flatbread on a large griddle", am: "በምጣድ ላይ የሚጋገር እንጀራ" },
    placeholder: true,
  },
  beans: {
    src: "/images/beans",
    width: 1600, height: 1100,
    alt: { en: "Close-up of roasted coffee beans", am: "የተቆላ ቡና" },
    placeholder: true,
  },
  ceremonyTools: {
    src: "/images/ceremonyTools",
    width: 1600, height: 1100,
    alt: { en: "Coffee grinder and ceremony items on a wooden counter", am: "የቡና መፍጫ እና የሥነ ሥርዓት እቃዎች" },
    placeholder: true,
  },
} satisfies Record<string, SiteImage>;

export type ImageKey = keyof typeof IMAGES;
