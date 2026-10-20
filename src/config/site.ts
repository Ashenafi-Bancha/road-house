/**
 * ─────────────────────────────────────────────────────────────
 *  SITE CONFIG — the single source of truth for business facts.
 *  Change the name spelling, phone, hours, links, etc. HERE ONLY.
 * ─────────────────────────────────────────────────────────────
 */

export const SITE = {
  /** Brand name — edit spelling here and it updates everywhere. */
  name: {
    en: "Road House Cafe & Kunspagna",
    am: "ሮድሀውስ ካፌ እና ኩንስፓኛ",
    /** Short form used in tight spaces (logo, preloader, footer wordmark). */
    short: "Road House",
    /** Second line of the logo. */
    sub: "Cafe & Kunspagna",
    /** The three lines of the big hero headline. */
    heroLines: ["Road House", "Cafe &", "Kunspagna"],
    /** The two halves used by the "Two Gates" section. */
    cafe: { en: "Road House Cafe", am: "ሮድሀውስ ካፌ" },
    restaurant: { en: "Kunspagna", am: "ኩንስፓኛ" },
  },

  /**
   * Public URL of the deployed site (used for canonical URLs, sitemap, Open Graph).
   * [CONFIRM WITH OWNER] — replace with the real domain once purchased.
   */
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://roadhouse-sodo.example.com",

  phone: {
    display: "+251 91 106 9024",
    /** E.164 format for tel: links and schema.org */
    e164: "+251911069024",
  },

  /** [CONFIRM WITH OWNER] WhatsApp number — set to null to hide the WhatsApp button. */
  whatsapp: null as string | null,

  address: {
    en: "Near the stadium, past the Kale Heywot Church, Wolaita Sodo",
    am: "ከስታድየም ቃ/ህ/ቤ/ክርስቲያን ከፍ ብሎ፣ ወላይታ ሶዶ",
    city: "Wolaita Sodo",
    country: "ET",
    plusCode: "VQ45+PPX, Soddo",
    /** Global plus code 6GRVVQ45+PPX decoded to its centre point. */
    geo: { lat: 6.85686, lng: 37.75936 },
  },

  maps: {
    /** Official Google Maps listing (reviews, directions). */
    listing: "https://goo.gl/maps/PjA3ceNT2EodiCDe8",
    directions:
      "https://www.google.com/maps/dir/?api=1&destination=6.85686,37.75936",
    embed: "https://maps.google.com/maps?q=6.85686,37.75936&z=17&output=embed",
  },

  /** Opening hours in Ethiopian local time (Africa/Addis_Ababa), 24h clock. */
  hours: {
    timeZone: "Africa/Addis_Ababa",
    open: 7, // 7:00 AM
    close: 21, // 9:00 PM
    days: "Mo-Su",
  },

  rating: { value: 4.7, count: 30, source: "Google" },

  social: {
    instagram: {
      handle: "@roadhousecafeandkunspagna",
      // Derived from the handle — [CONFIRM WITH OWNER]
      url: "https://www.instagram.com/roadhousecafeandkunspagna/",
      followers: "960+",
    },
    tiktok: {
      handle: "ሮድሀውስ ካፌ እና ኩንስፓኛ || Roadhouse",
      // [CONFIRM WITH OWNER] — exact TikTok profile URL unknown; set it here.
      url: null as string | null,
    },
  },

  popular: { busiestHour: 17 },
} as const;

export type SiteConfig = typeof SITE;
