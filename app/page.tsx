import { Header } from '@/components/header';
import { SystemSketch } from '@/components/system-sketch';
import { Arrow, GithubIcon } from '@/components/icons';
import { ProjectVisual } from '@/components/project-visual';
import { ProjectDetails } from '@/components/project-details';
import { CopyEmail } from '@/components/copy-email';
import { Reveal } from '@/components/reveal';
import { profile, projects, toolkit } from '@/lib/portfolio';

const steps = [
  { title: 'Understand the problem.', text: 'Start with the inputs, the constraints, and what a correct result should look like.', detail: 'Requirements & boundaries' },
  { title: 'Make the layers clear.', text: 'Separate responsibilities. Keep interfaces explicit and data flow easy to follow.', detail: 'Architecture & contracts' },
  { title: 'Build, then question it.', text: 'Implement the core, debug the edge cases, and use peer review to challenge assumptions.', detail: 'Implementation & review' },
  { title: 'Think beyond the code.', text: 'Consider how services connect, where data lives, and what happens when something fails.', detail: 'Runtime & infrastructure' },
];

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
            <h1 id="hero-title">Built below<br />the <span>surface.</span></h1>
            <p className="hero-intro">I’m Mohamed. I build the systems<br className="desktop-break" /> that make the rest possible.</p>
            <p className="hero-description">From HTTP servers in C++ to secure APIs and containerized services. I care about how things work, and how to make them work well.</p>
            <div className="flex flex-wrap items-center gap-x-7 gap-y-5 hero-actions"><a href="#work" className="button button-primary">Explore my work <Arrow /></a><a href={profile.github} target="_blank" rel="noopener noreferrer" className="quiet-link"><GithubIcon width={18} height={18} /> GitHub <Arrow diagonal width={14} height={14} /></a></div>
            <div className="availability"><span className="status-dot" /><span>Open to internships & engineering opportunities</span></div>
          </div>
          <div className="hero-figure"><SystemSketch /></div>
        </div>
        <div className="shell hero-footer"><span className="eyebrow">1337 Coding School <span className="footer-divider">/</span> 42 Network</span><span className="hero-location"><span className="location-mark" aria-hidden="true" />{profile.location}</span><a href="#work" className="scroll-cue">Scroll to explore <Arrow width={15} height={15} /></a></div>
      </section>

      <section id="work" className="section-pad shell section-anchor" aria-labelledby="work-title">
        <Reveal><div className="section-heading"><div><span className="section-label"><span>01</span> / Selected work</span><h2 id="work-title">Proof in the projects.</h2></div><p>Real projects. Different layers of the stack.<br />A look at the decisions behind the code.</p></div></Reveal>
        <Reveal><article className="featured-project project-card">
          <div className="featured-visual"><div className="project-index"><span>PROJECT {featured.number}</span><span>Systems engineering</span></div><ProjectVisual type={featured.visual} /></div>
          <div className="featured-content"><div className="project-meta"><span>{featured.category}</span><span>{featured.date}</span></div><h3>{featured.name}</h3><p className="project-summary">{featured.summary}</p><div className="featured-note"><span className="note-rule" /><p>Request parsing. Nonblocking connections.<br />Every layer, understood and implemented.</p></div><ul className="tag-list" aria-label="Webserv technologies">{featured.technologies.map((tag) => <li key={tag}>{tag}</li>)}</ul><a className="source-link" href={featured.href} target="_blank" rel="noopener noreferrer">Explore repository <Arrow diagonal width={17} height={17} /><span className="sr-only"> for Webserv</span></a><ProjectDetails project={featured} /></div>
        </article></Reveal>
        <div className="project-grid">{projects.slice(1).map((project) => <Reveal key={project.number}><article className="project-card secondary-project"><div className="project-index"><span>PROJECT {project.number}</span><span>{project.status ? 'In development' : project.date}</span></div><ProjectVisual type={project.visual} /><div className="project-body"><p className="project-category">{project.category}</p><h3>{project.name}</h3><p className="project-summary">{project.summary}</p><ul className="tag-list" aria-label={`${project.name} technologies`}>{project.technologies.map((tag) => <li key={tag}>{tag}</li>)}</ul><div className="project-source">{project.href ? <a className="source-link" href={project.href} target="_blank" rel="noopener noreferrer">Explore repository <Arrow diagonal width={16} height={16} /><span className="sr-only"> for {project.name}</span></a> : <span className="private-repo"><span className="status-dot" />Private repository · in progress</span>}</div><ProjectDetails project={project} /></div></article></Reveal>)}</div>
        <Reveal><div className="work-footnote"><span>More experiments and source code on GitHub.</span><a className="quiet-link" href={profile.github} target="_blank" rel="noopener noreferrer">github.com/maywanel <Arrow diagonal width={15} height={15} /></a></div></Reveal>
      </section>

      <section id="approach" className="approach-section section-pad section-anchor" aria-labelledby="approach-title"><div className="shell">
        <Reveal><div className="section-heading"><div><span className="section-label"><span>02</span> / How I work</span><h2 id="approach-title">Understand it.<br />Then build it properly.</h2></div><p>Good backend work starts before the first endpoint. This is the approach I bring to each project.</p></div></Reveal>
        <div className="process-grid">{steps.map((step, index) => <Reveal key={step.title}><div className="process-step"><div className="process-number"><span>0{index + 1}</span><Arrow width={18} height={18} /></div><h3>{step.title}</h3><p>{step.text}</p><span className="process-detail">{step.detail}</span></div></Reveal>)}</div>
        <Reveal><div className="principle"><span className="principle-symbol" aria-hidden="true">{'{ }'}</span><p>The goal is simple: <span>code that makes sense, and systems you can reason about.</span></p></div></Reveal>
      </div></section>

      <section id="about" className="section-pad shell section-anchor" aria-labelledby="about-title"><div className="about-layout">
        <Reveal><div className="about-heading"><span className="section-label"><span>03</span> / The person behind the code</span><h2 id="about-title">Curiosity,<br />put to work.</h2><div className="about-monogram" aria-hidden="true"><span>m<span>.</span></span><div className="monogram-axis axis-x" /><div className="monogram-axis axis-y" /><span className="monogram-coordinate">BEN GUERIR / MOROCCO</span></div><div className="about-caption"><span>{profile.name}</span><span>{profile.location}</span></div></div></Reveal>
        <Reveal><div className="about-copy"><p className="about-lead">I like knowing what happens after a request leaves the browser.</p><p>How it’s parsed. Who’s allowed to make it. Where the data goes. That curiosity is what drew me to backend development, and it still shapes how I learn and build.</p><p>I’m a software engineering student at <strong>1337 Coding School</strong>, part of the 42 Network. Since October 2024, I’ve been learning through projects, debugging, and peer review, moving from low-level programming to application backends and infrastructure.</p><p>Outside the core curriculum, I explore deployment and automation through DevOps workshops, and security through CTF challenges. My next step is to bring that foundation to a team and contribute to software people rely on.</p><div className="education-note"><span className="education-number">42</span><div><h3>1337 Coding School</h3><p>Software engineering · October 2024 — present</p><span>Project-based. Peer-reviewed. Always learning.</span></div></div></div></Reveal>
      </div>
      <Reveal><div className="toolkit-heading"><h3>A practical toolkit.</h3><p>Chosen through building, not collecting.</p></div><div className="toolkit-grid">{toolkit.map((group) => <div className="toolkit-group" key={group.name}><h4>{group.name}</h4><p>{group.description}</p><ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul></div>)}</div></Reveal>
      </section>

      <section id="contact" className="contact-section section-anchor" aria-labelledby="contact-title"><div className="shell">
        <Reveal><div className="contact-top"><span className="section-label"><span>04</span> / Let’s work together</span><span className="contact-availability"><span className="status-dot" />Open to opportunities</span></div><div className="contact-layout"><div><h2 id="contact-title">Your next project.<br /><span>A solid foundation.</span></h2><p>Looking for someone who cares about what’s behind the interface?<br className="desktop-break" /> Let’s talk about your team, your systems, and where I can help.</p><div className="flex flex-wrap items-center gap-6 contact-actions"><a className="button button-primary" href={`mailto:${profile.email}`}>Start a conversation <Arrow diagonal /></a><CopyEmail /></div></div><div className="contact-aside"><span className="eyebrow">A direct line</span><a className="email-link" href={`mailto:${profile.email}`}>{profile.email}<Arrow diagonal width={16} height={16} /></a><a className="quiet-link" href={profile.github} target="_blank" rel="noopener noreferrer"><GithubIcon width={18} height={18} />Find me on GitHub<Arrow diagonal width={14} height={14} /></a><span className="contact-location">Based in {profile.location}.</span></div></div></Reveal>
        <footer className="site-footer"><a className="footer-brand" href="#top">m<span>.</span><span className="sr-only"> Back to top</span></a><span>© 2026 Mohamed El Messaadi</span><span className="footer-note">Built with intention. From the ground up.</span><a className="back-top" href="#top">Back to top <Arrow width={15} height={15} /></a></footer>
      </div></section>
    </main>
  </>;
}
