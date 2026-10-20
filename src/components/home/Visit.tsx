"use client";
/**
 * VISIT — address (both languages), plus code (copy), live hours, call/directions,
 * service icons, best-time note, and a click-to-load Google Map (keeps Lighthouse fast).
 */
import { useState } from "react";
import { SITE } from "@/config/site";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Button } from "@/components/ui/Button";
import { OpenBadge } from "@/components/ui/OpenBadge";
import {
  ArrowUpRightIcon, ClockIcon, CopyIcon, DineInIcon, DriveIcon, OutdoorIcon,
  ParkingIcon, PhoneIcon, PinIcon, TakeoutIcon,
} from "@/components/ui/Icons";

function MapCard() {
  const { t } = useLocale();
  const [load, setLoad] = useState(false);
  return (
    <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-cream/10 bg-coffee sm:aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[560px]">
      {load ? (
        <iframe
          src={SITE.maps.embed}
          title={t.visit.mapTitle}
          className="absolute inset-0 h-full w-full border-0 [filter:grayscale(0.4)_sepia(0.25)_contrast(1.05)]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          data-lenis-prevent=""
        />
      ) : (
        <button type="button" onClick={() => setLoad(true)} className="group absolute inset-0 flex flex-col items-center justify-center gap-4 text-center">
          {/* Stylised "map" backdrop: roads + grid, drawn in CSS/SVG */}
          <svg className="absolute inset-0 h-full w-full opacity-40" aria-hidden preserveAspectRatio="none" viewBox="0 0 400 400">
            <defs>
              <pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse">
                <path d="M28 0H0V28" fill="none" stroke="#5a3a26" strokeWidth="0.6" />
              </pattern>
            </defs>
            <rect width="400" height="400" fill="url(#grid)" />
            <path d="M-10 250 C 100 230, 180 180, 410 140" stroke="#e3a33b" strokeWidth="7" fill="none" opacity="0.6" />
            <path d="M140 -10 C 160 120, 210 260, 260 410" stroke="#b9a68c" strokeWidth="3" fill="none" opacity="0.5" />
            <path d="M-10 90 L 410 330" stroke="#b9a68c" strokeWidth="2" fill="none" opacity="0.35" />
          </svg>
          <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-ember text-cream shadow-[0_0_0_10px_rgba(217,87,43,0.2)] transition-transform duration-500 group-hover:scale-110">
            <PinIcon size={28} />
          </span>
          <span className="relative rounded-full bg-cream px-5 py-3 text-sm font-semibold text-espresso">{t.visit.mapLoad}</span>
          <span className="relative text-xs text-muted">{t.visit.mapNote}</span>
        </button>
      )}
    </div>
  );
}

export function Visit({ headingLevel = 2 }: { headingLevel?: 1 | 2 }) {
  const { t } = useLocale();
  const [copied, setCopied] = useState(false);
  const Heading = headingLevel === 1 ? "h1" : "h2";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(SITE.address.plusCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch { /* clipboard blocked — ignore */ }
  };

  const services = [
    { icon: DineInIcon, label: t.visit.serviceList.dineIn },
    { icon: OutdoorIcon, label: t.visit.serviceList.outdoor },
    { icon: TakeoutIcon, label: t.visit.serviceList.takeout },
    { icon: DriveIcon, label: t.visit.serviceList.drive },
    { icon: ParkingIcon, label: t.visit.serviceList.parking },
  ];

  return (
    <section id="visit" className="section-y bg-charcoal" aria-labelledby="visit-title">
      <div className="container-x grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="eyebrow mb-4">{t.visit.eyebrow}</p>
          <Heading id="visit-title" className="font-display text-huge">{t.visit.title}</Heading>

          <dl className="mt-10 divide-y divide-cream/10 border-y border-cream/10">
            <div className="grid gap-2 py-5 sm:grid-cols-[9rem_1fr]">
              <dt className="flex items-center gap-2 text-sm text-muted"><PinIcon size={16} /> {t.visit.address}</dt>
              <dd>
                <p>{SITE.address.en}</p>
                <p className="mt-1 text-parchment/80" lang="am">{SITE.address.am}</p>
              </dd>
            </div>
            <div className="grid gap-2 py-5 sm:grid-cols-[9rem_1fr]">
              <dt className="text-sm text-muted">{t.visit.plusCode}</dt>
              <dd className="flex flex-wrap items-center gap-3">
                <span className="font-mono tracking-wide">{SITE.address.plusCode}</span>
                <button type="button" onClick={copy} className="inline-flex items-center gap-1.5 rounded-full border border-cream/20 px-3 py-1 text-xs transition-colors hover:bg-cream hover:text-espresso">
                  <CopyIcon size={14} /> <span aria-live="polite">{copied ? t.visit.copied : t.visit.copy}</span>
                </button>
              </dd>
            </div>
            <div className="grid gap-2 py-5 sm:grid-cols-[9rem_1fr]">
              <dt className="flex items-center gap-2 text-sm text-muted"><ClockIcon size={16} /> {t.visit.hours}</dt>
              <dd className="flex flex-wrap items-center gap-3">
                <span>{t.visit.hoursValue} · {t.visit.hoursTime}</span>
                <OpenBadge />
              </dd>
            </div>
            <div className="grid gap-2 py-5 sm:grid-cols-[9rem_1fr]">
              <dt className="flex items-center gap-2 text-sm text-muted"><PhoneIcon size={16} /> {t.visit.phone}</dt>
              <dd><a href={`tel:${SITE.phone.e164}`} className="link-u text-lg">{SITE.phone.display}</a></dd>
            </div>
          </dl>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={`tel:${SITE.phone.e164}`} icon={<PhoneIcon size={16} />}>{t.visit.call}</Button>
            <Button href={SITE.maps.directions} variant="ghost" icon={<ArrowUpRightIcon size={16} />}>{t.visit.directions}</Button>
          </div>

          <h3 className="mt-12 text-sm uppercase tracking-[0.2em] text-muted">{t.visit.services}</h3>
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {services.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3 rounded-2xl border border-cream/10 bg-espresso/40 px-4 py-3 text-sm transition-colors hover:border-ember/50">
                <Icon size={20} className="shrink-0 text-ember" /> {label}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex gap-4 rounded-2xl border border-gold/25 bg-gold/5 p-5">
            <ClockIcon size={22} className="mt-0.5 shrink-0 text-gold" />
            <div>
              <p className="font-semibold text-gold">{t.visit.bestTime}</p>
              <p className="mt-1 text-sm text-parchment/85">{t.visit.bestTimeText}</p>
            </div>
          </div>
        </div>

        <MapCard />
      </div>
    </section>
  );
}
