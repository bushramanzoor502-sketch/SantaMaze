import { useState } from 'react';
import { characters, animations } from '../../data/characters';
import { asset } from '../../lib/env';
import { SpriteSanta, type Facing } from '../../components/SpriteSanta';
import { Chevron } from '../../components/Icons';
import './Characters.css';

const FACINGS: Facing[] = ['down', 'right', 'up', 'left'];

/** After the game's "Change Character" carousel: loops around, SELECT to pick. */
export function Characters() {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(0);
  const [hover, setHover] = useState(false);
  const [facing, setFacing] = useState(0);
  const c = characters[index];

  const go = (d: number) => {
    setIndex((i) => (i + d + characters.length) % characters.length);
    setFacing(0);
  };

  return (
    <section
      className="chars"
      aria-labelledby="chars-title"
      style={{ '--glow': c.glow, '--coat': c.color, '--bg': `url(${asset('scenes/fireside-1672.webp')})` } as React.CSSProperties}
    >
      <div className="chars__bg" aria-hidden="true" />
      <div className="container-wide chars__inner">
        <header className="chars__head">
          <p className="kicker reveal">Change character</p>
          <h2 id="chars-title" className="reveal">
            Pick your coat.
          </h2>
          <p className="lead reveal">
            Four Santas, all unlocked from the start. They play exactly the same — choosing one is choosing the coat
            you want to see racing through the snow.
          </p>
        </header>

        <div className="chars__stage" aria-roledescription="carousel" aria-label="Characters">
          <button type="button" className="chars__arrow chars__arrow--prev" onClick={() => go(-1)} aria-label="Previous Santa">
            <Chevron dir="left" />
          </button>

          <div
            className="chars__hero"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={() => setFacing((f) => (f + 1) % 4)}
            aria-hidden="true"
          >
            <div className="chars__rug" aria-hidden="true" />
            <div className="chars__sprite" key={c.id}>
              <SpriteSanta
                coat={c.folder}
                anim={hover ? 'walk' : 'idle'}
                facing={FACINGS[facing]}
                size="100%"
                label={`${c.name} in a ${c.coat.toLowerCase()} coat`}
              />
            </div>
          </div>

          <button type="button" className="chars__arrow chars__arrow--next" onClick={() => go(1)} aria-label="Next Santa">
            <Chevron />
          </button>

          <div className="chars__card" aria-live="polite">
            <p className="chars__count">
              {index + 1} / {characters.length}
            </p>
            <h3>{c.name}</h3>
            <p>{c.blurb}</p>
            <div className="chars__tools">
              <button type="button" className="chars__tool" onClick={() => setFacing((f) => (f + 1) % 4)}>
                Turn around
              </button>
              <button type="button" className="chars__tool" aria-pressed={hover} onClick={() => setHover((h) => !h)}>
                {hover ? 'Stand still' : 'Walk'}
              </button>
            </div>
            <button
              type="button"
              className={`btn ${selected === index ? 'btn--ghost' : ''}`}
              onClick={() => setSelected(index)}
              aria-pressed={selected === index}
            >
              {selected === index ? 'Selected' : 'SELECT'}
            </button>
          </div>
        </div>

        <ul className="chars__thumbs" aria-label="All Santas">
          {characters.map((x, i) => (
            <li key={x.id}>
              <button
                type="button"
                className={`chars__thumb ${i === index ? 'is-active' : ''}`}
                onClick={() => {
                  setIndex(i);
                  setFacing(0);
                }}
                aria-label={x.name}
                aria-current={i === index}
                style={{ '--coat': x.color } as React.CSSProperties}
              >
                <img src={asset(`characters/${x.folder}/still.webp`)} alt="" width="256" height="256" loading="lazy" />
                {selected === i && <span className="chars__check" aria-hidden="true">✓</span>}
              </button>
            </li>
          ))}
        </ul>

        <p className="chars__anims">
          Every Santa is fully animated in four directions: {animations.join(' · ')}.
        </p>
      </div>
    </section>
  );
}
