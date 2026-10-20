import type { Metadata } from "next";
import { getDictionary, type Locale } from "@/i18n";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/pages/PageHero";
import { AboutContent } from "@/components/pages/AboutContent";
import { Marquee } from "@/components/home/Marquee";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata(locale as Locale, "about");
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  const t = getDictionary(locale as Locale);
  return (
    <>
      <PageHero eyebrow={t.aboutPage.eyebrow} title={t.aboutPage.title} />
      <AboutContent />
      <Marquee />
    </>
  );
}
