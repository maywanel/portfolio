'use client';

import { useEffect, useRef, type KeyboardEvent, type PointerEvent } from 'react';
import { usePathname } from 'next/navigation';

export function ScrollRuler() {
  const ref = useRef<HTMLDivElement>(null);
  const marker = useRef<HTMLSpanElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const ruler = ref.current!;
    const root = document.documentElement;
    const header = document.querySelector<HTMLElement>('.site-header');
    const hero = document.querySelector<HTMLElement>('.hero');
    // The stats row is the final step of the existing hero choreography.
    // Follow its real animation lifecycle, including reduced-motion timing.
    const lastEntrance = hero?.querySelector<HTMLElement>('.stats-bar');
    const syncEntrance = () => {
      const pending = hero?.dataset.entrance === 'waiting'
        || lastEntrance?.getAnimations().some(animation => animation.playState !== 'finished');
      ruler.dataset.entrance = pending ? 'waiting' : 'ready';
    };
    const entranceObserver = new MutationObserver(syncEntrance);
    if (hero) entranceObserver.observe(hero, { attributes: true, attributeFilter: ['data-entrance'] });
    lastEntrance?.addEventListener('animationend', syncEntrance);
    lastEntrance?.addEventListener('animationcancel', syncEntrance);
    syncEntrance();
    let frame = 0;
    let travel = 0;
    let range = 0;
    const update = () => {
      frame = 0;
      const progress = range > 0 ? Math.max(0, Math.min(1, window.scrollY / range)) : 0;
      marker.current!.style.transform = `translateY(${progress * travel}px)`;
      const percentage = Math.round(progress * 100);
      ruler.setAttribute('aria-valuenow', String(percentage));
      ruler.setAttribute('aria-valuetext', `${percentage}% of page`);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const measure = () => {
      const top = (header?.offsetHeight ?? 0) + 24;
      ruler.style.top = `${top}px`;
      range = Math.max(0, root.scrollHeight - window.innerHeight);
      ruler.hidden = range === 0;
      root.toggleAttribute('data-scroll-ruler', range > 0);
      // The intro temporarily hides the ruler, so its clientHeight can be zero.
      travel = Math.max(0, window.innerHeight - top - parseFloat(getComputedStyle(ruler).bottom) - 2);
      schedule();
    };
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    if (header) observer.observe(header);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', measure);
    measure();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      entranceObserver.disconnect();
      lastEntrance?.removeEventListener('animationend', syncEntrance);
      lastEntrance?.removeEventListener('animationcancel', syncEntrance);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', measure);
      root.removeAttribute('data-scroll-ruler');
    };
  }, [pathname]);

  const seek = (event: PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
    window.scrollTo({ top: progress * (document.documentElement.scrollHeight - window.innerHeight), behavior: 'instant' });
  };
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const range = document.documentElement.scrollHeight - window.innerHeight;
    const page = window.innerHeight * 0.85;
    const positions: Record<string, number> = {
      ArrowDown: window.scrollY + 80,
      ArrowUp: window.scrollY - 80,
      PageDown: window.scrollY + page,
      PageUp: window.scrollY - page,
      Home: 0,
      End: range,
      ' ': window.scrollY + (event.shiftKey ? -page : page),
    };
    if (!(event.key in positions)) return;
    event.preventDefault();
    window.scrollTo({ top: positions[event.key], behavior: 'instant' });
  };

  return <div ref={ref} className="scroll-ruler" hidden role="scrollbar" tabIndex={0}
    aria-label="Page scroll position" aria-controls="portfolio-page" aria-orientation="vertical"
    aria-valuemin={0} aria-valuemax={100} aria-valuenow={0}
    onKeyDown={onKeyDown}
    onPointerDown={event => {
      if (event.button !== 0) return;
      event.preventDefault();
      event.currentTarget.focus({ preventScroll: true });
      event.currentTarget.setPointerCapture(event.pointerId);
      seek(event);
    }}
    onPointerMove={event => { if (event.currentTarget.hasPointerCapture(event.pointerId)) seek(event); }}
    onPointerUp={event => {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    }}>
    <div className="scroll-ruler-ticks" aria-hidden="true">
      {Array.from({ length: 41 }, (_, index) => <span key={index}
        className={`scroll-ruler-tick${index % 10 === 0 ? ' is-major' : index % 5 === 0 ? ' is-medium' : ''}`}>
        {index % 10 === 0 && <span className="scroll-ruler-label">{String(index * 2.5).padStart(2, '0')}</span>}
      </span>)}
    </div>
    <span ref={marker} className="scroll-ruler-marker" aria-hidden="true" />
  </div>;
}
