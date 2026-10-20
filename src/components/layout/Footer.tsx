"use client";
import Link from "next/link";
import { SITE } from "@/config/site";
import { fmt, href } from "@/i18n";
import { useLocale } from "@/components/providers/LocaleProvider";
import { InstagramIcon, TikTokIcon, ArrowUpRightIcon } from "@/components/ui/Icons";
import { OpenBadge } from "@/components/ui/OpenBadge";

export function Footer() {
  const { locale, t } = useLocale();
  const year = new Date().getFullYear();
  const links = [
    { label: t.nav.menu, path: "/menu" },
    { label: t.nav.gallery, path: "/gallery" },
    { label: t.nav.about, path: "/about" },
    { label: t.nav.visit, path: "/visit" },
  ];

  return (
    <footer className="relative overflow-hidden bg-charcoal pb-28 md:pb-10">
      <div className="textile textile-thin" aria-hidden />
      <div className="container-x pt-20">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <p className="font-display text-3xl">{t.footer.tagline}</p>
            <div className="mt-6"><OpenBadge detail /></div>
          </div>
          <div>
            <p className="eyebrow mb-4">{t.footer.explore}</p>
            <ul className="space-y-2">
              {links.map((l) => (
                <li key={l.path}><Link className="link-u" href={href(locale, l.path)}>{l.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-4">{t.footer.contact}</p>
            <ul className="space-y-2 text-parchment">
              <li><a className="link-u" href={`tel:${SITE.phone.e164}`}>{SITE.phone.display}</a></li>
              <li>{t.visit.hoursValue}<br />{t.visit.hoursTime}</li>
              <li>
                <a className="link-u inline-flex items-center gap-1" href={SITE.maps.listing} target="_blank" rel="noopener noreferrer">
                  {SITE.address.plusCode} <ArrowUpRightIcon size={14} />
                </a>
              </li>
            </ul>
            <p className="eyebrow mb-3 mt-8">{t.footer.follow}</p>
            <div className="flex flex-col gap-2 text-parchment">
              <a className="link-u inline-flex w-fit items-center gap-2" href={SITE.social.instagram.url} target="_blank" rel="noopener noreferrer">
                <InstagramIcon size={16} /> {SITE.social.instagram.handle}
                <span className="text-xs text-muted">({fmt(t.footer.instagramFollowers, { count: SITE.social.instagram.followers })})</span>
              </a>
              {SITE.social.tiktok.url ? (
                <a className="link-u inline-flex w-fit items-center gap-2" href={SITE.social.tiktok.url} target="_blank" rel="noopener noreferrer">
                  <TikTokIcon size={16} /> TikTok
                </a>
              ) : (
                <span className="inline-flex items-center gap-2"><TikTokIcon size={16} /> <span lang="am">{SITE.social.tiktok.handle}</span></span>
              )}
            </div>
          </div>
        </div>

        {/* Giant wordmark */}
        <div
          aria-hidden
          data-word={SITE.name.short}
          className="mt-20 select-none whitespace-nowrap font-display text-[17vw] font-semibold leading-[0.8] tracking-tighter text-cream/[0.06] after:content-[attr(data-word)]"
        />
        <div className="mt-6 flex flex-col justify-between gap-2 border-t border-cream/10 pt-6 text-xs text-muted sm:flex-row">
          <span>© {year} {SITE.name[locale]}. {t.footer.rights}</span>
          <span lang="am">{SITE.name.am}</span>
        </div>
      </div>
    </footer>
  );
}
