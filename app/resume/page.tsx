import type { Metadata } from 'next';
import Link from 'next/link';
import { profile, projects, toolkit } from '@/lib/portfolio';
import { PrintResume } from '@/components/print-resume';

export const metadata: Metadata = {
  title: `${profile.name} | Resume`,
  description: `Resume of ${profile.name}, ${profile.role} in ${profile.location}.`,
  alternates: { canonical: '/resume/' },
};

export default function Resume() {
  return (
    <main className="shell resume">
      <nav className="resume-actions" aria-label="Resume actions"><Link className="text-link" href="/">← Portfolio</Link><PrintResume /></nav>
      <header><h1>{profile.name}</h1><p className="hero-role">{profile.role}</p><p>{profile.location}</p><div className="resume-contact"><a href={`mailto:${profile.email}`}>{profile.email}</a><a href={profile.github}>github.com/maywanel</a>{profile.linkedin && <a href={profile.linkedin}>LinkedIn</a>}</div></header>
      <section aria-labelledby="resume-background"><h2 id="resume-background">Education &amp; Focus</h2><h3>Software Engineering Student, 1337 Coding School</h3><p>October 2024 - present · 42 Network</p><p>Low-level systems programming, networking, containerization, and backend architecture.</p></section>
      <section aria-labelledby="resume-skills"><h2 id="resume-skills">Technical Skills</h2>{toolkit.map((group) => <p key={group.name}><strong>{group.name}:</strong> {group.items.join(', ')}</p>)}</section>
      <section aria-labelledby="resume-projects"><h2 id="resume-projects">Projects</h2>{projects.map((project) => <article key={project.name}><h3>{project.name}</h3><p>{project.summary}</p><ul>{project.implementation.map((item) => <li key={item}>{item}</li>)}</ul>{project.href ? <a className="text-link" href={project.href}>{project.href.replace('https://', '')}</a> : <p>{project.status}</p>}</article>)}</section>
    </main>
  );
}
