/**
 * Preloader (~1.8s, once per browser session).
 * Pure CSS: the wordmark outline is "filled with coffee" from the bottom up while
 * a thin stream pours from above and an ember pulses. Because it's CSS-only it
 * can never get stuck if JavaScript fails, and it costs nothing to hydrate.
 * The inline script in the layout adds `intro-seen` to <html> on repeat visits → hidden.
 */
import { SITE } from "@/config/site";

export function Preloader({ label }: { label: string }) {
  return (
    <div className="preloader fixed inset-0 z-[120] flex items-center justify-center bg-espresso" role="presentation" aria-label={label}>
      <style>{`
        .intro-seen .preloader{display:none}
        .pl-word{position:relative;display:inline-block}
        .pl-fill{position:absolute;inset:0;color:var(--color-ember);clip-path:inset(100% 0 0 0);animation:pl-fill 1.1s cubic-bezier(.65,0,.35,1) .25s forwards}
        .pl-outline{color:transparent;-webkit-text-stroke:1px rgba(244,234,219,.45)}
        .pl-stream{position:absolute;left:50%;top:-40vh;width:2px;height:40vh;background:linear-gradient(transparent,var(--color-gold));transform-origin:top;transform:scaleY(0);animation:pl-stream 1.2s cubic-bezier(.65,0,.35,1) .1s forwards}
        .pl-ember{animation:pl-pulse 1s ease-in-out infinite}
        @keyframes pl-fill{to{clip-path:inset(0 0 0 0)}}
        @keyframes pl-stream{0%{transform:scaleY(0)}55%{transform:scaleY(1)}100%{transform:scaleY(1);opacity:0}}
        @keyframes pl-pulse{50%{transform:scale(1.8);opacity:.4}}
      `}</style>
      <div className="relative text-center">
        <span className="pl-stream" aria-hidden />
        <span className="pl-word font-display text-big font-semibold">
          <span className="pl-outline">{SITE.name.short}</span>
          <span className="pl-fill" aria-hidden>{SITE.name.short}</span>
        </span>
        <div className="mt-5 flex items-center justify-center gap-3 text-xs uppercase tracking-[0.3em] text-muted">
          <span className="pl-ember inline-block h-1.5 w-1.5 rounded-full bg-ember" aria-hidden />
          <span lang="am">{SITE.name.am}</span>
        </div>
      </div>
    </div>
  );
}
