"use client";
/**
 * Fixed header: wordmark, live open badge, language toggle, menu button.
 * Hides on scroll down, reappears on scroll up; gains a blurred backdrop after the hero.
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { SITE } from "@/config/site";
import { href } from "@/i18n";
import { useLocale } from "@/components/providers/LocaleProvider";
import { OpenBadge } from "@/components/ui/OpenBadge";

// The overlay (and framer-motion with it) is fetched on first intent: hover/focus/touch of the button.
const loadMenu = () => import("./MenuOverlay");
const MenuLayer = dynamic(loadMenu, { ssr: false });

export function Header() {
  const { locale, t } = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuUsed, setMenuUsed] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > last && y > 300);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the overlay whenever the route changes
  useEffect(() => setOpen(false), [pathname]);

  // Same page in the other language
  const other = locale === "en" ? "am" : "en";
  const switchHref = pathname.replace(/^\/(en|am)(?=\/|$)/, `/${other}`) || href(other);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color,backdrop-filter] duration-500 ease-out-expo
          ${hidden && !open ? "-translate-y-full" : "translate-y-0"}
          ${scrolled && !open ? "bg-espresso/70 backdrop-blur-xl" : "bg-transparent"}`}
      >
        <div className="container-x flex h-16 items-center justify-between gap-4 md:h-20">
          <Link href={href(locale)} className="group flex flex-col leading-none" aria-label={SITE.name[locale]}>
            <span className="font-display text-xl font-semibold tracking-tight md:text-2xl">
              {SITE.name.short.split(" ").map((w, i) => (
                <span key={i}>{i > 0 && <span className="text-ember">·</span>}{w}</span>
              ))}
            </span>
            <span className="mt-1 text-[10px] uppercase tracking-[0.28em] text-muted">{SITE.name.sub}</span>
          </Link>

          <div className="flex items-center gap-2 md:gap-4">
            <span className="hidden sm:block"><OpenBadge /></span>
            <Link
              href={switchHref}
              hrefLang={other}
              lang={other}
              aria-label={t.nav.switchToLabel}
              className="rounded-full border border-cream/20 px-3 py-1.5 text-xs font-semibold transition-colors hover:border-cream/60 hover:bg-cream/5"
            >
              {t.nav.switchTo}
            </Link>
            <button
              type="button"
              onClick={() => { setMenuUsed(true); setOpen((v) => !v); }}
              onPointerEnter={loadMenu}
              onFocus={loadMenu}
              onTouchStart={loadMenu}
              aria-expanded={open}
              aria-controls="site-menu"
              aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
              className="group relative flex h-11 w-11 items-center justify-center rounded-full bg-cream text-espresso transition-transform duration-300 hover:scale-105"
            >
              <span className="relative block h-3 w-5" aria-hidden>
                <span className={`absolute left-0 top-0 h-[1.5px] w-full bg-current transition-transform duration-500 ease-out-expo ${open ? "translate-y-[5px] rotate-45" : ""}`} />
                <span className={`absolute bottom-0 left-0 h-[1.5px] w-full bg-current transition-transform duration-500 ease-out-expo ${open ? "-translate-y-[5px] -rotate-45" : ""}`} />
              </span>
            </button>
          </div>
        </div>
      </header>
      {menuUsed && <MenuLayer open={open} onClose={close} />}
    </>
  );
}
