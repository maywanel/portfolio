import type { Project } from '@/lib/portfolio';
import { Arrow, StackIcon } from './icons';

export function ProjectVisual({ type }: { type: Project['visual'] }) {
  if (type === 'http') return <div className="project-visual visual-http" aria-hidden="true">
    <div className="visual-overline"><span>HTTP / 1.1</span><span>REQUEST → RESPONSE</span></div>
    <div className="http-request"><span className="method">GET</span><span>/index.html</span><span className="request-version">HTTP/1.1</span></div>
    <div className="http-connection"><span /><span className="connection-label">parse · route · respond</span></div>
    <div className="http-server"><StackIcon width={28} height={28} /><div><span>webserv</span><small>Nonblocking event loop</small></div><span className="server-indicator" /></div>
    <div className="http-response"><span className="response-code">200</span><span>OK</span><span>Content-Type: text/html</span></div>
    <div className="visual-baseline"><span>C++98</span><span>Built from scratch</span></div>
  </div>;
  if (type === 'containers') return <div className="project-visual visual-containers" aria-hidden="true"><div className="mini-visual-label">Docker services</div><div className="container-network"><div>Nginx<span>:443</span></div><i /><div>App<span>internal</span></div><i /><div>Data<span>volume</span></div></div><div className="network-boundary"><span>Docker network</span></div></div>;
  if (type === 'books') return <div className="project-visual visual-books" aria-hidden="true"><div className="mini-visual-label">Book API</div><div className="book-api"><div className="book-spines"><i /><i /><i /><i /></div><div className="book-endpoint"><span><b>GET</b> /api/books</span><span><b>POST</b> /auth/login</span><span className="endpoint-muted">Authorization: Bearer …</span></div></div></div>;
  return <div className="project-visual visual-access" aria-hidden="true"><div className="mini-visual-label">Organization roles</div><div className="access-flow"><div className="identity-symbol"><span /><i /></div><Arrow width={20} /><div className="access-roles"><span>Owner</span><span>Member</span></div><Arrow width={20} /><div className="access-resource"><StackIcon /></div></div><div className="access-rule">user → role → resource</div></div>;
}
