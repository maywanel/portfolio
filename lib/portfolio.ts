// Keep public profile details and project evidence in one place.
export const profile = {
  name: 'Mohamed El Messaadi',
  role: 'Backend Developer',
  email: 'mouhamedelmessadi@gmail.com',
  github: 'https://github.com/maywanel',
  linkedin: '', // Set only to a confirmed personal profile URL.
  resume: '/resume/',
  location: 'Ben Guerir, Morocco',
  url: 'https://mohamedelmessaadi.tech',
};

export type Project = {
  name: string;
  category: string;
  summary: string;
  technologies: string[];
  href?: string;
  status?: string;
  architecture: string[];
  implementation: string[];
};

export const projects: Project[] = [
  {
    name: 'ft_transcendence',
    category: 'Backend architecture',
    status: 'In development · Private repository',
    summary: 'Backend development for a collaborative platform with organization multi-tenancy and real-time features.',
    technologies: ['TypeScript', 'Fastify', 'PostgreSQL', 'OAuth 2.0'],
    architecture: ['Public API', 'Authentication & organization access', 'Platform services'],
    implementation: [
      'User management and public API endpoints for platform features.',
      'Organization multi-tenancy with roles and shared workspaces.',
      'Real-time features and OAuth 2.0 integration.',
    ],
  },
  {
    name: 'Webserv',
    category: 'Low-level systems & networking',
    summary: 'A non-blocking HTTP/1.1 web server built from scratch in C++98.',
    technologies: ['C++98', 'POSIX sockets', 'epoll', 'HTTP/1.1', 'CGI'],
    href: 'https://github.com/maywanel/webserv',
    architecture: ['Socket I/O', 'Request parsing & routing', 'HTTP response / CGI'],
    implementation: [
      'I/O multiplexing with epoll to handle non-blocking socket connections.',
      'HTTP request parsing, routing, and file upload handling.',
      'CGI script execution connected to the server’s request and response lifecycle.',
    ],
  },
  {
    name: 'BookLibrary',
    category: 'Full-stack application',
    summary: 'A book library application with a Java backend, authenticated access, and dynamic book data.',
    technologies: ['Java', 'Spring Boot', 'Spring Security', 'JWT', 'Open Library API'],
    // The public repository retains its original PageTurner name.
    href: 'https://github.com/maywanel/PageTurner',
    architecture: ['Library application', 'Secured Spring API', 'Cached Open Library data'],
    implementation: [
      'Spring Security and JWT authentication protect the application API.',
      'Role-based administration supports book management.',
      'Dynamic data caching integrates book information from the Open Library API.',
    ],
  },
];

export const toolkit = [
  { name: 'Languages', items: ['C', 'C++', 'Java', 'TypeScript', 'Bash', 'SQL'] },
  { name: 'Infrastructure & Tools', items: ['Docker', 'Kubernetes', 'Nginx', 'Linux (Arch/Omarchy)', 'Git', 'Neovim'] },
  { name: 'Frameworks', items: ['Spring Boot', 'Spring Security'] },
];
