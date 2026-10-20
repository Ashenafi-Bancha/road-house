"use client";
/** ABOUT — owner's story (placeholder), the space, what we're known for. */
import { href } from "@/i18n";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Photo } from "@/components/ui/Photo";
import { Button } from "@/components/ui/Button";
import { ArrowIcon } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";

export function AboutContent() {
  const { locale, t } = useLocale();
  const a = t.aboutPage;

  return (
    <>
      {/* Story */}
      <section className="section-y container-x grid gap-12 md:grid-cols-[1fr_1.1fr] md:items-center">
        {/* First photo is above the fold on phones: shown immediately (fast LCP) */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
          <Photo name="entrance" sizes="(min-width: 768px) 45vw, 100vw" className="h-full w-full" cursor="view" priority />
        </div>
        <Reveal>
          <p className="eyebrow">{a.storyTitle}</p>
          <p className="mt-6 font-display text-2xl leading-snug md:text-4xl">{a.intro}</p>
          <div className="mt-8 rounded-2xl border border-dashed border-gold/40 bg-gold/5 p-6 text-parchment">{a.story}</div>
        </Reveal>
      </section>

      {/* The space */}
      <section className="bg-coffee">
        <div className="section-y container-x">
          <Reveal className="grid gap-8 md:grid-cols-2 md:items-end">
            <h2 className="font-display text-huge">{a.spaceTitle}</h2>
            <p className="text-parchment/85 md:text-lg">{a.space}</p>
          </Reveal>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {(["cafeInterior", "restaurantInterior", "outdoor"] as const).map((img, i) => (
              <Reveal key={img} delay={i * 0.1} className="relative aspect-[4/5] overflow-hidden rounded-3xl md:aspect-[3/4]">
                <Photo name={img} sizes="(min-width: 768px) 33vw, 100vw" className="h-full w-full" cursor="view" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Known for */}
      <section className="section-y container-x">
        <p className="eyebrow">{a.valuesTitle}</p>
        <ul className="mt-8 divide-y divide-cream/10 border-y border-cream/10">
          {a.values.map((v, i) => (
            <Reveal as="li" key={v} delay={i * 0.06} className="group flex items-baseline gap-6 py-6 md:py-8">
              <span className="text-sm tabular-nums text-muted">0{i + 1}</span>
              <span className="font-display text-[clamp(2rem,5.5vw,4.5rem)] leading-none transition-[color,transform] duration-500 ease-out-expo group-hover:translate-x-3 group-hover:text-ember">
                {v}
              </span>
            </Reveal>
          ))}
        </ul>
        <div className="mt-12 flex flex-wrap gap-3">
          <Button href={href(locale, "/menu")} icon={<ArrowIcon size={16} />}>{t.hero.ctaMenu}</Button>
          <Button href={href(locale, "/visit")} variant="ghost">{t.hero.ctaVisit}</Button>
        </div>
      </section>
    </>
  );
}
