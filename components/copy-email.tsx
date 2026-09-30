'use client';

import { useEffect, useRef, useState } from 'react';
import { profile } from '@/lib/portfolio';
import { CopyIcon } from './icons';

export function CopyEmail() {
  const [status, setStatus] = useState<'idle' | 'copied' | 'error'>('idle');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  async function copy() {
    if (timer.current) clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(profile.email);
      setStatus('copied');
    } catch { setStatus('error'); }
    timer.current = setTimeout(() => setStatus('idle'), 4500);
  }
  return <div className="copy-wrapper"><button type="button" className="copy-button" onClick={copy}><CopyIcon /><span>{status === 'copied' ? 'Email copied' : 'Copy email'}</span></button><span className="copy-status" role="status">{status === 'error' ? 'Copy unavailable. Use the email link instead.' : status === 'copied' ? 'Copied to clipboard.' : ''}</span></div>;
}
