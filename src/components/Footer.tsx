import { nav, site } from '../data/site';
import { asset, pageHref } from '../lib/env';
import { Mail } from './Icons';
import './Footer.css';

export function Footer() {
  const year = 2026;
  return (
    <footer className="site-footer">
      <div className="container-wide site-footer__inner">
        <div className="site-footer__brand">
          <img src={asset('brand/logo-640.webp')} alt={site.name} width="640" height="352" loading="lazy" />
          <p>{site.shortDescription}</p>
        </div>

        <nav className="site-footer__col" aria-label="Footer">
          <h2>Explore</h2>
          <ul>
            {nav.map((n) => (
              <li key={n.key}>
                <a href={pageHref(n.path)}>{n.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-footer__col">
          <h2>Support</h2>
          <ul>
            <li>
              <a href={`mailto:${site.email}`} className="site-footer__mail">
                <Mail /> {site.email}
              </a>
            </li>
            <li>
              <a href={pageHref('contact/')}>Report a bug</a>
            </li>
            <li>
              <a href={pageHref('privacy-policy/')}>Your privacy</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="container-wide site-footer__legal">
        <p>
          © {year} <span className="placeholder">{site.developer}</span>. All rights reserved.
        </p>
        <p>
          {site.name} is a game for Android. Google Play and the Google Play logo are trademarks of Google LLC.
        </p>
      </div>
    </footer>
  );
}
