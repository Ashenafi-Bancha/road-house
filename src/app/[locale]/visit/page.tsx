import type { Metadata } from "next";
import { getDictionary, type Locale } from "@/i18n";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/pages/PageHero";
import { ContactCards } from "@/components/pages/ContactCards";
import { Visit } from "@/components/home/Visit";
import { Rating } from "@/components/home/Rating";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata(locale as Locale, "visit");
}

export default async function VisitPage({ params }: Props) {
  const { locale } = await params;
  const t = getDictionary(locale as Locale);
  return (
    <>
      <PageHero eyebrow={t.visitPage.eyebrow} title={t.visitPage.title}>
        <ContactCards />
      </PageHero>
      <Visit />
      <Rating />
    </>
  );
}
