"use client";
/**
 * GALLERY — CSS-columns masonry + accessible lightbox
 * (Esc to close, ←/→ to navigate, swipe on touch, focus returns to the thumbnail).
 * The lightbox (and framer-motion) loads on demand — first hover/focus/tap of a photo.
 */
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { GALLERY } from "@/data/gallery";
import { IMAGES } from "@/data/images";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useLenis } from "@/components/providers/SmoothScroll";
import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";

const loadLightbox = () => import("./Lightbox");
const Lightbox = dynamic(loadLightbox, { ssr: false });

// Varying tile shapes give the masonry its rhythm
const ASPECTS = ["aspect-[4/5]", "aspect-square", "aspect-[3/4]", "aspect-[4/3]", "aspect-[2/3]", "aspect-[5/4]"];

export function GalleryGrid() {
  const { locale, t } = useLocale();
  const lenis = useLenis();
  const [index, setIndex] = useState<number | null>(null);
  const [dir, setDir] = useState(0);
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);
  const [used, setUsed] = useState(false);
  const lastIndex = useRef(0);
  const total = GALLERY.length;
  const isOpen = index !== null;

  const go = useCallback(
    (step: number) => {
      setDir(step);
      setIndex((i) => (i === null ? i : (i + step + total) % total));
    },
    [total]
  );

  const close = useCallback(() => setIndex(null), []);

  if (index !== null) lastIndex.current = index;

  useEffect(() => {
    if (!isOpen) return;
    lenis?.stop();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      lenis?.start();
      triggers.current[lastIndex.current]?.focus(); // return focus to the thumbnail
    };
  }, [isOpen, lenis, close, go]);

  return (
    <section className="container-x pb-28 pt-6">
      <ul className="columns-2 gap-3 md:columns-3 md:gap-5 xl:columns-4">
        {GALLERY.map((key, i) => (
          // Slide-only reveal: tiles are always painted (opacity 1), so the visible ones count for LCP.
          <Reveal as="li" key={key} variant="slide" margin="-5%" delay={(i % 4) * 0.06} className="mb-3 break-inside-avoid md:mb-5">
            <button
              ref={(el) => { triggers.current[i] = el; }}
              type="button"
              onClick={() => { setUsed(true); setDir(0); setIndex(i); }}
              onPointerEnter={loadLightbox}
              onFocus={loadLightbox}
              onTouchStart={loadLightbox}
              className="block w-full overflow-hidden rounded-2xl"
              aria-label={`${t.galleryPage.open}: ${IMAGES[key].alt[locale]}`}
            >
              <Photo
                name={key}
                sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
                className={`w-full ${ASPECTS[i % ASPECTS.length]}`}
                cursor="view"
              />
            </button>
          </Reveal>
        ))}
      </ul>

      {used && <Lightbox index={index} dir={dir} go={go} close={close} />}
    </section>
  );
}
