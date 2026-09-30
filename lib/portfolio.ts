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
  detail: string;
  visual: 'http' | 'containers' | 'books' | 'access';
};

export const projects: Project[] = [
  {
    number: '01', name: 'Webserv', category: 'HTTP server / systems programming', date: 'April 2026',
    summary: 'I built an HTTP/1.1 server in C++98 with nonblocking sockets and epoll.',
    technologies: ['C++98', 'POSIX sockets', 'epoll', 'HTTP/1.1'],
    href: 'https://github.com/maywanel/webserv', visual: 'http',
    detail: 'The hardest part for me was connecting CGI execution to the multiplexing and request parsing. Getting those pieces to work together gave me a lot of trouble.',
  },
  {
    number: '02', name: 'Inception', category: 'Containerized infrastructure', date: 'July 2026',
    summary: 'I used Docker Compose to connect separate services, with Nginx handling TLS termination and volumes keeping data across restarts.',
    technologies: ['Docker', 'Compose', 'Nginx', 'MariaDB', 'Redis'],
    href: 'https://github.com/maywanel/inception', visual: 'containers',
    detail: 'The amount of material to learn was the hardest part of Inception for me. It felt like a rabbit hole: every topic led to more things to read.',
  },
  {
    number: '03', name: 'PageTurner', category: 'Application backend', date: 'January 2026',
    summary: 'I built a book management API with Spring Security, JWT authentication, role-based administration, and cached external book data.',
    technologies: ['Java', 'Spring Boot', 'Spring Security', 'JWT'],
    href: 'https://github.com/maywanel/PageTurner', visual: 'books',
    detail: 'JWT gave me a lot of trouble, and I found Spring Boot’s structure confusing. Those were the hardest parts of PageTurner for me.',
  },
  {
    number: '04', name: 'ft_transcendence', category: 'Collaborative platform / team project', date: 'Expected November 2026',
    summary: 'I’m working on authentication, organization roles, and shared workspaces with a team.',
    technologies: ['Node.js', 'Fastify', 'PostgreSQL', 'Access control'],
    status: 'In progress · private repository', visual: 'access',
    detail: 'This is my first big project with a full team where everyone has a role, and I like that part of it. It’s still in development, with completion expected in November 2026. The repository is currently private.',
  },
];

export const toolkit = [
  { name: 'Languages', description: 'I use these for systems code, APIs, and scripts.', items: ['C / C++', 'Java', 'JavaScript', 'SQL', 'Bash'] },
  { name: 'Backend', description: 'I use these to build APIs and handle authentication.', items: ['Node.js', 'Fastify', 'Spring Boot', 'Spring Security', 'REST APIs'] },
  { name: 'Infrastructure', description: 'I use these for containers, databases, and version control.', items: ['Linux', 'Docker / Compose', 'Nginx', 'PostgreSQL', 'Git'] },
];
