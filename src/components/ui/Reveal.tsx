"use client";
/**
 * Scroll reveal without an animation library: CSS does the motion (globals.css → [data-reveal]),
 * one shared IntersectionObserver sets `data-in` once the element enters the viewport.
 *  - "fade": fades + rises 40px
 *  - "slide": rises only (stays painted, so visible tiles still count for LCP)
 */
import { createElement, useEffect, useRef } from "react";

const margins = new Map<string, IntersectionObserver>();

function observer(margin: string) {
  let o = margins.get(margin);
  if (!o) {
    o = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          (e.target as HTMLElement).dataset.in = "";
          o!.unobserve(e.target);
        }
      },
      { rootMargin: `0px 0px ${margin} 0px` }
    );
    margins.set(margin, o);
  }
  return o;
}

type Props = {
  as?: "div" | "li";
  variant?: "fade" | "slide";
  /** Seconds */
  delay?: number;
  /** Bottom root margin, e.g. "-10%" = reveal once 10% inside the viewport */
  margin?: string;
  className?: string;
  children: React.ReactNode;
};

export function Reveal({ as = "div", variant = "fade", delay = 0, margin = "-10%", className, children }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const o = observer(margin);
    o.observe(el);
    return () => o.unobserve(el);
  }, [margin]);

  return createElement(
    as,
    {
      ref,
      "data-reveal": variant,
      className,
      style: delay ? ({ "--reveal-delay": `${delay}s` } as React.CSSProperties) : undefined,
    },
    children
  );
}
