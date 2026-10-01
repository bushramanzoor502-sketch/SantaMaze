import { site } from '../../data/site';
import { asset, pageHref } from '../../lib/env';
import { SnowCanvas } from '../../components/SnowCanvas';
import { StoreButton } from '../../components/StoreButton';
import { SpriteSanta } from '../../components/SpriteSanta';
import './FinalCta.css';

export function FinalCta() {
  return (
    <section
      className="final"
      aria-labelledby="final-title"
      style={{ '--bg': `url(${asset('scenes/sunset-1672.webp')})` } as React.CSSProperties}
    >
      <div className="final__bg" aria-hidden="true" data-parallax="0.2" />
      <SnowCanvas className="final__snow" density={0.7} />
      <div className="container final__inner">
        <img className="final__logo reveal" src={asset('brand/logo-640.webp')} alt="" width="640" height="352" loading="lazy" />
        <h2 id="final-title" className="reveal">
          The gifts won’t collect themselves.
        </h2>
        <p className="lead reveal">{site.shortDescription}</p>
        <div className="final__ctas reveal">
          <StoreButton />
          <a className="btn btn--red" href={pageHref('about/')}>
            Learn more about the game
          </a>
        </div>
      </div>
      <div className="final__walkers" aria-hidden="true">
        <SpriteSanta coat="red" anim="walk" facing="right" size={110} className="final__walker" />
        <SpriteSanta coat="green" anim="walk" facing="right" size={96} className="final__walker final__walker--2" />
      </div>
    </section>
  );
}
