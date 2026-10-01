// Small runtime helpers shared by every page. Everything that touches
// `window` is a function so it is never evaluated during prerendering.

const BASE = import.meta.env.BASE_URL;

/** URL of a file in /public, respecting the deploy base path. */
export const asset = (p: string) => `${BASE}assets/${p}`;

/** Link to a page path such as "about/" (or "" for home). */
export const pageHref = (p: string) => `${BASE}${p}`;

/** srcset for an image exported at several widths as name-<w>.webp. */
export const srcSet = (name: string, widths: number[]) =>
  widths.map((w) => `${asset(`${name}-${w}.webp`)} ${w}w`).join(', ');

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Whether to attempt the WebGL scene at all. */
export function canRender3D(): boolean {
  if (typeof window === 'undefined' || prefersReducedMotion()) return false;
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  if (nav.connection?.saveData) return false;
  if (nav.deviceMemory !== undefined && nav.deviceMemory < 4) return false;
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}
