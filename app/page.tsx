import { ArrowUpRight, ArrowUp } from '@phosphor-icons/react/dist/ssr';
import { Header } from '@/components/header';
import { Hero } from '@/components/hero';
import { ProjectList } from '@/components/project-list';
import { Capabilities } from '@/components/capabilities';
import { CopyEmail } from '@/components/copy-email';
import { MagneticLink, Reveal } from '@/components/motion';
import { profile } from '@/lib/portfolio';
import { IntroOverlay } from '@/components/intro-overlay';

// Content remains server-rendered; interactive motion is isolated in leaf components.
export default function Home() {
  return <>
    <IntroOverlay />
    <a className="skip-link" href="#main">Skip to content</a>
    <Header />
    <main id="main" className="home-page" tabIndex={-1}>
      <Hero />
      <ProjectList />
      <section id="about" className="about-section section-anchor" aria-labelledby="about-title">
        <div className="shell about-layout">
          <Reveal><h2 id="about-title">Curiosity at<br />the <span className="muted-heading">core.</span></h2></Reveal>
          <Reveal className="about-copy">
            <p className="about-lead">I like knowing what happens<br className="desktop-break" /> beneath the surface.</p>
            <p>I’m a Software Engineering Student at <strong>1337 Coding School</strong>, part of the 42 Network, in Ben Guerir, Morocco.</p>
            <p>My focus is low-level systems programming, networking, containerization, and backend architecture. I learn by building the pieces, understanding their constraints, and making them work together.</p>
            <div className="education-line"><span>1337 Coding School</span><span>October 2024 - present</span></div>
          </Reveal>
        </div>
      </section>
      <Capabilities />
      <section id="contact" className="contact-section section-anchor" aria-labelledby="contact-title">
        <div className="shell">
          <Reveal><div className="contact-heading"><h2 id="contact-title">Let’s build<br />something <span>solid.</span></h2><MagneticLink className="contact-orb" href={`mailto:${profile.email}`} label="Start a conversation by email"><ArrowUpRight size={58} weight="light" aria-hidden="true" /></MagneticLink></div>
            <div className="contact-layout"><p>I’m looking for a backend internship. Get in touch to talk about your team and the systems you’re building.</p><div className="contact-actions"><a className="email-link" href={`mailto:${profile.email}`}>{profile.email}</a><CopyEmail /><div className="contact-links"><a className="text-link" href={profile.github}>GitHub <ArrowUpRight size={17} aria-hidden="true" /></a><a className="text-link" href={profile.resume}>Resume <ArrowUpRight size={17} aria-hidden="true" /></a></div></div></div>
          </Reveal>
          <footer className="site-footer"><span>© 2026 {profile.name}</span><a className="text-link back-top" href="#top">Back to top <ArrowUp size={16} aria-hidden="true" /></a></footer>
        </div>
      </section>
    </main>
  </>;
}
