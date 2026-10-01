import { asset } from '../../lib/env';
import { Picture } from '../../components/Picture';
import './Story.css';

/** "What is it" — the premise in one breath, told over a walking Santa. */
export function Story() {
  return (
    <section id="story" className="story section" aria-labelledby="story-title">
      <div className="story__glow" aria-hidden="true" />
      <div className="container-wide story__grid">
        <div className="story__copy">
          <p className="kicker reveal">The game</p>
          <h2 id="story-title" className="story__title reveal">
            One Santa. <em>Four winter worlds.</em> Every last gift.
          </h2>
          <p className="lead reveal">
            Santa’s Maze Adventure is a top-down Christmas maze game for Android, played in landscape. Each level drops
            Santa at the edge of a brand-new maze with gifts scattered along its paths and a locked door waiting at the
            far end.
          </p>
          <p className="reveal">
            Sweep up every gift, watch the gate spring open, and make it through before the clock runs past par. Then
            the next maze is waiting — a little bigger, and a little less forgiving.
          </p>
          <dl className="story__facts reveal">
            <div>
              <dt>4</dt>
              <dd>winter worlds</dd>
            </div>
            <div>
              <dt>4</dt>
              <dd>Santas to choose from</dd>
            </div>
            <div>
              <dt>∞</dt>
              <dd>levels per world</dd>
            </div>
          </dl>
        </div>

        <div className="story__art reveal" style={{ '--delay': '150ms' } as React.CSSProperties}>
          <Picture
            name="brand/island-dash"
            widths={[640, 1056]}
            sizes="(max-width: 900px) 90vw, 46vw"
            alt="Isometric holly-hedge maze on a snowy island with a cottage, lanterns, gifts and a candy-cane arch"
            className="story__island"
          />
          <img
            className="story__santa"
            src={asset('brand/santa-walk-420.webp')}
            srcSet={`${asset('brand/santa-walk-420.webp')} 420w, ${asset('brand/santa-walk-834.webp')} 834w`}
            sizes="(max-width: 900px) 40vw, 18vw"
            width="834"
            height="886"
            alt="Santa striding along with a green sack full of presents"
            loading="lazy"
            data-parallax="-0.18"
          />
        </div>
      </div>
    </section>
  );
}
