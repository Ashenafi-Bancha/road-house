import type { Metadata } from "next";
import { SITE } from "@/config/site";
import { getDictionary, href, LOCALES, type Locale } from "@/i18n";

type PageKey = "home" | "menu" | "gallery" | "about" | "visit";

/** Per-page metadata with canonical + hreflang alternates for both languages. */
export function buildMetadata(locale: Locale, page: PageKey): Metadata {
  const t = getDictionary(locale);
  const path = page === "home" ? "/" : `/${page}`;
  const title = page === "home" ? t.meta.title : `${t.meta.pages[page].title} — ${SITE.name[locale]}`;
  const description = page === "home" ? t.meta.description : t.meta.pages[page].description;

  return {
    title: { absolute: title },
    description,
    keywords: t.meta.keywords,
    alternates: {
      canonical: href(locale, path),
      languages: Object.fromEntries([
        ...LOCALES.map((l) => [l === "am" ? "am-ET" : "en", href(l, path)]),
        ["x-default", href("en", path)],
      ]),
    },
    openGraph: {
      type: "website",
      siteName: SITE.name[locale],
      title,
      description,
      url: href(locale, path),
      locale: locale === "am" ? "am_ET" : "en_US",
      images: [{ url: "/og.png", width: 1200, height: 630, alt: SITE.name[locale] }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/og.png"] },
  };
}

/** schema.org Restaurant (LocalBusiness) structured data. */
export function restaurantJsonLd(locale: Locale) {
  const t = getDictionary(locale);
  const pad = (h: number) => `${String(h).padStart(2, "0")}:00`;
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${SITE.url}/#restaurant`,
    name: SITE.name.en,
    alternateName: SITE.name.am,
    description: t.meta.description,
    url: `${SITE.url}${href(locale)}`,
    telephone: SITE.phone.e164,
    image: [`${SITE.url}/og.png`],
    servesCuisine: ["Ethiopian", "Wolaita"],
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.en,
      addressLocality: SITE.address.city,
      addressCountry: SITE.address.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: SITE.address.geo.lat, longitude: SITE.address.geo.lng },
    hasMap: SITE.maps.listing,
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: pad(SITE.hours.open),
        closes: pad(SITE.hours.close),
      },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: SITE.rating.value,
      reviewCount: SITE.rating.count,
      bestRating: 5,
    },
    amenityFeature: ["Dine-in", "Outdoor seating", "Takeout", "Drive-through", "Free parking"].map((name) => ({
      "@type": "LocationFeatureSpecification",
      name,
      value: true,
    })),
    menu: `${SITE.url}${href(locale, "/menu")}`,
    sameAs: [SITE.social.instagram.url, SITE.social.tiktok.url].filter(Boolean),
  };
}
