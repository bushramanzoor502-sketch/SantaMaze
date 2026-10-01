import { prefersReducedMotion } from './env';

/** Fades/slides `.reveal` elements in as they enter the viewport. */
export function initReveals(root: ParentNode = document) {
  const els = Array.from(root.querySelectorAll<HTMLElement>('.reveal:not(.is-in)'));
  if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  );
  els.forEach((el) => io.observe(el));
}

/**
 * Camera-like parallax: elements with data-parallax="<factor>" drift against
 * the scroll. One rAF loop, transforms only, capped travel.
 */
export function initParallax() {
  if (prefersReducedMotion()) return;
  const els = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'));
  if (!els.length) return;
  let raf = 0;
  const update = () => {
    raf = 0;
    const vh = window.innerHeight;
    for (const el of els) {
      const rect = (el.parentElement ?? el).getBoundingClientRect();
      if (rect.bottom < -200 || rect.top > vh + 200) continue;
      const factor = parseFloat(el.dataset.parallax || '0.2');
      const center = rect.top + rect.height / 2 - vh / 2;
      const y = Math.max(-80, Math.min(80, -center * factor));
      el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
    }
  };
  const onScroll = () => {
    if (!raf) raf = requestAnimationFrame(update);
  };
  update();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
}
