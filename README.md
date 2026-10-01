# Mohamed El Messaadi — portfolio

A responsive backend and systems engineering portfolio with system light/dark themes built with Next.js App Router, React, TypeScript, and Tailwind CSS. IBM Plex Sans and IBM Plex Mono are hosted locally, with licenses in `public/fonts/`.

## Development

Use Node.js 22 or later.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Edit the main layout in `app/page.tsx`, the hero in `components/hero.tsx`, project presentation in `components/project-list.tsx`, project and profile information in `lib/portfolio.ts`, and styling in `app/globals.css`. Interactive components live in `components/`.

## Production and validation

```sh
npm run lint
npm run build
npm start
```

The complete deployable site is generated in `out/`. `npm start` previews that exact export at http://127.0.0.1:3000. The build also updates the original root `index.html` and its `_next/` assets for existing static previews. Do not edit generated HTML directly. The full-resolution logo lives in `public/mylogo.png`; the header and footer use the optimized `public/brand-mark.webp`; the build also copies it to the root for static previews.

```sh
npx playwright install chromium
npm test
```

Tests cover responsive layouts, visible project implementation notes, the printable resume, mobile navigation, email actions, accessibility, reduced motion, missing pages, and JavaScript-free content. For an installed system Chromium, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE=/usr/bin/chromium`.

## Profile links and resume

Update `lib/portfolio.ts` for contact links. `profile.linkedin` is rendered only when a confirmed URL is configured. The Resume link opens `/resume/`, a printable page generated from the same verified profile and project data; use **Print / Save as PDF** to export it. You may replace `profile.resume` with your own hosted PDF. BookLibrary links to its existing public repository, named PageTurner.

## Deployment

The GitHub Pages workflow builds, checks, tests, and deploys `out/` when changes are pushed to `main` or `master`. In GitHub repository settings, select **Pages → Source → GitHub Actions**. `public/CNAME` preserves `mohamedelmessaadi.tech`; the existing custom domain and DNS configuration must remain in place. No deployment is performed by local build commands.

Other static hosts can serve `out/`; configure `404.html` as their not-found page. Hosts with native Next.js support can run the same build. This portfolio has no backend runtime requirement.

## Content and behavior

- All project information comes from the previous portfolio. The private project remains marked in development.
- Email actions open the visitor's mail application; copying the email requires HTTPS or localhost. Failures show a useful fallback message.
- The architecture illustration is explanatory, not a live service monitor.
- Motion respects the visitor's reduced-motion preference. Content is rendered in the exported HTML, so the portfolio remains readable without JavaScript.
- Palette: `#b0d8e3`, `#0e3768`, `#555555`, `#f1f2f6`, with dark navy surfaces and accessible text tints.

Framework setup follows the [Next.js static export documentation](https://nextjs.org/docs/app/guides/static-exports) and [Tailwind CSS Next.js guide](https://tailwindcss.com/docs/installation/framework-guides/nextjs).
