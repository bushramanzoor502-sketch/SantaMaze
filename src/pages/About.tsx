import { Layout } from '../components/Layout';
import { PageHero } from '../components/PageHero';
import { Picture } from '../components/Picture';
import { Star } from '../components/Icons';
import { StoreButton } from '../components/StoreButton';
import { controls, settings, stars } from '../data/game';
import { worlds, CURVE_LENGTH } from '../data/worlds';
import { characters, animations } from '../data/characters';
import { site } from '../data/site';
import { asset, pageHref } from '../lib/env';
import './About.css';

const pct = (v: number) => `${Math.round(v * 100)}%`;

export default function About() {
  return (
    <Layout page="about">
      <PageHero
        kicker="About the game"
        title={
          <>
            A cozy maze game with a <span className="gold">Christmas heart</span>
          </>
        }
        lead={`${site.name} is a landscape maze game for Android about one simple, satisfying job: find every gift, then find the way out.`}
        bg={asset('worlds/snowy-village-1672.webp')}
        art={
          <img
            src={asset('brand/santa-walk-834.webp')}
            alt="Santa walking with a green sack full of presents"
            width="834"
            height="886"
            className="about-hero__santa"
          />
        }
      />

      {/* Concept */}
      <section className="section about-concept" aria-labelledby="concept-title">
        <div className="container about-split">
          <div>
            <p className="kicker reveal">The concept</p>
            <h2 id="concept-title" className="reveal">
              Calm, not cruel.
            </h2>
            <p className="lead reveal">
              There are no enemies to dodge, no lives to lose and no game over screen. The maze itself is the
              challenge — and the only clock you are racing is your own.
            </p>
            <p className="reveal">
              Each level drops Santa on the edge of a freshly built maze. Gifts are spread through its corridors and the
              exit is a locked door that stays sealed until the very last one has been collected. Pick up the final
              gift and the gate opens; reach it and Santa glides inside as the doors swing shut behind him.
            </p>
            <p className="reveal">
              Your time decides your stars. Every level has a par time worked out from the size of its maze, so a
              bigger maze earns you more time — but finishing quickly still takes a clean route and a steady thumb.
            </p>
          </div>
          <figure className="about-shot reveal">
            <img
              src={asset('scenes/gameplay-hud.webp')}
              alt="In-game screen: Santa in a snowy hedge maze with the level counter, pause button, gift counter 0/15 and the hint “Drag to move Santa”"
              width="749"
              height="310"
              loading="lazy"
            />
            <figcaption>In-game art from the project: a level in progress, with the gift counter at the top right.</figcaption>
          </figure>
        </div>
      </section>

      {/* How to play */}
      <section className="section about-play" aria-labelledby="play-title">
        <div className="container">
          <p className="kicker reveal">How to play</p>
          <h2 id="play-title" className="reveal">
            Three ways to steer
          </h2>
          <div className="about-controls">
            {controls.map((c, i) => (
              <article key={c.name} className="control-card reveal" style={{ '--delay': `${i * 90}ms` } as React.CSSProperties}>
                <span className={`control-card__icon control-card__icon--${c.name.toLowerCase()}`} aria-hidden="true" />
                <h3>{c.name}</h3>
                <p>{c.detail}</p>
              </article>
            ))}
          </div>

          <div className="about-rules">
            <div className="reveal">
              <h3>Move with feel</h3>
              <p>
                Push the stick a little and Santa walks; push it further and he runs, then sprints. Speed comes at a
                price: clip a wall too fast and he stumbles, hit one flat out and he takes a tumble in a burst of snow —
                felt through haptic feedback if you have it switched on.
              </p>
            </div>
            <div className="reveal">
              <h3>Earn your stars</h3>
              <table className="stars-table">
                <caption className="sr-only">Stars awarded by finishing time</caption>
                <tbody>
                  {stars.map((s) => (
                    <tr key={s.stars}>
                      <th scope="row">
                        <span className="stars-table__stars" aria-label={`${s.stars} star${s.stars > 1 ? 's' : ''}`}>
                          {[1, 2, 3].map((n) => (
                            <Star key={n} filled={n <= s.stars} />
                          ))}
                        </span>
                      </th>
                      <td>{s.rule}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="reveal">
              <h3>Make it yours</h3>
              <ul className="ticks">
                {settings.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Worlds */}
      <section className="section about-worlds" aria-labelledby="aw-title">
        <div className="container">
          <p className="kicker reveal">The worlds</p>
          <h2 id="aw-title" className="reveal">
            Four worlds, four difficulty curves
          </h2>
          <p className="lead reveal">
            All four worlds are open from the start and every one has its own music. Each has an endless ladder of
            levels: the maze grows as you climb, and fewer dead ends are opened up into loops, until the world reaches
            its hardest settings at level {CURVE_LENGTH}.
          </p>
        </div>
        <div className="container-wide about-world-list">
          {worlds.map((w, i) => (
            <article key={w.id} className={`about-world reveal ${i % 2 ? 'is-flip' : ''}`} style={{ '--accent': w.accent } as React.CSSProperties}>
              <div className="about-world__art">
                <Picture name={`worlds/${w.id}`} widths={[640, 960]} sizes="(max-width: 900px) 100vw, 50vw" alt={`${w.name} loading-screen artwork`} />
              </div>
              <div className="about-world__body">
                <p className="about-world__num">World {w.index}</p>
                <h3>{w.name}</h3>
                <p className="about-world__sub">“{w.subtitle}”</p>
                <p>{w.description}</p>
                <dl>
                  <div>
                    <dt>Maze size</dt>
                    <dd>
                      {w.startSize[0]}×{w.startSize[1]} → {w.maxSize[0]}×{w.maxSize[1]}
                    </dd>
                  </div>
                  <div>
                    <dt>Dead ends reopened</dt>
                    <dd>
                      {pct(w.braid[0])} → {pct(w.braid[1])}
                    </dd>
                  </div>
                  <div>
                    <dt>Character</dt>
                    <dd>{w.character}</dd>
                  </div>
                </dl>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Characters */}
      <section
        className="section about-chars"
        aria-labelledby="ac-title"
        style={{ '--bg': `url(${asset('scenes/fireside-960.webp')})` } as React.CSSProperties}
      >
        <div className="container">
          <p className="kicker reveal">The Santas</p>
          <h2 id="ac-title" className="reveal">
            One hero, four coats
          </h2>
          <p className="lead reveal">
            Every Santa is unlocked from day one and handles exactly the same. Each comes fully animated in four
            directions — {animations.join(', ').toLowerCase()}.
          </p>
          <ul className="about-char-row">
            {characters.map((c, i) => (
              <li key={c.id} className="reveal" style={{ '--delay': `${i * 80}ms`, '--coat': c.color } as React.CSSProperties}>
                <img src={asset(`characters/${c.folder}/still.webp`)} alt={`${c.name}`} width="256" height="256" loading="lazy" />
                <h3>{c.name}</h3>
                <p>{c.coat} coat</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Development */}
      <section className="section about-dev" aria-labelledby="dev-title">
        <div className="container about-split">
          <div>
            <p className="kicker reveal">Behind the game</p>
            <h2 id="dev-title" className="reveal">
              Built from the ground up
            </h2>
            <p className="reveal">
              {site.name} doesn’t run on an off-the-shelf engine. It is built on a custom C++ game engine rendering with
              OpenGL ES 3.0, wrapped in a slim Android shell — which keeps it light, quick to load and smooth on a wide
              range of phones.
            </p>
            <ul className="ticks reveal">
              <li>Mazes generated from a seed, so every player gets the same level</li>
              <li>Hand-tuned difficulty curve for each world</li>
              <li>Snowfall, footstep trails and particle effects</li>
              <li>Designed for landscape play, full-screen and edge to edge</li>
              <li>Fully offline — no account, no ads, no internet connection required</li>
            </ul>
          </div>
          <aside className="clay-panel about-vision on-cream reveal" aria-labelledby="vision-title">
            <h3 id="vision-title">A note from the developer</h3>
            <p>
              <span className="placeholder">[Add a short note about why you made the game and what you hope players enjoy.]</span>
            </p>
            <p className="about-vision__sig">
              — <span className="placeholder">{site.developer}</span>
            </p>
          </aside>
        </div>
      </section>

      <section className="section about-cta">
        <div className="container about-cta__inner">
          <h2 className="reveal">Ready when you are.</h2>
          <div className="about-cta__btns reveal">
            <StoreButton />
            <a className="btn btn--ghost" href={pageHref('contact/')}>
              Contact the team
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
}
