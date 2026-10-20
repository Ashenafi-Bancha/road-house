import type { Metadata } from "next";
import { getDictionary, type Locale } from "@/i18n";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/pages/PageHero";
import { MenuBrowser } from "@/components/pages/MenuBrowser";
import { Marquee } from "@/components/home/Marquee";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata(locale as Locale, "menu");
}

export default async function MenuPage({ params }: Props) {
  const { locale } = await params;
  const t = getDictionary(locale as Locale);
  return (
    <>
      <PageHero eyebrow={t.menuPage.eyebrow} title={t.menuPage.title} intro={t.menuPage.intro} />
      <MenuBrowser />
      <Marquee small />
    </>
  );
}
