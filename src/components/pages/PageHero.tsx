/**
 * Shared editorial header for inner pages: eyebrow, big title (line reveal), intro.
 * Uses the same CSS-only reveal classes as the home hero → text paints without waiting for JS.
 */
const v = (i: number) => ({ ["--i" as string]: i }) as React.CSSProperties;

export function PageHero({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro?: string; children?: React.ReactNode }) {
  return (
    <header className="relative overflow-hidden pb-14 pt-36 md:pb-20 md:pt-48">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_85%_0%,rgba(217,87,43,0.18),transparent_70%)]" />
      <div className="container-x relative">
        <p className="eyebrow hero-fade" style={v(0)}>{eyebrow}</p>
        <h1 className="mt-5 font-display text-huge">
          <span className="reveal-line block overflow-hidden pb-[0.08em]" style={v(0)}>
            <span className="block">{title}</span>
          </span>
        </h1>
        {intro && (
          <p className="hero-fade mt-6 max-w-2xl text-parchment/80 md:text-lg" style={v(1)}>
            {intro}
          </p>
        )}
        {children && <div className="hero-fade" style={v(2)}>{children}</div>}
      </div>
      <div className="textile textile-thin absolute inset-x-0 bottom-0 opacity-60" aria-hidden />
    </header>
  );
}
