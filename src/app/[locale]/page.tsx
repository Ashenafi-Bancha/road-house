import type { Metadata } from "next";
import type { Locale } from "@/i18n";
import { buildMetadata } from "@/lib/seo";
import { Hero } from "@/components/home/Hero";
import { Marquee } from "@/components/home/Marquee";
import { TwoGates } from "@/components/home/TwoGates";
import { SignatureDishes } from "@/components/home/SignatureDishes";
import { CoffeeCeremony } from "@/components/home/CoffeeCeremony";
import { Rating } from "@/components/home/Rating";
import { Visit } from "@/components/home/Visit";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata(locale as Locale, "home");
}

/** HOME — every signature section, in story order. */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <TwoGates />
      <SignatureDishes />
      <Marquee small reverse />
      <CoffeeCeremony />
      <Rating />
      <Visit />
    </>
  );
}
