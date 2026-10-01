// Renders each page to static HTML after `vite build`, so content, headings
// and links are present without JavaScript (SEO, previews, no-JS visitors).
// The client then hydrates the same markup. Also writes sitemap.xml.

import fs from 'node:fs/promises';
import path from 'node:path';
import { createServer, loadEnv } from 'vite';

const base = process.env.BASE_PATH ?? '/';
const env = loadEnv('production', process.cwd(), 'VITE_');
const siteUrl = (env.VITE_SITE_URL || '').replace(/\/$/, '');

const PAGES = [
  { key: 'home', html: 'index.html', path: '' },
  { key: 'about', html: 'about/index.html', path: 'about/' },
  { key: 'privacy', html: 'privacy-policy/index.html', path: 'privacy-policy/' },
  { key: 'contact', html: 'contact/index.html', path: 'contact/' },
];

const vite = await createServer({
  base,
  appType: 'custom',
  logLevel: 'error',
  server: { middlewareMode: true, hmr: false },
});

try {
  const { render } = await vite.ssrLoadModule('/src/ssr.tsx');
  for (const page of PAGES) {
    const markup = render(page.key);
    const file = path.resolve('dist', page.html);
    let html = await fs.readFile(file, 'utf8');
    if (!html.includes('<!--app-->')) throw new Error(`No <!--app--> slot in ${page.html}`);
    html = html.replace('<!--app-->', markup);
    // Public-folder URLs written in the HTML head need the deploy base too.
    if (base !== '/') html = html.replace(/(["\s,])\/(assets|favicon|apple-touch-icon)/g, `$1${base}$2`);
    await fs.writeFile(file, html);
    console.log(`prerendered ${page.html} (${(markup.length / 1024).toFixed(1)} kB)`);
  }
} finally {
  await vite.close();
}

const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PAGES.map((p) => `  <url><loc>${siteUrl}/${p.path}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`;
await fs.writeFile(path.resolve('dist/sitemap.xml'), sitemap);
await fs.appendFile(path.resolve('dist/robots.txt'), `\nSitemap: ${siteUrl}/sitemap.xml\n`);
console.log('wrote sitemap.xml');
