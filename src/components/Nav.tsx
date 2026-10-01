import { useEffect, useRef, useState } from 'react';
import { nav, site, type PageKey } from '../data/site';
import { asset, pageHref } from '../lib/env';
import { Close, Menu } from './Icons';
import './Nav.css';

export function Nav({ current }: { current: PageKey }) {
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Transparent over the opening scene, solid once scrolled; tucks away while
  // scrolling down and returns on the way up.
  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      setSolid(y > 80);
      setHidden(y > 320 && y > lastY + 4);
      if (y < lastY - 4 || y <= 320) setHidden(false);
      lastY = y;
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Mobile menu: lock scroll, trap focus, close on Escape.
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    document.body.style.overflow = 'hidden';
    const focusables = () =>
      Array.from(panel?.querySelectorAll<HTMLElement>('a, button') ?? []).filter((el) => !el.hasAttribute('disabled'));
    focusables()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
      if (e.key === 'Tab') {
        const els = [toggleRef.current!, ...focusables()];
        const first = els[0];
        const last = els[els.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    const mq = window.matchMedia('(min-width: 900px)');
    const onMq = () => mq.matches && setOpen(false);
    mq.addEventListener('change', onMq);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
      mq.removeEventListener('change', onMq);
    };
  }, [open]);

  const cls = ['site-nav', solid && 'is-solid', hidden && !open && 'is-hidden', open && 'is-open'].filter(Boolean).join(' ');

  return (
    <header className={cls}>
      <div className="site-nav__bar">
        <a className="site-nav__brand" href={pageHref('')} aria-label={`${site.name} — Home`}>
          <img src={asset('brand/logo-640.webp')} alt="" width="640" height="352" />
        </a>

        <nav className="site-nav__links" aria-label="Main">
          <ul>
            {nav.map((item) => (
              <li key={item.key}>
                <a href={pageHref(item.path)} aria-current={item.key === current ? 'page' : undefined}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <button
          ref={toggleRef}
          className="site-nav__toggle"
          type="button"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <Close /> : <Menu />}
        </button>
      </div>

      <div id="mobile-menu" ref={panelRef} className="site-nav__panel" hidden={!open}>
        <nav aria-label="Mobile">
          <ul>
            {nav.map((item, i) => (
              <li key={item.key} style={{ '--i': i } as React.CSSProperties}>
                <a href={pageHref(item.path)} aria-current={item.key === current ? 'page' : undefined} onClick={() => setOpen(false)}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p className="site-nav__panel-foot">{site.tagline}</p>
      </div>
    </header>
  );
}
