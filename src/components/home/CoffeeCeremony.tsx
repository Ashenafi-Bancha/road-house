"use client";
/**
 * COFFEE CEREMONY — scroll-driven story: Roasting → Brewing → Serving.
 * Desktop (motion OK): the section pins; images wipe in, text crossfades, a progress line fills.
 * Phones / reduced motion: a simple stacked sequence with fade-ins.
 */
import { useRef } from "react";
import { useGsap } from "@/lib/gsap";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";
import type { ImageKey } from "@/data/images";

const STEP_IMAGES: ImageKey[] = ["roasting", "brewing", "serving"];

/** Little glowing sparks drifting up over the roasting image */
function Sparks() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[3] overflow-hidden" aria-hidden>
      <style>{`
        .spark{position:absolute;bottom:-10px;width:4px;height:4px;border-radius:9999px;background:#ffb070;box-shadow:0 0 8px 2px rgba(217,87,43,.8);animation:spark 3.2s linear infinite;opacity:0}
        @keyframes spark{0%{transform:translate(0,0);opacity:0}15%{opacity:1}100%{transform:translate(var(--dx),-70vh);opacity:0}}
      `}</style>
      {Array.from({ length: 14 }).map((_, i) => (
        <span
          key={i}
          className="spark"
          style={{ left: `${(i * 37) % 100}%`, animationDelay: `${(i * 0.45) % 3.2}s`, ["--dx" as string]: `${((i % 5) - 2) * 18}px` }}
        />
      ))}
    </div>
  );
}

export function CoffeeCeremony() {
  const { t } = useLocale();
  const root = useRef<HTMLElement>(null);
  const steps = t.ceremony.steps;

  useGsap(
    ({ gsap }) => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const imgs = gsap.utils.toArray<HTMLElement>(".cer-img");
        const texts = gsap.utils.toArray<HTMLElement>(".cer-text");
        gsap.set(imgs.slice(1), { clipPath: "inset(100% 0% 0% 0%)" });
        gsap.set(texts.slice(1), { autoAlpha: 0, y: 40 });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: ".cer-pin", pin: true, start: "top top", end: "+=220%", scrub: 0.6 },
        });
        tl.to(".cer-progress", { scaleY: 1, duration: 2 }, 0);
        for (let i = 1; i < imgs.length; i++) {
          const at = i - 0.5;
          tl.to(imgs[i], { clipPath: "inset(0% 0% 0% 0%)", duration: 0.5 }, at)
            .to(imgs[i - 1].querySelector("img"), { scale: 1.15, duration: 0.5 }, at)
            .to(texts[i - 1], { autoAlpha: 0, y: -40, duration: 0.3 }, at)
            .to(texts[i], { autoAlpha: 1, y: 0, duration: 0.3 }, at + 0.2)
            .to(`.cer-dot-${i}`, { backgroundColor: "#d9572b", scale: 1.3, duration: 0.1 }, at + 0.2);
        }
      });
      return () => mm.revert();
    },
    root
  );

  return (
    <section ref={root} className="relative bg-coffee" aria-label={t.ceremony.eyebrow}>
      {/* Desktop pinned version */}
      <div className="cer-pin hidden h-[100svh] overflow-hidden lg:motion-safe:block">
        <div className="container-x grid h-full grid-cols-[1.1fr_1fr] items-center gap-16">
          <div className="relative h-[76vh] overflow-hidden rounded-3xl">
            {STEP_IMAGES.map((img, i) => (
              <div key={img} className="cer-img absolute inset-0" style={{ zIndex: i }}>
                <Photo name={img} sizes="55vw" className="h-full w-full" sweep={false} cursor="view" />
                {i === 0 && <Sparks />}
              </div>
            ))}
          </div>

          <div className="relative flex h-[76vh] gap-10">
            {/* Progress line */}
            <div className="relative w-px bg-cream/15" aria-hidden>
              <div className="cer-progress absolute inset-0 origin-top scale-y-0 bg-ember" />
              {steps.map((_, i) => (
                <span key={i} className={`cer-dot-${i} absolute -left-[5px] h-[11px] w-[11px] rounded-full ${i === 0 ? "bg-ember" : "bg-cream/30"}`} style={{ top: `${(i / (steps.length - 1)) * 100}%` }} />
              ))}
            </div>
            <div className="relative flex-1">
              <p className="eyebrow">{t.ceremony.eyebrow}</p>
              <h2 className="mt-4 font-display text-big">{t.ceremony.title}</h2>
              <p className="mt-3 text-parchment/70">{t.ceremony.intro}</p>
              <div className="relative mt-14">
                {steps.map((s) => (
                  <div key={s.num} className="cer-text absolute inset-x-0 top-0">
                    <span className="font-display text-7xl text-ember">{s.num}</span>
                    <h3 className="mt-2 font-display text-5xl">{s.title}</h3>
                    <p className="mt-4 max-w-md text-lg leading-relaxed text-parchment/80">{s.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile + reduced-motion version */}
      <div className="section-y lg:motion-safe:hidden">
        <div className="container-x">
          <p className="eyebrow">{t.ceremony.eyebrow}</p>
          <h2 className="mt-4 font-display text-huge">{t.ceremony.title}</h2>
          <p className="mt-3 text-parchment/70">{t.ceremony.intro}</p>
          <ol className="mt-12 space-y-14">
            {steps.map((s, i) => (
              <Reveal
                as="li"
                key={s.num}
                margin="-15%"
                className="grid gap-5 md:grid-cols-2 md:items-center"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
                  <Photo name={STEP_IMAGES[i]} sizes="(min-width: 768px) 50vw, 100vw" className="h-full w-full" />
                  {i === 0 && <Sparks />}
                </div>
                <div>
                  <span className="font-display text-5xl text-ember">{s.num}</span>
                  <h3 className="mt-1 font-display text-4xl">{s.title}</h3>
                  <p className="mt-3 text-parchment/80">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
