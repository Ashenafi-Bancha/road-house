"use client";
/**
 * "RATED 4.7 ON GOOGLE" — animated counter + filling stars, linking to the real Google listing.
 * No reviews are quoted here on purpose (no invented testimonials).
 */
import { useRef } from "react";
import { SITE } from "@/config/site";
import { fmt } from "@/i18n";
import { useGsap } from "@/lib/gsap";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Button } from "@/components/ui/Button";
import { ArrowUpRightIcon, StarIcon } from "@/components/ui/Icons";

export function Rating() {
  const { t } = useLocale();
  const root = useRef<HTMLElement>(null);
  const value = SITE.rating.value;
  // Fill per star: 4.7 → [100, 100, 100, 100, 70]
  const fills = Array.from({ length: 5 }, (_, i) => Math.round(Math.max(0, Math.min(1, value - i)) * 100));

  useGsap(
    ({ gsap }) => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const num = root.current!.querySelector<HTMLElement>(".rating-num")!;
      const counter = { v: 0 };
      num.textContent = "0.0";
      gsap.set(".star-fill", { width: "0%" });

      const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 70%", once: true } });
      tl.to(counter, {
        v: value,
        duration: 2,
        ease: "power3.out",
        onUpdate: () => { num.textContent = counter.v.toFixed(1); },
      }).to(".star-fill", { width: (i: number) => `${fills[i]}%`, duration: 0.6, stagger: 0.18, ease: "power2.out" }, 0.2);
    },
    root
  );

  return (
    <section ref={root} className="section-y relative overflow-hidden bg-espresso" aria-labelledby="rating-title">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_50%_50%,rgba(227,163,59,0.12),transparent_70%)]" />
      <div className="container-x relative text-center">
        <p className="eyebrow">{t.rating.eyebrow}</p>
        <h2 id="rating-title" className="sr-only">{fmt(t.rating.title, { value })}</h2>

        <p className="mt-6 font-display text-[clamp(7rem,26vw,20rem)] font-semibold leading-none tracking-tighter text-cream" aria-hidden>
          <span className="rating-num tabular-nums">{value.toFixed(1)}</span>
        </p>

        <div className="mt-4 flex justify-center gap-2" role="img" aria-label={`${value} ${t.rating.outOf}`}>
          {fills.map((f, i) => (
            <span key={i} className="relative inline-block h-9 w-9 md:h-12 md:w-12">
              <StarIcon className="absolute inset-0 h-full w-full text-cream/15" />
              <span className="star-fill absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${f}%` }}>
                <StarIcon className="h-9 w-9 text-gold md:h-12 md:w-12" />
              </span>
            </span>
          ))}
        </div>

        <p className="mt-6 text-lg text-parchment">
          <span className="font-display text-2xl text-cream">{fmt(t.rating.title, { value })}</span>
          <br />
          {fmt(t.rating.basedOn, { count: SITE.rating.count })}
        </p>

        <div className="mt-10 flex justify-center">
          <Button href={SITE.maps.listing} variant="light" icon={<ArrowUpRightIcon size={18} />}>{t.rating.cta}</Button>
        </div>
      </div>
    </section>
  );
}
