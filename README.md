# Mohamed El Messaadi — portfolio

A dark, responsive backend engineering portfolio built with Next.js App Router, React, TypeScript, and Tailwind CSS. IBM Plex Sans and IBM Plex Mono are hosted locally, with licenses in `public/fonts/`.

## Development

Use Node.js 22 or later.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Edit the page in `app/page.tsx`, project and profile information in `lib/portfolio.ts`, and styling in `app/globals.css`. Interactive components live in `components/`.

## Production and validation

```sh
npm run lint
npm run build
npm start
```

The complete deployable site is generated in `out/`. `npm start` previews that exact export at http://127.0.0.1:3000. The build also updates the original root `index.html` and its `_next/` assets for existing static previews. Do not edit generated HTML directly. The shared logo lives in `public/mylogo.png`; the build also copies it to the root for static previews.

```sh
npx playwright install chromium
npm test
```

Tests cover responsive layouts, the architecture tabs, project notes, mobile navigation, email actions, accessibility, reduced motion, missing pages, and JavaScript-free content. For an installed system Chromium, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE=/usr/bin/chromium`.

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
