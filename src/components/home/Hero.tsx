"use client";
/**
 * HERO — 3D jebena + brand name revealed line by line.
 * The line reveal is a CSS animation timed to start as the preloader lifts
 * (or almost immediately on repeat visits), so text paints without waiting for JS.
 */
import { useRef } from "react";
import { SITE } from "@/config/site";
import { href } from "@/i18n";
import { useGsap } from "@/lib/gsap";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Button } from "@/components/ui/Button";
import { OpenBadge } from "@/components/ui/OpenBadge";
import { ArrowIcon } from "@/components/ui/Icons";
import { HeroVisual } from "./HeroVisual";

/** Stagger index for the CSS reveal animations */
const v = (i: number) => ({ ["--i" as string]: i }) as React.CSSProperties;

export function Hero() {
  const { locale, t } = useLocale();
  const root = useRef<HTMLElement>(null);

  useGsap(
    ({ gsap }) => {
      // The intro reveal is pure CSS (globals.css → .reveal-line / .hero-fade) so it never waits
      // for JavaScript — that keeps LCP fast. GSAP only drives the scroll-linked parallax.
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // Scroll: headline drifts up and fades, visual sinks slightly — cinematic depth.
      gsap.to(".hero-content", {
        yPercent: -18,
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(".hero-visual", {
        yPercent: 12,
        scale: 1.08,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
    },
    root
  );

  return (
    <section ref={root} className="relative h-[100svh] min-h-[640px] overflow-hidden bg-espresso" aria-labelledby="hero-title">
      {/* Warm dusk light */}
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_70%_45%,rgba(217,87,43,0.22),transparent_70%),radial-gradient(ellipse_80%_60%_at_20%_100%,rgba(59,36,22,0.9),transparent_70%)]" />
      <div className="hero-visual absolute inset-0">
        <HeroVisual />
      </div>
      {/* Legibility gradient behind the text */}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/30 to-transparent md:bg-gradient-to-r md:from-espresso/90 md:via-espresso/30" />

      <div className="hero-content container-x relative flex h-full flex-col justify-end pb-28 pt-24 md:justify-center md:pb-10 md:pt-28">
        <div style={v(0)} className="hero-fade mb-6 flex flex-wrap items-center gap-3">
          <span className="eyebrow">{t.hero.eyebrow}</span>
          <OpenBadge detail />
        </div>

        <h1 id="hero-title" className="font-display text-mega font-semibold">
          <span className="reveal-line block overflow-hidden pb-[0.06em]" style={v(0)}><span className="block">{SITE.name.heroLines[0]}</span></span>{" "}
          <span className="reveal-line block overflow-hidden pb-[0.06em]" style={v(1)}><span className="block italic font-normal text-parchment">{SITE.name.heroLines[1]}</span></span>{" "}
          <span className="reveal-line block overflow-hidden pb-[0.08em]" style={v(2)}><span className="block text-ember">{SITE.name.heroLines[2]}</span></span>
        </h1>
        <p style={v(1)} className="hero-fade mt-4 font-display text-xl text-parchment md:text-3xl" lang="am">{SITE.name.am}</p>

        <div className="mt-8 max-w-xl">
          <p style={v(2)} className="hero-fade font-display text-lg italic text-gold md:text-xl">“{t.hero.tagline}”</p>
          <p style={v(3)} className="hero-fade mt-3 text-sm leading-relaxed text-parchment/80 md:text-base">{t.hero.sub}</p>
        </div>

        <div style={v(4)} className="hero-fade mt-8 flex flex-wrap gap-3">
          <Button href={href(locale, "/menu")} icon={<ArrowIcon size={18} />}>{t.hero.ctaMenu}</Button>
          <Button href={href(locale, "/visit")} variant="ghost">{t.hero.ctaVisit}</Button>
        </div>
      </div>

      {/* Scroll cue */}
      <div style={v(5)} aria-hidden className="hero-fade absolute bottom-8 right-6 hidden items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-muted md:flex">
        {t.hero.scroll}
        <span className="relative block h-12 w-px overflow-hidden bg-cream/15">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_1.8s_ease-in-out_infinite] bg-ember" />
        </span>
      </div>
    </section>
  );
}
