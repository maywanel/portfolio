'use client';

import { useState } from 'react';
import Image from 'next/image';
import landingPage from '@/taskflow1.png';
import analytics from '@/taskflow2.png';
import teamDashboard from '@/taskflow3.png';

const slides = [
  { src: landingPage, alt: 'TaskFlow landing page' },
  { src: analytics, alt: 'TaskFlow workspace analytics showing workload and completion trends' },
  { src: teamDashboard, alt: 'TaskFlow team dashboard showing open tasks and upcoming deadlines' },
];

export function TaskFlowGallery() {
  const [index, setIndex] = useState(0);

  function move(offset: number) {
    setIndex(current => (current + offset + slides.length) % slides.length);
  }

  return <div className="project-art taskflow-art" role="group" aria-label="TaskFlow screenshots">
    <div className="taskflow-stage">
      <div className="taskflow-frame">
        <Image {...slides[index]} />
        <button type="button" aria-label="Previous screenshot" onClick={() => move(-1)}>←</button>
        <button type="button" aria-label="Next screenshot" onClick={() => move(1)}>→</button>
      </div>
    </div>
    <span className="sr-only" role="status">{slides[index].alt}</span>
  </div>;
}
