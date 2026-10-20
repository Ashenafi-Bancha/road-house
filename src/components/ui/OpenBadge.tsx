"use client";
/** Live "Open now / Closed" badge based on Ethiopian time (Africa/Addis_Ababa). */
import { useEffect, useState } from "react";
import { isOpenNow } from "@/lib/hours";
import { useLocale } from "@/components/providers/LocaleProvider";

export function OpenBadge({ className = "", detail = false }: { className?: string; detail?: boolean }) {
  const { t } = useLocale();
  // null until mounted → avoids a server/client mismatch (static HTML can't know the time).
  const [open, setOpen] = useState<boolean | null>(null);

  useEffect(() => {
    const update = () => setOpen(isOpenNow());
    update();
    const id = window.setInterval(update, 60_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-cream/15 bg-espresso/60 px-3 py-1.5 text-xs font-medium backdrop-blur-md transition-opacity duration-500 ${open === null ? "opacity-0" : "opacity-100"} ${className}`}
      role="status"
      aria-live="polite"
    >
      <span className="relative flex h-2 w-2" aria-hidden>
        {open && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />}
        <span className={`relative inline-flex h-2 w-2 rounded-full ${open ? "bg-emerald-400" : "bg-ember"}`} />
      </span>
      <span>{open ? t.status.open : t.status.closed}</span>
      {detail && open !== null && <span className="text-muted">· {open ? t.status.closesAt : t.status.opensAt}</span>}
    </span>
  );
}
