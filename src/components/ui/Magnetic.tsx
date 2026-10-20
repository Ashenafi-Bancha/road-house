"use client";
/**
 * Magnetic wrapper: the child drifts toward the cursor while hovered.
 * No-op on touch devices and with reduced motion.
 */
import { useEffect, useRef } from "react";
import { loadGsap } from "@/lib/gsap";

export function Magnetic({ children, strength = 0.35, className = "" }: { children: React.ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // GSAP loads on the first hover, so pages without a pointer never download it for this.
    let xTo: ((v: number) => void) | null = null;
    let yTo: ((v: number) => void) | null = null;
    const enter = () => {
      loadGsap().then(({ gsap }) => {
        xTo ??= gsap.quickTo(el, "x", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
        yTo ??= gsap.quickTo(el, "y", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
      });
    };
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      xTo?.((e.clientX - (r.left + r.width / 2)) * strength);
      yTo?.((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const leave = () => { xTo?.(0); yTo?.(0); };
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [strength]);

  return <span ref={ref} className={`inline-block will-change-transform ${className}`}>{children}</span>;
}
