'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { observeActivity } from './viewport-activity';

function useReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduce(query.matches);
    update(); query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return reduce;
}

export function JourneyHero({ children }: { children: ReactNode }) {
  return <section className="journey-image-hero" aria-labelledby="journey-title">
    <div className="journey-image-sticky">
      <div className="journey-image" aria-hidden="true" />
      <div className="journey-image-shade" aria-hidden="true" />
    </div>
    <div className="journey-hero shell">{children}</div>
  </section>;
}

export function JourneyPath({ children, concepts }: { children: ReactNode; concepts: string[] }) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const distance = useMotionValue(0);
  const [travel, setTravel] = useState(0);
  const [horizontal, setHorizontal] = useState(false);
  const scrollYProgress = useMotionValue(0);
  const transform = useTransform(() => `translate3d(${-scrollYProgress.get() * distance.get()}px,0,0)`);
  useEffect(() => {
    const measure = () => {
      const desktop = window.matchMedia('(min-width: 900px)').matches && !reduce;
      setHorizontal(desktop);
      const value = desktop && track.current ? Math.max(0, track.current.scrollWidth - track.current.clientWidth) : 0;
      distance.set(value);
      setTravel(value);
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (track.current) observer.observe(track.current);
    return () => observer.disconnect();
  }, [distance, reduce, horizontal]);
  useEffect(() => {
    if (!horizontal) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const bounds = section.current?.getBoundingClientRect();
      if (bounds) scrollYProgress.set(Math.max(0, Math.min(1, -bounds.top / Math.max(1, bounds.height - innerHeight))));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    return observeActivity(section.current!, active => {
      if (active) {
        update();
        window.addEventListener('scroll', schedule, { passive: true });
        window.addEventListener('resize', schedule);
      } else {
        window.removeEventListener('scroll', schedule);
        window.removeEventListener('resize', schedule);
        cancelAnimationFrame(frame);
        frame = 0;
      }
    });
  }, [horizontal, scrollYProgress]);
  return <section id="chapters" ref={section} className={`journey-path ${horizontal ? 'is-horizontal' : ''}`} style={travel ? { height: `calc(100svh + ${travel}px)` } : undefined} aria-labelledby="path-title">
    <JourneyTape concepts={concepts} />
    <div className="journey-path-sticky">
      <div className="shell journey-path-heading"><h2 id="path-title">Small functions.<br /><span> Real systems.</span></h2><p>Each project raises the stakes. Each correction makes the understanding deeper.</p></div>
      <div className="journey-path-window"><motion.div ref={track} className="journey-path-track" style={{ transform: travel ? transform : 'none' }}>{children}</motion.div></div>
    </div>
  </section>;
}

export function JourneyTape({ concepts }: { concepts: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => observeActivity(ref.current!, active => {
    ref.current?.setAttribute('data-motion-active', String(active));
  }, '0px'), []);
  return <div ref={ref} className="journey-tape" role="region" aria-label="Languages and concepts learned">
    <div className="journey-tape-track">{[0, 1].map((copy) => <div className="journey-tape-copy" key={copy} aria-hidden={copy === 1}>{concepts.map((concept) => <span key={concept}>{concept}</span>)}</div>)}</div>
  </div>;
}
