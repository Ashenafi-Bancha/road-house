"use client";
/**
 * Subtle sizzling smoke (2D canvas) for the Shekla Tibs card.
 * Soft warm puffs rise and dissolve. Runs only while on screen, never with reduced motion.
 */
import { useEffect, useRef } from "react";

type Puff = { x: number; y: number; r: number; vx: number; vy: number; life: number; max: number };

export function SmokeCanvas({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let running = false;
    const puffs: Puff[] = [];
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const resize = () => {
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const spawn = () => {
      const w = canvas.width, h = canvas.height;
      puffs.push({
        x: w * (0.3 + Math.random() * 0.4),
        y: h * (0.75 + Math.random() * 0.15),
        r: w * (0.04 + Math.random() * 0.05),
        vx: (Math.random() - 0.5) * 0.25 * dpr,
        vy: -(0.35 + Math.random() * 0.5) * dpr,
        life: 0,
        max: 160 + Math.random() * 120,
      });
    };

    const frame = () => {
      if (!running) return;
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "screen";
      if (puffs.length < 28 && Math.random() < 0.35) spawn();
      for (let i = puffs.length - 1; i >= 0; i--) {
        const p = puffs[i];
        p.life++;
        p.x += p.vx + Math.sin((p.life + i * 20) / 30) * 0.3;
        p.y += p.vy;
        p.r += 0.35 * dpr;
        const k = p.life / p.max;
        const alpha = Math.sin(Math.PI * k) * 0.16;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        g.addColorStop(0, `rgba(250,232,212,${alpha})`);
        g.addColorStop(1, "rgba(250,232,212,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        if (p.life >= p.max) puffs.splice(i, 1);
      }
      raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !running) { running = true; raf = requestAnimationFrame(frame); }
      else if (!e.isIntersecting) { running = false; cancelAnimationFrame(raf); }
    });
    io.observe(canvas);

    return () => { running = false; cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); };
  }, []);

  return <canvas ref={ref} className={`pointer-events-none ${className}`} aria-hidden />;
}
