import { profile } from '@/lib/portfolio';
import { HeroBackdrop, MagneticLink } from './motion';

export function Hero() {
  return (
    <section id="top" className="hero section-anchor" aria-labelledby="hero-title">
      <HeroBackdrop />
      <div className="shell hero-stage">
        <div className="hero-copy">
          <div className="hero-identity">
          <h1 id="hero-title">Mohamed <span>El Messaadi</span></h1>
          <p className="hero-role">{profile.role}</p>
          <p className="hero-location"> {profile.location}</p>
          </div>
          <div className="hero-details">
          <p className="hero-description">I build backend services and low-level systems, from non-blocking C++ servers to authenticated APIs.</p>
          <div className="hero-actions flex flex-wrap items-center gap-3" aria-label="Profile and contact links">
            <MagneticLink className="button button-primary" href={`mailto:${profile.email}`}>Email me</MagneticLink>
            <MagneticLink className="button button-outline" href={profile.github}>GitHub</MagneticLink>
            <MagneticLink className="button button-outline" href={profile.resume}>Resume</MagneticLink>
          </div>
          </div>
        </div>
        <div className="hero-side-note">
          <span className="availability"><i aria-hidden="true" /> Open to internships</span>
          <p>Behind every interface,<br />a system that works.</p>
          <a className="text-link" href="#work">Explore my work</a>
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
