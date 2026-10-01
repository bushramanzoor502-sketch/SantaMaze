import { site } from '../../data/site';
import { asset } from '../../lib/env';
import { Picture } from '../../components/Picture';
import { SnowCanvas } from '../../components/SnowCanvas';
import { StoreButton } from '../../components/StoreButton';
import { ArrowDown } from '../../components/Icons';
import { MazeDiorama } from '../../three/MazeDiorama';
import './Hero.css';

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      {/* Layer 1 — the night village under the northern lights */}
      <div className="hero__sky" aria-hidden="true" data-parallax="0.35">
        <Picture name="scenes/night-village" widths={[768, 1280, 1949]} sizes="100vw" alt="" priority />
      </div>
      <div className="hero__grade" aria-hidden="true" />
      {/* Layer 3 — falling snow in front of everything */}
      <SnowCanvas className="hero__snow" />

      <div className="container-wide hero__inner">
        <div className="hero__copy">
          <h1 id="hero-title" className="hero__title">
            <img
              className="hero__logo"
              src={asset('brand/logo-1143.webp')}
              srcSet={`${asset('brand/logo-640.webp')} 640w, ${asset('brand/logo-1143.webp')} 1143w`}
              sizes="(max-width: 900px) 80vw, 560px"
              width="1143"
              height="629"
              alt={site.name}
              fetchPriority="high"
            />
          </h1>
          <p className="hero__tagline">
            Collect every gift.
            <br />
            <span>Unlock the gate.</span>
          </p>
          <p className="hero__desc">
            Guide Santa through ever-growing mazes across four winter worlds. Every level is a fresh maze, every gift
            matters — and the door won’t open until the last one is in the sack.
          </p>
          <div className="hero__ctas">
            <StoreButton />
            <a className="btn btn--ghost" href="#worlds">
              Explore the worlds
            </a>
          </div>
        </div>

        {/* Layer 2 — the 3D island */}
        <div className="hero__stage">
          <MazeDiorama />
        </div>
      </div>

      <a className="hero__cue" href="#story" aria-label="Scroll to discover the game">
        <ArrowDown />
      </a>
    </section>
  );
}
