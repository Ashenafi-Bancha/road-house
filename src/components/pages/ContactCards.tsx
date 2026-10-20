"use client";
/** Quick contact cards for /visit: call, directions, Instagram, TikTok, WhatsApp (if set). */
import { SITE } from "@/config/site";
import { useLocale } from "@/components/providers/LocaleProvider";
import { ArrowUpRightIcon, InstagramIcon, PhoneIcon, PinIcon, TikTokIcon, WhatsAppIcon } from "@/components/ui/Icons";

export function ContactCards() {
  const { t } = useLocale();
  const cards = [
    { icon: PhoneIcon, label: t.visit.call, value: SITE.phone.display, href: `tel:${SITE.phone.e164}` },
    { icon: PinIcon, label: t.visit.directions, value: SITE.address.plusCode, href: SITE.maps.directions },
    ...(SITE.whatsapp
      ? [{ icon: WhatsAppIcon, label: t.visitPage.whatsapp, value: SITE.whatsapp, href: `https://wa.me/${SITE.whatsapp.replace(/\D/g, "")}` }]
      : []),
    { icon: InstagramIcon, label: "Instagram", value: SITE.social.instagram.handle, href: SITE.social.instagram.url },
    ...(SITE.social.tiktok.url ? [{ icon: TikTokIcon, label: "TikTok", value: "Roadhouse", href: SITE.social.tiktok.url }] : []),
  ];

  return (
    <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(({ icon: Icon, label, value, href }) => (
        <li key={label}>
          <a
            href={href}
            {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="group flex h-full items-center gap-4 rounded-2xl border border-cream/10 bg-coffee/60 p-5 transition-colors duration-300 hover:border-ember hover:bg-coffee"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ember/15 text-ember transition-colors group-hover:bg-ember group-hover:text-cream">
              <Icon size={20} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-xs uppercase tracking-[0.15em] text-muted">{label}</span>
              <span className="block truncate font-semibold">{value}</span>
            </span>
            <ArrowUpRightIcon size={16} className="shrink-0 text-muted transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cream" />
          </a>
        </li>
      ))}
    </ul>
  );
}
