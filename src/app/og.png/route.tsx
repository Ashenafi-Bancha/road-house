/**
 * Open Graph image (1200×630), rendered once at build time → /og.png
 * Typographic card in the brand palette, so it never depends on a placeholder photo.
 */
import { ImageResponse } from "next/og";
import { SITE } from "@/config/site";

export const dynamic = "force-static";

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "radial-gradient(ellipse at 80% 30%, #7a3018 0%, #3b2416 35%, #1a110b 75%)",
          color: "#f4eadb",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 26, letterSpacing: 6, color: "#e3a33b", textTransform: "uppercase" }}>
          Wolaita Sodo · Ethiopia
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 120, lineHeight: 1, fontWeight: 700 }}>{SITE.name.short}</div>
          <div style={{ fontSize: 64, lineHeight: 1.1, color: "#d9572b" }}>{SITE.name.sub}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", fontSize: 28, color: "#e6d5bc" }}>
          <div style={{ display: "flex" }}>Rated {SITE.rating.value} on Google · Open daily 7 AM – 9 PM</div>
          <div style={{ display: "flex" }}>{SITE.phone.display}</div>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 12, display: "flex" }}>
          {["#c8281e", "#111", "#e8b530", "#111", "#1f6b3a", "#111", "#e8b530", "#111"].map((c, i) => (
            <div key={i} style={{ flex: i % 2 ? 0.25 : 1, background: c }} />
          ))}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
