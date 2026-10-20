import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Fraunces, Inter_Tight } from "next/font/google";
import localFont from "next/font/local";
import "../globals.css";
import { SITE } from "@/config/site";
import { getDictionary, isLocale, LOCALES } from "@/i18n";
import { restaurantJsonLd } from "@/lib/seo";
import { LocaleProvider } from "@/components/providers/LocaleProvider";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBar } from "@/components/layout/MobileBar";
import { Cursor } from "@/components/layout/Cursor";
import { Preloader } from "@/components/layout/Preloader";

/* Fonts are self-hosted at build time by next/font → no layout shift, no external requests. */
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap", axes: ["opsz"] });
const inter = Inter_Tight({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
// Amharic: Noto Ethiopic, subset to the characters the site actually uses (scripts/subset-fonts.mjs)
const ethSerif = localFont({ src: "../../fonts/noto-serif-ethiopic-subset.woff2", variable: "--font-ethiopic-serif", weight: "500 700", display: "swap", preload: true });
const ethSans = localFont({ src: "../../fonts/noto-sans-ethiopic-subset.woff2", variable: "--font-ethiopic-sans", weight: "400 600", display: "swap", preload: true });

export const dynamicParams = false;
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: "#1a110b",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  applicationName: SITE.name.en,
  formatDetection: { telephone: true },
  icons: { icon: "/favicon.svg" },
};

// Runs before paint: flags JS (for reveal states) and skips the preloader on repeat visits.
const bootScript = `(function(){var d=document.documentElement;d.classList.add('js');try{if(sessionStorage.getItem('rh-intro'))d.classList.add('intro-seen');else{sessionStorage.setItem('rh-intro','1');setTimeout(function(){d.classList.add('intro-seen')},3400)}}catch(e){}})();`;

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <html
      lang={locale}
      className={`${fraunces.variable} ${inter.variable} ${ethSerif.variable} ${ethSans.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantJsonLd(locale)) }}
        />
      </head>
      <body>
        <LocaleProvider locale={locale} dict={dict}>
          <a href="#main" className="sr-only z-[200] rounded-full bg-cream px-4 py-2 text-espresso focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
            {dict.nav.skip}
          </a>
          <Preloader label={dict.preloader.label} />
          <SmoothScroll>
            <Header />
            <main id="main">{children}</main>
            <Footer />
            <MobileBar />
          </SmoothScroll>
          <Cursor />
          <div className="grain" aria-hidden />
          <div className="vignette" aria-hidden />
        </LocaleProvider>
      </body>
    </html>
  );
}
