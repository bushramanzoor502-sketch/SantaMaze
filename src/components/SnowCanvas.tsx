import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../lib/env';

/**
 * Lightweight 2D snowfall, echoing the game's own snowfall effect. Pauses when
 * off-screen or when the tab is hidden; disabled entirely for reduced motion.
 */
export function SnowCanvas({ density = 1, className = '' }: { density?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || prefersReducedMotion()) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = true;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    type Flake = { x: number; y: number; r: number; vy: number; drift: number; phase: number; a: number };
    let flakes: Flake[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(160, (w * h) / 9000) * density);
      flakes = Array.from({ length: count }, () => spawn(true));
    };
    const spawn = (anywhere: boolean): Flake => {
      const r = Math.random() ** 2 * 2.6 + 0.6;
      return {
        x: Math.random() * w,
        y: anywhere ? Math.random() * h : -10,
        r,
        vy: 12 + r * 14,
        drift: 6 + Math.random() * 14,
        phase: Math.random() * Math.PI * 2,
        a: 0.35 + Math.random() * 0.55,
      };
    };

    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#fff';
      for (let i = 0; i < flakes.length; i++) {
        const f = flakes[i];
        f.y += f.vy * dt;
        f.phase += dt * 0.9;
        const x = f.x + Math.sin(f.phase) * f.drift;
        if (f.y > h + 8) flakes[i] = spawn(false);
        ctx.globalAlpha = f.a;
        ctx.beginPath();
        ctx.arc(x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (raf || !visible || document.hidden) return;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      visible ? start() : stop();
    });
    io.observe(canvas);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVis);
    start();
    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [density]);

  return <canvas ref={ref} className={`snow-canvas ${className}`} aria-hidden="true" />;
}
