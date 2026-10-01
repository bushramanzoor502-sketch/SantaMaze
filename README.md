# Santa's Maze Adventure — official website

The website for **Santa's Maze Adventure**, a Christmas maze game for Android.
Four pages: Home, About, Privacy Policy and Contact Us.

Built with Vite, React and TypeScript, with a lazy-loaded three.js hero scene.
Every page is prerendered to static HTML at build time, so it works on GitHub Pages
and is readable without JavaScript.

## Commands

| Command | What it does |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Local dev server at http://localhost:5173 |
| `npm run build` | Typecheck, build and prerender into `dist/` |
| `npm run preview` | Serve the production build |
| `npm run assets` | Re-import art from the game project (see below) |

## Before going live

All site-wide details live in **`src/data/site.ts`**:

- `developer`, `country` — currently `[placeholders]`, shown highlighted on the site
- `playStoreUrl` — while empty, the store button reads "Coming soon to Google Play"
- `socials` — add links to replace the `[link]` placeholders
- `email` — the contact/support address used across the site

Also update:

- `.env` → `VITE_SITE_URL`, used for canonical and Open Graph URLs (the GitHub
  workflow sets this automatically for `<owner>.github.io/<repo>`)
- `src/pages/About.tsx` → the "note from the developer" placeholder
- `src/pages/Privacy.tsx` → postal address placeholder, and review the policy if the
  game ever adds online services (analytics, ads, cloud saves…)

## Live site & automatic deployment

**Live:** https://bushramanzoor502-sketch.github.io/SantaMaze/

Deployment is fully automatic (`.github/workflows/deploy.yml`):

1. Edit anything — copy in `src/data/`, a page, styles, images in `public/`.
2. Commit and push to `main`:
   ```sh
   git add -A
   git commit -m "Describe your change"
   git push
   ```
3. GitHub Actions typechecks, builds and prerenders all four pages, then publishes
   them. The site updates in about a minute — follow progress under the repo's
   **Actions** tab. If the build fails (e.g. a type error), nothing is published and
   the live site stays as it was.

Pull requests to `main` run the same build as a check without deploying.
Links and asset paths adapt to the repository name automatically, so no page needs
editing for deployment.

**One-time setup:** in the repository, open **Settings → Pages → Build and deployment**
and set **Source** to **GitHub Actions**.

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
