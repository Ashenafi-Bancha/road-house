/**
 * i18n — all user-facing text lives in en.json / am.json.
 * Pages are statically generated per locale: /en/... and /am/...
 */
import en from "./en.json";
import am from "./am.json";
import { SITE } from "@/config/site";

export const LOCALES = ["en", "am"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export type Dictionary = typeof en;

/** Fill "{name}" everywhere with the brand name from src/config/site.ts (one place to edit). */
function withName<T>(value: T, name: string): T {
  if (typeof value === "string") return value.replaceAll("{name}", name) as T;
  if (Array.isArray(value)) return value.map((v) => withName(v, name)) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, withName(v, name)])) as T;
  }
  return value;
}

const dictionaries: Record<Locale, Dictionary> = {
  en: withName(en, SITE.name.en),
  am: withName(am as Dictionary, SITE.name.am),
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries.en;
}

/** Replace {tokens} in a string: fmt("Rated {value}", { value: 4.7 }) */
export function fmt(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`));
}

/** Build a locale-prefixed path: href("am", "/menu") -> "/am/menu/" */
export function href(locale: Locale, path = "/") {
  const clean = path.replace(/^\/+|\/+$/g, "");
  return clean ? `/${locale}/${clean}/` : `/${locale}/`;
}
