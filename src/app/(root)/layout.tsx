import type { Metadata } from "next";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: SITE.name.en,
  robots: { index: false, follow: true },
  alternates: { canonical: "/en/" },
};

/** Minimal root layout for "/" which only redirects to /en/ or /am/. */
export default function RootRedirectLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ background: "#1a110b", color: "#f4eadb", fontFamily: "system-ui, sans-serif" }}>{children}</body>
    </html>
  );
}
