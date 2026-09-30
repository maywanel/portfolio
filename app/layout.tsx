import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { profile } from '@/lib/portfolio';
import './globals.css';

const sans = localFont({
  src: [
    { path: '../public/fonts/ibm-plex-sans-400.ttf', weight: '400', style: 'normal' },
    { path: '../public/fonts/ibm-plex-sans-500.ttf', weight: '500', style: 'normal' },
    { path: '../public/fonts/ibm-plex-sans-600.ttf', weight: '600', style: 'normal' },
  ],
  variable: '--font-plex', display: 'swap', fallback: ['Arial', 'sans-serif'],
});
const mono = localFont({ src: '../public/fonts/ibm-plex-mono-400-normal.ttf', variable: '--font-plex-mono', display: 'swap', preload: false, fallback: ['Courier New', 'monospace'] });

export const metadata: Metadata = {
  metadataBase: new URL(profile.url),
  title: 'Mohamed El Messaadi — Backend Developer',
  description: 'Backend developer and 1337 student in Morocco. Explore my work in HTTP servers, secure APIs, and containerized infrastructure.',
  alternates: { canonical: '/' },
  openGraph: { type: 'website', locale: 'en_US', url: profile.url, siteName: profile.name, title: 'Mohamed El Messaadi — Backend Developer', description: 'Built below the surface. HTTP servers, secure APIs, and containerized infrastructure.', images: [{ url: '/social-card.png', width: 1200, height: 630, alt: 'Mohamed El Messaadi — Backend Developer. Built below the surface.' }] },
  twitter: { card: 'summary_large_image', title: 'Mohamed El Messaadi — Backend Developer', description: 'HTTP servers, secure APIs, and containerized infrastructure.', images: ['/social-card.png'] },
  robots: { index: true, follow: true },
};
export const viewport: Viewport = { themeColor: '#080f18', colorScheme: 'dark' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${sans.variable} ${mono.variable}`}><body>{children}</body></html>;
}
