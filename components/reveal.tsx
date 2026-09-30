'use client';

import { useEffect, useRef, type ReactNode } from 'react';

export function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element || matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    if (element.getBoundingClientRect().top > window.innerHeight) element.dataset.reveal = 'pending';
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { element.dataset.reveal = 'visible'; observer.disconnect(); }
    }, { threshold: .08, rootMargin: '0px 0px 80px 0px' });
    observer.observe(element);
    const revealOnFocus = () => { element.dataset.reveal = 'visible'; };
    element.addEventListener('focusin', revealOnFocus);
    return () => { observer.disconnect(); element.removeEventListener('focusin', revealOnFocus); };
  }, []);
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>;
}
