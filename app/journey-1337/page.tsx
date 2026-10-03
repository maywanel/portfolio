import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowDown, ArrowLeft, ArrowUpRight, BracketsCurly, Cpu, GitBranch, TerminalWindow } from '@phosphor-icons/react/dist/ssr';
import { Header } from '@/components/header';
import { Reveal } from '@/components/motion';
import { JourneyVideo, JourneyPath, JourneyTape } from '@/components/journey-motion';
import { profile } from '@/lib/portfolio';

export const metadata: Metadata = {
  title: 'My journey at 1337 | Mohamed El Messaadi',
  description: 'How project work at 1337 Coding School shaped my path from C and C++ fundamentals to backend systems.',
};

const chapters = [
  { number: '01', period: 'MEMORY & PRECISION', title: 'the wake up', icon: TerminalWindow,
    body: 'The first steps in C are about understanding memory and how it works. It\'s not just about writing code, but about thinking about the system and how it behaves.',
    proof: 'C · pointers · memory ownership', lesson: 'Learn to make one function dependable and bulletproof before building on top of it.' },
  { number: '02', period: 'PROCESSES & UNIX & GRAPHICS', title: 'getting into the flow', icon: Cpu,
    body: 'the next projects intrduce processes, Unix and graphics. the challenge is to understand how the pieces fit together, and how to handle failure in a system that is more than just a single program.',
    proof: 'fork · execve · pipes · file descriptors', lesson: 'A program has to handle failure as carefully as the happy path.' },
  { number: '03', period: 'CONCURRENCY & DESIGN', title: 'new challenges', icon: GitBranch,
    body: 'the next projects intrduce new domains: networking, concurrency, and design. the challenge is to understand how the pieces fit together, and how to handle failure in a system',
    proof: 'C++ · synchronization · parsing · networking', lesson: 'Correct pieces still need careful coordination to become a correct system.' },
  { number: '04', period: 'NETWORKS & PROTOCOLS', title: 'learning is a way of life', icon: Cpu,
    body: 'Building an HTTP server in C++98 and managing a containerized application. the hard part is to find the right informations and not going deep into the rabbit hole of details.',
    proof: 'C++98 · sockets · Docker · containers', lesson: 'Think in states and lifecycles, not just in functions.' },
  { number: '05', period: 'A COMPLETE APPLICATION', title: 'the end of the beginning', icon: BracketsCurly,
    body: 'The final project is a complete application with a backend, database, and authentication. the challenge is to integrate all the pieces you\'ve learned and make them work together.',
    proof: 'JavaScript · Fastify · SQL · OAuth · Docker', lesson: 'Architecture, integration, and communication matter as much as code.' },
  { number: '06', period: 'THE CORRECTION SYSTEM', title: 'Defend every decision.', icon: GitBranch,
    body: 'Writing the code is only part of the work. Peer corrections mean explaining the implementation, testing edge cases, and confronting leaks, crashes, and broken assumptions. A fragile solution sends you back to the editor.',
    proof: 'Peer review · edge cases · accountability', lesson: 'The hard part becomes the habit: test carefully, explain clearly, and improve.' },
];
const concepts = ['C', 'Memory management', 'Unix', 'Processes', 'C++', 'Concurrency', 'HTTP', 'Sockets', 'TypeScript', 'PostgreSQL', 'Docker', 'Peer review'];

export default function JourneyPage() {
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <Header />
    <main id="main" className="journey-page" tabIndex={-1}>
      <JourneyVideo>
        <Link className="text-link journey-back" href="/"><ArrowLeft size={17} aria-hidden="true" /> Back to portfolio</Link>
        <Reveal>
          <p className="journey-kicker">1337 CODING SCHOOL · 42 NETWORK</p>
          <h1 id="journey-title">Learning by<br />building <span>the system.</span></h1>
          <div className="journey-intro">
            <p>A personal account of how my time at 1337 has taken me from C fundamentals to backend architecture and systems work.</p>
            <span className="journey-date">OCTOBER 2024 / PRESENT<br />BEN GUERIR, MOROCCO</span>
          </div>
          <a className="journey-scroll" href="#chapters">Follow the path <ArrowDown size={16} aria-hidden="true" /></a>
        </Reveal>
      </JourneyVideo>

      <div className="journey-content">
        <JourneyTape concepts={concepts} />
        <JourneyPath>
          {chapters.map(({ number, period, title, icon: Icon, body, proof, lesson }) => (
            <article key={number} className="journey-stage">
              <div className="journey-stage-top"><span className="journey-number">{number}</span><Icon size={30} weight="light" aria-hidden="true" /></div>
              <p className="journey-stage-period">{period}</p>
              <h3>{title}</h3><p className="journey-stage-body">{body}</p>
              <p className="journey-stage-lesson">{lesson}</p><span className="journey-proof">{proof}</span>
            </article>
          ))}
        </JourneyPath>

        <section className="journey-end shell" aria-labelledby="journey-end-title">
          <Reveal>
            <p className="journey-kicker">THE NEXT CHAPTER</p>
            <h2 id="journey-end-title">Still learning.<br /><span>Ready to contribute.</span></h2>
            <div className="journey-end-row"><p>I’m looking for a backend internship where I can keep learning and help build dependable systems.</p><Link className="button button-primary" href={`mailto:${profile.email}`}>Get in touch <ArrowUpRight size={18} aria-hidden="true" /></Link></div>
          </Reveal>
        </section>
        <footer className="shell journey-footer"><span>© 2026 {profile.name}</span><Link className="text-link" href="/">Back to portfolio <ArrowUpRight size={16} aria-hidden="true" /></Link></footer>
      </div>
    </main>
  </>;
}
