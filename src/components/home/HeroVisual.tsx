"use client";
/**
 * Decides what the hero shows behind the headline:
 *  - "full" / "lite": the 3D jebena (lazy-loaded after the page is idle)
 *  - "none": a static photo with CSS steam (low-end devices, slow/save-data connections,
 *    reduced motion, or no WebGL)
 */
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { get3DTier } from "@/lib/device";
import { Photo } from "@/components/ui/Photo";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), { ssr: false });

type Tier = "full" | "lite" | "none";

export function HeroVisual() {
  const wrap = useRef<HTMLDivElement>(null);
  const [tier, setTier] = useState<Tier | null>(null);
  const [load, setLoad] = useState(false);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(true);

  useEffect(() => {
    const tr = get3DTier();
    setTier(tr);
    if (tr === "none") return;
    // three.js is the heaviest download on the site, so it never competes with first paint:
    // it loads on the visitor's first interaction, or a few seconds after the page has loaded.
    let timer = 0;
    const events = ["pointermove", "pointerdown", "touchstart", "scroll", "keydown"] as const;
    const start = () => {
      window.clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, start));
      const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1));
      idle(() => setLoad(true));
    };
    events.forEach((e) => window.addEventListener(e, start, { once: true, passive: true }));
    // Phones ("lite") wait for a real interaction so low-end devices never pay for 3D up front;
    // desktops also start on their own a few seconds after load.
    const afterLoad = () => { if (tr === "full") timer = window.setTimeout(start, 3500); };
    if (document.readyState === "complete") afterLoad();
    else window.addEventListener("load", afterLoad, { once: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("load", afterLoad);
      events.forEach((e) => window.removeEventListener(e, start));
    };
  }, []);

  // Pause rendering when the hero scrolls out of view (saves battery/CPU)
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} className="absolute inset-0" aria-hidden>
      {tier && tier !== "none" && load && (
        <div className={`absolute inset-0 transition-opacity duration-[1500ms] ${ready ? "opacity-100" : "opacity-0"}`}>
          <HeroScene tier={tier} active={active} onReady={() => setReady(true)} />
        </div>
      )}

      {tier === "none" && (
        <div className="absolute right-0 top-0 h-[58%] w-full md:h-full md:w-[52%]">
          <Photo
            name="heroJebena"
            sizes="(min-width: 768px) 52vw, 100vw"
            priority
            sweep={false}
            className="h-full w-full [mask-image:linear-gradient(to_bottom,black_55%,transparent)] md:[mask-image:linear-gradient(to_left,black_45%,transparent)]"
            imgClassName="opacity-70"
          />
          <div className="css-steam absolute left-1/2 top-[18%]">
            <span /><span /><span />
          </div>
        </div>
      )}
    </div>
  );
}
