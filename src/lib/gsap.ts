"use client";
/**
 * GSAP is loaded on demand (never in the initial bundle) so it can't delay first paint.
 * `loadGsap()` resolves once per page life; `useGsap()` runs a scoped effect after it loads.
 */
import { useEffect, useRef } from "react";
import type { ScrollTrigger as ScrollTriggerType } from "gsap/ScrollTrigger";

type Gsap = typeof import("gsap").gsap;
export type GsapModules = { gsap: Gsap; ScrollTrigger: typeof ScrollTriggerType };

let promise: Promise<GsapModules> | null = null;

export function loadGsap(): Promise<GsapModules> {
  promise ??= Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([g, st]) => {
    g.gsap.registerPlugin(st.ScrollTrigger);
    return { gsap: g.gsap, ScrollTrigger: st.ScrollTrigger };
  });
  return promise;
}

/**
 * Resolves after the page has loaded and the main thread is idle, or on the first
 * interaction, whichever comes first — then loads GSAP.
 */
let idlePromise: Promise<GsapModules> | null = null;
export function loadGsapWhenIdle(): Promise<GsapModules> {
  idlePromise ??= new Promise<void>((resolve) => {
    const events = ["pointerdown", "touchstart", "wheel", "scroll", "keydown"] as const;
    let done = false;
    const go = () => {
      if (done) return;
      done = true;
      events.forEach((e) => window.removeEventListener(e, go));
      resolve();
    };
    events.forEach((e) => window.addEventListener(e, go, { once: true, passive: true }));
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
    const afterLoad = () => idle(go, { timeout: 2000 });
    if (document.readyState === "complete") afterLoad();
    else window.addEventListener("load", afterLoad, { once: true });
  }).then(loadGsap);
  return idlePromise;
}

let refreshTimer = 0;
/** Several components create triggers after the async load → re-measure once afterwards. */
function scheduleRefresh(ScrollTrigger: GsapModules["ScrollTrigger"]) {
  window.clearTimeout(refreshTimer);
  refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 100);
}

/**
 * Like @gsap/react's useGSAP: runs `setup` inside a gsap.context scoped to `scope`
 * (selector text resolves within it) and reverts everything on unmount.
 */
export function useGsap(
  setup: (m: GsapModules) => void | (() => void),
  scope: React.RefObject<HTMLElement | null>,
) {
  const setupRef = useRef(setup);
  setupRef.current = setup;

  useEffect(() => {
    let cancelled = false;
    let ctx: gsap.Context | undefined;
    loadGsapWhenIdle().then((m) => {
      if (cancelled || !scope.current) return;
      ctx = m.gsap.context(() => setupRef.current(m), scope.current);
      scheduleRefresh(m.ScrollTrigger);
    });
    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [scope]);
}
