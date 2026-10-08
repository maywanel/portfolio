'use client';

import { useRef, type ReactNode } from 'react';
import {
  motion, useMotionTemplate, useReducedMotion, useScroll, useSpring, useTransform,
  type Variants,
} from 'framer-motion';

// Shared timing keeps the entrance, hover, and scroll choreography consistent.
export const revealVariants: Variants = {
  rest: { opacity: 1, transform: 'translateY(0px)' },
  enter: {
    opacity: [0.55, 1],
    transform: ['translateY(24px)', 'translateY(0px)'],
    transition: { duration: 0.65, ease: [0.23, 1, 0.32, 1] },
  },
};
const spring = { type: 'spring' as const, duration: 0.5, bounce: 0.2 };

function finePointer() {
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}

export function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  // Server HTML is visible. Motion enhances it without hiding no-JS content.
  return <motion.div className={`motion-reveal ${className}`} variants={revealVariants} initial={false}
    whileInView={reduce ? 'rest' : 'enter'} viewport={{ once: true, amount: 0.12 }}>
    {children}
  </motion.div>;
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
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const transform = useTransform(scrollYProgress, [0, 1], ['translate3d(0,0,0)', 'translate3d(-5%,90px,0)']);
  return <div className="hero-backdrop" ref={ref} aria-hidden="true">
    <motion.div className="hero-type-layer hero-type-back" style={{ transform: reduce ? 'none' : transform }}>
      <div className="hero-word-mask"><div className="hero-display hero-backend">BACKEND</div></div>
    </motion.div>
    <div className="portrait-frame">
      {/* Preserve the supplied transparent portrait at its original aspect ratio. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="hero-portrait" src="/me.png" alt="" width="1080" height="1448" fetchPriority="high" />
    </div>
    <motion.div className="hero-type-layer hero-type-front" style={{ transform: reduce ? 'none' : transform }}>
      <div className="hero-word-mask"><div className="hero-display hero-developer">DEVELOPER</div></div>
    </motion.div>
  </div>;
}
