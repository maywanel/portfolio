import Image from 'next/image';
import { Header } from '@/components/header';
import { SystemSketch } from '@/components/system-sketch';
import { Arrow, GithubIcon } from '@/components/icons';
import { ProjectVisual } from '@/components/project-visual';
import { ProjectDetails } from '@/components/project-details';
import { CopyEmail } from '@/components/copy-email';
import { Reveal } from '@/components/reveal';
import { profile, projects, toolkit } from '@/lib/portfolio';

export default function Home() {
  const featured = projects[0];
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <Header />
    <main id="main">
      <section id="top" className="hero section-anchor" aria-labelledby="hero-title">
        <div className="shell hero-layout">
          <div className="hero-copy">
            <div className="hero-eyebrow eyebrow"><span className="small-rule" />Backend / Systems / Infrastructure</div>
            <h1 id="hero-title">Mohamed<br /> <span>El Messaadi</span></h1>
            <p className="hero-intro">I’m a backend developer and a 1337 student.</p>
            <p className="hero-description">I build C++ HTTP servers, Java and Node.js APIs, and Docker services.</p>
            <div className="flex flex-wrap items-center gap-x-7 gap-y-5 hero-actions"><a href="#work" className="button button-primary">Explore my work <Arrow /></a><a href={profile.github} target="_blank" rel="noopener noreferrer" className="quiet-link"><GithubIcon width={18} height={18} /> GitHub <Arrow diagonal width={14} height={14} /></a></div>
            <div className="availability"><span className="status-dot" /><span>Open to internships</span></div>
          </div>
          <div className="hero-figure"><SystemSketch /></div>
        </div>
        <div className="shell hero-footer"><span className="eyebrow">1337 Coding School <span className="footer-divider">/</span> 42 Network</span><span className="hero-location"><span className="location-mark" aria-hidden="true" />{profile.location}</span><a href="#work" className="scroll-cue">Scroll to explore <Arrow width={15} height={15} /></a></div>
      </section>

      <section id="work" className="section-pad shell section-anchor" aria-labelledby="work-title">
        <Reveal><div className="section-heading"><div><h2 id="work-title">Projects</h2></div><p>These are the projects I’ve worked on, with notes about what gave me trouble.</p></div></Reveal>
        <Reveal><article className="featured-project project-card">
          <div className="featured-visual"><div className="project-index"><span>PROJECT {featured.number}</span><span>Systems engineering</span></div><ProjectVisual type={featured.visual} /></div>
          <div className="featured-content"><div className="project-meta"><span>{featured.category}</span><span>{featured.date}</span></div><h3>{featured.name}</h3><p className="project-summary">{featured.summary}</p><div className="featured-note"><span className="note-rule" /><p>It handles request parsing, routing, CGI execution, and file uploads.</p></div><ul className="tag-list" aria-label="Webserv technologies">{featured.technologies.map((tag) => <li key={tag}>{tag}</li>)}</ul><a className="source-link" href={featured.href} target="_blank" rel="noopener noreferrer">Explore repository <Arrow diagonal width={17} height={17} /><span className="sr-only"> for Webserv</span></a><ProjectDetails project={featured} /></div>
        </article></Reveal>
        <div className="project-grid">{projects.slice(1).map((project) => <Reveal key={project.number}><article className="project-card secondary-project"><div className="project-index"><span>PROJECT {project.number}</span><span>{project.status ? 'In development' : project.date}</span></div><ProjectVisual type={project.visual} /><div className="project-body"><p className="project-category">{project.category}</p><h3>{project.name}</h3><p className="project-summary">{project.summary}</p><ul className="tag-list" aria-label={`${project.name} technologies`}>{project.technologies.map((tag) => <li key={tag}>{tag}</li>)}</ul><div className="project-source">{project.href ? <a className="source-link" href={project.href} target="_blank" rel="noopener noreferrer">Explore repository <Arrow diagonal width={16} height={16} /><span className="sr-only"> for {project.name}</span></a> : <span className="private-repo"><span className="status-dot" />Private repository · in progress</span>}</div><ProjectDetails project={project} /></div></article></Reveal>)}</div>
        <Reveal><div className="work-footnote"><span>More experiments and source code on GitHub.</span><a className="quiet-link" href={profile.github} target="_blank" rel="noopener noreferrer">github.com/maywanel <Arrow diagonal width={15} height={15} /></a></div></Reveal>
      </section>

      <section id="about" className="section-pad shell section-anchor" aria-labelledby="about-title"><div className="about-layout">
        <Reveal><div className="about-heading"><h2 id="about-title">About</h2><div className="about-monogram" aria-hidden="true"><Image className="about-logo" src="/mylogo.png" alt="" width={160} height={160} /><div className="monogram-axis axis-x" /><div className="monogram-axis axis-y" /><span className="monogram-coordinate">BEN GUERIR / MOROCCO</span></div><div className="about-caption"><span>{profile.name}</span><span>{profile.location}</span></div></div></Reveal>
        <Reveal><div className="about-copy"><p className="about-lead">I’m a 1337 student in Ben Guerir, Morocco.</p><p>I’ve been studying software engineering at <strong>1337 Coding School</strong>, part of the 42 Network, since October 2024.</p><p>I’ve also taken part in DevOps workshops on deployment and automation, and CTF challenges.</p><div className="education-note"><span className="education-number">42</span><div><h3>1337 Coding School</h3><p>Software engineering · October 2024 — present</p></div></div></div></Reveal>
      </div>
      <Reveal><div className="toolkit-heading"><h3>Tools I use</h3></div><div className="toolkit-grid">{toolkit.map((group) => <div className="toolkit-group" key={group.name}><h4>{group.name}</h4><p>{group.description}</p><ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul></div>)}</div></Reveal>
      </section>

      <section id="contact" className="contact-section section-anchor" aria-labelledby="contact-title"><div className="shell">
        <Reveal><div className="contact-top"><span className="contact-availability"><span className="status-dot" />Looking for an internship</span></div><div className="contact-layout"><div><h2 id="contact-title">Contact</h2><p>I’m looking for a backend internship; email me if your team is hiring.</p><div className="flex flex-wrap items-center gap-6 contact-actions"><a className="button button-primary" href={`mailto:${profile.email}`}>Email me <Arrow diagonal /></a><CopyEmail /></div></div><div className="contact-aside"><span className="eyebrow">Email</span><a className="email-link" href={`mailto:${profile.email}`}>{profile.email}<Arrow diagonal width={16} height={16} /></a><a className="quiet-link" href={profile.github} target="_blank" rel="noopener noreferrer"><GithubIcon width={18} height={18} />Find me on GitHub<Arrow diagonal width={14} height={14} /></a><span className="contact-location">Based in {profile.location}.</span></div></div></Reveal>
        <footer className="site-footer"><a className="footer-brand" href="#top"><Image src="/mylogo.png" alt="" width={32} height={32} /><span className="sr-only"> Back to top</span></a><span>© 2026 Mohamed El Messaadi</span><a className="back-top" href="#top">Back to top <Arrow width={15} height={15} /></a></footer>
      </div></section>
    </main>
  </>;
}
