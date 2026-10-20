"use client";
/**
 * Gallery lightbox (framer-motion: fade, slide between photos, swipe/drag on touch).
 * Loaded on demand by GalleryGrid the first time a photo is opened.
 */
import Image from "next/image";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { GALLERY } from "@/data/gallery";
import { IMAGES } from "@/data/images";
import { fmt } from "@/i18n";
import { useLocale } from "@/components/providers/LocaleProvider";
import { ChevronIcon, CloseIcon } from "@/components/ui/Icons";

type Props = { index: number | null; dir: number; go: (step: number) => void; close: () => void };

export default function Lightbox({ index, dir, go, close }: Props) {
  const { locale, t } = useLocale();
  const closeBtn = useRef<HTMLButtonElement>(null);
  const total = GALLERY.length;
  const current = index !== null ? IMAGES[GALLERY[index]] : null;
  const isOpen = index !== null;

  useEffect(() => {
    if (isOpen) closeBtn.current?.focus();
  }, [isOpen]);

  return (
    <AnimatePresence>
      {index !== null && current && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={fmt(t.galleryPage.counter, { n: index + 1, total })}
          className="fixed inset-0 z-[95] flex flex-col bg-espresso/95 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="flex items-center justify-between p-4 md:p-6">
            <span className="text-sm tabular-nums text-muted" aria-live="polite">
              {fmt(t.galleryPage.counter, { n: index + 1, total })}
            </span>
            <button ref={closeBtn} type="button" onClick={close} aria-label={t.galleryPage.close} className="flex h-11 w-11 items-center justify-center rounded-full bg-cream text-espresso">
              <CloseIcon />
            </button>
          </div>

          <div className="relative flex-1 overflow-hidden" onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
            <AnimatePresence initial={false} mode="popLayout">
              <motion.div
                key={index}
                className="absolute inset-4 md:inset-x-24 md:inset-y-4"
                initial={{ opacity: 0, x: dir * 80 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir * -80 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.6}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -60) go(1);
                  else if (info.offset.x > 60) go(-1);
                }}
              >
                <Image src={current.src} alt={current.alt[locale]} fill sizes="100vw" className="pointer-events-none select-none object-contain" draggable={false} />
              </motion.div>
            </AnimatePresence>

            <button type="button" onClick={() => go(-1)} aria-label={t.galleryPage.prev} className="absolute left-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 rotate-180 items-center justify-center rounded-full border border-cream/30 bg-espresso/60 transition-colors hover:bg-cream hover:text-espresso md:flex">
              <ChevronIcon />
            </button>
            <button type="button" onClick={() => go(1)} aria-label={t.galleryPage.next} className="absolute right-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-cream/30 bg-espresso/60 transition-colors hover:bg-cream hover:text-espresso md:flex">
              <ChevronIcon />
            </button>
          </div>
          <p className="px-4 pb-24 pt-3 text-center text-sm text-parchment md:pb-6">{current.alt[locale]}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
