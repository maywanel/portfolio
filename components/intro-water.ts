// The same WebGL refraction plugin used by the supplied reference.
// It is loaded only for the intro, after the logo morph is complete.
export async function createIntroWater(element: HTMLElement, logo: HTMLImageElement, isCancelled: () => boolean) {
  const { default: $ } = await import('jquery');
  await import('jquery.ripples');
  await logo.decode();
  if (isCancelled()) return null;
  const surface = $(element);
  const scene = document.createElement('canvas');
  function image() {
    const width = element.clientWidth;
    const height = element.clientHeight;
    const ratio = Math.min(devicePixelRatio || 1, 2, 2048 / Math.max(width, height));
    scene.width = Math.round(width * ratio);
    scene.height = Math.round(height * ratio);
    const context = scene.getContext('2d')!;
    context.scale(ratio, ratio);
    context.fillStyle = getComputedStyle(element).getPropertyValue('--bg').trim();
    context.fillRect(0, 0, width, height);
    // Match the underlying screen-blended logo exactly before adding refraction.
    const logoWidth = Math.min(620, width * .775);
    const logoHeight = logoWidth * logo.naturalHeight / logo.naturalWidth;
    context.globalCompositeOperation = 'screen';
    context.drawImage(logo, (width - logoWidth) / 2, (height - logoHeight) / 2, logoWidth, logoHeight);
    return scene.toDataURL();
  }
  try {
    surface.ripples({ resolution: 512, dropRadius: 20, perturbance: .01, interactive: false, imageUrl: image() });
  } catch {
    // Unsupported GPU: keep the original logo visible and dismissal working.
    element.replaceChildren();
    element.classList.remove('jquery-ripples');
    return null;
  }
  element.dataset.active = 'true';
  return {
    drop(x: number, y: number) { surface.ripples('drop', x, y, 20, .025); },
    resize() { surface.ripples('set', 'imageUrl', image()); surface.ripples('updateSize'); },
    pause() { surface.ripples('pause'); },
    play() { surface.ripples('play'); },
    destroy() { delete element.dataset.active; surface.ripples('destroy'); },
  };
}
