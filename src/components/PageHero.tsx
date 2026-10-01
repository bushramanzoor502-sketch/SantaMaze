import type { ReactNode } from 'react';
import { SnowCanvas } from './SnowCanvas';
import './PageHero.css';

interface Props {
  kicker: string;
  title: ReactNode;
  lead?: ReactNode;
  /** Background scene asset name (exported at 1672/960 or similar). */
  bg: string;
  art?: ReactNode;
  compact?: boolean;
}

/** Cinematic opening band for the inner pages. */
export function PageHero({ kicker, title, lead, bg, art, compact }: Props) {
  return (
    <section className={`page-hero ${compact ? 'page-hero--compact' : ''}`} style={{ '--bg': `url(${bg})` } as React.CSSProperties}>
      <div className="page-hero__bg" aria-hidden="true" data-parallax="0.25" />
      <div className="page-hero__shade" aria-hidden="true" />
      <SnowCanvas density={0.6} />
      <div className="container-wide page-hero__inner">
        <div className="page-hero__copy">
          <p className="kicker reveal">{kicker}</p>
          <h1 className="reveal" style={{ '--delay': '80ms' } as React.CSSProperties}>
            {title}
          </h1>
          {lead && (
            <p className="lead reveal" style={{ '--delay': '160ms' } as React.CSSProperties}>
              {lead}
            </p>
          )}
        </div>
        {art && <div className="page-hero__art reveal" style={{ '--delay': '220ms' } as React.CSSProperties}>{art}</div>}
      </div>
    </section>
  );
}
