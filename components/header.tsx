'use client';

import { useEffect, useRef, useState } from 'react';
import { MagneticLink } from './motion';
import { Arrow } from './icons';

const links = [
  { href: '#work', label: 'Work' },
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');
  const menuButton = useRef<HTMLButtonElement>(null);
  const header = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) if (entry.isIntersecting) setActive(`#${entry.target.id}`);
    }, { rootMargin: '-20% 0px -55% 0px' });
    document.querySelectorAll('main section[id]').forEach((section) => observer.observe(section));
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && menuButton.current?.getAttribute('aria-expanded') === 'true') { setOpen(false); menuButton.current?.focus(); }
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!header.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      observer.disconnect();
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, []);

  return (
    <header className="site-header" ref={header}>
      <div className="shell header-inner">
        <a className="brand group" href="#top" aria-label="Mohamed El Messaadi, back to top" onClick={() => setOpen(false)}>
          <span className="monogram" aria-hidden="true">ME<span>.</span></span>
        </a>
        <button className="menu-button" ref={menuButton} aria-expanded={open} aria-controls="main-navigation" onClick={() => setOpen(!open)}>
          <span>{open ? 'Close' : 'Menu'}</span><span className={`menu-lines ${open ? 'is-open' : ''}`} aria-hidden="true"><i /><i /></span>
        </button>
        <nav id="main-navigation" aria-label="Main navigation" className={`main-nav ${open ? 'is-open' : ''}`}>
          {links.map(({ href, label }) => <a key={href} href={href} aria-current={active === href ? 'location' : undefined} onClick={() => setOpen(false)}>{label}</a>)}
          <MagneticLink href="#contact" className="nav-contact button button-outline" onClick={() => setOpen(false)}>Let’s talk <Arrow diagonal width={15} height={15} /></MagneticLink>
        </nav>
      </div>
    </header>
  );
}
