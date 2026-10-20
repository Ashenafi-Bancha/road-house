"use client";
/**
 * MENU — category filter tabs + item grid. All data comes from src/data/menu.ts.
 * Deep links: /menu/#coffee opens the "Coffee & Tea" tab.
 * Animations use LazyMotion: only the small `m` core ships up front; layout features load async.
 */
import { useEffect, useState } from "react";
import { AnimatePresence, LazyMotion, m } from "framer-motion";
import { MENU_CATEGORIES, MENU_ITEMS } from "@/data/menu";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Photo } from "@/components/ui/Photo";

const loadFeatures = () => import("./motionFeatures").then((mod) => mod.default);

export function MenuBrowser() {
  const { locale, t } = useLocale();
  const [cat, setCat] = useState<string>("all");

  useEffect(() => {
    const fromHash = window.location.hash.slice(1);
    if (MENU_CATEGORIES.some((c) => c.id === fromHash)) setCat(fromHash);
  }, []);

  const select = (id: string) => {
    setCat(id);
    history.replaceState(null, "", id === "all" ? window.location.pathname : `#${id}`);
  };

  const tabs = [{ id: "all", name: { en: t.menuPage.all, am: t.menuPage.all } }, ...MENU_CATEGORIES];
  const items = cat === "all" ? MENU_ITEMS : MENU_ITEMS.filter((i) => i.category === cat);
  const formatPrice = (p: number | null) =>
    p == null ? t.menuPage.priceTbc : `${new Intl.NumberFormat(locale === "am" ? "am-ET" : "en-US").format(p)} ${t.menuPage.currency}`;

  return (
    <LazyMotion features={loadFeatures}>
    <section className="container-x pb-28 pt-10">
      {/* Filter tabs (sticky under the header) */}
      <div className="sticky top-16 z-20 -mx-4 bg-espresso/85 px-4 py-3 backdrop-blur-xl md:top-20">
        <div role="tablist" aria-label={t.menuPage.filterLabel} className="no-scrollbar flex gap-2 overflow-x-auto">
          {tabs.map((c) => {
            const active = cat === c.id;
            return (
              <button
                key={c.id}
                role="tab"
                aria-selected={active}
                aria-controls="menu-panel"
                onClick={() => select(c.id)}
                className={`relative shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${active ? "text-espresso" : "text-parchment hover:text-cream"}`}
              >
                {active && <m.span layoutId="menu-pill" className="absolute inset-0 rounded-full bg-cream" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
                <span className="relative">{c.name[locale]}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div id="menu-panel" role="tabpanel">
      <m.ul layout className="mt-10 grid gap-x-10 gap-y-2 md:grid-cols-2">
        {/* initial={false}: items are visible in the static HTML; only filter changes animate */}
        <AnimatePresence initial={false} mode="popLayout">
          {items.map((item, idx) => {
            const placeholder = item.name.en.startsWith("[");
            return (
              <m.li
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className={`group flex gap-5 border-b border-cream/10 py-6 ${placeholder ? "opacity-60" : ""}`}
              >
                {item.image ? (
                  <Photo name={item.image} sizes="112px" priority={cat === "all" && idx < 2} className="relative h-24 w-24 shrink-0 rounded-2xl md:h-28 md:w-28" cursor="taste" />
                ) : (
                  <div aria-hidden className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border border-dashed border-cream/20 p-2 text-center text-[10px] uppercase tracking-widest text-muted md:h-28 md:w-28">
                    {t.common.placeholderImage}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-3">
                    <h2 className="font-display text-xl md:text-2xl">{item.name[locale]}</h2>
                    <span aria-hidden className="mb-1 flex-1 border-b border-dotted border-cream/20" />
                    <span className="shrink-0 text-sm font-semibold text-gold tabular-nums">{formatPrice(item.price)}</span>
                  </div>
                  {locale === "en" && !placeholder && <p className="mt-0.5 text-sm text-muted" lang="am">{item.name.am}</p>}
                  <p className="mt-2 text-sm text-parchment/75">{item.description[locale]}</p>
                  {item.signature && (
                    <span className="mt-3 inline-block rounded-full bg-terracotta px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-cream">
                      {t.menuPage.signature}
                    </span>
                  )}
                </div>
              </m.li>
            );
          })}
        </AnimatePresence>
      </m.ul>
      </div>
    </section>
    </LazyMotion>
  );
}
