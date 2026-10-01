import { useEffect, type ReactNode } from 'react';
import type { PageKey } from '../data/site';
import { Footer } from './Footer';
import { Nav } from './Nav';
import { initParallax, initReveals } from '../lib/scroll';

export function Layout({ page, children }: { page: PageKey; children: ReactNode }) {
  // Runs once the page (and every section effect) has mounted or hydrated.
  useEffect(() => {
    initReveals();
    initParallax();
  }, []);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Nav current={page} />
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </>
  );
}
