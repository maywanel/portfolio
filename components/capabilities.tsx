import { BracketsCurly, Stack, TerminalWindow } from '@phosphor-icons/react/dist/ssr';
import { toolkit } from '@/lib/portfolio';
import { Reveal } from './motion';

const icons = [BracketsCurly, TerminalWindow, Stack];

export function Capabilities() {
  return <section id="skills" className="shell section-pad section-anchor" aria-labelledby="skills-title">
    <Reveal className="section-heading editorial-heading"><h2 id="skills-title">Capabilities<br /><span className="muted-heading">&amp; tools.</span></h2><p>The languages, tools, and frameworks I bring to the work.</p></Reveal>
    <div className="capabilities-grid">
      {toolkit.map((group, index) => {
        const Icon = icons[index];
        return <Reveal className={`capability capability-${index}`} key={group.name}>
          <div className="capability-top"><Icon size={34} weight="light" aria-hidden="true" /></div>
          <h3>{group.name}</h3><ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul>
        </Reveal>;
      })}
    </div>
  </section>;
}
