import { profile } from '@/lib/portfolio';

export function Hero() {
  return (
    <section id="top" className="hero section-anchor" aria-labelledby="hero-title">
      <div className="shell hero-layout">
        <div className="hero-copy">
          <h1 id="hero-title">Mohamed <span>El Messaadi</span></h1>
          <p className="hero-role">{profile.role}</p>
          <p className="hero-location"><span aria-hidden="true">📍</span> {profile.location}</p>
          <p className="hero-description">I build backend services and low-level systems, from non-blocking C++ servers to authenticated APIs.</p>
          <div className="hero-actions" aria-label="Profile and contact links">
            <a className="button button-primary" href={`mailto:${profile.email}`}>Email me</a>
            <a className="text-link" href={profile.github}>GitHub</a>
            {profile.linkedin && <a className="text-link" href={profile.linkedin}>LinkedIn</a>}
            <a className="text-link" href={profile.resume}>Resume</a>
          </div>
        </div>
        <aside className="hero-background" aria-label="Background and availability">
          <p className="availability">Open to backend internships</p>
          <h2>Built from the fundamentals.</h2>
          <p>Software Engineering Student at <strong>1337 Coding School</strong>.</p>
          <p>My focus: systems programming, networking, containerization, and backend architecture.</p>
          <a className="text-link" href="#work">Explore my projects <span aria-hidden="true">↗</span></a>
        </aside>
      </div>
    </section>
  );
}
