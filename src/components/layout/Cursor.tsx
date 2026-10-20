"use client";
/**
 * Custom cursor: small ember dot + trailing ring.
 * - Grows over links/buttons.
 * - Shows a label ("Taste" / "View") over elements with data-cursor="taste|view".
 * Only enabled for fine pointers with hover (never on touch) and without reduced motion.
 */
import { useEffect, useRef, useState } from "react";
import { loadGsapWhenIdle } from "@/lib/gsap";
import { useLocale } from "@/components/providers/LocaleProvider";

export function Cursor() {
  const { t } = useLocale();
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<"" | "taste" | "view">("");
  const [hovering, setHovering] = useState(false);
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ok =
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(ok);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    let cleanup = () => {};
    let cancelled = false;
    loadGsapWhenIdle().then(({ gsap }) => {
    if (cancelled || !dot.current || !ring.current) return;
    document.documentElement.classList.add("has-cursor");
    const dx = gsap.quickTo(dot.current, "x", { duration: 0.12, ease: "power3" });
    const dy = gsap.quickTo(dot.current, "y", { duration: 0.12, ease: "power3" });
    const rx = gsap.quickTo(ring.current, "x", { duration: 0.5, ease: "power3" });
    const ry = gsap.quickTo(ring.current, "y", { duration: 0.5, ease: "power3" });

    const move = (e: PointerEvent) => {
      dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const el = e.target as Element | null;
      const c = el?.closest?.("[data-cursor]")?.getAttribute("data-cursor");
      setLabel(c === "taste" || c === "view" ? c : "");
      setHovering(!!el?.closest?.("a, button, [role='tab'], input, label"));
    };
    const leaveWindow = () => gsap.to([dot.current, ring.current], { opacity: 0, duration: 0.2 });
    const enterWindow = () => gsap.to([dot.current, ring.current], { opacity: 1, duration: 0.2 });

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    document.addEventListener("pointerleave", leaveWindow);
    document.addEventListener("pointerenter", enterWindow);
    cleanup = () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.removeEventListener("pointerleave", leaveWindow);
      document.removeEventListener("pointerenter", enterWindow);
    };
    });
    return () => { cancelled = true; cleanup(); };
  }, [enabled]);

  if (!enabled) return null;

  const text = label === "taste" ? t.cursor.taste : label === "view" ? t.cursor.view : "";
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100]">
      <div ref={ring} className="absolute left-0 top-0">
        <div
          className={`-translate-x-1/2 -translate-y-1/2 rounded-full border transition-[width,height,background-color,border-color] duration-500 ease-out-expo flex items-center justify-center
            ${text ? "h-24 w-24 border-transparent bg-ember/90 backdrop-blur-sm" : hovering ? "h-14 w-14 border-cream/70 bg-cream/5" : "h-9 w-9 border-cream/40"}`}
        >
          <span className={`text-[11px] font-semibold uppercase tracking-[0.18em] text-cream transition-opacity duration-300 ${text ? "opacity-100" : "opacity-0"}`}>
            {text}
          </span>
        </div>
      </div>
      <div ref={dot} className="absolute left-0 top-0">
        <div className={`h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember transition-opacity ${text ? "opacity-0" : "opacity-100"}`} />
      </div>
    </div>
  );
}
