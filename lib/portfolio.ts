export const profile = {
  name: 'Mohamed El Messaadi',
  email: 'mouhamedelmessadi@gmail.com',
  github: 'https://github.com/maywanel',
  location: 'Ben Guerir, Morocco',
  url: 'https://mohamedelmessaadi.tech',
};

export type Project = {
  number: string;
  name: string;
  category: string;
  date: string;
  summary: string;
  technologies: string[];
  href?: string;
  status?: string;
  detail: { title: string; text: string }[];
  visual: 'http' | 'containers' | 'books' | 'access';
};

export const projects: Project[] = [
  {
    number: '01', name: 'Webserv', category: 'HTTP server / systems programming', date: 'April 2026',
    summary: 'An HTTP/1.1 server, built from the socket up. A closer look at what really happens between a request and a response.',
    technologies: ['C++98', 'POSIX sockets', 'epoll', 'HTTP/1.1'],
    href: 'https://github.com/maywanel/webserv', visual: 'http',
    detail: [
      { title: 'The challenge', text: 'Handle multiple clients without blocking the server, while turning raw socket data into valid HTTP requests and responses.' },
      { title: 'The implementation', text: 'Nonblocking sockets and epoll manage connections. Request parsing, routing, CGI execution, and file uploads form the application layer.' },
      { title: 'What I learned', text: 'Protocol details matter. Following a request through each layer makes connection handling and server behavior much easier to reason about.' },
    ],
  },
  {
    number: '02', name: 'Inception', category: 'Containerized infrastructure', date: 'July 2026',
    summary: 'A multi-service environment with clear boundaries. Separate containers, persistent data, and one controlled entry point.',
    technologies: ['Docker', 'Compose', 'Nginx', 'MariaDB', 'Redis'],
    href: 'https://github.com/maywanel/inception', visual: 'containers',
    detail: [
      { title: 'The challenge', text: 'Give each service its own responsibility while keeping networking, storage, and startup behavior understandable.' },
      { title: 'The implementation', text: 'Docker Compose connects the services through an organized network. Nginx handles TLS termination; volumes preserve data across container restarts.' },
      { title: 'What I learned', text: 'Infrastructure is part of the application. Service boundaries, persistence, and restart behavior need the same attention as application logic.' },
    ],
  },
  {
    number: '03', name: 'PageTurner', category: 'Application backend', date: 'January 2026',
    summary: 'A book management API with authenticated user flows, role-based administration, and cached external book data.',
    technologies: ['Java', 'Spring Boot', 'Spring Security', 'JWT'],
    href: 'https://github.com/maywanel/PageTurner', visual: 'books',
    detail: [
      { title: 'The challenge', text: 'Connect book discovery and management with clear user permissions and efficient access to external book data.' },
      { title: 'The implementation', text: 'Spring Security and JWT support authentication and role-based administration. Caching reduces repeated requests for external book data.' },
      { title: 'What I learned', text: 'Authentication, authorization, and data access are distinct concerns. Keeping those responsibilities clear makes a backend easier to extend.' },
    ],
  },
  {
    number: '04', name: 'ft_transcendence', category: 'Collaborative platform / team project', date: 'Expected November 2026',
    summary: 'Backend work for a shared workspace platform. Building around identity, organization roles, and explicit access rules.',
    technologies: ['Node.js', 'Fastify', 'PostgreSQL', 'Access control'],
    status: 'In progress · private repository', visual: 'access',
    detail: [
      { title: 'The challenge', text: 'Model identity and organization-level permissions for a platform used by multiple people and teams.' },
      { title: 'My focus', text: 'Working with a team on authentication, shared workspaces, organization roles, and API behavior around access control.' },
      { title: 'Current status', text: 'In development, with completion expected in November 2026. The repository is currently private.' },
    ],
  },
];

export const toolkit = [
  { name: 'Languages', description: 'From memory to application logic.', items: ['C / C++', 'Java', 'JavaScript', 'SQL', 'Bash'] },
  { name: 'Backend', description: 'Interfaces with clear responsibilities.', items: ['Node.js', 'Fastify', 'Spring Boot', 'Spring Security', 'REST APIs'] },
  { name: 'Infrastructure', description: 'Everything the application runs on.', items: ['Linux', 'Docker / Compose', 'Nginx', 'PostgreSQL', 'Git'] },
];
