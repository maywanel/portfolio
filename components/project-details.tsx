'use client';

import { useState } from 'react';
import type { Project } from '@/lib/portfolio';

export function ProjectDetails({ project }: { project: Project }) {
  const [open, setOpen] = useState(false);
  return <div className="project-details">
    <button className="details-trigger" aria-expanded={open} aria-controls={`project-details-${project.number}`} onClick={() => setOpen(!open)}><span>{open ? 'Close engineering notes' : 'Engineering notes'}<span className="sr-only"> for {project.name}</span></span><span className={`plus-icon ${open ? 'is-open' : ''}`} aria-hidden="true" /></button>
    <div id={`project-details-${project.number}`} className={`details-panel ${open ? 'is-open' : ''}`} inert={!open} aria-hidden={!open}>
      <div className="details-overflow"><div className="details-content"><p>{project.detail}</p></div></div>
    </div>
  </div>;
}
