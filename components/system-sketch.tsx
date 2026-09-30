'use client';

import { useRef, useState, type KeyboardEvent } from 'react';
import { Arrow, StackIcon } from './icons';

const flows = [
  { name: 'Request', label: 'HTTP request', text: 'The server parses the request, runs its handler, and sends a response.', top: 'CLIENT', input: 'GET /books', middle: 'HTTP service', left: 'Parse', right: 'Route', bottom: 'Response', output: '200 OK' },
  { name: 'Access', label: 'Authorization', text: 'The service checks identity and permissions before returning a resource.', top: 'CLIENT', input: 'Bearer token', middle: 'Access control', left: 'Identity', right: 'Role', bottom: 'Resource', output: 'Access granted' },
  { name: 'Deploy', label: 'Reverse proxy', text: 'Nginx terminates TLS and forwards the request to an application container.', top: 'INTERNET', input: 'HTTPS :443', middle: 'Nginx proxy', left: 'TLS', right: 'Network', bottom: 'Application', output: 'Docker container' },
];

export function SystemSketch() {
  const [selected, setSelected] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const flow = flows[selected];
  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % flows.length;
    else if (event.key === 'ArrowLeft') next = (index + flows.length - 1) % flows.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = flows.length - 1;
    else return;
    event.preventDefault(); setSelected(next); tabs.current[next]?.focus();
  }
  return (
    <div className="system-sketch">
      <div className="sketch-heading"><span className="eyebrow">Backend examples</span><StackIcon width={19} height={19} /></div>
      <div className="sketch-canvas" aria-hidden="true">
        <svg viewBox="0 0 480 330" className="system-svg" fill="none">
          <path className="diagram-line" d="M240 77v58M240 199v57M142 167H66v-40M338 167h76v-40" />
          <path className="diagram-packet" d="M240 77v58M240 199v57" />
          <circle cx="66" cy="124" r="3" fill="var(--ice)" /><circle cx="414" cy="124" r="3" fill="var(--ice)" />
          <rect x="167" y="24" width="146" height="53" rx="5" className="diagram-node" />
          <text x="240" y="46" className="svg-label" textAnchor="middle">{flow.top}</text><text x="240" y="65" className="svg-small" textAnchor="middle">{flow.input}</text>
          <rect x="142" y="135" width="196" height="64" rx="5" className="diagram-main" />
          <path d="M162 153h13v10h-13zm0 17h13v10h-13z" stroke="var(--ice)" /><circle cx="171" cy="158" r="1" fill="var(--ice)" /><circle cx="171" cy="175" r="1" fill="var(--ice)" />
          <text x="253" y="171" className="svg-main" textAnchor="middle">{flow.middle}</text>
          <text x="65" y="158" className="svg-small" textAnchor="middle">{flow.left}</text><text x="414" y="158" className="svg-small" textAnchor="middle">{flow.right}</text>
          <rect x="158" y="256" width="164" height="54" rx="5" className="diagram-node" /><text x="240" y="278" className="svg-label" textAnchor="middle">{flow.bottom}</text><text x="240" y="297" className="svg-small" textAnchor="middle">{flow.output}</text>
          <text x="251" y="109" className="svg-tiny">IN</text><text x="251" y="231" className="svg-tiny">OUT</text>
        </svg>
        <span className="sketch-caption">Example flow</span><span className="sketch-cross" aria-hidden="true">+</span>
      </div>
      <div className="sketch-tabs" role="tablist" aria-label="Explore backend architecture">
        {flows.map((item, index) => <button key={item.name} ref={(element) => { tabs.current[index] = element; }} id={`flow-tab-${index}`} role="tab" aria-selected={selected === index} aria-controls={`flow-panel-${index}`} tabIndex={selected === index ? 0 : -1} onClick={() => setSelected(index)} onKeyDown={(event) => onKeyDown(event, index)}><span className="tab-index">0{index + 1}</span>{item.name}<Arrow width={14} height={14} /></button>)}
      </div>
      {flows.map((item, index) => <div key={item.name} id={`flow-panel-${index}`} className="sketch-description" role="tabpanel" aria-labelledby={`flow-tab-${index}`} hidden={selected !== index} tabIndex={0}><p className="sketch-description-title">{item.label}</p><p>{item.text}</p></div>)}
    </div>
  );
}
