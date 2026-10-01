import Image from 'next/image';
import { Header } from '@/components/header';
import { Hero } from '@/components/hero';
import { ProjectList } from '@/components/project-list';
import { CopyEmail } from '@/components/copy-email';
import { profile, toolkit } from '@/lib/portfolio';

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Header />
      <main id="main" tabIndex={-1}>
        <Hero />
        <section id="about" className="shell section-pad section-anchor" aria-labelledby="about-title">
          <div className="background-layout">
            <h2 id="about-title">Experience &amp;<br className="desktop-break" /> Background</h2>
            <div className="background-copy">
              <h3>Software Engineering Student</h3>
              <p className="education-school">1337 Coding School <span>42 Network</span></p>
              <p className="education-date">October 2024 - present</p>
              <p>I study software engineering through hands-on projects, with a focus on low-level systems programming, networking, containerization, and backend architecture.</p>
              <p>My work spans C and C++ fundamentals, HTTP server internals, and backend services with authentication and access control.</p>
            </div>
          </div>
        </section>
        <section id="skills" className="shell section-pad section-anchor" aria-labelledby="skills-title">
          <div className="section-heading"><h2 id="skills-title">Skills</h2></div>
          <div className="toolkit-grid">
            {toolkit.map((group) => (
              <div className="toolkit-group" key={group.name}>
                <h3>{group.name}</h3>
                <ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
            ))}
          </div>
        </section>
        <ProjectList />
        <section id="contact" className="contact-section section-anchor" aria-labelledby="contact-title">
          <div className="shell contact-layout">
            <div><h2 id="contact-title">Let’s build something solid.</h2><p>I’m looking for a backend internship. Get in touch to talk about your team and the systems you’re building.</p></div>
            <div className="contact-actions"><a className="email-link" href={`mailto:${profile.email}`}>{profile.email}</a><CopyEmail /><div className="contact-links"><a className="text-link" href={profile.github}>GitHub</a>{profile.linkedin && <a className="text-link" href={profile.linkedin}>LinkedIn</a>}<a className="text-link" href={profile.resume}>Resume</a></div></div>
          </div>
        </section>
      </main>
      <footer className="shell site-footer"><a className="footer-brand" href="#top" aria-label="Back to top"><Image src="/brand-mark.webp" alt="" width={32} height={32} /></a><span>© {new Date().getFullYear()} {profile.name}</span><a className="text-link back-top" href="#top">Back to top ↑</a></footer>
    </>
  );
}
