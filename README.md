# Santa's Maze Adventure — official website

The website for **Santa's Maze Adventure**, a Christmas maze game for Android.
Four pages: Home, About, Privacy Policy and Contact Us.

Built with Vite, React and TypeScript, with a lazy-loaded three.js hero scene.
Every page is prerendered to static HTML at build time, so it works on any static host
(it is hosted on Netlify) and is readable without JavaScript.

## Commands

| Command | What it does |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Local dev server at http://localhost:5173 |
| `npm run build` | Typecheck, build and prerender into `dist/` |
| `npm run preview` | Serve the production build |
| `npm run assets` | Re-import art from the game project (see below) |

## Site details

All site-wide details live in **`src/data/site.ts`**:

- `developer`, `developerUrl`, `country` — the studio shown on Contact, About, Privacy and the footer
- `playStoreUrl` — the Google Play listing every "Get it on Google Play" button links to
- `email` — the contact/support address used across the site

Review `src/pages/Privacy.tsx` whenever the game adds or removes a service (it
currently covers Firebase Analytics, Crashlytics and Cloud Messaging).

## Hosting & automatic deployment

The site is hosted on **Netlify**, which builds and publishes it on every push to
`main` using `netlify.toml` (build command `npm run build`, publish folder `dist`).

1. Edit anything — copy in `src/data/`, a page, styles, images in `public/`.
2. Commit and push to `main`:
   ```sh
   git add -A
   git commit -m "Describe your change"
   git push
   ```
3. Netlify typechecks, builds and prerenders all four pages, then publishes them.
   If the build fails (e.g. a type error), nothing is published and the live site
   stays as it was.

Netlify passes the site address as `$URL`, which becomes `VITE_SITE_URL` for the
canonical, Open Graph and sitemap links.

## Game art

Images in `public/assets/` were produced by `scripts/import-assets.mjs` from the game
project. The script only **reads** the game folder and writes optimized WebP files
here. Run it again after changing the game's art:

```sh
GAME_DIR="E:/Android Projects/Maze" npm run assets
```

## Where things are

```
src/
  data/        Game facts and site settings (single source of truth for copy)
  lib/maze.ts  TypeScript port of the game's maze generator (same seeds, same mazes)
  three/       The 3D hero diorama (lazy-loaded, with a static fallback)
  sections/    Home page sections
  pages/       Home, About, Privacy, Contact
  components/  Nav, footer, shared UI
scripts/       Asset import and build-time prerender
```

## Accessibility & performance notes

- Respects `prefers-reduced-motion`: the 3D scene, snowfall, parallax and animations
  are replaced with static art.
- The 3D scene is skipped (static art instead) without WebGL, with Save-Data on, or
  on low-memory devices; it pauses when off-screen or the tab is hidden.
