export function revealSection(element: HTMLElement) {
  return element.animate([
    { opacity: 0.55, transform: 'translateY(20px)' },
    { opacity: 1, transform: 'translateY(0)' },
  ], { duration: 550, easing: 'cubic-bezier(.23,1,.32,1)' });
}
