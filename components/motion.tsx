'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import {
  motion, useMotionTemplate, useReducedMotion, useSpring,
} from 'framer-motion';
import { observeActivity } from './viewport-activity';

const spring = { type: 'spring' as const, duration: 0.5, bounce: 0.2 };

function finePointer() {
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}

export function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let animation: Animation | undefined;
    let started = false;
    let disposed = false;
    let active = false;
    const stop = observeActivity(ref.current!, nearby => {
      active = nearby;
      if (nearby && !started) {
        started = true;
        // Fetch the reveal implementation only as its first section approaches.
        void import('./section-reveal').then(({ revealSection }) => {
          if (disposed || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
          animation = revealSection(ref.current!);
          if (!active) animation.pause();
        }).catch(() => { /* Content stays visible if the enhancement cannot load. */ });
      } else if (animation) {
        if (matchMedia('(prefers-reduced-motion: reduce)').matches) animation.finish();
        else if (nearby && animation.playState === 'paused') animation.play();
        else if (!nearby && animation.playState === 'running') animation.pause();
      }
    }, '100px');
    return () => { disposed = true; stop(); animation?.cancel(); };
  }, []);
  return <div ref={ref} className={`motion-reveal ${className}`}>{children}</div>;
}

export function MagneticLink({ children, href, className = '', onClick, label }: {
  children: ReactNode; href: string; className?: string; onClick?: () => void; label?: string;
}) {
  const reduce = useReducedMotion();
  const x = useSpring(0, spring);
  const y = useSpring(0, spring);
  const transform = useMotionTemplate`translate3d(${x}px, ${y}px, 0)`;
  const reset = () => { x.set(0); y.set(0); };
  return <motion.a href={href} className={`magnetic-link ${className}`} onClick={onClick} aria-label={label}
    style={{ transform: reduce ? 'none' : transform }}
    onPointerMove={(event) => {
      if (reduce || event.pointerType !== 'mouse' || !finePointer()) return;
      const bounds = event.currentTarget.getBoundingClientRect();
      x.set(Math.max(-7, Math.min(7, (event.clientX - bounds.left - bounds.width / 2) * 0.12)));
      y.set(Math.max(-5, Math.min(5, (event.clientY - bounds.top - bounds.height / 2) * 0.16)));
    }} onPointerLeave={reset} onPointerCancel={reset} onFocus={reset} onBlur={reset}>
    {children}
  </motion.a>;
}

export function TiltCard({ children, className = '', labelId }: { children: ReactNode; className?: string; labelId: string }) {
  const reduce = useReducedMotion();
  const x = useSpring(0, spring);
  const y = useSpring(0, spring);
  const transform = useMotionTemplate`perspective(1100px) rotateX(${x}deg) rotateY(${y}deg)`;
  const reset = () => { x.set(0); y.set(0); };
  return <motion.article className={`tilt-card ${className}`} aria-labelledby={labelId}
    style={{ transform: reduce ? 'none' : transform }}
    onPointerMove={(event) => {
      if (reduce || event.pointerType !== 'mouse' || !finePointer()) return;
      const rect = event.currentTarget.getBoundingClientRect();
      x.set(-(event.clientY - rect.top - rect.height / 2) / rect.height * 3);
      y.set((event.clientX - rect.left - rect.width / 2) / rect.width * 3);
    }} onPointerLeave={reset} onPointerCancel={reset} onFocusCapture={reset}>
    {children}
  </motion.article>;
}

export function HeroBackdrop() {
  return <div className="hero-backdrop" aria-hidden="true">
    <div className="hero-type-layer hero-type-back">
      <div className="hero-word-mask"><div className="hero-display hero-backend">BACKEND</div></div>
    </div>
    <div className="portrait-frame">
      {/* Preserve the supplied transparent portrait at its original aspect ratio. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="hero-portrait" src="/me.png" alt="" width="1080" height="1448" fetchPriority="high" />
    </div>
    <div className="hero-type-layer hero-type-front">
      <div className="hero-word-mask"><div className="hero-display hero-developer">DEVELOPER</div></div>
    </div>
  </div>;
}
