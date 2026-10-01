'use client';

export function PrintResume() {
  return <button className="button button-primary" type="button" onClick={() => window.print()}>Print / Save as PDF</button>;
}
