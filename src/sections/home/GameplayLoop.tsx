import { useEffect, useRef, useState } from 'react';
import { loop } from '../../data/game';
import { asset } from '../../lib/env';
import { Picture } from '../../components/Picture';
import { SpriteSanta } from '../../components/SpriteSanta';
import { Star } from '../../components/Icons';
import './GameplayLoop.css';

/**
 * Scroll story: a landscape phone stays in view while the four steps of a
 * level scroll past; the screen's HUD changes to match the active step.
 */
export function GameplayLoop() {
  const [active, setActive] = useState(0);
  const [gifts, setGifts] = useState(0);
  const stepsRef = useRef<HTMLOListElement>(null);
  const TOTAL = 12;

  useEffect(() => {
    const items = Array.from(stepsRef.current?.querySelectorAll<HTMLElement>('[data-step]') ?? []);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.step));
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // The gift counter fills while step 2 is on screen.
  useEffect(() => {
    if (active < 1) return setGifts(0);
    if (active > 1) return setGifts(TOTAL);
    setGifts(0);
    const id = window.setInterval(() => setGifts((g) => (g >= TOTAL ? g : g + 1)), 160);
    return () => window.clearInterval(id);
  }, [active]);

  return (
    <section className="loop section" aria-labelledby="loop-title">
      <div className="container-wide">
        <header className="loop__head">
          <p className="kicker reveal">How a level plays</p>
          <h2 id="loop-title" className="reveal">
            Find them all. Open the door.
          </h2>
        </header>

        <div className="loop__grid">
          <div className="loop__sticky">
            <div className={`phone phone--step-${active}`}>
              <div className="phone__screen">
                <Picture
                  name="maps/snowy-village"
                  widths={[960, 1672]}
                  sizes="(max-width: 900px) 92vw, 56vw"
                  alt="A Snowy Village maze seen from above, with gifts, lanterns and Christmas trees along the paths"
                  className="phone__map"
                />
                <div className="phone__hud" aria-hidden="true">
                  <span className="phone__pause" />
                  <span className={`phone__gifts ${gifts === TOTAL ? 'is-done' : ''}`}>
                    <img src={asset('objects/gift-red.webp')} alt="" width="24" height="24" />
                    {gifts}/{TOTAL}
                  </span>
                </div>

                <div className="phone__layer phone__layer--move" aria-hidden="true">
                  <span className="phone__stick">
                    <span />
                  </span>
                  <SpriteSanta anim="walk" facing="right" size="22%" className="phone__santa" playing={active === 0} />
                  <span className="phone__hint">Use the stick to move</span>
                </div>
                <div className="phone__layer phone__layer--gate" aria-hidden="true">
                  <span className="phone__toast">Gate unlocked! Reach the door</span>
                </div>
                <div className="phone__layer phone__layer--done" aria-hidden="true">
                  <div className="phone__results">
                    <strong>Level Complete</strong>
                    <span className="phone__stars">
                      <Star />
                      <Star />
                      <Star />
                    </span>
                    <span className="phone__time">YOUR TIME 0:48</span>
                  </div>
                </div>
              </div>
            </div>
            <ol className="loop__dots" aria-hidden="true">
              {loop.map((s, i) => (
                <li key={s.step} className={i === active ? 'is-active' : ''} />
              ))}
            </ol>
          </div>

          <ol className="loop__steps" ref={stepsRef}>
            {loop.map((s, i) => (
              <li key={s.step} data-step={i} className={`loop__step ${i === active ? 'is-active' : ''}`}>
                <span className="loop__num">{s.step}</span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
                <span className="loop__quote">“{s.hint}”</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
