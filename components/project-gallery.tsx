'use client';

import { useState } from 'react';
import Image from 'next/image';
import landingPage from '@/taskflow1.png';
import analytics from '@/taskflow2.png';
import teamDashboard from '@/taskflow3.png';

import signIn from '@/PageTurner1.png';
import shelf from '@/PageTurner2.png';
import covers from '@/PageTurner3.png';
import details from '@/PageTurner4.png';
import library from '@/PageTurner5.png';

const galleries = {
  TaskFlow: [
    { src: landingPage, alt: 'TaskFlow landing page' },
    { src: analytics, alt: 'TaskFlow workspace analytics showing workload and completion trends' },
    { src: teamDashboard, alt: 'TaskFlow team dashboard showing open tasks and upcoming deadlines' },
  ],
  PageTurner: [
    { src: signIn, alt: 'PageTurner sign-in page' },
    { src: shelf, alt: 'Reading room with books arranged on a shelf' },
    { src: covers, alt: 'Reading room with books displayed by cover' },
    { src: details, alt: 'Book details for Shatter Me with an option to add it to the library' },
    { src: library, alt: 'Personal library showing Shatter Me and reading progress filters' },
  ],
};

export function ProjectGallery({ name }: { name: keyof typeof galleries }) {
  const slides = galleries[name];
  const [index, setIndex] = useState(0);

  function move(offset: number) {
    setIndex(current => (current + offset + slides.length) % slides.length);
  }

  return <div className="project-art gallery-art" role="group" aria-label={`${name} screenshots`}>
    <div className="gallery-stage">
      <div className="gallery-frame">
        <Image {...slides[index]} />
        <button type="button" aria-label="Previous screenshot" onClick={() => move(-1)}>←</button>
        <button type="button" aria-label="Next screenshot" onClick={() => move(1)}>→</button>
      </div>
    </div>
    <span className="sr-only" role="status">{slides[index].alt}</span>
  </div>;
}
