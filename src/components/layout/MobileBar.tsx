"use client";
/** Sticky bottom action bar on phones: Call · Directions · Menu. */
import Link from "next/link";
import { SITE } from "@/config/site";
import { href } from "@/i18n";
import { useLocale } from "@/components/providers/LocaleProvider";
import { MenuBookIcon, PhoneIcon, PinIcon } from "@/components/ui/Icons";

export function MobileBar() {
  const { locale, t } = useLocale();
  const item = "flex flex-1 flex-col items-center justify-center gap-1 py-2 text-[11px] font-semibold active:scale-95 transition-transform";
  return (
    <nav
      aria-label="Quick actions"
      className="safe-bottom fixed inset-x-0 bottom-0 z-30 border-t border-cream/10 bg-espresso/85 px-2 pt-1.5 backdrop-blur-xl md:hidden"
    >
      <div className="flex gap-1">
        <a href={`tel:${SITE.phone.e164}`} className={`${item} rounded-xl bg-terracotta text-cream`}>
          <PhoneIcon size={18} /> {t.nav.call}
        </a>
        <a href={SITE.maps.directions} target="_blank" rel="noopener noreferrer" className={item}>
          <PinIcon size={18} /> {t.nav.directions}
        </a>
        <Link href={href(locale, "/menu")} className={item}>
          <MenuBookIcon size={18} /> {t.nav.foodMenu}
        </Link>
      </div>
    </nav>
  );
}
