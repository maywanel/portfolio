'use client';

import { useEffect, useRef, useState } from 'react';
import type { createIntroWater } from './intro-water';


const INTRO_SEEN_KEY = 'portfolio:intro-seen';

export function IntroOverlay() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    // Decide before mounting the overlay or downloading its visual effects.
    const frame = requestAnimationFrame(() => {
      try {
        if (localStorage.getItem(INTRO_SEEN_KEY)) return;
        localStorage.setItem(INTRO_SEEN_KEY, 'true');
      } catch { /* Storage may be unavailable; the introduction remains skippable. */ }
      setShow(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  return show ? <FirstVisitIntro /> : null;
}

function FirstVisitIntro() {
  const [removed, setRemoved] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const waterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const waterElement = waterRef.current;
    if (!overlay || !waterElement) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const previousFocus = document.activeElement;
    const hero = document.querySelector<HTMLElement>('.hero');
    const header = document.querySelector<HTMLElement>('.home-header');
    if (hero) hero.dataset.entrance = 'waiting';
    if (header) header.dataset.entrance = 'waiting';
    const siblings = [...overlay.parentElement!.children].filter((el): el is HTMLElement => el instanceof HTMLElement && el !== overlay && el.tagName !== 'SCRIPT');
    const inertStates = siblings.map(el => el.inert);
    siblings.forEach(el => { el.inert = true; });
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    overlay.focus({ preventScroll: true });
    let width = innerWidth;
    let height = innerHeight;
    let water: Awaited<ReturnType<typeof createIntroWater>> = null;
    let waterTimer: ReturnType<typeof setTimeout> | undefined;
    let ready = false;
    let exiting = false;
    let morphFrame = 0;
    let revealFrame = 0;
    let disposed = false;
    let lastDrop = 0;
    const morphCanvas = overlay.querySelector<HTMLCanvasElement>('.intro-morph')!;
    const morphReady = (reduced.matches ? Promise.resolve(null) : import('./intro-morph').then(({ prepareIntroMorph }) => disposed || exiting ? null : prepareIntroMorph(morphCanvas, overlay.querySelector('.intro-name')!, overlay.querySelector('.intro-logo')!)))
      .then(draw => {
        if (!disposed && !exiting && draw && !reduced.matches) {
          draw(0);
          overlay.dataset.ink = 'ready';
        }
        return draw;
      }).catch(() => null);
    let exitTimer: ReturnType<typeof setTimeout> | undefined;
    async function startWater() {
      if (disposed || exiting || reduced.matches || water) return;
      const { createIntroWater } = await import('./intro-water');
      if (disposed || exiting || reduced.matches) return;
      water = await createIntroWater(waterElement!, overlay!.querySelector('.intro-logo')!, () => disposed || exiting || reduced.matches).catch(() => null);
      if (water && (disposed || exiting)) { water.destroy(); water = null; }
    }
    function logoVisible() {
      overlay!.dataset.phase = 'logo';
      ready = true;
      waterTimer = setTimeout(startWater, 600);
    }
    function resize() {
      width = innerWidth;
      height = innerHeight;
      water?.resize();
    }
    function move(event: PointerEvent) {
      if (!ready || exiting || reduced.matches || !finePointer.matches || event.pointerType !== 'mouse') return;
      const now = performance.now();
      if (now - lastDrop < 16) return;
      lastDrop = now;
      water?.drop(event.clientX, event.clientY);
    }
    function visibility() {
      if (document.hidden || reduced.matches) water?.pause();
      else water?.play();
    }
    function restore() {
      document.body.style.overflow = previousOverflow;
      siblings.forEach((el, index) => { el.inert = inertStates[index]; });
    }
    function finish() {
      if (hero) hero.dataset.entrance = 'playing';
      if (header) header.dataset.entrance = 'playing';
      restore();
      setRemoved(true);
      document.getElementById('main')?.focus({ preventScroll: true });
    }
    function reveal(event?: MouseEvent) {
      if (exiting) return;
      exiting = true;
      const x = event?.detail ? event.clientX : width / 2;
      const y = event?.detail ? event.clientY : height / 2;
      const surface = overlay!.querySelector<HTMLElement>('.intro-surface')!;
      const wave = overlay!.querySelector<HTMLElement>('.intro-wave')!;
      wave.style.left = `${x}px`;
      wave.style.top = `${y}px`;
      overlay!.dataset.phase = 'exit';
      if (reduced.matches) {
        exitTimer = setTimeout(finish, 180);
        return;
      }
      const start = performance.now();
      function expand(now: number) {
        const progress = Math.min(1, (now - start) / 1000);
        // Constant travel keeps the reveal moving visibly for the full second.
        const reach = Math.hypot(Math.max(x, width - x), Math.max(y, height - y)) + 80;
        const radius = progress * reach;
        surface.style.maskImage = `radial-gradient(circle at ${x}px ${y}px, transparent ${Math.max(0, radius - 14)}px, black ${radius + 6}px)`;
        wave.style.width = `${radius * 2}px`;
        wave.style.height = `${radius * 2}px`;
        wave.style.opacity = String(Math.min(1, progress * 12) * (1 - progress ** 5));
        if (progress < 1) revealFrame = requestAnimationFrame(expand);
        else finish();
      }
      revealFrame = requestAnimationFrame(expand);
    }
    function keydown(event: KeyboardEvent) {
      if (['Escape', 'Enter', ' '].includes(event.key)) {
        event.preventDefault();
        reveal();
      } else if (event.key === 'Tab') {
        event.preventDefault();
        overlay!.focus();
      }
    }
    const logoTimer = setTimeout(async () => {
      const renderMorph = await morphReady;
      if (disposed || exiting) return;
      if (reduced.matches || !renderMorph) {
        logoVisible();
        return;
      }
      overlay.dataset.phase = 'morph';
      const start = performance.now();
      function morph(now: number) {
        if (disposed || exiting) return;
        const progress = Math.min(1, (now - start) / 1800);
        renderMorph!(progress);
        if (progress < 1) morphFrame = requestAnimationFrame(morph);
        else {
          logoVisible();
        }
      }
      morphFrame = requestAnimationFrame(morph);
    }, 1500);
    resize();
    document.addEventListener('visibilitychange', visibility);
    reduced.addEventListener('change', visibility);
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', move);
    window.addEventListener('click', reveal);
    window.addEventListener('keydown', keydown);
    return () => {
      clearTimeout(logoTimer);
      disposed = true;
      cancelAnimationFrame(morphFrame);
      cancelAnimationFrame(revealFrame);
      clearTimeout(exitTimer);
      clearTimeout(waterTimer);
      water?.destroy();
      document.removeEventListener('visibilitychange', visibility);
      reduced.removeEventListener('change', visibility);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('click', reveal);
      window.removeEventListener('keydown', keydown);
      if (hero?.dataset.entrance === 'waiting') delete hero.dataset.entrance;
      if (header?.dataset.entrance === 'waiting') delete header.dataset.entrance;
      restore();
      if (overlay.contains(document.activeElement) && previousFocus instanceof HTMLElement) previousFocus.focus({ preventScroll: true });
    };
  }, [removed]);

  if (removed) return null;
  return <div ref={overlayRef} className="intro-overlay" data-phase="name" role="dialog" tabIndex={-1} aria-describedby="intro-instructions" aria-modal="true" aria-label="Welcome to Mohamed El Messaadi’s portfolio">
    <div className="intro-surface">
    <div ref={waterRef} className="intro-water" aria-hidden="true" />
    <div className="intro-center" aria-hidden="true">
      <canvas className="intro-morph" aria-hidden="true" />
      <p className="intro-name">Mohamed <span>El Messaadi</span></p>
      {/* Use the original local logo, including its gold accent. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="intro-logo" src="/mylogo.png" alt="" width="1536" height="1024" loading="eager" />
    </div>
    <span id="intro-instructions" className="intro-instructions">Click anywhere or press Enter, Space, or Escape to enter the portfolio.</span>
    </div>
    <div className="intro-wave" aria-hidden="true" />
    <noscript><style>{`.intro-overlay { display: none !important; } body { overflow: auto !important; }`}</style></noscript>
  </div>;
}
