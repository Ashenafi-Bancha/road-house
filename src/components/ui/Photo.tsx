"use client";
import Image from "next/image";
import { IMAGES, type ImageKey } from "@/data/images";
import { useLocale } from "@/components/providers/LocaleProvider";

type Props = {
  name: ImageKey;
  sizes: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  /** Show the "Taste" cursor over food images */
  cursor?: "taste" | "view" | null;
  sweep?: boolean;
};

/**
 * Responsive photo that fills its (aspect-ratio-sized) parent.
 * Parent must define the size → zero layout shift.
 */
export function Photo({ name, sizes, className = "", imgClassName = "", priority, cursor = null, sweep = true }: Props) {
  const { locale } = useLocale();
  const img = IMAGES[name];
  return (
    <div className={`${sweep ? "img-sweep" : "relative overflow-hidden"} bg-coffee ${className}`} data-cursor={cursor ?? undefined}>
      <Image
        src={img.src}
        alt={img.alt[locale]}
        fill
        sizes={sizes}
        priority={priority}
        className={`object-cover ${imgClassName}`}
      />
    </div>
  );
}
