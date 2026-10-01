import { useRef, useState, type KeyboardEvent } from 'react';
import { worlds } from '../../data/worlds';
import { asset } from '../../lib/env';
import { Picture } from '../../components/Picture';
import './Worlds.css';

/**
 * World select, after the game's "Select Map" screen: four snow globes on a
 * shelf. Choosing one swaps the full-bleed world art behind it.
 */
export function Worlds() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const w = worlds[active];

  const onKey = (e: KeyboardEvent) => {
    const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = (active + dir + worlds.length) % worlds.length;
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <section id="worlds" className="worlds" aria-labelledby="worlds-title" style={{ '--accent': w.accent } as React.CSSProperties}>
      <div className="worlds__backdrops" aria-hidden="true">
        {worlds.map((x, i) => (
          <div key={x.id} className={`worlds__backdrop ${i === active ? 'is-active' : ''}`}>
            <Picture name={`worlds/${x.id}`} widths={[640, 960, 1672]} sizes="100vw" alt="" />
          </div>
        ))}
      </div>
      <div className="worlds__shade" aria-hidden="true" />

      <div className="container-wide worlds__inner">
        <header className="worlds__head">
          <p className="kicker reveal">Select map</p>
          <h2 id="worlds-title" className="reveal">
            Four worlds. Four ways to get lost.
          </h2>
          <p className="lead reveal">
            Every world is open from the start, each with its own soundtrack, its own scenery and its own idea of how
            hard a maze should get.
          </p>
        </header>

        <div
          className="worlds__panel"
          role="tabpanel"
          id="world-panel"
          aria-labelledby={`world-tab-${w.id}`}
          key={w.id}
        >
          <p className="worlds__index">World {w.index}</p>
          <h3 className="worlds__name">{w.name}</h3>
          <p className="worlds__subtitle">“{w.subtitle}”</p>
          <p className="worlds__desc">{w.description}</p>
          <dl className="worlds__stats">
            <div>
              <dt>Difficulty</dt>
              <dd>
                <span className="worlds__meter" aria-hidden="true">
                  {[1, 2, 3, 4].map((n) => (
                    <i key={n} className={n <= w.difficulty ? 'on' : ''} />
                  ))}
                </span>
                {w.difficultyLabel}
              </dd>
            </div>
            <div>
              <dt>Level 1 maze</dt>
              <dd>
                {w.startSize[0]} × {w.startSize[1]}
              </dd>
            </div>
            <div>
              <dt>Grows to</dt>
              <dd>
                {w.maxSize[0]} × {w.maxSize[1]}
              </dd>
            </div>
          </dl>
        </div>

        <div className="worlds__shelf">
          <div className="worlds__globes" role="tablist" aria-label="Worlds" onKeyDown={onKey}>
            {worlds.map((x, i) => (
              <button
                key={x.id}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                id={`world-tab-${x.id}`}
                role="tab"
                type="button"
                aria-selected={i === active}
                aria-controls="world-panel"
                tabIndex={i === active ? 0 : -1}
                className={`globe ${i === active ? 'is-active' : ''}`}
                onClick={() => setActive(i)}
              >
                <img src={asset(`globes/${x.id}.webp`)} alt="" width="420" height="505" loading="lazy" />
                <span className="globe__plate">{x.name}</span>
              </button>
            ))}
          </div>
          <div className="worlds__plank" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
