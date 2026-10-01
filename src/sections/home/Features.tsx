import { features } from '../../data/features';
import { asset } from '../../lib/env';
import { Picture } from '../../components/Picture';
import './Features.css';

/** Full-width feature scenes; the art unmasks as each scene scrolls in. */
export function Features() {
  return (
    <section className="features section" aria-labelledby="features-title">
      <div className="container-wide">
        <header className="features__head">
          <p className="kicker reveal">Features</p>
          <h2 id="features-title" className="reveal">
            Small mazes. Big moments.
          </h2>
        </header>
      </div>

      <div className="features__list">
        {features.map((f, i) => {
          const isShot = f.image === 'scenes/gameplay-hud';
          return (
            <article key={f.id} className={`feature ${i % 2 ? 'feature--flip' : ''}`} aria-labelledby={`feature-${f.id}`}>
              <div className="feature__art reveal">
                {isShot ? (
                  <img
                    src={asset('scenes/gameplay-hud.webp')}
                    alt={f.alt}
                    width="749"
                    height="310"
                    loading="lazy"
                    className="feature__img feature__img--shot"
                  />
                ) : (
                  <Picture name={f.image} widths={[960, 1672]} sizes="(max-width: 900px) 100vw, 60vw" alt={f.alt} className="feature__img" />
                )}
              </div>
              <div className="feature__copy reveal" style={{ '--delay': '120ms' } as React.CSSProperties}>
                <p className="feature__kicker">{f.kicker}</p>
                <h3 id={`feature-${f.id}`}>{f.title}</h3>
                <p>{f.body}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
