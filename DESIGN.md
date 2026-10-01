# Portfolio design

An editorial, portrait-led portfolio for Mohamed El Messaadi, Backend & Systems Software Engineer. The visitor should understand the specialty and find contact details immediately, then explore the architecture and implementation of the work.

## Visual system

- Fixed dark theme, including under light system preferences: canvas `#111110`, surface `#1a1a18`, foreground `#f2f0eb`, secondary `#b9b7b0`, dividers `#353532`.
- Space Grotesk 600 for headings and display type; IBM Plex Sans 400/500 for reading. Fonts are self-hosted WOFF2 with licenses in `public/fonts`.
- Oversized decorative systems lettering sits behind the supplied monochrome portrait. The semantic heading remains the person's name. Decorative lettering and diagrams are excluded from assistive technology.
- Pill CTAs, 14–16px card radii, subtle metallic gradients. The project grid features one wide architecture project, then two smaller projects. Cards show real implementation details.
- 1320px maximum content width, 56px desktop gutters, 20px mobile gutters. Section spacing scales from 80px to 140px. Layout changes at 1100px, 800px, 700px, and 380px.
- The provided `me.png` is preserved in `public`. Responsive WebP derivatives keep transparency and aspect ratio. Grayscale and edge fades are presentation CSS, not modifications of the original portrait.

## Motion

Implemented in `components/motion.tsx` using Framer Motion. Scroll parallax is decorative only; ordinary scrolling is never intercepted. Pointer springs use duration 0.5s and bounce 0.2. Magnetic links move at most 7px horizontally and 5px vertically. Cards tilt at most 1.5 degrees per axis. Pointer leave/cancel and keyboard focus reset them.

Reveals use a 650ms ease-out `[0.23, 1, 0.32, 1]`, once per section, with visible server-rendered defaults. Reduced motion removes transforms. Magnetic and tilt interactions require a fine mouse pointer. Hover gradients fade over 250ms.

References: [Motion scroll](https://motion.dev/docs/react-use-scroll), [Motion springs](https://motion.dev/docs/react-use-spring), [accessible motion](https://motion.dev/docs/react-accessibility).

## Preserved behavior

Navigation anchors, keyboard skip link, mobile navigation with Escape support, email copy feedback, printable resume, static export and GitHub Pages workflow. ft_transcendence retains its honest private/in-development status until a verified repository URL is supplied. BookLibrary links to the existing PageTurner repository.
