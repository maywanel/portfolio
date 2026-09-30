import Link from 'next/link';
import { Arrow } from '@/components/icons';

export default function NotFound() {
  return <main className="not-found shell"><span className="section-label">404 / Page not found</span><h1>This route<br />ends here.</h1><p>The page you’re looking for doesn’t exist. Head back to the portfolio to explore my work.</p><Link className="button button-primary" href="/">Back to the portfolio <Arrow /></Link></main>;
}
