import { ArrowUpRight } from '@phosphor-icons/react/dist/ssr';
import { profile } from '@/lib/portfolio';
import { HeroBackdrop, MagneticLink } from './motion';

export function Hero() {
  return (
    <section id="top" className="hero section-anchor" aria-labelledby="hero-title">
      <HeroBackdrop />
      <div className="shell hero-stage">
        <div className="portrait-frame">
          {/* Responsive derivatives of the supplied transparent portrait; preserve its aspect ratio. */}
          <picture>
            <source type="image/webp" srcSet="/portrait-640.webp 640w, /portrait-1200.webp 1200w" sizes="(max-width: 700px) 95vw, 49vw" />
            <img className="hero-portrait" src="/me.png" width={1200} height={1600} alt="Mohamed El Messaadi" fetchPriority="high" />
          </picture>
        </div>
        <div className="hero-copy">
          <h1 id="hero-title">Mohamed <span>El Messaadi</span></h1>
          <p className="hero-role">{profile.role}</p>
          <p className="hero-location"><span aria-hidden="true">📍</span> {profile.location}</p>
          <p className="hero-description">I build backend services and low-level systems, from non-blocking C++ servers to authenticated APIs.</p>
          <div className="hero-actions flex flex-wrap items-center gap-3" aria-label="Profile and contact links">
            <MagneticLink className="button button-primary" href={`mailto:${profile.email}`}>Email me <ArrowUpRight aria-hidden="true" size={17} /></MagneticLink>
            <MagneticLink className="button button-outline" href={profile.github}>GitHub <ArrowUpRight aria-hidden="true" size={17} /></MagneticLink>
            <MagneticLink className="button button-outline" href={profile.resume}>Resume <ArrowUpRight aria-hidden="true" size={17} /></MagneticLink>
          </div>
        </div>
        <div className="hero-side-note">
          <span className="availability"><i aria-hidden="true" /> Open to internships</span>
          <p>Behind every interface,<br />a system that works.</p>
          <a className="text-link" href="#work">Explore my work <ArrowUpRight aria-hidden="true" size={20} /></a>
        </div>
      </div>
      <div className="shell stats-bar" aria-label="Background at a glance">
        <div><strong>1337</strong><span>Coding School /<br />42 Network</span></div>
        <div><strong>3+</strong><span>Enterprise-Level<br />Architecture Projects</span></div>
        <div><strong>C/C++</strong><span>Low-Level<br />Systems Focus</span></div>
      </div>
    </section>
  );
}
