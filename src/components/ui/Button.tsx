import Link from "next/link";
import { Magnetic } from "./Magnetic";

type Variant = "primary" | "ghost" | "light";

const styles: Record<Variant, string> = {
  primary: "bg-terracotta text-cream hover:bg-[#9a3a22]",
  ghost: "border border-cream/30 text-cream hover:border-cream hover:bg-cream/5",
  light: "bg-cream text-espresso hover:bg-parchment",
};

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  external?: boolean;
  icon?: React.ReactNode;
  className?: string;
  ariaLabel?: string;
};

/** Pill button with magnetic hover. Uses next/link for internal routes. */
export function Button({ href, children, variant = "primary", external, icon, className = "", ariaLabel }: Props) {
  const cls = `group relative inline-flex min-h-12 items-center gap-3 overflow-hidden rounded-full px-6 py-3 text-sm font-semibold tracking-wide transition-colors duration-300 ${styles[variant]} ${className}`;
  const inner = (
    <>
      <span className="relative">{children}</span>
      {icon && <span className="relative transition-transform duration-500 ease-out-expo group-hover:translate-x-1">{icon}</span>}
    </>
  );
  const isExternal = external || /^(https?:|tel:|mailto:)/.test(href);
  return (
    <Magnetic>
      {isExternal ? (
        <a href={href} className={cls} aria-label={ariaLabel} {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          {inner}
        </a>
      ) : (
        <Link href={href} className={cls} aria-label={ariaLabel}>
          {inner}
        </Link>
      )}
    </Magnetic>
  );
}
