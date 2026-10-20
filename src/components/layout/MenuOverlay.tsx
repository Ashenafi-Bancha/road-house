"use client";
/**
 * Full-screen navigation overlay.
 * - Opens with a circular clip-path wipe from the menu button (top-right).
 * - Links stagger in; Escape closes; focus is trapped and restored.
 * Loaded on demand by the Header (with framer-motion), so it costs nothing until first opened.
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { SITE } from "@/config/site";
import { href } from "@/i18n";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useLenis } from "@/components/providers/SmoothScroll";
import { InstagramIcon, PhoneIcon, PinIcon, ClockIcon, TikTokIcon } from "@/components/ui/Icons";

const EASE = [0.76, 0, 0.24, 1] as const;

export default function MenuLayer({ open, onClose }: { open: boolean; onClose: () => void }) {
  return <AnimatePresence>{open && <MenuOverlay onClose={onClose} />}</AnimatePresence>;
}

export function MenuOverlay({ onClose }: { onClose: () => void }) {
  const { locale, t } = useLocale();
  const pathname = usePathname();
  const lenis = useLenis();
  const panel = useRef<HTMLDivElement>(null);

  const links = [
    { label: t.nav.home, path: "/" },
    { label: t.nav.menu, path: "/menu" },
    { label: t.nav.gallery, path: "/gallery" },
    { label: t.nav.about, path: "/about" },
    { label: t.nav.visit, path: "/visit" },
  ];

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    lenis?.stop();
    document.body.style.overflow = "hidden";
    panel.current?.querySelector<HTMLElement>("a")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab" || !panel.current) return;
      // Focus trap: keep Tab within the overlay + the header toggle button
      const header = document.querySelector<HTMLElement>("header button[aria-controls='site-menu']");
      const items = [...panel.current.querySelectorAll<HTMLElement>("a, button"), ...(header ? [header] : [])];
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      lenis?.start();
      previouslyFocused?.focus?.();
    };
  }, [lenis, onClose]);

  return (
    <motion.div
      id="site-menu"
      ref={panel}
      role="dialog"
      aria-modal="true"
      aria-label={t.nav.openMenu}
      className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-coffee"
      initial={{ clipPath: "circle(0% at calc(100% - 3rem) 2.5rem)" }}
      animate={{ clipPath: "circle(150% at calc(100% - 3rem) 2.5rem)" }}
      exit={{ clipPath: "circle(0% at calc(100% - 3rem) 2.5rem)" }}
      transition={{ duration: 0.8, ease: EASE }}
    >
      <div className="container-x grid flex-1 gap-12 pb-28 pt-28 md:grid-cols-[1.6fr_1fr] md:items-end md:pb-16">
        <nav aria-label="Main">
          <ul className="space-y-1">
            {links.map((l, i) => {
              const target = href(locale, l.path);
              const active = pathname === target || pathname === target.slice(0, -1);
              return (
                <li key={l.path} className="overflow-hidden">
                  <motion.div
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "110%", transition: { duration: 0.3 } }}
                    transition={{ delay: 0.25 + i * 0.07, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link
                      href={target}
                      onClick={onClose}
                      aria-current={active ? "page" : undefined}
                      className="group flex items-baseline gap-4 font-display text-[clamp(2.6rem,9vw,6.5rem)] leading-[1.05] tracking-tight"
                    >
                      <span className="text-xs font-sans tabular-nums text-muted">0{i + 1}</span>
                      <span className={`transition-[color,transform] duration-500 ease-out-expo group-hover:translate-x-3 group-hover:text-ember ${active ? "text-ember" : ""}`}>
                        {l.label}
                      </span>
                    </Link>
                  </motion.div>
                </li>
              );
            })}
          </ul>
        </nav>

        <motion.div
          className="space-y-6 text-sm text-parchment"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <p className="font-display text-2xl text-cream" lang="am">{SITE.name.am}</p>
          <p className="flex gap-3"><PinIcon className="shrink-0 text-ember" /> {SITE.address[locale]}</p>
          <p className="flex gap-3"><ClockIcon className="shrink-0 text-ember" /> {t.visit.hoursValue}, {t.visit.hoursTime}</p>
          <a href={`tel:${SITE.phone.e164}`} className="link-u flex w-fit gap-3"><PhoneIcon className="shrink-0 text-ember" /> {SITE.phone.display}</a>
          <div className="flex gap-3">
            <a href={SITE.social.instagram.url} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex h-11 w-11 items-center justify-center rounded-full border border-cream/20 transition-colors hover:bg-cream hover:text-espresso"><InstagramIcon /></a>
            {SITE.social.tiktok.url && (
              <a href={SITE.social.tiktok.url} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="flex h-11 w-11 items-center justify-center rounded-full border border-cream/20 transition-colors hover:bg-cream hover:text-espresso"><TikTokIcon /></a>
            )}
          </div>
        </motion.div>
      </div>
      <div className="textile" aria-hidden />
    </motion.div>
  );
}
