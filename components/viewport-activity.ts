// Start enhancements near the viewport; release listeners when they leave it.
export function observeActivity(element: Element, change: (active: boolean) => void, margin = '240px') {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let nearby = false;
  let active = false;
  const update = () => {
    const next = nearby && !document.hidden && !reduced.matches;
    if (next !== active || reduced.matches) { active = next; change(active); }
  };
  const observer = new IntersectionObserver(([entry]) => {
    nearby = entry.isIntersecting;
    update();
  }, { rootMargin: margin });
  observer.observe(element);
  document.addEventListener('visibilitychange', update);
  reduced.addEventListener('change', update);
  return () => {
    observer.disconnect();
    document.removeEventListener('visibilitychange', update);
    reduced.removeEventListener('change', update);
    if (active) change(false);
  };
}
