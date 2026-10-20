"use client";
/**
 * Infinite marquee strip: "ጥሬ ስጋ • Shekla Tibs • Kitfo • Coffee • …"
 * Base speed + a boost from scroll velocity; the text skews slightly with speed.
 * Reduced motion → static strip.
 */
import { useEffect, useRef } from "react";
import { loadGsapWhenIdle } from "@/lib/gsap";
import { useLocale } from "@/components/providers/LocaleProvider";

export function Marquee({ reverse = false, small = false }: { reverse?: boolean; small?: boolean }) {
  const { t } = useLocale();
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = track.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cleanup = () => {};
    let cancelled = false;
    loadGsapWhenIdle().then(({ gsap, ScrollTrigger }) => {
    if (cancelled) return;
    let x = 0;
    let boost = 0;
    let visible = false;
    let half = el.scrollWidth / 2;
    const dir = reverse ? 1 : -1;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);
    // Measure once (and on resize) — reading scrollWidth every frame would force a layout per frame.
    const ro = new ResizeObserver(() => { half = el.scrollWidth / 2; });
    ro.observe(el);
    const setX = gsap.quickSetter(el, "x", "px");
    const setSkew = gsap.quickSetter(el, "skewX", "deg");

    const st = ScrollTrigger.create({
      trigger: el,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => { boost = gsap.utils.clamp(-14, 14, self.getVelocity() / 220); },
    });

    const tick = (_: number, dt: number) => {
      if (!visible || !half) return;
      boost *= 0.92; // ease the scroll boost back to base speed
      x += dir * (0.045 * dt + Math.abs(boost));
      if (x <= -half) x += half;
      if (x > 0) x -= half;
      setX(x);
      setSkew(boost * 0.5 * dir);
    };
    gsap.ticker.add(tick);
    cleanup = () => { gsap.ticker.remove(tick); st.kill(); io.disconnect(); ro.disconnect(); };
    });
    return () => { cancelled = true; cleanup(); };
  }, [reverse]);

  const items = t.marquee;
  const row = (key: string, hidden = false) => (
    <div key={key} className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <span key={i} className="flex items-center">
          <span className={`font-display whitespace-nowrap px-6 md:px-10 ${small ? "text-2xl md:text-4xl italic text-parchment/70" : "text-5xl md:text-8xl font-semibold"}`}>
            {item}
          </span>
          <span className={`inline-block rounded-full bg-ember ${small ? "h-2 w-2" : "h-3 w-3 md:h-4 md:w-4"}`} aria-hidden />
        </span>
      ))}
    </div>
  );

  return (
    <div className={`relative overflow-hidden ${small ? "py-4" : "bg-coffee py-8 md:py-12"}`}>
      {!small && <div className="textile textile-thin absolute inset-x-0 top-0" aria-hidden />}
      <div ref={track} className="marquee-track" role="marquee" aria-label={items.slice(0, 5).join(", ")}>
        {row("a")}
        {row("b", true)}
      </div>
      {!small && <div className="textile textile-thin absolute inset-x-0 bottom-0" aria-hidden />}
    </div>
  );
}
