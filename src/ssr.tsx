// Build-time only: renders a page to HTML for scripts/prerender.mjs. Loaded
// through Vite so React and react-dom/server share one module graph.
import { renderToString } from 'react-dom/server';
import Home from './pages/Home';
import About from './pages/About';
import Privacy from './pages/Privacy';
import Contact from './pages/Contact';

const pages = { home: Home, about: About, privacy: Privacy, contact: Contact };

export function render(page: keyof typeof pages): string {
  const Page = pages[page];
  return renderToString(<Page />);
}
