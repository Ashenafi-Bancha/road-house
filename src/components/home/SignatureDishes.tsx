"use client";
/**
 * SIGNATURE DISHES — pinned horizontal scroll (desktop) with mask reveals + inner parallax.
 * Phones / reduced motion: a native swipe carousel with scroll-snap (no pinning fights).
 */
import { useRef } from "react";
import { href } from "@/i18n";
import { useGsap } from "@/lib/gsap";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Photo } from "@/components/ui/Photo";
import { Button } from "@/components/ui/Button";
import { ArrowIcon } from "@/components/ui/Icons";
import { SmokeCanvas } from "./SmokeCanvas";
import type { ImageKey } from "@/data/images";

const DISHES: { key: "kurt" | "shekla" | "kitfo" | "ranger"; image: ImageKey }[] = [
  { key: "kurt", image: "kurt" },
  { key: "shekla", image: "shekla" },
  { key: "kitfo", image: "kitfo" },
  { key: "ranger", image: "ranger" },
];

export function SignatureDishes() {
  const { locale, t } = useLocale();
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGsap(
    ({ gsap }) => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const el = track.current!;
        const distance = () => el.scrollWidth - window.innerWidth;

        const scroller = gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: ".dishes-pin",
            pin: true,
            scrub: 0.8,
            start: "top top",
            end: () => `+=${distance()}`,
            invalidateOnRefresh: true,
          },
        });

        gsap.utils.toArray<HTMLElement>(".dish-card").forEach((card) => {
          const media = card.querySelector(".dish-media");
          const img = card.querySelector("img");
          gsap.fromTo(media, { clipPath: "inset(0% 100% 0% 0%)" }, {
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "none",
            scrollTrigger: { trigger: card, containerAnimation: scroller, start: "left 95%", end: "left 45%", scrub: true },
          });
          gsap.fromTo(img, { xPercent: -8, scale: 1.18 }, {
            xPercent: 8,
            ease: "none",
            scrollTrigger: { trigger: card, containerAnimation: scroller, start: "left right", end: "right left", scrub: true },
          });
        });
      });
      return () => mm.revert();
    },
    root
  );

  return (
    <section ref={root} className="relative bg-charcoal" aria-labelledby="dishes-title">
      <div className="dishes-pin flex min-h-[100svh] flex-col justify-center overflow-hidden py-20 lg:py-0">
        <div className="container-x mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow mb-4">{t.dishes.eyebrow}</p>
            <h2 id="dishes-title" className="max-w-3xl font-display text-huge">{t.dishes.title}</h2>
          </div>
          <Button href={href(locale, "/menu")} variant="ghost" icon={<ArrowIcon size={16} />}>{t.dishes.cta}</Button>
        </div>

        <div
          ref={track}
          className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto px-[clamp(1rem,4vw,3.5rem)] pb-4 lg:gap-8 lg:motion-safe:snap-none lg:motion-safe:overflow-visible"
          data-lenis-prevent-wheel=""
        >
          {DISHES.map((d, i) => {
            const item = t.dishes.items[d.key];
            return (
              <article key={d.key} className="dish-card w-[82vw] shrink-0 snap-center sm:w-[60vw] lg:w-[34vw]">
                <div className="dish-media relative aspect-[4/5] overflow-hidden rounded-3xl lg:aspect-auto lg:h-[52vh]">
                  <Photo
                    name={d.image}
                    sizes="(min-width: 1024px) 34vw, 82vw"
                    className="absolute inset-0 h-full w-full"
                    cursor="taste"
                  />
                  {d.key === "shekla" && <SmokeCanvas className="absolute inset-0 z-[3] h-full w-full" />}
                  <span className="absolute left-5 top-5 z-[4] rounded-full bg-espresso/70 px-3 py-1 text-xs tabular-nums backdrop-blur">0{i + 1}</span>
                </div>
                <div className="mt-5 flex items-baseline justify-between gap-4">
                  <h3 className="font-display text-3xl md:text-4xl">{item.name}</h3>
                  <span className="shrink-0 text-sm text-gold">{item.native}</span>
                </div>
                <p className="mt-2 max-w-md text-sm text-parchment/75">{item.text}</p>
              </article>
            );
          })}
          <div className="w-px shrink-0 lg:w-[4vw]" aria-hidden />
        </div>
      </div>
    </section>
  );
}
