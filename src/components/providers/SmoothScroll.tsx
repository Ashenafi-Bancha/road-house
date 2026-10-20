"use client";
/**
 * Lenis smooth scrolling, synced with GSAP ScrollTrigger.
 * Disabled entirely when the visitor prefers reduced motion.
 * Touch devices keep native scrolling (Lenis default) for best feel and battery.
 * Lenis and GSAP are loaded after the page is idle (or on first interaction), never up front.
 */
import type Lenis from "lenis";
import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { loadGsapWhenIdle } from "@/lib/gsap";

const LenisContext = createContext<Lenis | null>(null);
export const useLenis = () => useContext(LenisContext);

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cleanup = () => {};
    let cancelled = false;
    Promise.all([import("lenis"), loadGsapWhenIdle()]).then(([{ default: LenisCtor }, { gsap, ScrollTrigger }]) => {
      if (cancelled) return;
      const instance = new LenisCtor({ lerp: 0.1, anchors: { offset: -80 }, autoRaf: false });
      instance.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => instance.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      setLenis(instance);
      cleanup = () => {
        gsap.ticker.remove(tick);
        instance.destroy();
        setLenis(null);
      };
    });
    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  // New page → jump to top (or to the #hash target) and re-measure scroll triggers.
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) {
      lenis ? lenis.scrollTo(0, { immediate: true }) : window.scrollTo(0, 0);
    }
    // (On the first page this waits for GSAP's idle-time load like everything else.)
    let cancelled = false;
    const id = window.setTimeout(() => {
      loadGsapWhenIdle().then(({ ScrollTrigger }) => { if (!cancelled) ScrollTrigger.refresh(); });
    }, 350);
    return () => { cancelled = true; window.clearTimeout(id); };
  }, [pathname, lenis]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
