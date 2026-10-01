import { useEffect, useRef, useState } from 'react';
import { asset, canRender3D } from '../lib/env';
import { Picture } from '../components/Picture';
import { Star } from '../components/Icons';
import type { HudState } from './scene';
import './MazeDiorama.css';

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

/**
 * The 3D hero island. Renders the game's isometric island art first, then —
 * on capable devices — lazy-loads three.js and swaps in the live diorama.
 * Reduced motion, Save-Data, low memory or no WebGL keep the static art.
 */
export function MazeDiorama() {
  const host = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);
  const [hud, setHud] = useState<HudState | null>(null);

  useEffect(() => {
    const el = host.current;
    if (!el || !canRender3D()) return;
    let disposed = false;
    let dispose: (() => void) | undefined;

    const begin = () =>
      import('./scene')
        .then(({ createScene }) =>
          createScene(el, {
            assetBase: asset(''),
            mobile: window.matchMedia('(max-width: 700px), (pointer: coarse)').matches,
            onHud: setHud,
            onReady: () => setLive(true),
          }),
        )
        .then((s) => {
          if (disposed) s.dispose();
          else dispose = s.dispose;
        })
        .catch((err) => {
          console.warn('3D scene unavailable, keeping static art.', err);
        });

    // Let the page paint first.
    const idle = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
    const handle = idle ? idle(begin, { timeout: 1200 }) : window.setTimeout(begin, 300);
    return () => {
      disposed = true;
      if (!idle) window.clearTimeout(handle);
      dispose?.();
    };
  }, []);

  const phaseText =
    hud?.phase === 'unlocked'
      ? 'Gate unlocked! Reach the door'
      : hud?.phase === 'complete'
        ? 'Level Complete'
        : null;

  return (
    <div className={`diorama ${live ? 'is-live' : ''}`}>
      <div className="diorama__fallback" aria-hidden={live}>
        <Picture
          name="brand/island-splash"
          widths={[640, 1070]}
          sizes="(max-width: 900px) 92vw, 50vw"
          alt="A clay-style maze island of snow-capped gingerbread walls, Christmas trees, candy canes and a glowing gift"
          priority
        />
      </div>
      <div ref={host} className="diorama__stage" />

      {live && hud && (
        <div className="diorama__hud" aria-hidden="true">
          <div className="hud-pill">
            <span className="hud-pill__label">Snowy Village</span>
            <span>
              Level {hud.level} · {hud.rows} × {hud.cols}
            </span>
          </div>
          <div className={`hud-pill hud-pill--gifts ${hud.collected === hud.total ? 'is-done' : ''}`}>
            <img src={asset('objects/gift-red.webp')} alt="" width="28" height="28" />
            {hud.collected}/{hud.total}
          </div>
          {phaseText && (
            <div className={`hud-toast ${hud.phase === 'complete' ? 'hud-toast--complete' : ''}`} key={hud.phase}>
              {hud.phase === 'complete' ? (
                <>
                  <strong>Level Complete</strong>
                  <span className="hud-stars">
                    {[1, 2, 3].map((n) => (
                      <Star key={n} filled={n <= hud.stars} />
                    ))}
                  </span>
                  <span className="hud-time">YOUR TIME {fmt(hud.seconds)}</span>
                </>
              ) : (
                phaseText
              )}
            </div>
          )}
        </div>
      )}
      {live && (
        <p className="diorama__caption">
          Autoplay preview · a real Snowy Village level, built by the game’s own maze generator
        </p>
      )}
    </div>
  );
}
