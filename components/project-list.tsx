import { Globe, Books, LockSimple, Cube, TerminalWindow } from '@phosphor-icons/react/dist/ssr';
import { TaskFlowGallery } from './taskflow-gallery';
import { projects } from '@/lib/portfolio';
import { MagneticLink, Reveal, TiltCard } from './motion';
import { StackingProjects } from './stacking-projects';

function ProjectArt({ name }: { name: string }) {
  if (name === 'TaskFlow') {
    return <TaskFlowGallery />;
  }
  if (name === 'Webserv') {
    return <div className="project-art server-art" aria-hidden="true">
      <div className="server-orbits"><span /><span /><Globe size={104} weight="thin" /></div>
      <div className="protocol-label"><strong>HTTP/1.1</strong><span>request → multiplex → respond</span></div>
    </div>;
  }
  if (name === 'cube3d' || name === 'minishell') {
    const graphics = name === 'cube3d';
    const Icon = graphics ? Cube : TerminalWindow;
    return <div className="project-art server-art" aria-hidden="true">
      <div className="server-orbits"><span /><span /><Icon size={104} weight="thin" /></div>
      <div className="protocol-label"><strong>{graphics ? 'Raycasting' : 'minishell'}</strong><span>{graphics ? 'map → rays → render' : 'parse → pipe → execute'}</span></div>
    </div>;
  }
  return <div className="project-art library-art" aria-hidden="true">
    <div className="book-object"><Books size={138} weight="thin" /></div><div className="library-caption"><span>PageTurner</span><span>Discover. Organize. Read.</span></div>
  </div>;
}

export function ProjectList() {
  return <section id="work" className="shell section-pad section-anchor" aria-labelledby="work-title">
    <Reveal className="section-heading editorial-heading">
      <h2 id="work-title">Selected <span className="muted-heading">work.</span></h2>
      <p>Built from first principles. Designed for what comes next.</p>
    </Reveal>
    <StackingProjects>
      {projects.map((project, index) => (
        <TiltCard key={project.name} className={`project-card project-card-featured${index > 0 ? ' project-card-secondary' : ''}`} labelId={`project-${project.name}`}>
            <ProjectArt name={project.name} />
            <div className="project-content">
              <div className="project-title-row"><h3 id={`project-${project.name}`}>{project.name}</h3></div>
              <p className="project-category">{project.category}</p>
              <p className="project-summary">{project.summary}</p>
              <ul className="tag-list" aria-label={`${project.name} technologies`}>{project.technologies.map((technology) => <li key={technology}>{technology}</li>)}</ul>
              <div className="project-engineering"><h4>Implementation</h4><ul className="implementation-list">{project.implementation.map((item) => <li key={item}>{item}</li>)}</ul></div>
              {project.href ? <MagneticLink className="text-link project-link" href={project.href}>View repository<span className="sr-only"> for {project.name}</span></MagneticLink>
                : <p className="project-status"><LockSimple size={15} aria-hidden="true" />{project.status}</p>}
            </div>
          </TiltCard>
      ))}
    </StackingProjects>
  </section>;
}
