/**
 * Capability checks used to decide whether to run heavy effects (3D, smoke, pinning).
 * Only call on the client.
 */
type NavigatorExtras = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean; effectiveType?: string };
};

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function isTouchDevice() {
  return window.matchMedia("(hover: none), (pointer: coarse)").matches;
}

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/** Returns "full", "lite" (simplified 3D for phones) or "none" (static fallback). */
export function get3DTier(): "full" | "lite" | "none" {
  const nav = navigator as NavigatorExtras;
  if (prefersReducedMotion() || !hasWebGL()) return "none";
  const conn = nav.connection;
  // Data saver or 2G → static image. (3D only loads after the page is idle, so 3G gets "lite".)
  if (conn?.saveData || /2g/.test(conn?.effectiveType ?? "")) return "none";
  if ((nav.deviceMemory ?? 8) < 3 || (nav.hardwareConcurrency ?? 8) < 4) return "none";
  if (conn?.effectiveType === "3g") return "lite";
  return isTouchDevice() || window.innerWidth < 768 ? "lite" : "full";
}
