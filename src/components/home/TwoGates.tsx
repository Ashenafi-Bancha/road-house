"use client";
/**
 * "TWO GATES" — split screen: Cafe vs. Restaurant (Kunspagna).
 * Desktop: hover (or keyboard focus) expands one side to ~70%.
 * Mobile: stacked panels; tap to expand one (accordion-like).
 */
import Link from "next/link";
import { useState } from "react";
import { SITE } from "@/config/site";
import { href } from "@/i18n";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Photo } from "@/components/ui/Photo";
import { ArrowIcon } from "@/components/ui/Icons";
import type { ImageKey } from "@/data/images";

type Side = "cafe" | "restaurant";

export function TwoGates() {
  const { locale, t } = useLocale();
  const [active, setActive] = useState<Side | null>(null);

  const gates: { id: Side; image: ImageKey; link: string; accent: string }[] = [
    { id: "cafe", image: "cafeInterior", link: href(locale, "/menu") + "#coffee", accent: "text-gold" },
    { id: "restaurant", image: "restaurantInterior", link: href(locale, "/menu") + "#wolaita", accent: "text-ember" },
  ];

  return (
    <section className="section-y bg-espresso" aria-labelledby="gates-title">
      <div className="container-x mb-12 grid gap-6 md:mb-16 md:grid-cols-2 md:items-end">
        <div>
          <p className="eyebrow mb-4">{t.gates.eyebrow}</p>
          <h2 id="gates-title" className="font-display text-huge">{t.gates.title}</h2>
        </div>
        <div className="md:pl-12">
          <p className="text-parchment/80 md:text-lg">{t.gates.intro}</p>
          <p className="mt-3 text-xs uppercase tracking-[0.2em] text-muted">{t.gates.hint}</p>
        </div>
      </div>

      <div className="container-x">
        <div className="flex h-[88svh] min-h-[620px] flex-col gap-3 md:h-[78vh] md:min-h-[560px] md:flex-row" onMouseLeave={() => setActive(null)}>
          {gates.map((g) => {
            const isActive = active === g.id;
            const copy = t.gates[g.id];
            const grow = active === null ? 1 : isActive ? 2.3 : 0.7;
            return (
              <div
                key={g.id}
                className="group relative min-h-[180px] overflow-hidden rounded-3xl transition-[flex-grow] duration-[900ms] ease-out-expo"
                style={{ flexGrow: grow, flexBasis: 0 }}
                onMouseEnter={() => setActive(g.id)}
              >
                <Photo
                  name={g.image}
                  sizes="(min-width: 768px) 70vw, 100vw"
                  className="absolute inset-0 h-full w-full"
                  imgClassName={`transition-transform duration-[1400ms] ease-out-expo ${isActive ? "scale-105" : "scale-110"}`}
                  cursor="view"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/50 to-espresso/10" />

                {/* Whole panel is clickable (tap on phones); the button gives keyboard access. */}
                <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 md:p-10" onClick={() => setActive(g.id)}>
                  <button type="button" className="text-left" aria-expanded={isActive} onFocus={() => setActive(g.id)}>
                    <span className={`eyebrow ${g.accent}`}>{copy.label}</span>
                    <span className="mt-3 block font-display text-[clamp(2.4rem,6vw,5.5rem)] leading-none">{SITE.name[g.id][locale]}</span>
                  </button>
                  {/* Height animates via CSS grid rows (globals.css → .expand); hidden content is inert. */}
                  <div className={`expand ${isActive ? "is-open" : ""}`} inert={!isActive}>
                    <div>
                      <p className="max-w-md pt-4 text-parchment">{copy.text}</p>
                      <Link
                        href={g.link}
                        className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-cream px-5 py-3 text-sm font-semibold text-espresso transition-colors hover:bg-gold"
                      >
                        {copy.cta} <ArrowIcon size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
