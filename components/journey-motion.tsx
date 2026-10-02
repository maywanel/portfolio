'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

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

export function JourneyVideo({ children }: { children: ReactNode }) {
  const section = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  const [failed, setFailed] = useState(false);
  const desired = useRef(0);
  const seek = useCallback(() => {
    const element = video.current;
    if (!element || element.readyState < 1 || element.seeking) return;
    const time = reduce ? 0.5 : Math.min(desired.current * 2, Math.max(0, element.duration - 0.04), 2);
    if (Math.abs(element.currentTime - time) > 0.015) element.currentTime = time;
  }, [reduce]);
  const update = useCallback(() => {
    const bounds = section.current?.getBoundingClientRect();
    if (bounds) desired.current = Math.max(0, Math.min(1, (88 - bounds.top) / Math.max(1, bounds.height - window.innerHeight + 88)));
    seek();
  }, [seek]);
  useEffect(() => {
    let frame = 0;
    const tick = () => { update(); frame = requestAnimationFrame(tick); };
    const observer = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(frame);
      if (entry.isIntersecting && !reduce) tick();
      else update();
    });
    if (section.current) observer.observe(section.current);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, [reduce, update]);
  return <section ref={section} className="journey-video-hero" aria-labelledby="journey-title">
    <div className="journey-video-sticky">
      {!failed && <video ref={video} className="journey-video" src="/journey-hero.mp4" poster="/journey-hero.jpg" muted playsInline preload="auto" aria-hidden="true" onLoadedData={update} onSeeked={seek} onError={() => setFailed(true)} />}
      <div className="journey-video-shade" />
      <div className="journey-hero shell">{children}</div>
    </div>
  </section>;
}

export function JourneyPath({ children }: { children: ReactNode }) {
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
    const tick = () => {
      const bounds = section.current?.getBoundingClientRect();
      if (bounds) scrollYProgress.set(Math.max(0, Math.min(1, -bounds.top / Math.max(1, bounds.height - innerHeight))));
      frame = requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(frame);
      if (entry.isIntersecting) tick();
    });
    if (section.current) observer.observe(section.current);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, [horizontal, scrollYProgress]);
  return <section id="chapters" ref={section} className={`journey-path ${horizontal ? 'is-horizontal' : ''}`} style={travel ? { height: `calc(100svh + ${travel}px)` } : undefined} aria-labelledby="path-title">
    <div className="journey-path-sticky">
      <div className="shell journey-path-heading"><h2 id="path-title">Small functions.<br /><span> Real systems.</span></h2><p>Each project raises the stakes. Each correction makes the understanding deeper.</p></div>
      <div className="journey-path-window"><motion.div ref={track} className="journey-path-track" style={{ transform: travel ? transform : 'none' }}>{children}</motion.div></div>
    </div>
  </section>;
}

export function JourneyTape({ concepts }: { concepts: string[] }) {
  return <div className="journey-tape" role="region" aria-label="Languages and concepts learned">
    <div className="journey-tape-track">{[0, 1].map((copy) => <div className="journey-tape-copy" key={copy} aria-hidden={copy === 1}>{concepts.map((concept) => <span key={concept}>{concept}</span>)}</div>)}</div>
  </div>;
}
