'use client';

import { Children, useEffect, useRef, type ReactNode } from 'react';
import { observeActivity } from './viewport-activity';

type StackMetrics = { starts: number[]; tops: number[]; enabled: boolean };

// Sticky handles layout. Geometry is cached on resize; nearby scroll events
// only write transforms, without React renders or an always-running loop.
export function StackingProjects({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const metrics = useRef<StackMetrics>({ starts: [], tops: [], enabled: false });
  const layers = useRef<HTMLElement[]>([]);

  function update(scroll: number) {
    const { starts, tops, enabled } = metrics.current;
    layers.current.forEach((layer, index) => {
      const next = starts[index + 1];
      const distance = next === undefined ? 0 : next - tops[index + 1] - scroll;
      const progress = enabled && next !== undefined
        ? Math.max(0, Math.min(1, 1 - distance / (starts[index + 1] - starts[index]))) : 0;
      layer.style.transform = progress ? `scale(${1 - progress * 0.025})` : 'none';
    });
  }


  useEffect(() => {
    const stack = ref.current!;
    const header = document.querySelector<HTMLElement>('.site-header');
    const items = Array.from(stack.children) as HTMLElement[];
    layers.current = items.map(item => item.firstElementChild as HTMLElement);
    let frame = 0;
    const measure = () => {
      const compact = window.innerWidth < 801;
      const inset = compact ? 16 : 24;
      const step = Math.min(compact ? 6 : 12, 48 / Math.max(1, items.length - 1));
      // A tall card must scroll past its heading before pinning, so its last
      // line/link can be read. Disabling the whole deck here also disabled the
      // requested interaction on phones and short laptop windows.
      const tallest = Math.max(0, ...items.map(item => item.offsetHeight));
      const depth = step * Math.max(0, items.length - 1);
      const base = Math.min((header?.offsetHeight ?? 100) + inset,
        window.innerHeight - tallest - depth - inset);
      const tops = items.map((_, index) => base + index * step);
      const enabled = true;
      const gap = parseFloat(getComputedStyle(stack).rowGap);
      let start = stack.getBoundingClientRect().top + window.scrollY;
      const starts = items.map(item => {
        const position = start;
        start += item.offsetHeight + gap;
        return position;
      });
      metrics.current = { starts, tops, enabled };
      items.forEach((item, index) => item.style.setProperty('--stack-top', `${tops[index]}px`));
      stack.dataset.stacking = String(enabled);
      update(window.scrollY);
    };
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(measure); };
    const observer = new ResizeObserver(schedule);
    observer.observe(stack);
    if (header) observer.observe(header);
    items.forEach(item => observer.observe(item));
    window.addEventListener('resize', schedule);
    measure();
    let scrollFrame = 0;
    const onScroll = () => {
      if (!scrollFrame) scrollFrame = requestAnimationFrame(() => {
        scrollFrame = 0;
        update(window.scrollY);
      });
    };
    const stopActivity = observeActivity(stack, active => {
      stack.dataset.motionActive = String(active);
      if (active) {
        measure();
        window.addEventListener('scroll', onScroll, { passive: true });
      } else {
        window.removeEventListener('scroll', onScroll);
        cancelAnimationFrame(scrollFrame);
        scrollFrame = 0;
      }
    });
    return () => {
      stopActivity();
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('resize', schedule);
    };
  }, [children]);

  return <div className="project-stack" ref={ref} onFocusCapture={(event) => {
    // Reverse tabbing can focus a link behind the deck. Restore that card's
    // reading position before it receives keyboard interaction.
    const index = layers.current.findIndex(layer => layer.contains(event.target));
    const { enabled, starts, tops } = metrics.current;
    if (enabled && index >= 0 && window.scrollY > starts[index] - tops[index] + 1) {
      window.scrollTo({ top: starts[index] - tops[index], behavior: 'instant' });
    }
  }}>
    {Children.map(children, (child, index) => <div className="project-stack-item" style={{ zIndex: index + 1 }}>
      <div className="project-stack-layer">{child}</div>
    </div>)}
  </div>;
}
