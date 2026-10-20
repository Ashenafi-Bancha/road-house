import type { Metadata } from "next";
import { getDictionary, type Locale } from "@/i18n";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/pages/PageHero";
import { GalleryGrid } from "@/components/pages/GalleryGrid";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata(locale as Locale, "gallery");
}

export default async function GalleryPage({ params }: Props) {
  const { locale } = await params;
  const t = getDictionary(locale as Locale);
  return (
    <>
      <PageHero eyebrow={t.galleryPage.eyebrow} title={t.galleryPage.title} intro={t.galleryPage.intro} />
      <GalleryGrid />
    </>
  );
}
