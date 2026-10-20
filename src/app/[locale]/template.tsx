"use client";
/**
 * Page transition: a coffee-coloured curtain sweeps up off the new page while
 * the content fades in. Templates re-mount on every client-side navigation.
 *
 * The very first load skips the transition (the preloader covers it), so the
 * static HTML is fully visible for fast LCP and for visitors without JS.
 * Opacity only (no transforms) so GSAP pinning inside pages keeps working.
 * Pure CSS (globals.css → .page-curtain / .page-enter); reduced motion disables it there.
 */
import { useEffect } from "react";

let firstLoad = true;

export default function Template({ children }: { children: React.ReactNode }) {
  const animateIn = !firstLoad;

  useEffect(() => {
    firstLoad = false;
  }, []);

  return (
    <>
      {animateIn && <div aria-hidden className="page-curtain pointer-events-none fixed inset-0 z-[110] bg-coffee" />}
      <div className={animateIn ? "page-enter" : undefined}>{children}</div>
    </>
  );
}
