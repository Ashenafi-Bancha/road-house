import type { MetadataRoute } from "next";
import { SITE } from "@/config/site";
import { href, LOCALES } from "@/i18n";

export const dynamic = "force-static";

const PAGES = ["/", "/menu", "/gallery", "/about", "/visit"];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.flatMap((path) =>
    LOCALES.map((locale) => ({
      url: `${SITE.url}${href(locale, path)}`,
      changeFrequency: "monthly" as const,
      priority: path === "/" ? 1 : 0.8,
      alternates: {
        languages: Object.fromEntries(LOCALES.map((l) => [l === "am" ? "am-ET" : "en", `${SITE.url}${href(l, path)}`])),
      },
    }))
  );
}
