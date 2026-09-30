import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

export function Arrow({ diagonal = false, ...props }: IconProps & { diagonal?: boolean }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{diagonal ? <path d="M6 18 18 6M6 6h12v12" /> : <path d="M4 12h16m-6-6 6 6-6 6" />}</svg>;
}

export function GithubIcon(props: IconProps) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}><path d="M9 19c-4.3 1.3-4.3-2.2-6-2.7m12 5v-3.4c.1-1-.3-1.8-.8-2.3 2.7-.3 5.6-1.3 5.6-6A4.7 4.7 0 0 0 18.5 6c.1-.3.6-1.6-.2-3.3 0 0-1-.3-3.5 1.3a12 12 0 0 0-6.4 0C6 2.4 5 2.7 5 2.7c-.8 1.7-.3 3-.2 3.3a4.7 4.7 0 0 0-1.3 3.6c0 4.7 2.8 5.7 5.5 6-.4.4-.8 1.1-.8 2.2v3.5" /></svg>;
}

export function StackIcon(props: IconProps) {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}><path d="m3 7 9-5 9 5-9 5-9-5Zm0 5 9 5 9-5M3 17l9 5 9-5" /></svg>;
}

export function CopyIcon(props: IconProps) {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V4H4v12h4" /></svg>;
}
