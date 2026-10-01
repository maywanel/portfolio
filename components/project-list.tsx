import { projects } from '@/lib/portfolio';

export function ProjectList() {
  return (
    <section id="work" className="shell section-pad section-anchor" aria-labelledby="work-title">
      <div className="section-heading">
        <h2 id="work-title">Projects</h2>
        <p>Backend architecture, network programming, and authenticated applications.</p>
      </div>
      <div className="project-list">
        {projects.map((project) => (
          <article className="project" key={project.name} aria-labelledby={`project-${project.name}`}>
            <div className="project-overview">
              <h3 id={`project-${project.name}`}>{project.name}</h3>
              <p className="project-category">{project.category}</p>
              <p className="project-summary">{project.summary}</p>
              <ul className="tag-list" aria-label={`${project.name} technologies`}>
                {project.technologies.map((technology) => <li key={technology}>{technology}</li>)}
              </ul>
              {project.href ? (
                <a className="text-link" href={project.href}>View repository<span className="sr-only"> for {project.name}</span> <span aria-hidden="true">↗</span></a>
              ) : <p className="project-status">{project.status}</p>}
            </div>
            <div className="project-engineering">
              <h4>Implementation</h4>
              <ul className="implementation-list">
                {project.implementation.map((item) => <li key={item}>{item}</li>)}
              </ul>
              {/* Text stays selectable and readable at every size, unlike a raster diagram. */}
              <ol className="architecture-flow" aria-label={`${project.name} architecture overview`}>
                {project.architecture.map((step) => <li key={step}>{step}</li>)}
              </ol>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
